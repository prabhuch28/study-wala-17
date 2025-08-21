"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Upload,
  FileText,
  BookOpen,
  Target,
  Zap,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Plus,
  Sparkles,
} from "lucide-react"
import { useRouter } from "next/navigation"

type Step = 1 | 2 | 3 | 4

interface StudyGuideConfig {
  title: string
  subject: string
  difficulty: string
  examDate: string
  studyTime: string
  topics: string[]
  contentTypes: string[]
  files: File[]
}

export default function CreateStudyGuide() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [config, setConfig] = useState<StudyGuideConfig>({
    title: "",
    subject: "",
    difficulty: "",
    examDate: "",
    studyTime: "",
    topics: [],
    contentTypes: [],
    files: [],
  })

  const steps = [
    { number: 1, title: "Upload Materials", description: "Add your syllabus, notes, or PDFs" },
    { number: 2, title: "Configure Guide", description: "Set up your study preferences" },
    { number: 3, title: "Select Topics", description: "Choose what to focus on" },
    { number: 4, title: "Generate", description: "Create your personalized guide" },
  ]

  const contentTypeOptions = [
    { id: "summaries", label: "Chapter Summaries", icon: BookOpen },
    { id: "flashcards", label: "Flashcards", icon: Zap },
    { id: "questions", label: "Practice Questions", icon: Target },
    { id: "diagrams", label: "ASCII Diagrams", icon: FileText },
    { id: "keyterms", label: "Key Terms", icon: Brain },
    { id: "timeline", label: "Timeline/Sequence", icon: ChevronRight },
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setConfig((prev) => ({ ...prev, files: [...prev.files, ...files] }))
  }

  const removeFile = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }))
  }

  const addTopic = (topic: string) => {
    if (topic.trim() && !config.topics.includes(topic.trim())) {
      setConfig((prev) => ({
        ...prev,
        topics: [...prev.topics, topic.trim()],
      }))
    }
  }

  const removeTopic = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }))
  }

  const toggleContentType = (type: string) => {
    setConfig((prev) => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(type)
        ? prev.contentTypes.filter((t) => t !== type)
        : [...prev.contentTypes, type],
    }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const content =
        config.files.length > 0
          ? `Study materials uploaded: ${config.files.map((f) => f.name).join(", ")}`
          : "No files uploaded - generating from topic knowledge"

      const response = await fetch("/api/generate-study-guide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          topics: config.topics,
          studyType: config.contentTypes.join(", ") || "Comprehensive Review",
          difficulty: config.difficulty || "intermediate",
          timeframe: config.studyTime ? `${config.studyTime} hours daily` : "flexible",
        }),
      })

      if (response.ok) {
        // Generate a mock study guide ID and redirect to the study guide page
        const studyGuideId = `guide-${Date.now()}`
        router.push(`/study-guide/${studyGuideId}`)
      } else {
        console.error("Failed to generate study guide")
        setIsGenerating(false)
      }
    } catch (error) {
      console.error("Error generating study guide:", error)
      setIsGenerating(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep((prev) => (prev + 1) as Step)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step)
  }

  const getStepProgress = () => (currentStep / 4) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="glass">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 rounded-xl glass glow">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Create Study Guide</h1>
                <p className="text-sm text-muted-foreground">AI-powered content generation</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">Step {currentStep} of 4</div>
              <Progress value={getStepProgress()} className="w-32" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center gap-3 ${
                    step.number <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.number < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.number === currentStep
                          ? "bg-primary/20 text-primary border-2 border-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.number < currentStep ? <Check className="h-4 w-4" /> : step.number}
                  </div>
                  <div className="hidden md:block">
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-px mx-4 ${step.number < currentStep ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card className="glass-strong glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Study Materials
                </CardTitle>
                <CardDescription>
                  Upload your syllabus, lecture notes, textbook chapters, or any study materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center glass hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="font-medium">Drop files here or click to browse</p>
                    <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT files up to 10MB each</p>
                  </div>
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>

                {config.files.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Uploaded Files</h4>
                    {config.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg glass">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="glass-strong glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Configure Your Study Guide
                </CardTitle>
                <CardDescription>Set up your preferences for personalized content generation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Study Guide Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Advanced Calculus Final Exam"
                      value={config.title}
                      onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={config.subject}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, subject: value }))}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level</Label>
                    <Select
                      value={config.difficulty}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, difficulty: value }))}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-date">Exam Date</Label>
                    <Input
                      id="exam-date"
                      type="date"
                      value={config.examDate}
                      onChange={(e) => setConfig((prev) => ({ ...prev, examDate: e.target.value }))}
                      className="glass"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="study-time">Daily Study Time</Label>
                    <Select
                      value={config.studyTime}
                      onValueChange={(value) => setConfig((prev) => ({ ...prev, studyTime: value }))}
                    >
                      <SelectTrigger className="glass">
                        <SelectValue placeholder="Hours/day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4+ hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Content Types to Generate</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contentTypeOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          config.contentTypes.includes(option.id)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border glass hover:border-primary/50"
                        }`}
                        onClick={() => toggleContentType(option.id)}
                      >
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="glass-strong glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Select Study Topics
                </CardTitle>
                <CardDescription>Add specific topics or let AI extract them from your materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a topic (e.g., Integration by Parts)"
                    className="glass"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addTopic(e.currentTarget.value)
                        e.currentTarget.value = ""
                      }
                    }}
                  />
                  <Button variant="outline" className="glass bg-transparent">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 rounded-lg glass border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">AI-Suggested Topics</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Derivatives", "Integrals", "Limits", "Chain Rule", "Optimization", "Related Rates"].map(
                      (topic) => (
                        <Badge
                          key={topic}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/20"
                          onClick={() => addTopic(topic)}
                        >
                          {topic}
                          <Plus className="h-3 w-3 ml-1" />
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                {config.topics.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Selected Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {config.topics.map((topic, index) => (
                        <Badge key={index} className="bg-primary/20 text-primary border-primary/30">
                          {topic}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2 hover:bg-transparent"
                            onClick={() => removeTopic(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card className="glass-strong glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Generate Study Guide
                </CardTitle>
                <CardDescription>Review your configuration and generate your personalized study guide</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg glass">
                    <h4 className="font-medium mb-2">Study Guide Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Title:</span>
                        <p className="font-medium">{config.title || "Untitled"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Subject:</span>
                        <p className="font-medium capitalize">{config.subject || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Difficulty:</span>
                        <p className="font-medium capitalize">{config.difficulty || "Not specified"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Files:</span>
                        <p className="font-medium">{config.files.length} uploaded</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg glass">
                    <h4 className="font-medium mb-2">Content Types ({config.contentTypes.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {config.contentTypes.map((type) => (
                        <Badge key={type} variant="outline" className="border-primary/30 text-primary">
                          {contentTypeOptions.find((opt) => opt.id === type)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg glass">
                    <h4 className="font-medium mb-2">Topics ({config.topics.length})</h4>
                    <div className="flex flex-wrap gap-2">
                      {config.topics.map((topic, index) => (
                        <Badge key={index} variant="outline" className="border-accent/30 text-accent">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Button onClick={handleGenerate} disabled={isGenerating} className="w-full glow-strong" size="lg">
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Generating Study Guide...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Study Guide
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="glass bg-transparent">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={nextStep} disabled={currentStep === 4} className="glow">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
