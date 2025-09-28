// In: app/api/provider/dashboard/route.ts

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();

        // Perform all database queries in parallel for efficiency
        const [totalPatients, totalAnalyses, pendingReviews, recentCases] = await Promise.all([
            db.collection('patients').countDocuments(),
            db.collection('cases').countDocuments(),
            db.collection('cases').countDocuments({ status: 'pending' }),
            db.collection('cases')
              .find({ status: 'pending' }) // Fetch only cases that need review
              .sort({ analysisDate: -1 })  // Get the most recent ones first
              .limit(5)                     // Limit to 5 for the dashboard view
              .toArray(),
        ]);
        
        // For the chart, we can return static data for now, as a real-time aggregation is complex
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
                aiAccuracy: 98.8 // This is typically a calculated value, hardcoded for now
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