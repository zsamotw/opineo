import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { comment } = await req.json();

  if (!process.env.HF_TOKEN) {
    return NextResponse.json(
      { error: "Brak HF_TOKEN w konfiguracji środowiska" },
      { status: 500 }
    );
  }

  const prompt = `Przeanalizuj poniższy komentarz pod kątem retoryki, argumentacji i tonu emocjonalnego.

KOMENTARZ: "${comment}"

Odpowiedz w języku polskim, używając naturalnego języka. Twoja odpowiedź powinna zawierać:
1. Krótkie podsumowanie głównych argumentów lub braku argumentów w komentarzu
2. Ocenę tonu (emocjonalny/neutralny/racjonalny) z uzasadnieniem
3. Wskazanie technik retorycznych (np. ad personam, manipulacje emocjonalne)
4. Ogólną ocenę jakości argumentacji

Bądź obiektywny i konstruktywny.`;

  try {
    const r = await fetch(
      "https://api-inference.huggingface.co/models/google/flan-t5-large",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 400,
            temperature: 0.3,
          },
          options: {
            wait_for_model: true
          }
        }),
      }
    );

    const data = await r.json();

    if (!r.ok) {
      return NextResponse.json(
        {
          error: `HuggingFace API error: ${r.status}`,
          details: data,
        },
        { status: 500 }
      );
    }

    let generatedText = "";

    if (Array.isArray(data)) {
      generatedText = data[0]?.generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    } else if (data.error) {
      throw new Error(data.error);
    }

    return NextResponse.json({
      analysis:
        generatedText?.trim() ||
        "Nie udało się przeanalizować komentarza.",
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