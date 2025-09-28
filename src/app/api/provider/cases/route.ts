// In: app/api/provider/cases/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        const cases = await db
            .collection('cases')
            .find({})
            .sort({ analysisDate: -1 }) // Sort by most recent first
            .toArray();

        return NextResponse.json(cases);

    } catch (error) {
        console.error("Failed to fetch cases:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}