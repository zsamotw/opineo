import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { comment } = await req.json();

  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "Brak OPENROUTER_API_KEY w konfiguracji środowiska" },
      { status: 500 }
    );
  }

  const prompt = `Przeanalizuj poniższy komentarz pod kątem retoryki, argumentacji i tonu emocjonalnego.

KOMENTARZ: "${comment}"

Odpowiedz w języku polskim, używając naturalnego języka. Twoja odpowiedź powinna zawierać:
1. Krótkie podsumowanie głównych argumentów lub braku argumentów w komentarzu
2. Ocenę tonu (emocjonalny/neutralny/racjonalny) z uzasadnieniem
3. Wskazanie technik retorycznych, jeśli występują (np. ad personam, fałszywa dychotomia, emocjonalne manipulacje, itp.)
4. Ogólną ocenę jakości argumentacji

Bądź obiektywny i konstruktywny w analizie.`;

  try {
    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000", // opcjonalne, ale zalecane
        "X-Title": "Comment Analyzer", // opcjonalne
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct-v0.2",
        messages: [
          {
            role: "system",
            content: "Jesteś ekspertem od analizy retoryki i argumentacji.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        {
          error: `OpenRouter API error: ${r.status}`,
          details: data,
        },
        { status: 500 }
      );
    }

    const generatedText =
      data.choices?.[0]?.message?.content ?? "Brak odpowiedzi modelu.";

    return NextResponse.json({
      analysis: generatedText.trim(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: `Błąd: ${
          err instanceof Error ? err.message : "Nieznany błąd"
        }`,
      },
      { status: 500 }
    );
  }
}