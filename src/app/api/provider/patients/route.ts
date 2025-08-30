import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
// Import ObjectId to work with MongoDB's unique IDs
import { ObjectId } from 'mongodb';


export async function GET() {
    try {
        // 2. Connect to the database
        const { db } = await connectToDatabase();
        
        // 3. Fetch all documents from your "patients" collection
        // We sort by `createdAt` to show the newest patients first.
        const allPatients = await db.collection('patients').find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json(allPatients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, dob, gender, email, phone } = body;

        if (!name || !dob) {
            return NextResponse.json({ message: "Name and Date of Birth are required." }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        
        // 1. Create a unique ID for the new patient
        const newPatientId = new ObjectId();

        const newPatientDocument = {
            _id: newPatientId, // Use the generated ObjectId
            id: `p-${newPatientId.toString().slice(-6)}`, // Create a shorter, user-friendly ID
            name,
            dob,
            gender: gender || 'Not specified',
            email: email || null,
            phone: phone || null,
            lastScan: 'N/A',
            lastScanDate: '15 Aug 2025',
            createdAt: new Date(),
            avatarUrl: "https://example.com/avatar.png",
        };

        // 2. Insert the new document into the "patients" collection
        await db.collection('patients').insertOne(newPatientDocument);

        return NextResponse.json(
            { message: "Patient created successfully", patient: newPatientDocument },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating patient:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}