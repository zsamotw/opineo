import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { comment } = await req.json();

  if (!process.env.HF_TOKEN) {
    return NextResponse.json({ 
      error: "Brak HF_TOKEN w konfiguracji środowiska" 
    }, { status: 500 });
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
    const r = await fetch(
      "https://router.huggingface.co/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 600,
            temperature: 0.3,
          },
        }),
      }
    );

    const text = await r.text();
    
    if (!r.ok) {
      return NextResponse.json({ 
        error: `HuggingFace API error: ${r.status} - ${text}` 
      }, { status: 500 });
    }

    const data = JSON.parse(text);
    
    const generatedText = Array.isArray(data) 
      ? data[0]?.generated_text 
      : data.generated_text;

    return NextResponse.json({ 
      analysis: generatedText?.trim() || "Nie udało się przeanalizować komentarza." 
    });
  } catch (err) {
    return NextResponse.json({ 
      error: `Błąd: ${err instanceof Error ? err.message : "Nieznany błąd"}` 
    }, { status: 500 });
  }
}
