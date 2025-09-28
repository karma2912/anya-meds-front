// In: app/api/provider/cases/[caseId]/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId from the native driver

export async function GET(
    request: Request,
    { params }: { params: { caseId: string } }
) {
    const { caseId } = params;

    // Validate if the ID is a valid MongoDB ObjectId format using the native driver
    if (!ObjectId.isValid(caseId)) {
        return NextResponse.json({ error: 'Invalid Case ID format' }, { status: 400 });
    }

    try {
        // Connect to the database using your existing utility
        const { db } = await connectToDatabase();

        console.log(`Searching database for case: ${caseId}`);

        // Find the specific case in the 'cases' collection by its _id
        // We must convert the string ID to a MongoDB ObjectId to find it
        const caseDetails = await db.collection('cases').findOne({
            _id: new ObjectId(caseId),
        });

        if (caseDetails) {
            console.log(`Found case:`, caseDetails);
            return NextResponse.json(caseDetails);
        } else {
            console.error(`Case with ID ${caseId} not found in the database.`);
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }
    } catch (error) {
        console.error('Failed to fetch case data:', error);
        return NextResponse.json(
            { error: 'An internal server error occurred.' },
            { status: 500 }
        );
    }
}