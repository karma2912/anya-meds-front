import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
export async function GET(
    request: Request,
    { params }: { params: { patientId: string } }
) {
    try {
        const { patientId } =  await params;
        console.log(patientId)
        const { db } = await connectToDatabase();
        const patient = await db.collection('patients').findOne({ 
            id: patientId
            
        });

        if (!patient) {
            return NextResponse.json({ message: "Patient not found" }, { status: 404 });
        }
        return NextResponse.json(patient);

    } catch (error) {
        console.error("Error fetching single patient:", error);
        return NextResponse.json({ message: "An internal server error or invalid ID format occurred." }, { status: 500 });
    }
}