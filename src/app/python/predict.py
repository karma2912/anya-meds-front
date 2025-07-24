import torch
from torchvision import transforms, models
from PIL import Image
import os
import numpy as np
import cv2
import json
import sys
import base64
from io import BytesIO

# Import GradCAM components
from pytorch_grad_cam import GradCAMPlusPlus
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

# Path configuration
# This directory should contain your pre-trained model files (.pth)
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
os.makedirs(MODEL_DIR, exist_ok=True) # Ensure model directory exists

NIH_MODEL_PATH = os.path.join(MODEL_DIR, "best_covid_model.pth") # Path to your NIH model
COVID_MODEL_PATH = os.path.join(MODEL_DIR, "best_covid_model.pth") # Path to your COVID model

THRESHOLD = 0.4
USE_COVID_MODEL = True # Set to False to use NIH model for prediction

NIH_LABELS = [
    'Atelectasis', 'Cardiomegaly', 'Effusion', 'Infiltration', 'Mass',
    'Nodule', 'Pneumonia', 'Pneumothorax', 'Consolidation', 'Edema',
    'Emphysema', 'Fibrosis', 'Pleural_Thickening', 'Hernia', 'No Finding'
]
COVID_LABELS = ['Normal', 'COVID', 'Lung_Opacity', 'Viral_Pneumonia']

# Determine the device to run the model on (GPU if available, otherwise CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Image transformations required by the pre-trained models
transform = transforms.Compose([
    transforms.Resize((224, 224)), # Resize image to 224x224 pixels
    transforms.ToTensor(), # Convert PIL Image to PyTorch Tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406], # Normalize image with ImageNet means
                         std=[0.229, 0.224, 0.225]) # and standard deviations
])

def load_nih_model():
    """Loads the NIH Chest X-ray model."""
    model = models.densenet121(weights=None) # Initialize DenseNet121 without pre-trained ImageNet weights
    # Modify the classifier layer to match the number of NIH labels
    model.classifier = torch.nn.Sequential(
        torch.nn.Dropout(0.3),
        torch.nn.Linear(1024, 256),
        torch.nn.ReLU(inplace=True),
        torch.nn.Dropout(0.2),
        torch.nn.Linear(256, len(NIH_LABELS))
    )
    # Load the state dictionary from the saved model file
    state_dict = torch.load(NIH_MODEL_PATH, map_location=device)
    # Filter out unnecessary keys if the saved state_dict contains more than just model weights
    model_state_dict = model.state_dict()
    pretrained_dict = {k: v for k, v in state_dict.items() if k in model_state_dict}
    model_state_dict.update(pretrained_dict)
    model.load_state_dict(model_state_dict)
    model = model.to(device) # Move model to appropriate device (CPU/GPU)
    model.eval() # Set model to evaluation mode (disables dropout, batchnorm updates)
    return model

def load_covid_model():
    """Loads the COVID-19 Chest X-ray model."""
    model = models.densenet121(weights=None) # Initialize DenseNet121 without pre-trained ImageNet weights
    # Modify the classifier layer to match the 4 COVID-19 labels
    model.classifier = torch.nn.Linear(1024, 4)
    # Load the checkpoint, which might contain more than just model state (e.g., optimizer state)
    checkpoint = torch.load(COVID_MODEL_PATH, map_location=device)
    model.load_state_dict(checkpoint['model_state_dict']) # Load only the model state
    model = model.to(device)
    model.eval()
    return model

def predict_nih(image_path, model):
    """
    Performs prediction using the NIH model.
    Returns a list of (label, confidence) pairs for detected diseases,
    all probabilities, and the processed image tensor.
    """
    image = Image.open(image_path).convert("RGB") # Open and convert image to RGB
    image_tensor = transform(image).unsqueeze(0).to(device) # Apply transforms and add batch dimension
    with torch.no_grad(): # Disable gradient calculation for inference
        outputs = model(image_tensor)
        probs = torch.sigmoid(outputs).cpu().numpy()[0] # Apply sigmoid for multi-label classification
    
    # Filter predictions based on a threshold
    predictions = [(NIH_LABELS[i], float(prob)) for i, prob in enumerate(probs) if prob >= THRESHOLD]
    predictions.sort(key=lambda x: x[1], reverse=True) # Sort by confidence
    return predictions, probs, image_tensor

