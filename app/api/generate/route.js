import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  const body = await req.json();

  const { brand, industry, objective, product } = body;

  const prompt = `
You are an expert social media strategist.

Brand: ${brand}
Industry: ${industry}
Campaign Objective: ${objective}
Product: ${product}

STEP 1
Analyze brand voice.

STEP 2
Generate EXACTLY 10 tweets.

Rules:
- Each tweet under 280 characters
- Social media friendly
- Use hashtags
- Engaging tone

Output format:

Brand Voice Summary

Tweets:
1.
2.
3.
4.
5.
6.
7.
8.
9.
10.
`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return NextResponse.json({
    result: response.choices[0].message.content,
  });
}