import { NextResponse } from "next/server";

export async function POST(req) {
  const { prompt } = await req.json();
  const r = await fetch("https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.HF_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ inputs: prompt, "parameters": { "max_new_tokens": 256, "temperature": 0.7 } })
  });
  const data = await r.json();
  return NextResponse.json(data, { status: r.ok ? 200 : 400 });
}