import express from "express";
import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

router.get("/aigen", async (req, res) => {
    const prompt = req.query.prompt;
    console.log(prompt);
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    const result = await client.chat.stream({
        model: "mistral-small-latest",
        messages: [{ role: 'user', content: prompt }],
    });

    for await (const chunk of result) {
        const streamText = chunk.data.choices[0].delta.content;
        res.write(`data: ${streamText}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
});

export { router };

