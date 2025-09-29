// In: app/api/provider/dashboard/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Ensure this path is correct

export async function GET() {
    try {
        // 1. Get the current user's session to identify the doctor
        const session = await getServerSession(authOptions);

        // 2. Security Check: If no user is logged in, deny access
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        
        // 3. Convert the user's string ID from the session into a MongoDB ObjectId
        const doctorId = new ObjectId(session.user.id);
        
        const { db } = await connectToDatabase();

        // 4. Perform all database queries, filtering each one by the doctorId
        const [totalPatients, totalAnalyses, pendingReviews, recentCases] = await Promise.all([
            db.collection('patients').countDocuments({ doctorId: doctorId }),
            db.collection('cases').countDocuments({ doctorId: doctorId }),
            db.collection('cases').countDocuments({ status: 'pending', doctorId: doctorId }),
            db.collection('cases')
              .find({ status: 'pending', doctorId: doctorId }) // Filter recent cases
              .sort({ analysisDate: -1 })
              .limit(5)
              .toArray(),
        ]);
        
        // Static data for the chart
        const weeklyAnalyses = [
            { day: "Mon", analyses: 22 }, { day: "Tue", analyses: 35 }, { day: "Wed", analyses: 42 },
            { day: "Thu", analyses: 38 }, { day: "Fri", analyses: 51 }, { day: "Sat", analyses: 45 },
            { day: "Sun", analyses: 30 },
        ];

        const dashboardData = {
            stats: {
                totalPatients,
                totalAnalyses,
                pendingReviews,
                aiAccuracy: 98.8 // This is a placeholder value
            },
            recentCases,
            weeklyAnalyses
        };

        return NextResponse.json(dashboardData);

    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}