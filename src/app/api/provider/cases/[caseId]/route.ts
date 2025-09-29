// In: app/api/provider/cases/[caseId]/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next'; // <-- Import session tools
import { authOptions } from '@/lib/auth';       // <-- Import auth config

export async function GET(
    request: Request,
    { params }: { params: { caseId: string } }
) {
    // --- 1. Get the current user's session ---
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { caseId } = params;

    if (!ObjectId.isValid(caseId)) {
        return NextResponse.json({ error: 'Invalid Case ID format' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        console.log(`Searching database for case: ${caseId}`);

        const caseDetails = await db.collection('cases').findOne({
            _id: new ObjectId(caseId),
        });

        if (!caseDetails) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        // --- 2. Authorization Check: Does this case belong to the logged-in doctor? ---
        if (caseDetails.doctorId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden: You do not have access to this case.' }, { status: 403 });
        }

        // --- 3. If authorized, return the data ---
        console.log(`Found case:`, caseDetails);
        return NextResponse.json(caseDetails);

    } catch (error) {
        console.error('Failed to fetch case data:', error);
        return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
    }
}