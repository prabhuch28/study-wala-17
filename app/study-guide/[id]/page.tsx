"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, BookOpen, Clock, Target } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

interface StudyGuideData {
  id: string
  title: string
  content: string
  studyType: string
  difficulty: string
  timeframe: string
  topics: string[]
  createdAt: string
}

export default function StudyGuidePage({ params }: { params: { id: string } }) {
  const [studyGuide, setStudyGuide] = useState<StudyGuideData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from a database
    // For now, we'll simulate loading the study guide
    const mockData: StudyGuideData = {
      id: params.id,
      title: "Advanced Physics Study Guide",
      content:
        "# Advanced Physics Study Guide\n\n## Key Concepts\n\n### Quantum Mechanics\n- Wave-particle duality\n- Heisenberg uncertainty principle\n- Schrödinger equation\n\n### Thermodynamics\n- First law of thermodynamics\n- Second law of thermodynamics\n- Entropy and energy distribution\n\n## Practice Problems\n\n1. Calculate the wavelength of an electron moving at 10% the speed of light\n2. Determine the efficiency of a Carnot engine operating between 400K and 300K\n\n## Summary\n\nThis study guide covers the fundamental principles of advanced physics, focusing on quantum mechanics and thermodynamics.",
      studyType: "Comprehensive Review",
      difficulty: "Advanced",
      timeframe: "2 weeks",
      topics: ["Quantum Mechanics", "Thermodynamics", "Wave Physics"],
      createdAt: "2024-01-15",
    }

    setTimeout(() => {
      setStudyGuide(mockData)
      setIsLoading(false)
    }, 1000)
  }, [params.id])

  const handleExport = async (format: string) => {
    if (!studyGuide) return

    try {
      const response = await fetch("/api/export/study-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studyGuideId: studyGuide.id,
          format,
          title: studyGuide.title,
          content: studyGuide.content,
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download =
          response.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") ||
          `${studyGuide.title}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-800 rounded-lg mb-6 w-1/3"></div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
              <div className="h-6 bg-slate-700 rounded mb-4 w-1/2"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!studyGuide) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Study Guide Not Found</h1>
          <Link href="/dashboard">
            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem
                  onClick={() => handleExport("markdown")}
                  className="text-slate-200 hover:bg-slate-700"
                >
                  Markdown (.md)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("html")} className="text-slate-200 hover:bg-slate-700">
                  HTML (.html)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("txt")} className="text-slate-200 hover:bg-slate-700">
                  Plain Text (.txt)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Study Guide Header */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-2">{studyGuide.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                    <BookOpen className="w-3 h-3 mr-1" />
                    {studyGuide.studyType}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    <Target className="w-3 h-3 mr-1" />
                    {studyGuide.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {studyGuide.timeframe}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-2">Focus Topics</h3>
              <div className="flex flex-wrap gap-2">
                {studyGuide.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Study Guide Content */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
          <CardContent className="p-8">
            <div className="prose prose-invert prose-cyan max-w-none">
              <div
                className="text-slate-200 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: studyGuide.content
                    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-cyan-400 mb-3 mt-6">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium text-slate-200 mb-2 mt-4">$1</h3>')
                    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>')
                    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4">')
                    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">'),
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
