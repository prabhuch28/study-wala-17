"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Plus,
  BookOpen,
  Brain,
  CheckCircle2,
  Circle,
  TrendingUp,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface StudySession {
  id: string
  title: string
  subject: string
  duration: number
  date: string
  time: string
  type: "review" | "practice" | "reading" | "flashcards"
  completed: boolean
  studyGuideId?: string
}

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  category: "exam" | "skill" | "project" | "general"
}

export default function StudyPlannerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [isAddingSession, setIsAddingSession] = useState(false)
  const [isAddingGoal, setIsAddingGoal] = useState(false)

  // Mock data - in a real app, this would come from a database
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    {
      id: "1",
      title: "Physics Review",
      subject: "Advanced Physics",
      duration: 90,
      date: "2024-01-15",
      time: "14:00",
      type: "review",
      completed: false,
      studyGuideId: "physics-guide-1",
    },
    {
      id: "2",
      title: "Math Practice",
      subject: "Calculus",
      duration: 60,
      date: "2024-01-15",
      time: "16:00",
      type: "practice",
      completed: true,
    },
    {
      id: "3",
      title: "Chemistry Flashcards",
      subject: "Organic Chemistry",
      duration: 45,
      date: "2024-01-16",
      time: "10:00",
      type: "flashcards",
      completed: false,
    },
  ])

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Master Quantum Mechanics",
      description: "Complete comprehensive understanding of quantum mechanics principles",
      targetDate: "2024-02-15",
      progress: 65,
      category: "skill",
    },
    {
      id: "2",
      title: "Physics Midterm Exam",
      description: "Achieve 90% or higher on the physics midterm examination",
      targetDate: "2024-01-30",
      progress: 40,
      category: "exam",
    },
    {
      id: "3",
      title: "Research Project",
      description: "Complete thermodynamics research project",
      targetDate: "2024-03-01",
      progress: 25,
      category: "project",
    },
  ])

  const todaysSessions = studySessions.filter((session) => session.date === selectedDate)
  const completedToday = todaysSessions.filter((session) => session.completed).length
  const totalToday = todaysSessions.length

  const getTypeIcon = (type: StudySession["type"]) => {
    switch (type) {
      case "review":
        return <BookOpen className="w-4 h-4" />
      case "practice":
        return <Target className="w-4 h-4" />
      case "reading":
        return <BookOpen className="w-4 h-4" />
      case "flashcards":
        return <Brain className="w-4 h-4" />
      default:
        return <Circle className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: StudySession["type"]) => {
    switch (type) {
      case "review":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "practice":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "reading":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "flashcards":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getCategoryColor = (category: Goal["category"]) => {
    switch (category) {
      case "exam":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "skill":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "project":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "general":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const toggleSessionComplete = (sessionId: string) => {
    setStudySessions((prev) =>
      prev.map((session) => (session.id === sessionId ? { ...session, completed: !session.completed } : session)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
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
              <h1 className="text-3xl font-bold text-white">Study Planner</h1>
              <p className="text-slate-400">Organize your learning journey</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Dialog open={isAddingSession} onOpenChange={setIsAddingSession}>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Session
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Schedule Study Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="session-title" className="text-slate-300">
                      Session Title
                    </Label>
                    <Input
                      id="session-title"
                      placeholder="e.g., Physics Review"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="session-subject" className="text-slate-300">
                      Subject
                    </Label>
                    <Input
                      id="session-subject"
                      placeholder="e.g., Advanced Physics"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session-date" className="text-slate-300">
                        Date
                      </Label>
                      <Input id="session-date" type="date" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="session-time" className="text-slate-300">
                        Time
                      </Label>
                      <Input id="session-time" type="time" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session-duration" className="text-slate-300">
                        Duration (minutes)
                      </Label>
                      <Input
                        id="session-duration"
                        type="number"
                        placeholder="60"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="session-type" className="text-slate-300">
                        Type
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="practice">Practice</SelectItem>
                          <SelectItem value="reading">Reading</SelectItem>
                          <SelectItem value="flashcards">Flashcards</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddingSession(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-cyan-600 hover:bg-cyan-700">Schedule Session</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Set Learning Goal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-title" className="text-slate-300">
                      Goal Title
                    </Label>
                    <Input
                      id="goal-title"
                      placeholder="e.g., Master Quantum Mechanics"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-description" className="text-slate-300">
                      Description
                    </Label>
                    <Textarea
                      id="goal-description"
                      placeholder="Describe your learning goal..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goal-date" className="text-slate-300">
                        Target Date
                      </Label>
                      <Input id="goal-date" type="date" className="bg-slate-700 border-slate-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="goal-category" className="text-slate-300">
                        Category
                      </Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="skill">Skill</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddingGoal(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-cyan-600 hover:bg-cyan-700">Create Goal</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Today's Schedule */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selector */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white w-auto"
                  />
                  <div className="text-sm text-slate-400">
                    {completedToday}/{totalToday} sessions completed
                  </div>
                </div>

                {/* Today's Sessions */}
                <div className="space-y-3">
                  {todaysSessions.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No study sessions scheduled for this date</p>
                      <p className="text-sm">Click "Add Session" to schedule your first session</p>
                    </div>
                  ) : (
                    todaysSessions.map((session) => (
                      <Card
                        key={session.id}
                        className={`bg-slate-700/50 border-slate-600/50 transition-all duration-200 ${
                          session.completed ? "opacity-75" : "hover:bg-slate-700/70"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleSessionComplete(session.id)}
                                className="p-1 h-auto"
                              >
                                {session.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                ) : (
                                  <Circle className="w-5 h-5 text-slate-400" />
                                )}
                              </Button>
                              <div>
                                <h3
                                  className={`font-medium ${
                                    session.completed ? "text-slate-400 line-through" : "text-white"
                                  }`}
                                >
                                  {session.title}
                                </h3>
                                <p className="text-sm text-slate-400">{session.subject}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="secondary" className={getTypeColor(session.type)}>
                                {getTypeIcon(session.type)}
                                <span className="ml-1 capitalize">{session.type}</span>
                              </Badge>
                              <div className="text-sm text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {session.time} ({session.duration}m)
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Overview */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                    const dayProgress = Math.floor(Math.random() * 100) // Mock data
                    return (
                      <div key={day} className="text-center">
                        <div className="text-xs text-slate-400 mb-2">{day}</div>
                        <div className="h-20 bg-slate-700 rounded-lg relative overflow-hidden">
                          <div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500 to-cyan-400 transition-all duration-300"
                            style={{ height: `${dayProgress}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{dayProgress}%</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Goals & Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Today's Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sessions Completed</span>
                  <span className="text-white font-medium">
                    {completedToday}/{totalToday}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Study Time</span>
                  <span className="text-white font-medium">
                    {todaysSessions.filter((s) => s.completed).reduce((acc, s) => acc + s.duration, 0)}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Completion Rate</span>
                  <span className="text-emerald-400 font-medium">
                    {totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Learning Goals */}
            <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-cyan-400" />
                  Learning Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-white text-sm">{goal.title}</h3>
                        <p className="text-xs text-slate-400 mt-1">{goal.description}</p>
                      </div>
                      <Badge variant="secondary" className={`${getCategoryColor(goal.category)} text-xs`}>
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">{goal.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400">Due: {goal.targetDate}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
