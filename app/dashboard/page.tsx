"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  BookOpen,
  Calendar,
  Target,
  Plus,
  Clock,
  TrendingUp,
  Zap,
  Star,
  ChevronRight,
  Settings,
  User,
  Download,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [recentGuides] = useState([
    {
      id: 1,
      title: "Advanced Calculus - Integration Techniques",
      subject: "Mathematics",
      progress: 85,
      lastStudied: "2 hours ago",
      difficulty: "Advanced",
    },
    {
      id: 2,
      title: "Organic Chemistry - Reaction Mechanisms",
      subject: "Chemistry",
      progress: 60,
      lastStudied: "1 day ago",
      difficulty: "Intermediate",
    },
    {
      id: 3,
      title: "World War II - European Theater",
      subject: "History",
      progress: 95,
      lastStudied: "3 days ago",
      difficulty: "Beginner",
    },
  ])

  const [stats] = useState({
    totalGuides: 12,
    hoursStudied: 47,
    streakDays: 8,
    averageScore: 87,
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-primary/20 text-primary border-primary/30"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl glass glow">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Lumos Learn</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Alex</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="glass text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => router.push("/export")}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="icon" className="glass">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="glass">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  className="glass-strong glow border-primary/20 hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => router.push("/create")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/20 group-hover:bg-primary/30 transition-colors">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Create Study Guide</h3>
                        <p className="text-sm text-muted-foreground">Upload materials and generate AI content</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass-strong border-accent/20 hover:border-accent/40 transition-all cursor-pointer group"
                  onClick={() => router.push("/planner")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-accent/20 group-hover:bg-accent/30 transition-colors">
                        <Calendar className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Study Planner</h3>
                        <p className="text-sm text-muted-foreground">Plan your study schedule</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-accent transition-colors" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass-strong border-chart-2/20 hover:border-chart-2/40 transition-all cursor-pointer group"
                  onClick={() => router.push("/flashcards")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-chart-2/20 group-hover:bg-chart-2/30 transition-colors">
                        <Zap className="h-6 w-6 text-chart-2" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Flashcards</h3>
                        <p className="text-sm text-muted-foreground">Interactive spaced repetition</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-chart-2 transition-colors" />
                    </div>
                  </CardContent>
                </Card>

                <Card
                  className="glass-strong border-chart-3/20 hover:border-chart-3/40 transition-all cursor-pointer group"
                  onClick={() => router.push("/quiz")}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-chart-3/20 group-hover:bg-chart-3/30 transition-colors">
                        <Target className="h-6 w-6 text-chart-3" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Practice Quiz</h3>
                        <p className="text-sm text-muted-foreground">Test your knowledge</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:text-chart-3 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Recent Study Guides */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Study Guides</h2>
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {recentGuides.map((guide) => (
                  <Card key={guide.id} className="glass-strong hover:glow transition-all cursor-pointer group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">{guide.title}</h3>
                            <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{guide.subject}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Progress value={guide.progress} className="w-24 h-2" />
                              <span className="text-sm text-muted-foreground">{guide.progress}%</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {guide.lastStudied}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="glass">
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Overview */}
            <Card className="glass-strong glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{stats.totalGuides}</div>
                    <div className="text-sm text-muted-foreground">Study Guides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.hoursStudied}</div>
                    <div className="text-sm text-muted-foreground">Hours Studied</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-2">{stats.streakDays}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-chart-3">{stats.averageScore}%</div>
                    <div className="text-sm text-muted-foreground">Avg Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Schedule */}
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg glass">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Calculus Review</p>
                    <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg glass">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Chemistry Flashcards</p>
                    <p className="text-xs text-muted-foreground">4:00 PM - 4:45 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg glass">
                  <div className="w-2 h-2 rounded-full bg-chart-2" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">History Quiz</p>
                    <p className="text-xs text-muted-foreground">7:00 PM - 7:30 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievement */}
            <Card className="glass-strong border-yellow-500/20">
              <CardContent className="p-6 text-center">
                <div className="p-3 rounded-full bg-yellow-500/20 w-fit mx-auto mb-3">
                  <Star className="h-6 w-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold mb-1">Study Streak!</h3>
                <p className="text-sm text-muted-foreground">You've studied for 8 days straight. Keep it up!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
