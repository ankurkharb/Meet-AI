import type { Agent } from "@/modules/agents";
import type { Meeting } from "@/modules/meetings";

export type MeetingWithAgent = Meeting & {
    agent?: Agent | null;
    duration?: number | null;
};

export interface SummaryPayload {
    summary?: string;
    keyPoints?: string[];
    actionItems?: string[];
    decisonsMade?: string[];
    sentiment?: {
        overall?: "positive" | "neutral" | "negative";
        confidence?: number;
    };
    speakerHighlights?: {
        speaker: string;
        mainPoints?: string[];
    }[];
    meetingNotes?: string;
}

export interface SummaryData {
    summary: SummaryPayload | null;
    hasSummary: boolean;
}

export interface TranscriptData {
    transcript: unknown;
    hasTranscript: boolean;
}
