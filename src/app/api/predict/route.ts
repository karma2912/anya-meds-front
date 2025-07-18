// app/api/predict/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';
import { writeFile } from 'fs';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('image') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const imagePath = path.join(process.cwd(), 'app/python/test.png');
  await fs.mkdir(path.dirname(imagePath), { recursive: true });

  await fs.writeFile(imagePath, buffer);

  const pyPath = path.join(process.cwd(), 'app/python/predict.py');

  return new Promise((resolve) => {
    const process = spawn('python', [pyPath]);

    let result = '';
    let error = '';

    process.stdout.on('data', (data) => {
      result += data.toString();
    });

    process.stderr.on('data', (data) => {
      error += data.toString();
    });

    process.on('close', (code) => {
      if (code === 0) {
        try {
          const parsed = JSON.parse(result);
          resolve(NextResponse.json(parsed));
        } catch (e) {
          console.error('JSON parse error:', e);
          resolve(NextResponse.json({ error: 'Failed to parse Python output' }, { status: 500 }));
        }
      } else {
        console.error('Python script failed:', error);
        resolve(NextResponse.json({ error: 'Python script failed', detail: error }, { status: 500 }));
      }
    });
  });
}
