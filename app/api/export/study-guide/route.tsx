import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { studyGuideId, format, content, title } = await request.json()

    if (!content || !format || !title) {
      return new Response("Missing required fields", { status: 400 })
    }

    let exportContent: string
    let contentType: string
    let filename: string

    switch (format) {
      case "markdown":
        exportContent = content
        contentType = "text/markdown"
        filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`
        break

      case "html":
        exportContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
        h1 { color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 0.5rem; }
        h2 { color: #0f172a; margin-top: 2rem; }
        h3 { color: #334155; }
        code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
        pre { background: #f1f5f9; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }
        blockquote { border-left: 4px solid #0ea5e9; margin: 1rem 0; padding-left: 1rem; color: #64748b; }
    </style>
</head>
<body>
${content
  .replace(/^# (.*$)/gim, "<h1>$1</h1>")
  .replace(/^## (.*$)/gim, "<h2>$1</h2>")
  .replace(/^### (.*$)/gim, "<h3>$1</h3>")
  .replace(/^- (.*$)/gim, "<li>$1</li>")
  .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
  .replace(/\*(.*?)\*/g, "<em>$1</em>")
  .replace(/`(.*?)`/g, "<code>$1</code>")
  .replace(/\n\n/g, "</p><p>")
  .replace(/^(?!<[h|l])/gm, "<p>")
  .replace(/<p><\/p>/g, "")}
</body>
</html>`
        contentType = "text/html"
        filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.html`
        break

      case "txt":
        exportContent = content
          .replace(/^# (.*$)/gim, "$1\n" + "=".repeat(50))
          .replace(/^## (.*$)/gim, "\n$1\n" + "-".repeat(30))
          .replace(/^### (.*$)/gim, "\n$1\n")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/`(.*?)`/g, "$1")
        contentType = "text/plain"
        filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`
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
    console.error("Error exporting study guide:", error)
    return new Response("Failed to export study guide", { status: 500 })
  }
}
