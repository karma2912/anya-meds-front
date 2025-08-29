// In: app/api/provider/cases/[caseId]/route.ts

import { NextResponse } from 'next/server';
// Import the SAME shared cases array
import { cases } from '../db'; // Note the path is '../db' here

export async function GET(
    request: Request,
    { params }: { params: { caseId: string } }
) {
    const { caseId } = params;
    console.log(`Searching for case: ${caseId}`);

    // Find the specific case in our shared array
    const caseDetails = cases.find(c => c.id === caseId);

    if (caseDetails) {
        console.log(`Found case:`, caseDetails);
        return NextResponse.json(caseDetails);
    } else {
        console.error(`Case with ID ${caseId} not found.`);
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
    }
}