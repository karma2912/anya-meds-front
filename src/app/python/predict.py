import torch
from torchvision import transforms, models
from PIL import Image
import os
import numpy as np
import cv2
import json
import sys
import base64

from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

# Path configuration
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), 'uploads')
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

NIH_MODEL_PATH = os.path.join(MODEL_DIR, "best_covid_model.pth")
COVID_MODEL_PATH = os.path.join(MODEL_DIR, "best_covid_model.pth")
IMAGE_PATH = os.path.join(UPLOAD_DIR, "test.png")
HEATMAP_DIR = os.path.join(os.path.dirname(__file__), 'heatmaps')
os.makedirs(HEATMAP_DIR, exist_ok=True)

THRESHOLD = 0.4
USE_COVID_MODEL = True

NIH_LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration', 'Mass',
    'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia', 'No Finding'
]
COVID_LABELS = ['Normal', 'COVID', 'Lung_Opacity', 'Viral_Pneumonia']

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406],
                         std=[0.229, 0.224, 0.225])
])

def load_nih_model():
    model = models.densenet121(weights=None)
    model.classifier = torch.nn.Sequential(
        torch.nn.Dropout(0.3),
        torch.nn.Linear(1024, 256),
        torch.nn.ReLU(inplace=True),
        torch.nn.Dropout(0.2),
        torch.nn.Linear(256, len(NIH_LABELS))
    )
    state_dict = torch.load(NIH_MODEL_PATH, map_location=device)
    model_state_dict = model.state_dict()
    pretrained_dict = {k: v for k, v in state_dict.items() if k in model_state_dict}
    model_state_dict.update(pretrained_dict)
    model.load_state_dict(model_state_dict)
    model = model.to(device)
    model.eval()
    return model

def load_covid_model():
    model = models.densenet121(weights=None)
    model.classifier = torch.nn.Linear(1024, 4)
    checkpoint = torch.load(COVID_MODEL_PATH, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict'])
    model = model.to(device)
    model.eval()
    return model

def predict_nih(image_path, model):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = torch.sigmoid(outputs).cpu().numpy()[0]
    predictions = [(NIH_LABELS[i], float(prob)) for i, prob in enumerate(probs) if prob >= THRESHOLD]
    predictions.sort(key=lambda x: x[1], reverse=True)
    return predictions, probs

def predict_covid(image_path, model):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0]
    class_idx = np.argmax(probs)
    return COVID_LABELS[class_idx], float(probs[class_idx]), probs, image_tensor

def generate_gradcam(model, image_tensor, target_layer, class_idx, orig_image_path):
    model.eval()
    image_tensor = image_tensor.to(device)

    high_res_size = (512, 512)
    orig = Image.open(orig_image_path).convert("RGB").resize(high_res_size)
    orig_np = np.array(orig).astype(np.float32) / 255.0

    cam = GradCAMPlusPlus(model=model, target_layers=[target_layer])
    grayscale_cam = cam(input_tensor=image_tensor, targets=[ClassifierOutputTarget(class_idx)])[0]
    grayscale_cam = cv2.resize(grayscale_cam, high_res_size)

    cam_image = show_cam_on_image(orig_np, grayscale_cam, use_rgb=True)

    output_path = os.path.join(HEATMAP_DIR, "gradcam_output.png")
    cv2.imwrite(output_path, cv2.cvtColor(cam_image, cv2.COLOR_RGB2BGR))
    return output_path

if __name__ == "__main__":
    if not os.path.exists(IMAGE_PATH):
        print(json.dumps({ "error": f"Image not found: {IMAGE_PATH}" }))
        sys.exit(1)

    try:
        if USE_COVID_MODEL:
            model = load_covid_model()
            label, prob, all_probs, image_tensor = predict_covid(IMAGE_PATH, model)

            class_idx = np.argmax(all_probs)
            target_layer = model.features.denseblock4.denselayer16.conv2
            heatmap_path = generate_gradcam(model, image_tensor, target_layer, class_idx, IMAGE_PATH)

            result = {
                "label": label,
                "confidence": round(prob, 4),
                "probabilities": [
                    {"label": COVID_LABELS[i], "value": round(float(p), 4)}
                    for i, p in enumerate(all_probs)
                ],
                "heatmap": heatmap_path
            }

        else:
            model = load_nih_model()
            predictions, all_probs = predict_nih(IMAGE_PATH, model)

            result = {
                "label": predictions[0][0] if predictions else "No Finding",
                "confidence": round(predictions[0][1], 4) if predictions else 0.0,
                "probabilities": [
                    {"label": NIH_LABELS[i], "value": round(float(prob), 4)}
                    for i, prob in enumerate(all_probs)
                ]
            }

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)