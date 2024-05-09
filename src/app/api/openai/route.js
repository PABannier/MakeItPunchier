import { OpenAIStream } from "../../../utils/OpenAIStream";
import { NextResponse } from "next/server";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const runtime = "edge";

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json(
      { error: "No prompt or style in the request" },
      { status: 400 }
    );
  }

  const payload = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 200,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  // return stream response (SSE)
  return new Response(stream, {
    headers: new Headers({
      // since we don't use browser's EventSource interface, specifying content-type is optional.
      // the eventsource-parser library can handle the stream response as SSE, as long as the data format complies with SSE:
      // https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#sending_events_from_the_server

      // 'Content-Type': 'text/event-stream',
      "Cache-Control": "no-cache",
    }),
  });
}
