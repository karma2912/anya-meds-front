import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/auth";

export async function POST(
    request: Request,
    { params }: { params: { caseId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { caseId } = params;
        const body = await request.json();
        const { notes } = body;

        const { db } = await connectToDatabase();
        const casesCollection = db.collection('cases');

        const caseToUpdate = await casesCollection.findOne({ _id: new ObjectId(caseId) });

        if (!caseToUpdate) {
            return NextResponse.json({ error: 'Case not found' }, { status: 404 });
        }

        // Authorization check
        if (caseToUpdate.doctorId.toString() !== session.user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update the document in the database
        const updateResult = await casesCollection.updateOne(
            { _id: new ObjectId(caseId) },
            { 
                $set: { 
                    status: 'completed',
                    providerNotes: notes, // Save the notes
                    finalizedAt: new Date(), // Add a timestamp
                } 
            }
        );

        if (updateResult.modifiedCount === 0) {
            throw new Error('Failed to update the case status.');
        }
        
        // Return the newly updated document
        const updatedDocument = await casesCollection.findOne({ _id: new ObjectId(caseId) });
        return NextResponse.json(updatedDocument);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}