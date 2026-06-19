import { Router } from "express";
import agent from "../agents/code.agent.js";

const agentRouter = Router();
const AGENT_STEP_TIMEOUT_MS = Number(process.env.AGENT_STEP_TIMEOUT_MS ?? 180000);
const STREAM_HEARTBEAT_MS = Number(process.env.STREAM_HEARTBEAT_MS ?? 15000);

agentRouter.post("/invoke", async (req, res) => {
    const { message, projectId } = req.body;

    if (!message || !projectId) {
        return res.status(400).json({
            error: "Both message and projectId are required"
        });
    }

    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });

    const sendEvent = (event, data) => {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    const writer = (text) => sendEvent("status", { message: text });
    const heartbeat = setInterval(() => {
        res.write(": keep-alive\n\n");
    }, STREAM_HEARTBEAT_MS);

    try {
        const stream = await agent.stream(
            { messages: [ { role: "user", content: message } ] },
            {
                context: { projectId, writer },
                streamMode: "values",
                timeout: AGENT_STEP_TIMEOUT_MS
            }
        );

        let lastState = null;
        for await (const state of stream) {
            lastState = state;
        }

        if (lastState?.messages?.length) {
            const msgs = lastState.messages;
            for (let i = msgs.length - 1; i >= 0; i--) {
                const m = msgs[i];
                const role = m.role ?? m._getType?.();
                if ((role === 'ai' || role === 'assistant') && !m.tool_calls?.length) {
                    const content = typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
                    sendEvent("message", { content });
                    break;
                }
            }
        }

        sendEvent("done", { ok: true });
        res.end();
    } catch (error) {
        console.error("Error invoking agent:", error);
        if (res.headersSent) {
            sendEvent("error", {
                error: "Failed to invoke agent",
                message: error.message,
                hint: error.name === "TimeoutError"
                    ? "The upstream model request timed out. Increase MISTRAL_REQUEST_TIMEOUT_MS or try a smaller task."
                    : undefined
            });
            res.end();
        } else {
            res.status(500).json({ error: "Failed to invoke agent" });
        }
    } finally {
        clearInterval(heartbeat);
    }
});

export default agentRouter;

