import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const FORBIDDEN_WORDS = [
  "delve", "leverage", "revolutionize", "game-changer", "cutting-edge",
  "multifaceted", "nuanced", "paramount", "pivotal", "seamless", "robust",
  "innovative", "synergy", "empower", "unlock", "transformative", "landscape",
  "it's important to note", "in today's world", "in today's fast-paced",
  "at the end of the day", "in conclusion,", "to sum up,",
];

const SYSTEM_PROMPT = `You are a professional blog writer with deep subject expertise.
Write in natural, conversational human language as if a knowledgeable friend is explaining something.

Strict rules you must never break:
- Never use em-dashes (—) or en-dashes (–). Use a comma or period instead.
- Never use emojis.
- Never use these words or phrases: ${FORBIDDEN_WORDS.join(", ")}.
- Do not start sentences with "Additionally," "Furthermore," "Moreover," or "Subsequently,".
- Avoid passive voice where possible.
- Use short to medium sentences. Vary sentence length naturally.
- Write like a person, not a machine.

Output format: Return valid JSON only, with this exact structure:
{
  "content": "<h2>Section Title</h2><p>paragraph...</p>",
  "excerpt": "One or two sentence summary of the article.",
  "tags": "tag1, tag2, tag3",
  "readTime": 6
}

For "content", use only these HTML tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>.
Do NOT include <html>, <body>, <head>, or any wrapper tags.
Start with a <p> intro paragraph, then use <h2> for main sections.
Aim for 800 to 1200 words total.
"readTime" should be a number (minutes to read, roughly 200 words per minute).`;

export async function POST(req: Request) {
  try {
    const { title, category } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json({ ok: false, error: "Title is required" }, { status: 400 });
    }

    // Step 1: Research the topic using web search
    let researchNotes = "";
    try {
      const researchRes = await (openai.chat.completions.create as Function)({
        model: "gpt-4o-search-preview",
        web_search_options: { search_context_size: "medium" },
        messages: [
          {
            role: "user",
            content: `Research the topic: "${title}".
Find and summarize:
- Key facts and statistics
- Current trends or recent developments
- Expert opinions or common misconceptions
- Practical insights readers would find useful
- 3 to 5 specific, credible data points with context

Write a research brief in plain paragraphs. Be factual and specific.`,
          },
        ],
      });
      researchNotes = researchRes.choices[0]?.message?.content ?? "";
    } catch {
      // Search model not available — continue with model knowledge only
      researchNotes = "";
    }

    // Step 2: Write the article using the research
    const writeRes = await openai.chat.completions.create({
      model: "gpt-4o",
      response_format: { type: "json_object" },
      temperature: 0.75,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: researchNotes
            ? `Research notes:\n\n${researchNotes}\n\n---\n\nUsing the research above, write a complete blog article.\nTitle: "${title}"\nCategory: ${category ?? "General"}\n\nThe article must be grounded in the research facts. Write in a direct, human tone. No AI language.`
            : `Write a complete, well-researched blog article.\nTitle: "${title}"\nCategory: ${category ?? "General"}\n\nDraw on accurate knowledge about this topic. Write in a direct, human tone. No AI language.`,
        },
      ],
    });

    const raw = writeRes.choices[0]?.message?.content ?? "{}";
    let parsed: { content?: string; excerpt?: string; tags?: string; readTime?: number };

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: "AI returned invalid JSON. Please try again." }, { status: 500 });
    }

    // Post-process: strip any remaining dashes and emojis that slipped through
    const content = (parsed.content ?? "")
      .replace(/—|–/g, ",")
      .replace(/[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, "");

    return NextResponse.json({
      ok: true,
      data: {
        content,
        excerpt: parsed.excerpt ?? "",
        tags: parsed.tags ?? "",
        readTime: typeof parsed.readTime === "number" ? parsed.readTime : 6,
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
