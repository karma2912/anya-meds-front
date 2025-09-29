// In: app/api/provider/analyze/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // <-- FIX 1: Use the correct, central path

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('scanImage') as File | null;
        const analysisType = formData.get('analysisType') as string | null;
        const patientId = formData.get('patientId') as string | null;

        if (!file || !analysisType || !patientId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        
        const { db } = await connectToDatabase();
        
        if (!ObjectId.isValid(patientId)) {
            return NextResponse.json({ error: 'Invalid Patient ID format' }, { status: 400 });
        }
        
        const patient = await db.collection('patients').findOne({ _id: new ObjectId(patientId) });

        if (!patient || patient.doctorId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Patient not found or you are not authorized.' }, { status: 404 });
        }
        
        // --- Forward image to the Python backend ---
        const backendUrl = `http://localhost:5000/api/${analysisType}`;
        const backendFormData = new FormData();
        backendFormData.append('image', file);

        console.log(`Forwarding request to Python backend: ${backendUrl}`);
        
        // --- FIX 2: Complete the fetch call with method and body ---
        const mlResponse = await fetch(backendUrl, {
            method: 'POST',
            body: backendFormData,
        });

        if (!mlResponse.ok) {
            const errorText = await mlResponse.text();
            return NextResponse.json({ error: `Backend service failed: ${errorText}` }, { status: mlResponse.status });
        }
        
        const aiData = await mlResponse.json();
        console.log(`Found patient: ${patient.name}`);

        const caseDocument = {
            doctorId: new ObjectId(session.user.id),
            patientId: patientId,
            patientName: patient.name,
            analysisDate: new Date(),
            scanType: analysisType,
            primaryDiagnosis: aiData.diagnosis,
            confidenceScore: aiData.confidence,
            imageUrl: aiData.image_url,
            heatmapUrl: aiData.heatmap_url,
            narrativeReport: aiData.ai_summary,
            status: 'pending',
        };
        
        const result = await db.collection('cases').insertOne(caseDocument);
        console.log("Successfully saved case with ID:", result.insertedId);

        return NextResponse.json({ caseId: result.insertedId });

    } catch (error) {
        console.error('Error in analyze route:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}