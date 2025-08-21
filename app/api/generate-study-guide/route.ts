import { streamText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { content, topics, studyType, difficulty, timeframe } = await request.json()

    if (!content || !topics || !studyType) {
      return new Response("Missing required fields", { status: 400 })
    }

    const systemPrompt = `You are Lumos, an advanced AI study guide generator. Create comprehensive, well-structured study materials that help students learn effectively. Always format your responses with clear headings, bullet points, and organized sections.`

    const userPrompt = `Generate a ${studyType} study guide with ${difficulty} difficulty level for a ${timeframe} study period.

Content to study: ${content}

Focus topics: ${topics.join(", ")}

Requirements:
- Create comprehensive ${studyType} content
- Use clear headings and bullet points
- Include key concepts, definitions, and examples
- Make it engaging and easy to understand
- Structure it for effective learning

Format the response with proper markdown formatting for easy reading.`

    const result = streamText({
      model: xai("grok-4"),
      prompt: userPrompt,
      system: systemPrompt,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating study guide:", error)
    return new Response("Failed to generate study guide", { status: 500 })
  }
}
