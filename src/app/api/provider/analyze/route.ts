// In: app/api/provider/analyze/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('scanImage') as File | null;
        const analysisType = formData.get('analysisType') as string | null;

        if (!file || !analysisType) {
            return NextResponse.json({ error: 'Missing file or analysis type' }, { status: 400 });
        }

        // Determine the correct Python backend URL
        const backendUrl = `http://localhost:5000/api/${analysisType}`;

        // Create a new FormData to forward the file to the Python backend
        const backendFormData = new FormData();
        backendFormData.append('image', file);

        console.log(`Forwarding request to: ${backendUrl}`);

        // Call the Python ML backend
        const response = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Backend error:', errorText);
            return NextResponse.json({ error: `Backend service failed: ${errorText}` }, { status: response.status });
        }

        // Get the prediction data and return it to the frontend
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}