// In: app/api/provider/patients/[patientId]/route.ts

import { NextResponse } from 'next/server';
// 1. Import your MongoDB connection helper
import { connectToDatabase } from '@/lib/mongodb';
// 2. Import ObjectId to correctly query by MongoDB's unique ID
import { ObjectId } from 'mongodb';

export async function GET(
    request: Request,
    { params }: { params: { patientId: string } }
) {
    try {
        const { patientId } =  await params;
        console.log(patientId)
        // 3. Connect to the database
        const { db } = await connectToDatabase();
        
        // 4. Find the patient in the 'patients' collection by their unique _id
        // We must convert the patientId string from the URL into a MongoDB ObjectId
        const patient = await db.collection('patients').findOne({ 
            id: patientId
            
        });

        if (!patient) {
            // If no patient is found in the database, return a 404 error
            return NextResponse.json({ message: "Patient not found" }, { status: 404 });
        }

        // If the patient is found, return their data
        return NextResponse.json(patient);

    } catch (error) {
        console.error("Error fetching single patient:", error);
        // This will also catch errors if the provided patientId is not a valid ObjectId format
        return NextResponse.json({ message: "An internal server error or invalid ID format occurred." }, { status: 500 });
    }
}