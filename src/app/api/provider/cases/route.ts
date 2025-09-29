// In: app/api/provider/cases/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        // 1. Get the current user's session
        const session = await getServerSession(authOptions);

        // 2. Security Check: Ensure a user is logged in
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // 3. Convert the user's ID to an ObjectId for querying
        const doctorId = new ObjectId(session.user.id);

        const { db } = await connectToDatabase();

        // 4. Find only the cases where doctorId matches the logged-in user
        const cases = await db
            .collection('cases')
            .find({ doctorId: doctorId }) // <-- This is the crucial filter
            .sort({ analysisDate: -1 })   // Sort by most recent first
            .toArray();

        return NextResponse.json(cases);

    } catch (error) {
        console.error("Failed to fetch cases:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}