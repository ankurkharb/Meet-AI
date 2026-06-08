/**
 * OpenAI Realtime API Service
 * Handles real-time voice conversation with AI agent
 * 
 * Uses ephemeral token approach for client-side WebRTC connection
 */

const REALTIME_MODEL = process.env.OPENAI_REALTIME_MODEL || "gpt-realtime-2";
const REALTIME_TRANSCRIPTION_MODEL = "gpt-4o-transcribe";

export interface RealtimeSession {
    ephemeralToken: string;
    agentName: string;
    instructions: string;
}

/**
 * Create an ephemeral token for Realtime API access
 * This token is sent to the client to establish a WebRTC connection
 */
export async function createRealtimeSession(agentName: string, agentDescription?: string): Promise<RealtimeSession> {
    const apiKey = process.env.OPENAI_API_KEY;
    const instructions = getAgentInstructions(agentName, agentDescription);

    if (!apiKey) {
        throw new Error("REALTIME_NOT_AVAILABLE");
    }

    try {
        const response = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                session: {
                    type: "realtime",
                    model: REALTIME_MODEL,
                    instructions,
                    audio: {
                        output: { voice: "alloy" },
                        input: {
                            transcription: { model: REALTIME_TRANSCRIPTION_MODEL },
                            turn_detection: { type: "server_vad" },
                        },
                    },
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Realtime] Session creation failed:", response.status, errorText);

            // If Realtime API isn't available, throw a specific error
            if (response.status === 404 || response.status === 403) {
                throw new Error("REALTIME_NOT_AVAILABLE");
            }
            throw new Error(`Failed to create session: ${errorText}`);
        }

        const data = await response.json() as {
            value?: string;
            client_secret?: string | { value?: string };
        };
        const clientSecret = data.value || (typeof data.client_secret === "object"
            ? data.client_secret.value
            : data.client_secret);

        return {
            ephemeralToken: clientSecret || "",
            agentName,
            instructions,
        };
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown realtime error";
        console.error("[Realtime] Error:", message);

        // Re-throw with specific error for handling
        if (message === "REALTIME_NOT_AVAILABLE") {
            throw error;
        }
        throw new Error("REALTIME_NOT_AVAILABLE");
    }
}

/**
 * Get agent instructions based on agent configuration
 */
export function getAgentInstructions(agentName: string, agentDescription?: string): string {
    return `You are ${agentName}, an AI meeting assistant.
${agentDescription ? `Your role: ${agentDescription}` : ""}

Your responsibilities:
- Actively participate in the meeting conversation
- Provide helpful insights and answers when asked
- Be professional, concise, and helpful

Keep your responses conversational and natural. Listen carefully and respond appropriately.`;
}
