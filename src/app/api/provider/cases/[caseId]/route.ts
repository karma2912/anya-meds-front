import { NextResponse } from 'next/server';

const mockCaseDetails = {
    id: 'c-12345',
    patient: { name: 'Sarah Johnson', id: 'P-48291', dob: '1985-05-22', gender: 'Female' },
    scan: { type: 'Chest X-Ray', date: '2025-08-18', imageUrl: 'https://placehold.co/600x600/e2e8f0/64748b?text=Chest+X-Ray' },
    aiAnalysis: {
        diagnosis: 'Pneumonia Detected',
        confidence: 98.7,
        findings: [
            "Moderate consolidation in the right lower lobe, consistent with pneumonia.",
            "Air bronchograms are present within the consolidation.",
            "No evidence of pleural effusion or pneumothorax."
        ],
        recommendations: "Immediate antibiotic therapy is recommended. Follow-up imaging in 2-4 weeks to ensure resolution."
    },
    status: 'pending_review'
};

export async function GET(request: Request, { params }: { params: { caseId: string } }) {
    const { caseId } = params;
    console.log(`Fetching details for case: ${caseId}`);
    // In a real app, you would fetch this specific case from MongoDB
    return NextResponse.json(mockCaseDetails);
}
