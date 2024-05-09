import { NextResponse } from "next/server";
import Together from "together-ai";

const MODEL = "mistralai/Mixtral-8x7B-Instruct-v0.1";

if (!process.env.TOGETHER_API_KEY) {
  throw new Error("Missing env var from Together.ai");
}

export const config = {
  runtime: "edge",
};

const together = new Together({
  auth: process.env.TOGETHER_API_KEY,
});

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "No prompt in the request" },
      { status: 400 }
    );
  }

  const stream = await together.inference(MODEL, {
    prompt: prompt,
    max_tokens: 300,
    stream_tokens: true,
    stop: "</s>",
  });

  return new Response(stream, {
    headers: new Headers({
      "Cache-Control": "no-cache",
    }),
  });
}
