// In: app/api/provider/patients/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// --- Important: Add these imports for authentication ---
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';// Assuming your next-auth config is here

// --- GET: Fetches patients ONLY for the logged-in doctor ---
export async function GET() {
    try {
        // 1. Get the current user's session
        const session = await getServerSession(authOptions);

        // 2. Security Check: If no user is logged in, deny access
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
        }
        const doctorId = session.user.id;

        const { db } = await connectToDatabase();
        
        // 3. Fetch documents from "patients" where doctorId matches the logged-in user's ID
        const doctorPatients = await db.collection('patients')
            .find({ doctorId: new ObjectId(doctorId) }) // <-- This is the crucial filter!
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(doctorPatients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ message: "An internal server error occurred." }, { status: 500 });
    }
}

// --- POST: Creates a new patient and links them to the logged-in doctor ---
export async function POST(request: Request) {
    try {
        // 1. Get the current user's session
        const session = await getServerSession(authOptions);

        // 2. Security Check
        if (!session || !session.user?.id) {
            return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
        }
        const doctorId = session.user.id;
        
        const body = await request.json();
        const { name, part, gender, email, phone } = body;

        if (!name || !part) {
            return NextResponse.json({ message: "Name and Body part are required." }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        
        const newPatientId = new ObjectId();
        const newPatientDocument = {
            _id: newPatientId,
            doctorId: new ObjectId(doctorId), // <-- Link the new patient to the doctor!
            id: `p-${newPatientId.toString().slice(-6)}`,
            name,
            part,
            gender: gender || 'Not specified',
            email: email || null,
            phone: phone || null,
            lastScan: 'N/A',
            lastScanDate: '15 Aug 2025',
            createdAt: new Date(),
            avatarUrl: "https://example.com/avatar.png",
        };

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