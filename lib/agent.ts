import type { AgentResponseShape } from "@/types";
import { estimateTokensFromMessages } from "./credits";

export function getAgentReply(payload: unknown): string {
    if (typeof payload === "string") return payload;

    const data = payload as AgentResponseShape;

    return (
        data.message ??
        ""
    ).toString();
}

export function getTotalTokens(payload: unknown, fallbackText: string): number {
    if (typeof payload === "object" && payload !== null) {
        const data = payload as AgentResponseShape;
        const usage = data.usage;

        if (typeof usage === "number" && Number.isFinite(usage)) {
            return usage;
        }

        if (usage && typeof usage === "object") {
            const total = usage.total_tokens ?? 0;

            if (typeof total === "number" && Number.isFinite(total) && total > 0) {
                return total;
            }
        }
    }

    // Fallback if the agent does not return usage.
    return estimateTokensFromMessages([{ content: fallbackText }]);
}

export async function safeParseAgentResponse(res: Response): Promise<unknown> {
    const text = await res.text();

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}
