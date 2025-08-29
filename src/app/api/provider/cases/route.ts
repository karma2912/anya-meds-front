// In: app/api/provider/cases/route.ts

import { NextResponse } from 'next/server';
// Import the shared cases array
import { cases } from './db';

// This function now saves a new case to the shared array
export async function POST(request: Request) {
    try {
        const newCaseData = await request.json();
        cases.push(newCaseData);
        console.log('Case saved. Total cases now:', cases.length);
        return NextResponse.json(newCaseData, { status: 201 });
    } catch (error) {
        console.error('Failed to save case:', error);
        return NextResponse.json({ error: 'Failed to process case data' }, { status: 400 });
    }
}