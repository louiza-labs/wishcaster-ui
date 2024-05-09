import { makeEmail } from "@/lib/helpers";
import { google } from "googleapis";

import type { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
	const accessToken = request.cookies.get("accessToken")?.value;

	const gmail = google.gmail({ version: "v1", auth: accessToken });

	try {
		const emailsResponse = await gmail.users.messages.list({
			userId: "me",
		});

		const messages = emailsResponse.data.messages;

		return Response.json({ mail: messages });
	} catch (error) {
		console.error("Error fetching emails:", error);
		return Response.json({ error: "Failed to fetch emails" });
	}
}

export async function POST(request: NextRequest) {
	const accessToken = request.cookies.get("accessToken")?.value;
	const body = await request.json();
	const { to, subject, message } = body;
	const gmail = google.gmail({ version: "v1", auth: accessToken });

	const raw = makeEmail(to, subject, message);

	try {
		const response = await gmail.users.messages.send({
			userId: "me",
			requestBody: {
				raw: raw,
			},
		});

		return response.data;
	} catch (error) {
		console.error("Error sending email:", error);
		return { error: "Failed to send email" };
	}
}
