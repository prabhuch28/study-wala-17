import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface SubjectInput {
  name: string
  color?: string
  priority?: 'low' | 'medium' | 'high'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { userEmail, startDate, endDate, subjects } = body

    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured')
    }

    const inputSubjects = (subjects || []).filter((s: any) => s?.name?.trim())
    const subjectNames = subjects?.map((s: any) => s.name).filter(Boolean) || []
    const duration = startDate && endDate ? 
      Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24 * 7)) : 8

    const prompt = `Create a personalized study plan with the following requirements:

User Email: ${userEmail}
Study Duration: ${duration} weeks
Subjects: ${subjectNames.join(', ') || 'General subjects'}
Start Date: ${startDate}
End Date: ${endDate}

Please generate a comprehensive study plan in JSON format with:
1. A catchy title for the study plan
2. A brief description (2-3 sentences)
3. Subjects array with name, color (hex), and priority (high/medium/low)
4. Topics array with subject and items (5-7 topics per subject)
5. Roadmap array with week number, focus subject, and 3 specific goals

Make it personalized, realistic, and motivating. Prioritize subjects based on difficulty and importance. Use varied colors for subjects.

Return ONLY valid JSON in this exact format:
{
  "title": "string",
  "description": "string", 
  "subjects": [{"name": "string", "color": "#hex", "priority": "high|medium|low"}],
  "topics": [{"subject": "string", "items": ["string"]}],
  "roadmap": [{"week": number, "focus": "string", "goals": ["string"]}]
}`

    const completion = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert educational consultant and study planner. Generate personalized, effective study plans in valid JSON format only."
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
    let suggestions
    try {
      // Extract JSON from response if it's wrapped in markdown or other text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? jsonMatch[0] : aiResponse
      suggestions = JSON.parse(jsonStr)
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse)
      // Fallback to basic structure if parsing fails
      suggestions = {
        title: `${subjectNames.join(' & ') || 'Comprehensive'} Study Plan`,
        description: `AI-generated ${duration}-week study plan tailored for your learning goals.`,
        subjects: subjectNames.map((name: string, idx: number) => ({
          name,
          color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'][idx % 5],
          priority: ['high', 'medium', 'low'][idx % 3]
        })),
        topics: subjectNames.map((name: string) => ({
          subject: name,
          items: ['Fundamentals', 'Core Concepts', 'Practice Problems', 'Advanced Topics', 'Review']
        })),
        roadmap: Array.from({ length: Math.min(duration, 8) }, (_, i) => ({
          week: i + 1,
          focus: subjectNames[i % subjectNames.length] || 'Review',
          goals: ['Study core concepts', 'Complete exercises', 'Review progress']
        }))
      }
    }

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate study plan suggestions' },
      { status: 500 }
    )
  }
}
