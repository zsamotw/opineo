import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { comment } = await req.json();

  if (!process.env.HF_TOKEN) {
    return NextResponse.json({ 
      error: "Brak HF_TOKEN w konfiguracji środowiska" 
    }, { status: 500 });
  }

  const systemPrompt = `Jesteś ekspertem ds. analizy retoryki i argumentacji. Analizujesz komentarze pod kątem:
1. Głównych argumentów lub braku argumentów
2. Tonu (emocjonalny/neutralny/racjonalny)
3. Technik retorycznych (ad personam, fałszywa dychotomia, manipulacja emocjonalna, itp.)
4. Jakości argumentacji

Odpowiadasz w języku polskim, używając naturalnego języka. Bądź obiektywny i konstruktywny.`;

  try {
    const r = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-3.3-70B-Instruct:fastest",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Przeanalizuj komentarz: "${comment}"` }
          ],
          max_tokens: 600,
          temperature: 0.3,
        }),
      }
    );

    const data = await r.json();
    
    if (!r.ok) {
      return NextResponse.json({ 
        error: `HuggingFace API error: ${r.status}`,
        details: data,
        requestId: r.headers.get("x-request-id")
      }, { status: r.status });
    }

    const analysis = data.choices?.[0]?.message?.content;

    return NextResponse.json({ 
      analysis: analysis?.trim() || "Nie udało się przeanalizować komentarza." 
    });
  } catch (err) {
    return NextResponse.json({ 
      error: `Błąd: ${err instanceof Error ? err.message : "Nieznany błąd"}` 
    }, { status: 500 });
  }
}
