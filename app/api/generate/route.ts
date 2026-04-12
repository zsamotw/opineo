import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { comment } = await req.json();

  const prompt = `Przeanalizuj poniższy komentarz pod kątem retoryki, argumentacji i tonu emocjonalnego.

KOMENTARZ: "${comment}"

Odpowiedz w języku polskim, używając naturalnego języka. Twoja odpowiedź powinna zawierać:
1. Krótkie podsumowanie głównych argumentów lub braku argumentów w komentarzu
2. Ocenę tonu (emocjonalny/neutralny/racjonalny) z uzasadnieniem
3. Wskazanie technik retorycznych, jeśli występują (np. ad personam, fałszywa dychotomia, emocjonalne manipulacje, itp.)
4. Ogólną ocenę jakości argumentacji

Bądź obiektywny i konstruktywny w analizie.`;

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
          return_full_text: false,
        },
      }),
    }
  );

  const data = await r.json();
  
  if (Array.isArray(data) && data[0]?.generated_text) {
    return NextResponse.json({ analysis: data[0].generated_text.trim() });
  }
  
  return NextResponse.json({ 
    analysis: data.generated_text?.trim() || "Nie udało się przeanalizować komentarza." 
  }, { status: r.ok ? 200 : 500 });
}
