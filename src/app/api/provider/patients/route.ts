import { NextResponse } from 'next/server';

// --- ADDED: This line is required for static exports ---
// It tells Next.js to treat this route as if it were a static file at build time.
export const dynamic = "force-static";

// Mock patient data
const mockPatients = [
  { id: 'p-48291', name: 'Sarah Johnson', dob: '1985-05-22', lastScan: 'Chest X-Ray', lastScanDate: '2025-08-18' },
  { id: 'p-57123', name: 'Michael Chen', dob: '1978-11-10', lastScan: 'Brain MRI', lastScanDate: '2025-08-17' },
  { id: 'p-34982', name: 'Emma Williams', dob: '1992-02-15', lastScan: 'Skin Lesion', lastScanDate: '2025-08-17' },
  { id: 'p-67234', name: 'Robert Davis', dob: '1965-07-30', lastScan: 'Chest X-Ray', lastScanDate: '2025-08-16' },
];

export async function GET() {
  try {
    // In a real app, you would fetch this from your MongoDB database
    return NextResponse.json(mockPatients);
  } catch (error) {
    console.error("Error in GET /api/provider/patients:", error);
    // This ensures a proper JSON error response is sent
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("New patient data received:", body);
        // In a real app, you would save this to your database
        return NextResponse.json({ message: "Patient created successfully", patient: body }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/provider/patients:", error);
        return NextResponse.json(
          { message: "An internal server error occurred." },
          { status: 500 }
        );
    }
}
