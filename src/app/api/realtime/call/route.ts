import { createHash } from "crypto";
import { auth } from "@clerk/nextjs/server";
import { meetingsService } from "@/modules/meetings";
import { getAgentInstructions, getRealtimeModel } from "@/lib/openai-realtime";

export const runtime = "nodejs";

const REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-transcribe";

function getSafetyIdentifier(userId: string) {
    return createHash("sha256").update(userId).digest("hex");
}

export async function POST(request: Request) {
    const { userId } = await auth();

    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const meetingId = url.searchParams.get("meetingId");

    if (!meetingId) {
        return Response.json({ error: "Missing meetingId" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return Response.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const meeting = await meetingsService.getById(meetingId, userId);

    if (!meeting) {
        return Response.json({ error: "Meeting not found" }, { status: 404 });
    }

    const offerSdp = await request.text();

    if (!offerSdp.trim()) {
        return Response.json({ error: "Missing SDP offer" }, { status: 400 });
    }

    const agentName = meeting.agent?.name || "AI Assistant";
    const sessionConfig = JSON.stringify({
        type: "realtime",
        model: getRealtimeModel(),
        instructions: getAgentInstructions(agentName, meeting.agent?.description || undefined),
        audio: {
            output: { voice: "alloy" },
            input: {
                transcription: { model: REALTIME_TRANSCRIPTION_MODEL },
                turn_detection: { type: "server_vad" },
            },
        },
    });

    const formData = new FormData();
    formData.set("sdp", offerSdp);
    formData.set("session", sessionConfig);

    const openAiResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "OpenAI-Safety-Identifier": getSafetyIdentifier(userId),
        },
        body: formData,
    });

    const body = await openAiResponse.text();

    if (!openAiResponse.ok) {
        console.error("[Realtime] Call creation failed:", openAiResponse.status, body);
    }

    return new Response(body, {
        status: openAiResponse.status,
        headers: {
            "Cache-Control": "no-store",
            "Content-Type": openAiResponse.headers.get("content-type") || (openAiResponse.ok ? "application/sdp" : "text/plain"),
        },
    });
}
