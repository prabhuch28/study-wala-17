import type { NextRequest } from "next/server"

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  difficulty: string
  confidence: number
}

export async function POST(request: NextRequest) {
  try {
    const { flashcards, format } = await request.json()

    if (!flashcards || !Array.isArray(flashcards) || !format) {
      return new Response("Missing required fields", { status: 400 })
    }

    let exportContent: string
    let contentType: string
    let filename: string

    switch (format) {
      case "csv":
        const csvHeader = "Front,Back,Subject,Difficulty,Confidence\n"
        const csvRows = flashcards
          .map(
            (card: Flashcard) =>
              `"${card.front.replace(/"/g, '""')}","${card.back.replace(/"/g, '""')}","${card.subject}","${card.difficulty}","${card.confidence}"`,
          )
          .join("\n")
        exportContent = csvHeader + csvRows
        contentType = "text/csv"
        filename = "flashcards.csv"
        break

      case "anki":
        // Anki format: Front;Back;Tags
        const ankiRows = flashcards
          .map(
            (card: Flashcard) =>
              `"${card.front.replace(/"/g, '""')}";` +
              `"${card.back.replace(/"/g, '""')}";` +
              `"${card.subject} ${card.difficulty}"`,
          )
          .join("\n")
        exportContent = ankiRows
        contentType = "text/plain"
        filename = "flashcards_anki.txt"
        break

      case "json":
        exportContent = JSON.stringify(flashcards, null, 2)
        contentType = "application/json"
        filename = "flashcards.json"
        break

      default:
        return new Response("Unsupported format", { status: 400 })
    }

    return new Response(exportContent, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error exporting flashcards:", error)
    return new Response("Failed to export flashcards", { status: 500 })
  }
}
