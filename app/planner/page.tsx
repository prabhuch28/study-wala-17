"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Target, TrendingUp, Plus, Play, CheckCircle, AlertCircle, BookOpen, Brain, Circle, ArrowLeft, MessageSquare, Timer, Trophy, Sparkles, RefreshCw } from "lucide-react"
import ChatInterface from "@/components/ai-tutor/chat-interface"
import PomodoroTimer from "@/components/study-timer/pomodoro-timer"
import ProgressTracker from "@/components/gamification/progress-tracker"
import SmartSuggestions from "@/components/ai-recommendations/smart-suggestions"
import ClientOnly from "@/components/client-only"

interface StudyPlan {
  _id: string
  title: string
  description: string
  startDate: string
  endDate: string
  subjects: Array<{
    name: string
    color: string
    priority: string
    allocatedHours: number
    completedHours: number
  }>
  sessions: Array<{
    _id: string
    title: string
    subject: string
    startTime: string
    endTime: string
    duration: number
    status: string
    priority: string
    type: string
  }>
  statistics: {
    totalPlannedHours: number
    totalCompletedHours: number
    totalSessions: number
    completedSessions: number
    streakDays: number
    longestStreak: number
  }
}

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

interface PlanSuggestions {
  title: string
  description: string
  subjects: Array<{
    name: string
    color?: string
    priority?: 'low' | 'medium' | 'high'
  }>
  topics: Array<{
    subject: string
    items: string[]
  }>
  roadmap: Array<{
    week: number
    focus: string
    goals: string[]
  }>
}

