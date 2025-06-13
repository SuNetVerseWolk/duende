import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  maxRetries: 10,
});

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300000);

  try {
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid JSON format" },
        { status: 400 }
      );
    }

    const { term } = requestBody;
    if (!term || typeof term !== "string" || term.trim().length === 0) {
      return NextResponse.json(
        { error: "Invalid term parameter" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create(
      {
        model:
          process.env.NEXT_PUBLIC_OPENAI_MODEL || "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "system",
            content: `
						Term: "${term}"
            Определите следующий термин "${term}" в 1-2 предложениях, чтобы русский человек мог понять значение термина сразу же.
						Используйте простой и непринужденный русский язык и, при необходимости, укажите контекст.
						Не используйте термин в своем ответе, достаточно краткого описания.
          `,
          },
        ],
        temperature: 0.7,
      },
      {
        signal: controller.signal,
      }
    );

    clearTimeout(timeout);
    const definition = completion.choices[0].message.content?.trim() || "";
    if (!definition) {
      return NextResponse.json(
        { error: "Failed to generate definition" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      definition,
    });
  } catch (error) {
    clearTimeout(timeout);
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
