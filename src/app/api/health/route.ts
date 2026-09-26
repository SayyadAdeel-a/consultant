import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

/**
 * Health endpoint for uptime checks and local diagnostics. Reports
 * configuration status only — never credentials or connection details.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "integravity-website",
    supabaseConfigured: isSupabaseConfigured(),
    timestamp: new Date().toISOString(),
  });
}