export default function PlannerPage() {
  const { data: session } = useSession()
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [activeStudyPlan, setActiveStudyPlan] = useState<StudyPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [showAITutor, setShowAITutor] = useState(false)
  const [showPomodoroTimer, setShowPomodoroTimer] = useState(false)

  // Form states
  const [planTitle, setPlanTitle] = useState("")
  const [planDescription, setPlanDescription] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [subjects, setSubjects] = useState([{ name: "", color: "#3B82F6", priority: "medium" }])

  // AI suggestions state
  const [aiSuggestions, setAiSuggestions] = useState<PlanSuggestions | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  // Fetch AI plan suggestions for the dialog
  const fetchAISuggestions = async () => {
    try {
      setAiLoading(true)
      setAiError(null)
      const response = await fetch('/api/ai/plan-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: session?.user?.email,
          startDate,
          endDate,
          subjects: subjects.map(s => ({ name: s.name, color: s.color, priority: s.priority as 'low' | 'medium' | 'high' }))
        })
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      setAiSuggestions(data.suggestions as PlanSuggestions)
    } catch (err) {
      console.error('Failed to fetch AI suggestions:', err)
      setAiError('Failed to fetch suggestions. Please try again.')
    } finally {
      setAiLoading(false)
    }
  }

  const applyAISuggestions = () => {
    if (!aiSuggestions) return
    setPlanTitle(aiSuggestions.title)
    setPlanDescription(aiSuggestions.description)
    if (aiSuggestions.subjects?.length) {
      setSubjects(
        aiSuggestions.subjects.map(s => ({
          name: s.name,
          color: s.color || '#3B82F6',
          priority: (s.priority as string) || 'medium'
        }))
      )
    }
  }

  // Load AI suggestions when dialog opens
  useEffect(() => {
    if (showCreateDialog) {
      fetchAISuggestions()
    } else {
      // reset error/loading when dialog closes
      setAiError(null)
      setAiLoading(false)
    }
  }, [showCreateDialog])

  useEffect(() => {
    if (session?.user) {
      fetchStudyPlans()
    }
  }, [session])

  const fetchStudyPlans = async () => {
    try {
      const response = await fetch(`http://localhost:3004/api/study-planner?userId=${session?.user?.email}`)
      const data = await response.json()
      
      if (data.success) {
        setStudyPlans(data.data)
        if (data.data.length > 0) {
          setActiveStudyPlan(data.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to fetch study plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const createStudyPlan = async () => {
    try {
      const planData = {
        userId: session?.user?.email,
        title: planTitle,
        description: planDescription,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        subjects: subjects.filter(s => s.name.trim() !== "").map(s => ({
          ...s,
          allocatedHours: 0,
          completedHours: 0
        }))
      }

      const response = await fetch('http://localhost:3004/api/study-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      })

      const data = await response.json()
      if (data.success) {
        await fetchStudyPlans()
        setShowCreateDialog(false)
        // Reset form
        setPlanTitle("")
        setPlanDescription("")
        setStartDate("")
        setEndDate("")
        setSubjects([{ name: "", color: "#3B82F6", priority: "medium" }])
      }
    } catch (error) {
      console.error('Failed to create study plan:', error)
    }
  }

  const getTodaysSessions = () => {
    if (!activeStudyPlan) return []
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    return activeStudyPlan.sessions.filter(session => {
      const sessionDate = new Date(session.startTime)
      return sessionDate >= today && sessionDate < tomorrow
    })
  }

  const getUpcomingSessions = () => {
    if (!activeStudyPlan) return []
    
    const now = new Date()
    return activeStudyPlan.sessions
      .filter(session => new Date(session.startTime) > now && session.status === 'scheduled')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'scheduled': return 'bg-gray-400'
      case 'missed': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive'
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'default'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  const todaysSessions = getTodaysSessions()
  const upcomingSessions = getUpcomingSessions()
  const completedToday = todaysSessions.filter(s => s.status === 'completed').length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Planner</h1>
          {activeStudyPlan && (
            <p className="text-muted-foreground mt-1">{activeStudyPlan.title}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAITutor(true)} variant="outline">
            <MessageSquare className="h-4 w-4 mr-2" />
            AI Tutor
          </Button>
          <Button onClick={() => setShowPomodoroTimer(true)} variant="outline">
            <Timer className="h-4 w-4 mr-2" />
            Focus Timer
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Study Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* AI Suggestions Panel */}
                <div className="rounded-lg border p-4 bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">AI Suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={fetchAISuggestions} disabled={aiLoading}>
                        <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                      </Button>
                      <Button size="sm" onClick={applyAISuggestions} disabled={!aiSuggestions}>
                        Apply to Form
                      </Button>
                    </div>
                  </div>
                  {aiLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-0 border-primary"></div>
                      Generating personalized roadmap...
                    </div>
                  )}
                  {!aiLoading && aiError && (
                    <div className="text-sm text-destructive">{aiError}</div>
                  )}
                  {!aiLoading && !aiError && aiSuggestions && (
                    <div className="space-y-3 text-sm">
                      <div>
                        <div className="font-medium">Suggested Title</div>
                        <div className="text-muted-foreground">{aiSuggestions.title}</div>
                      </div>
                      <div>
                        <div className="font-medium">Description</div>
                        <div className="text-muted-foreground">{aiSuggestions.description}</div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Subjects & Priority</div>
                        <div className="flex flex-wrap gap-2">
                          {aiSuggestions.subjects.map((s, idx) => (
                            <Badge key={`${s.name}-${idx}`} variant="outline" className="text-xs">
                              <span className="inline-flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color || '#3B82F6' }}></span>
                                {s.name} · {s.priority || 'medium'}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Roadmap (First 2 Weeks)</div>
                        <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                          {aiSuggestions.roadmap.slice(0, 2).map((w) => (
                            <li key={w.week}>Week {w.week}: Focus on {w.focus} — {w.goals[0]}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="font-medium mb-1">Topics</div>
                        <div className="text-muted-foreground">
                          {aiSuggestions.topics.slice(0, 1).map(t => t.items.slice(0, 5).join(', '))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Plan Title</Label>
                    <Input
                      id="title"
                      value={planTitle}
                      onChange={(e) => setPlanTitle(e.target.value)}
                      placeholder="e.g., Final Exam Preparation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={planDescription}
                      onChange={(e) => setPlanDescription(e.target.value)}
                      placeholder="Brief description"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label>Subjects</Label>
                  {subjects.map((subject, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        placeholder="Subject name"
                        value={subject.name}
                        onChange={(e) => {
                          const newSubjects = [...subjects]
                          newSubjects[index].name = e.target.value
                          setSubjects(newSubjects)
                        }}
                      />
                      <Input
                        type="color"
                        value={subject.color}
                        onChange={(e) => {
                          const newSubjects = [...subjects]
                          newSubjects[index].color = e.target.value
                          setSubjects(newSubjects)
                        }}
                        className="w-16"
                      />
                      <Select
                        value={subject.priority}
                        onValueChange={(value) => {
                          const newSubjects = [...subjects]
                          newSubjects[index].priority = value
                          setSubjects(newSubjects)
                        }}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setSubjects([...subjects, { name: "", color: "#3B82F6", priority: "medium" }])}
                  >
                    Add Subject
                  </Button>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createStudyPlan}>Create Plan</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {!activeStudyPlan ? (
        <Card className="p-12 text-center">
          <CardContent>
            <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Study Plans Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first study plan to start organizing your learning journey.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-tutor">AI Tutor</TabsTrigger>
            <TabsTrigger value="timer">Focus Timer</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Sessions</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todaysSessions.length}</div>
                <p className="text-xs text-muted-foreground">
                  {completedToday} completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Study Hours</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {activeStudyPlan.statistics.totalCompletedHours.toFixed(1)}h
                </div>
                <p className="text-xs text-muted-foreground">
                  of {activeStudyPlan.statistics.totalPlannedHours.toFixed(1)}h planned
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((activeStudyPlan.statistics.completedSessions / activeStudyPlan.statistics.totalSessions) * 100) || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {activeStudyPlan.statistics.completedSessions} of {activeStudyPlan.statistics.totalSessions} sessions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeStudyPlan.statistics.streakDays}</div>
                <p className="text-xs text-muted-foreground">
                  Best: {activeStudyPlan.statistics.longestStreak} days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Today's Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaysSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No sessions scheduled for today
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todaysSessions.map((session) => (
                      <div key={session._id} className="flex items-center space-x-3 p-3 rounded-lg border">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{session.title}</p>
                            <Badge variant={getPriorityColor(session.priority)}>
                              {session.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {session.subject} • {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {session.status === 'scheduled' && (
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No upcoming sessions
                  </p>
                ) : (
                  <div className="space-y-3">
                    {upcomingSessions.map((session) => (
                      <div key={session._id} className="flex items-center space-x-3 p-3 rounded-lg border">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(session.status)}`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{session.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.subject} • {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Subject Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeStudyPlan.subjects.map((subject, index) => {
                  const progress = subject.allocatedHours > 0 
                    ? Math.round((subject.completedHours / subject.allocatedHours) * 100)
                    : 0
                  
                  return (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          ></div>
                          <span className="font-medium">{subject.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {subject.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {subject.completedHours.toFixed(1)}h / {subject.allocatedHours.toFixed(1)}h
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-300" 
                          style={{ 
                            width: `${Math.min(progress, 100)}%`,
                            backgroundColor: subject.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          </TabsContent>

          <TabsContent value="ai-tutor">
            <ClientOnly>
              <ChatInterface 
                subject={activeStudyPlan?.subjects[0]?.name}
                difficulty="intermediate"
              />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="timer">
            <div className="flex justify-center">
              <ClientOnly>
                <PomodoroTimer 
                  subject={activeStudyPlan?.subjects[0]?.name}
                  onSessionComplete={(sessionData) => {
                    console.log('Session completed:', sessionData)
                    // Add XP or update progress here
                  }}
                />
              </ClientOnly>
            </div>
          </TabsContent>

          <TabsContent value="progress">
            <ClientOnly>
              <ProgressTracker 
                userId={session?.user?.email || undefined}
                onLevelUp={(level) => console.log('Level up!', level)}
                onBadgeUnlocked={(badge) => console.log('Badge unlocked!', badge)}
              />
            </ClientOnly>
          </TabsContent>

          <TabsContent value="recommendations">
            <ClientOnly>
              <SmartSuggestions 
                userProgress={{
                  weakSubjects: ['Mathematics', 'Chemistry'],
                  strongSubjects: ['Physics', 'Biology'],
                  studyPatterns: {},
                  recentPerformance: {}
                }}
                onRecommendationAccept={(rec) => console.log('Applied recommendation:', rec)}
              />
            </ClientOnly>
          </TabsContent>
        </Tabs>
      )}

      {/* AI Tutor Dialog */}
      <Dialog open={showAITutor} onOpenChange={setShowAITutor}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>AI Personal Tutor</DialogTitle>
          </DialogHeader>
          <ClientOnly>
            <ChatInterface 
              subject={activeStudyPlan?.subjects[0]?.name}
              difficulty="intermediate"
            />
          </ClientOnly>
        </DialogContent>
      </Dialog>

      {/* Pomodoro Timer Dialog */}
      <Dialog open={showPomodoroTimer} onOpenChange={setShowPomodoroTimer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Focus Timer</DialogTitle>
          </DialogHeader>
          <ClientOnly>
            <PomodoroTimer 
              subject={activeStudyPlan?.subjects[0]?.name}
              onSessionComplete={(sessionData) => {
                console.log('Session completed:', sessionData)
                setShowPomodoroTimer(false)
              }}
            />
          </ClientOnly>
        </DialogContent>
      </Dialog>
    </div>
  )
}
