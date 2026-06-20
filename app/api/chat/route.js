// app/api/chat/route.js — Groq API proxy (server-side, key never exposed to browser)

export const runtime = 'edge'; // Edge runtime for fastest streaming on Vercel

export async function POST(req) {
  try {
    const body = await req.json();
    const { messages, systemPrompt } = body;

    if (!messages || !Array.isArray(messages)) {
      return Response.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Key priority: user's key from header (localStorage) → env var
    const apiKey =
      req.headers.get('x-groq-key')?.trim() ||
      process.env.GROQ_API_KEY?.trim();

    if (!apiKey) {
      return Response.json(
        { error: 'No API key configured. Add your Groq API key in Settings.' },
        { status: 401 }
      );
    }

    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model:       'llama-3.1-8b-instant',
          stream:      true,
          max_tokens:  500,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt || 'You are a helpful fitness coach.' },
            ...messages,
          ],
        }),
        signal: AbortSignal.timeout(20_000), // 20s timeout
      }
    );

    if (!groqResponse.ok) {
      const errText = await groqResponse.text().catch(() => '');
      if (groqResponse.status === 401) {
        return Response.json(
          { error: 'Invalid API key. Check your Groq API key in Settings.' },
          { status: 401 }
        );
      }
      if (groqResponse.status === 429) {
        return Response.json(
          { error: 'Rate limited by Groq. Please wait 30 seconds and try again.' },
          { status: 429 }
        );
      }
      return Response.json(
        { error: `Groq API error: ${groqResponse.status}` },
        { status: groqResponse.status }
      );
    }

    // Stream the response back to the client
    return new Response(groqResponse.body, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection:      'keep-alive',
      },
    });

  } catch (err) {
    if (err.name === 'TimeoutError') {
      return Response.json(
        { error: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }
    console.error('[/api/chat] Error:', err);
    return Response.json(
      { error: 'Server error. Please try again.' },
      { status: 503 }
    );
  }
}
