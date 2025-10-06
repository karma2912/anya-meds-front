import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(
    request: Request,
    { params }: { params: { patientId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { patientId } = params;
        if (!ObjectId.isValid(patientId)) {
            return NextResponse.json({ error: 'Invalid Patient ID' }, { status: 400 });
        }

        const { db } = await connectToDatabase();
        
        // Use an aggregation pipeline to join patient with their cases
        const patientData = await db.collection('patients').aggregate([
            // 1. Match the specific patient and ensure they belong to the logged-in doctor
            { 
                $match: { 
                    _id: new ObjectId(patientId),
                    doctorId: new ObjectId(session.user.id)
                }
            },
            // 2. "Join" with the 'cases' collection
            {
                $lookup: {
                    from: 'cases', // The collection to join with
                    let: { patient_id: { $toString: "$_id" } }, // Convert patient _id to string and store in a variable
                    pipeline: [
                        // Find cases where the string patientId matches our variable
                        { $match:
                            { $expr:
                                { $eq: [ "$patientId",  "$$patient_id" ] }
                            }
                        },
                        // Optional: Sort the cases within the aggregation
                        { $sort: { analysisDate: -1 } }
                    ],
                    as: 'cases' // The name of the new array field
                }
            }
        ]).toArray();

        if (!patientData || patientData.length === 0) {
            return NextResponse.json({ error: 'Patient not found or you are not authorized' }, { status: 404 });
        }

        // The result is an array, but we only need the first element
        return NextResponse.json(patientData[0]);

    } catch (error) {
        console.error("Failed to fetch patient details:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
