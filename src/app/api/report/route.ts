import { NextResponse } from "next/server";

// In-memory store (replace with DB in production)
const reports: any[] = [];

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const token = `RPT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

        const report = {
            token,
            type: body.type || "Unknown",
            location: body.location || "Unknown",
            description: body.description || "",
            severity: body.severity || "MODERATE",
            timestamp: new Date().toISOString(),
            status: "RECEIVED",
            coords: body.coords || null,
        };

        reports.push(report);

        return NextResponse.json({
            success: true,
            token,
            message: `Report received. Token: ${token}. Forwarding to district emergency cell.`,
            estimated_response:
                report.severity === "CRITICAL"
                    ? "30 minutes for CRITICAL"
                    : "2-4 hours for MODERATE/LOW",
        });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: "Failed to process report", message: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    // Admin endpoint to view all reports
    return NextResponse.json({ reports: reports.slice(-50) });
}
