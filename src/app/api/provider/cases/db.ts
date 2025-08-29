// In: app/api/provider/cases/db.ts

// Pre-populate the array with some mock data for easier development
export let cases: any[] = [
    {
        id: 'c-12345',
        patient: { name: 'Sarah Johnson', id: 'P-48291' },
        scan: {
            type: 'Chest X-Ray',
            date: '2025-08-18',
            imageUrl: 'https://placehold.co/600x600/e2e8f0/64748b?text=Chest+X-Ray'
        },
        aiAnalysis: {
            diagnosis: 'Pneumonia Detected',
            confidence: 98.7,
            findings: [
                "Moderate consolidation in the right lower lobe.",
                "Air bronchograms are present.",
                "No evidence of pleural effusion."
            ]
        }
    }
];