def predict_covid(image_path, model):
    """
    Performs prediction using the COVID-19 model.
    Returns the predicted label, its confidence, all class probabilities,
    and the processed image tensor.
    """
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(image_tensor)
        probs = torch.softmax(outputs, dim=1).cpu().numpy()[0] # Apply softmax for multi-class classification
    class_idx = np.argmax(probs) # Get the index of the highest probability class
    return COVID_LABELS[class_idx], float(probs[class_idx]), probs, image_tensor

def generate_gradcam_base64(model, image_tensor, target_layer, class_idx, orig_image_path):
    """
    Generates a Grad-CAM++ heatmap, overlays it on the original image,
    and returns the combined image as a base64 encoded string.
    """
    model.eval() # Ensure model is in evaluation mode
    image_tensor = image_tensor.to(device)

    # Resize original image to a consistent size for heatmap overlay
    high_res_size = (224, 224) 
    orig = Image.open(orig_image_path).convert("RGB").resize(high_res_size)
    orig_np = np.array(orig).astype(np.float32) / 255.0 # Normalize to 0-1 range

    # Initialize GradCAM++
    cam = GradCAMPlusPlus(model=model, target_layers=[target_layer])
    # Generate grayscale heatmap
    grayscale_cam = cam(input_tensor=image_tensor, targets=[ClassifierOutputTarget(class_idx)])[0]
    # Resize heatmap to original image dimensions
    grayscale_cam = cv2.resize(grayscale_cam, high_res_size)

    # Overlay heatmap on original image
    cam_image = show_cam_on_image(orig_np, grayscale_cam, use_rgb=True)

    # Convert the resulting image (numpy array) to a PIL Image, then to base64
    img_pil = Image.fromarray(cv2.cvtColor(cam_image, cv2.COLOR_RGB2BGR))
    buffered = BytesIO() # Create an in-memory binary stream
    img_pil.save(buffered, format="PNG") # Save PIL Image to the buffer as PNG
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8") # Base64 encode and decode to string
    return img_str

if __name__ == "__main__":
    # The script expects the image path as the first command-line argument
    if len(sys.argv) < 2:
        # If no image path is provided, print an error JSON and exit
        print(json.dumps({ "error": "No image path provided as argument." }))
        sys.exit(1)

    IMAGE_PATH = sys.argv[1] # Get image path from command-line argument

    if not os.path.exists(IMAGE_PATH):
        # If the image file does not exist at the provided path, print an error JSON and exit
        print(json.dumps({ "error": f"Image file not found at: {IMAGE_PATH}" }))
        sys.exit(1)

    try:
        if USE_COVID_MODEL:
            # Load and use the COVID model
            model = load_covid_model()
            label, prob, all_probs, image_tensor = predict_covid(IMAGE_PATH, model)

            # Define the target layer for GradCAM. This is crucial for GradCAM to work correctly.
            # For DenseNet121, 'features.denseblock4.denselayer16.conv2' is a common choice
            # for the last convolutional layer before global average pooling.
            target_layer = model.features.denseblock4.denselayer16.conv2

            # Get the index of the predicted class for GradCAM
            class_idx_for_gradcam = COVID_LABELS.index(label) if label in COVID_LABELS else 0 

            # Generate the heatmap and get its base64 string
            heatmap_base64 = generate_gradcam_base64(model, image_tensor, target_layer, class_idx_for_gradcam, IMAGE_PATH)

            # Prepare the result dictionary
            result = {
                "label": label,
                "confidence": round(prob, 4),
                "probabilities": [
                    {"label": COVID_LABELS[i], "value": round(float(p), 4)}
                    for i, p in enumerate(all_probs)
                ],
                "heatmap": heatmap_base64
            }
        else:
            # Load and use the NIH model (GradCAM not implemented for NIH in this example)
            model = load_nih_model()
            predictions, all_probs, image_tensor = predict_nih(IMAGE_PATH, model)
            
            result = {
                "label": predictions[0][0] if predictions else "No Finding",
                "confidence": round(predictions[0][1], 4) if predictions else 0.0,
                "probabilities": [
                    {"label": NIH_LABELS[i], "value": round(float(prob), 4)}
                    for i, prob in enumerate(all_probs)
                ],
                "heatmap": None # Heatmap is not generated for NIH model in this example
            }

        # Print the result as a JSON string to stdout, which Next.js API route will capture
        print(json.dumps(result))

    except Exception as e:
        # Catch any exceptions during the process, print as JSON error, and exit
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)
