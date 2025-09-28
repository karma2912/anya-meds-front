// In: app/api/provider/analyze/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // <-- Import ObjectId

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('scanImage') as File | null;
        const analysisType = formData.get('analysisType') as string | null;
        const patientId = formData.get('patientId') as string | null;

        if (!file || !analysisType || !patientId) {
            return NextResponse.json({ error: 'Missing file, analysis type, or patient ID' }, { status: 400 });
        }

        // --- Step 1: Forward image to the Python backend ---
        const backendUrl = `http://localhost:5000/api/${analysisType}`;
        const backendFormData = new FormData();
        backendFormData.append('image', file);

        console.log(`Forwarding request to Python backend: ${backendUrl}`);
        const mlResponse = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
        });

        if (!mlResponse.ok) {
            const errorText = await mlResponse.text();
            console.error('Python backend error:', errorText);
            return NextResponse.json({ error: `Backend service failed: ${errorText}` }, { status: mlResponse.status });
        }
        
        const aiData = await mlResponse.json();

        // --- Step 2: Connect to DB and fetch patient name ---
        console.log("Connecting to the database to fetch patient data...");
        const { db } = await connectToDatabase();

        // --- NEW: Find the patient in the 'patients' collection ---
        if (!ObjectId.isValid(patientId)) {
            return NextResponse.json({ error: 'Invalid Patient ID format' }, { status: 400 });
        }
        const patient = await db.collection('patients').findOne({ _id: new ObjectId(patientId) });

        // --- NEW: Handle case where patient is not found ---
        if (!patient) {
            return NextResponse.json({ error: `Patient with ID ${patientId} not found.` }, { status: 404 });
        }
        console.log(`Found patient: ${patient.name}`);

        // --- Step 3: Create the case document with the real name ---
        const caseDocument = {
            patientId: patientId,
            patientName: patient.name, // <-- Using the fetched name
            analysisDate: new Date(),
            scanType: analysisType,
            primaryDiagnosis: aiData.diagnosis,
            confidenceScore: aiData.confidence,
            imageUrl: aiData.image_url,
            heatmapUrl: aiData.heatmap_url,
            narrativeReport: aiData.ai_summary,
            status: 'pending',
        };
        
        // Insert the document into the 'cases' collection
        const result = await db.collection('cases').insertOne(caseDocument);
        console.log("Successfully saved case with ID:", result.insertedId);

        // --- Step 4: Return the NEW Case ID to the frontend ---
        return NextResponse.json({ caseId: result.insertedId });

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}