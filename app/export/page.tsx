"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Download, FileText, Brain, BarChart3, Calendar, CheckCircle2, Loader2, Package } from "lucide-react"
import Link from "next/link"

interface ExportItem {
  id: string
  title: string
  type: "study-guide" | "flashcards" | "progress" | "schedule"
  subject?: string
  lastModified: string
  selected: boolean
}

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState<string>("")
  const [isExporting, setIsExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  // Mock data for exportable items
  const [exportItems, setExportItems] = useState<ExportItem[]>([
    {
      id: "1",
      title: "Advanced Calculus - Integration Techniques",
      type: "study-guide",
      subject: "Mathematics",
      lastModified: "2 hours ago",
      selected: false,
    },
    {
      id: "2",
      title: "Organic Chemistry - Reaction Mechanisms",
      type: "study-guide",
      subject: "Chemistry",
      lastModified: "1 day ago",
      selected: false,
    },
    {
      id: "3",
      title: "Physics Flashcards Set",
      type: "flashcards",
      subject: "Physics",
      lastModified: "3 days ago",
      selected: false,
    },
    {
      id: "4",
      title: "Study Progress Report",
      type: "progress",
      lastModified: "Today",
      selected: false,
    },
    {
      id: "5",
      title: "Weekly Study Schedule",
      type: "schedule",
      lastModified: "Yesterday",
      selected: false,
    },
  ])

  const getTypeIcon = (type: ExportItem["type"]) => {
    switch (type) {
      case "study-guide":
        return <FileText className="w-4 h-4" />
      case "flashcards":
        return <Brain className="w-4 h-4" />
      case "progress":
        return <BarChart3 className="w-4 h-4" />
      case "schedule":
        return <Calendar className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: ExportItem["type"]) => {
    switch (type) {
      case "study-guide":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "flashcards":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "progress":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "schedule":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getFormatOptions = () => {
    const selectedTypes = exportItems.filter((item) => item.selected).map((item) => item.type)
    const uniqueTypes = [...new Set(selectedTypes)]

    if (uniqueTypes.length === 0) return []

    if (uniqueTypes.includes("study-guide")) {
      return [
        { value: "markdown", label: "Markdown (.md)" },
        { value: "html", label: "HTML (.html)" },
        { value: "txt", label: "Plain Text (.txt)" },
      ]
    }

    if (uniqueTypes.includes("flashcards")) {
      return [
        { value: "csv", label: "CSV (.csv)" },
        { value: "anki", label: "Anki Format (.txt)" },
        { value: "json", label: "JSON (.json)" },
      ]
    }

    if (uniqueTypes.includes("progress")) {
      return [
        { value: "pdf-report", label: "PDF Report (.html)" },
        { value: "csv", label: "CSV (.csv)" },
        { value: "json", label: "JSON (.json)" },
      ]
    }

    return [
      { value: "json", label: "JSON (.json)" },
      { value: "csv", label: "CSV (.csv)" },
    ]
  }

  const toggleItemSelection = (itemId: string) => {
    setExportItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, selected: !item.selected } : item)))
    setSelectedFormat("")
  }

  const selectAllItems = () => {
    const allSelected = exportItems.every((item) => item.selected)
    setExportItems((prev) => prev.map((item) => ({ ...item, selected: !allSelected })))
    setSelectedFormat("")
  }

  const handleExport = async () => {
    const selectedItems = exportItems.filter((item) => item.selected)
    if (selectedItems.length === 0 || !selectedFormat) return

    setIsExporting(true)
    setExportSuccess(false)

    try {
      // Group items by type for batch export
      const itemsByType = selectedItems.reduce(
        (acc, item) => {
          if (!acc[item.type]) acc[item.type] = []
          acc[item.type].push(item)
          return acc
        },
        {} as Record<string, ExportItem[]>,
      )

      // Export each type
      for (const [type, items] of Object.entries(itemsByType)) {
        let endpoint = ""
        let payload = {}

        switch (type) {
          case "study-guide":
            endpoint = "/api/export/study-guide"
            // For demo, we'll export the first study guide
            payload = {
              studyGuideId: items[0].id,
              format: selectedFormat,
              title: items[0].title,
              content: `# ${items[0].title}\n\n## Overview\n\nThis is a comprehensive study guide covering key concepts and principles.\n\n## Key Topics\n\n- Topic 1: Fundamental concepts\n- Topic 2: Advanced applications\n- Topic 3: Problem-solving techniques\n\n## Summary\n\nThis study guide provides a structured approach to mastering the subject matter.`,
            }
            break

          case "flashcards":
            endpoint = "/api/export/flashcards"
            payload = {
              flashcards: [
                {
                  id: "1",
                  front: "What is the derivative of x²?",
                  back: "2x",
                  subject: "Mathematics",
                  difficulty: "easy",
                  confidence: 4,
                },
                {
                  id: "2",
                  front: "Define entropy",
                  back: "A measure of disorder in a system",
                  subject: "Physics",
                  difficulty: "medium",
                  confidence: 3,
                },
              ],
              format: selectedFormat,
            }
            break

          case "progress":
            endpoint = "/api/export/progress"
            payload = {
              progressData: {
                totalGuides: 12,
                hoursStudied: 47,
                streakDays: 8,
                averageScore: 87,
                recentGuides: [
                  {
                    title: "Advanced Calculus",
                    subject: "Mathematics",
                    progress: 85,
                    lastStudied: "2 hours ago",
                  },
                  {
                    title: "Organic Chemistry",
                    subject: "Chemistry",
                    progress: 60,
                    lastStudied: "1 day ago",
                  },
                ],
              },
              format: selectedFormat,
            }
            break

          default:
            continue
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || "export"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }
      }

      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 3000)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const selectedCount = exportItems.filter((item) => item.selected).length
  const formatOptions = getFormatOptions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Package className="w-8 h-8 text-cyan-400" />
                Export Center
              </h1>
              <p className="text-slate-400">Export your study materials and progress</p>
            </div>
          </div>

          {exportSuccess && (
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Export completed!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Item Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selection Controls */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Select Items to Export</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllItems}
                    className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                  >
                    {exportItems.every((item) => item.selected) ? "Deselect All" : "Select All"}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {exportItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer ${
                      item.selected
                        ? "bg-cyan-500/10 border-cyan-500/30"
                        : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                    }`}
                    onClick={() => toggleItemSelection(item.id)}
                  >
                    <Checkbox checked={item.selected} onChange={() => toggleItemSelection(item.id)} />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${getTypeColor(item.type)}`}>{getTypeIcon(item.type)}</div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.subject && (
                            <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                              {item.subject}
                            </Badge>
                          )}
                          <span className="text-xs text-slate-400">Modified {item.lastModified}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className={`${getTypeColor(item.type)} text-xs`}>
                      {item.type.replace("-", " ")}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Export Options */}
          <div className="space-y-6">
            {/* Export Summary */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Download className="w-5 h-5 text-cyan-400" />
                  Export Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Selected Items</span>
                  <span className="text-white font-medium">{selectedCount}</span>
                </div>

                {selectedCount > 0 && (
                  <>
                    <Separator className="bg-slate-600" />

                    <div>
                      <Label htmlFor="format-select" className="text-slate-300 mb-2 block">
                        Export Format
                      </Label>
                      <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Choose format" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          {formatOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                      onClick={handleExport}
                      disabled={!selectedFormat || isExporting}
                    >
                      {isExporting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export Selected
                        </>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Export Info */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white text-sm">Export Formats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Study Guides</h4>
                  <p className="text-slate-400 text-xs">Markdown, HTML, or Plain Text formats</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Flashcards</h4>
                  <p className="text-slate-400 text-xs">CSV, Anki-compatible, or JSON formats</p>
                </div>
                <div>
                  <h4 className="font-medium text-slate-300 mb-1">Progress Reports</h4>
                  <p className="text-slate-400 text-xs">PDF-ready HTML, CSV, or JSON formats</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
