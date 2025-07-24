// app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto'; // For unique filenames

export async function POST(req: NextRequest) {
  console.log('API Route: /api/predict received request.');
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    console.error('API Route: No file uploaded.');
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  console.log(`API Route: File received: ${file.name}, size: ${file.size} bytes.`);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate a unique filename to prevent conflicts
  const uniqueFileName = `${randomUUID()}-${file.name}`;
  // Use /tmp for temporary storage. On Vercel/similar platforms, /tmp is writable.
  // On Windows, this might resolve to a system temp directory.
  const tempImagePath = path.join('/tmp', uniqueFileName); 

  console.log(`API Route: Temporary image path: ${tempImagePath}`);

  let predictionResult: any = null;
  let pythonErrorOutput: string = ''; // Capture full Python stderr

  try {
    // Write the image to a temporary file
    console.log(`API Route: Attempting to write file to ${tempImagePath}`);
    await fs.writeFile(tempImagePath, buffer);
    console.log(`API Route: File successfully written to ${tempImagePath}`);

    const pyPath = path.join(process.cwd(), 'app/python/predict.py');
    console.log(`API Route: Python script path: ${pyPath}`);

    // Check if Python script exists
    try {
      await fs.access(pyPath, fs.constants.F_OK);
      console.log(`API Route: Python script exists at ${pyPath}`);
    } catch (accessError) {
      console.error(`API Route: Python script NOT found at ${pyPath}. Error: ${accessError}`);
      return NextResponse.json({ error: 'Python script not found', detail: `Path: ${pyPath}` }, { status: 500 });
    }

    console.log(`API Route: Spawning Python process with command: python ${pyPath} ${tempImagePath}`);
    // Execute the Python script with the temporary image path
    const pythonProcess = spawn('python', [pyPath, tempImagePath]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      const chunk = data.toString();
      result += chunk;
      console.log(`Python STDOUT: ${chunk.trim()}`); // Log stdout chunks
    });

    pythonProcess.stderr.on('data', (data) => {
      const chunk = data.toString();
      error += chunk;
      console.error(`Python STDERR: ${chunk.trim()}`); // Log stderr chunks
    });

    await new Promise<void>((resolve, reject) => {
      pythonProcess.on('close', (code) => {
        console.log(`API Route: Python process closed with code ${code}`);
        if (code === 0) {
          try {
            predictionResult = JSON.parse(result);
            console.log('API Route: Successfully parsed Python output.');
            resolve();
          } catch (e) {
            console.error('API Route: JSON parse error from Python script output:', e);
            console.error('API Route: Raw Python STDOUT:', result);
            console.error('API Route: Raw Python STDERR:', error);
            reject(new Error('Failed to parse Python output. Check Python script logs for JSON format issues.'));
          }
        } else {
          pythonErrorOutput = error;
          console.error(`API Route: Python script failed with exit code ${code}. Full stderr:`, error);
          reject(new Error(`Python script failed with exit code ${code}.`));
        }
      });
      pythonProcess.on('error', (err) => {
        console.error('API Route: Failed to start Python process. Check if "python" command is in PATH, or if script path is correct:', err);
        reject(new Error('Failed to start Python process. Ensure Python is installed and accessible.'));
      });
    });

    console.log('API Route: Sending prediction result to frontend.');
    return NextResponse.json(predictionResult);

  } catch (e: any) {
    console.error('API Route: Caught an error during prediction process:', e);
    return NextResponse.json({ error: 'Prediction failed', detail: pythonErrorOutput || e.message }, { status: 500 });
  } finally {
    // Clean up the temporary image file
    try {
      console.log(`API Route: Attempting to delete temporary file: ${tempImagePath}`);
      await fs.unlink(tempImagePath);
      console.log(`API Route: Temporary file deleted: ${tempImagePath}`);
    } catch (cleanupError) {
      console.error('API Route: Error cleaning up temporary image file:', cleanupError);
    }
  }
}
