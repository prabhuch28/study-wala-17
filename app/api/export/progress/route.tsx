import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { progressData, format } = await request.json()

    if (!progressData || !format) {
      return new Response("Missing required fields", { status: 400 })
    }

    let exportContent: string
    let contentType: string
    let filename: string

    const currentDate = new Date().toISOString().split("T")[0]

    switch (format) {
      case "pdf-report":
        // Generate HTML that can be converted to PDF
        exportContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Study Progress Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2rem; color: #333; }
        .header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #0ea5e9; padding-bottom: 1rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 2rem 0; }
        .stat-card { background: #f8fafc; padding: 1rem; border-radius: 8px; text-align: center; }
        .stat-value { font-size: 2rem; font-weight: bold; color: #0ea5e9; }
        .stat-label { color: #64748b; font-size: 0.9rem; }
        .section { margin: 2rem 0; }
        .section h2 { color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f1f5f9; font-weight: 600; }
        .progress-bar { background: #e2e8f0; height: 8px; border-radius: 4px; overflow: hidden; }
        .progress-fill { background: #0ea5e9; height: 100%; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Study Progress Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">${progressData.totalGuides || 0}</div>
            <div class="stat-label">Study Guides</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${progressData.hoursStudied || 0}</div>
            <div class="stat-label">Hours Studied</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${progressData.streakDays || 0}</div>
            <div class="stat-label">Day Streak</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${progressData.averageScore || 0}%</div>
            <div class="stat-label">Average Score</div>
        </div>
    </div>
    
    <div class="section">
        <h2>Recent Activity</h2>
        <table>
            <thead>
                <tr>
                    <th>Study Guide</th>
                    <th>Subject</th>
                    <th>Progress</th>
                    <th>Last Studied</th>
                </tr>
            </thead>
            <tbody>
                ${(progressData.recentGuides || [])
                  .map(
                    (guide: any) => `
                    <tr>
                        <td>${guide.title}</td>
                        <td>${guide.subject}</td>
                        <td>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${guide.progress}%"></div>
                            </div>
                            ${guide.progress}%
                        </td>
                        <td>${guide.lastStudied}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    </div>
</body>
</html>`
        contentType = "text/html"
        filename = `study_progress_report_${currentDate}.html`
        break

      case "csv":
        const csvHeader = "Date,Study Guides,Hours Studied,Streak Days,Average Score\n"
        const csvRow = `${currentDate},${progressData.totalGuides || 0},${progressData.hoursStudied || 0},${progressData.streakDays || 0},${progressData.averageScore || 0}`
        exportContent = csvHeader + csvRow
        contentType = "text/csv"
        filename = `study_progress_${currentDate}.csv`
        break

      case "json":
        exportContent = JSON.stringify(
          {
            ...progressData,
            exportDate: new Date().toISOString(),
            reportType: "progress_summary",
          },
          null,
          2,
        )
        contentType = "application/json"
        filename = `study_progress_${currentDate}.json`
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
    console.error("Error exporting progress:", error)
    return new Response("Failed to export progress", { status: 500 })
  }
}
