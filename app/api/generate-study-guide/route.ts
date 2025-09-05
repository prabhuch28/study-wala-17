import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { topic, difficulty, files, userEmail } = body

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const hasFiles = files && files.length > 0
    const fileContext = hasFiles ? 
      `Based on uploaded files: ${files.map((f: any) => f.name).join(', ')}` : 
      'Using general knowledge about the topic'

    const prompt = `Create a comprehensive study guide for the following topic:

Topic: ${topic}
Difficulty Level: ${difficulty}
Context: ${fileContext}
User: ${userEmail}

Generate a detailed study guide in JSON format with:
1. Title and overview
2. Learning objectives (5-7 key objectives)
3. Key concepts with explanations
4. Study materials and resources
5. Practice questions with answers
6. Summary and key takeaways
7. Recommended study timeline

Make it engaging, well-structured, and appropriate for ${difficulty} level.

Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "overview": "string",
  "objectives": ["string"],
  "concepts": [{"title": "string", "explanation": "string"}],
  "materials": [{"type": "string", "title": "string", "description": "string"}],
  "questions": [{"question": "string", "answer": "string", "type": "multiple-choice|short-answer|essay"}],
  "summary": "string",
  "timeline": [{"week": number, "focus": "string", "activities": ["string"]}]
}`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator. Generate comprehensive, engaging study guides in valid JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4096,
    })

    const aiResponse = completion.choices[0]?.message?.content?.trim()
    
    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    let studyGuide
    try {
      // Extract JSON from response if it's wrapped in markdown or other text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse
      studyGuide = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback to basic structure if parsing fails
      studyGuide = {
        title: `${topic} Study Guide`,
        overview: `Comprehensive study guide for ${topic} at ${difficulty} level.`,
        objectives: [
          `Understand fundamental concepts of ${topic}`,
          `Apply key principles in practical scenarios`,
          `Analyze complex problems related to ${topic}`,
          `Synthesize knowledge for comprehensive understanding`,
          `Evaluate different approaches and solutions`
        ],
        concepts: [
          {
            title: "Introduction",
            explanation: `Basic introduction to ${topic} concepts and principles.`
          },
          {
            title: "Core Principles",
            explanation: `Key principles and fundamentals of ${topic}.`
          },
          {
            title: "Applications",
            explanation: `Practical applications and real-world examples.`
          }
        ],
        materials: [
          {
            type: "Reading",
            title: `${topic} Textbook`,
            description: "Primary textbook covering all essential concepts"
          },
          {
            type: "Practice",
            title: "Exercise Problems",
            description: "Collection of practice problems and solutions"
          }
        ],
        questions: [
          {
            question: `What are the key principles of ${topic}?`,
            answer: "The key principles include fundamental concepts and their applications.",
            type: "short-answer"
          },
          {
            question: `How does ${topic} apply in real-world scenarios?`,
            answer: "It applies through various practical implementations and use cases.",
            type: "essay"
          }
        ],
        summary: `This study guide covers essential aspects of ${topic} for ${difficulty} level learners.`,
        timeline: [
          {
            week: 1,
            focus: "Fundamentals",
            activities: ["Read core concepts", "Complete basic exercises", "Review key terms"]
          },
          {
            week: 2,
            focus: "Applications",
            activities: ["Study practical examples", "Solve practice problems", "Create concept maps"]
          }
        ]
      }
    }

    return NextResponse.json({ studyGuide })
  } catch (error) {
    console.error('Error generating study guide:', error)
    return NextResponse.json(
      { error: 'Failed to generate study guide' },
      { status: 500 }
    )
  }
}
