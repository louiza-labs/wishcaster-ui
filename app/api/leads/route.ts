import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
	const cookieStore = cookies();

	const supabase = createClient(cookieStore);

	try {
		let { data: leads, error } = await supabase.from("leads").select("*");
		return Response.json({ leads });
	} catch (error) {
		console.error("Error fetching leads:", error);
		return Response.json({ error: "Failed to fetch leads" });
	}
}
