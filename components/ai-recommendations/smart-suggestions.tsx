"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Clock, Target, Lightbulb, AlertTriangle, CheckCircle } from "lucide-react"

interface StudyRecommendation {
  id: string
  type: 'weakness' | 'strength' | 'schedule' | 'method' | 'motivation'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  estimatedImpact: number
  timeRequired: string
  actionable: boolean
  subject?: string
}

interface SmartSuggestionsProps {
  userProgress?: {
    weakSubjects: string[]
    strongSubjects: string[]
    studyPatterns: any
    recentPerformance: any
  }
  onRecommendationAccept?: (recommendation: StudyRecommendation) => void
}

export default function SmartSuggestions({ userProgress, onRecommendationAccept }: SmartSuggestionsProps) {
  const [recommendations, setRecommendations] = useState<StudyRecommendation[]>([])
  const [acceptedRecommendations, setAcceptedRecommendations] = useState<string[]>([])

  useEffect(() => {
    generateRecommendations()
  }, [userProgress])

  const generateRecommendations = () => {
    // AI-powered recommendation generation (simplified for demo)
    const suggestions: StudyRecommendation[] = [
      {
        id: '1',
        type: 'weakness',
        title: 'Focus on Mathematics',
        description: 'Your quiz scores in Mathematics are 15% below your average. Consider dedicating 30 minutes daily to practice problems.',
        priority: 'high',
        estimatedImpact: 85,
        timeRequired: '30 min/day',
        actionable: true,
        subject: 'Mathematics'
      },
      {
        id: '2',
        type: 'schedule',
        title: 'Optimize Study Timing',
        description: 'You perform 23% better during morning sessions (8-10 AM). Try scheduling difficult subjects during this time.',
        priority: 'medium',
        estimatedImpact: 70,
        timeRequired: 'Schedule adjustment',
        actionable: true
      },
      {
        id: '3',
        type: 'method',
        title: 'Try Active Recall',
        description: 'Based on your learning style, active recall techniques could improve retention by up to 40%.',
        priority: 'medium',
        estimatedImpact: 75,
        timeRequired: '15 min/session',
        actionable: true
      },
      {
        id: '4',
        type: 'strength',
        title: 'Leverage Physics Strength',
        description: 'You excel in Physics! Consider teaching concepts to peers or creating study guides to reinforce learning.',
        priority: 'low',
        estimatedImpact: 60,
        timeRequired: '20 min/week',
        actionable: true,
        subject: 'Physics'
      },
      {
        id: '5',
        type: 'motivation',
        title: 'Break Study Monotony',
        description: 'Your engagement drops after 45 minutes. Try the Pomodoro technique with 25-minute focused sessions.',
        priority: 'high',
        estimatedImpact: 80,
        timeRequired: 'Method change',
        actionable: true
      }
    ]

    setRecommendations(suggestions)
  }

  const handleAcceptRecommendation = (recommendation: StudyRecommendation) => {
    setAcceptedRecommendations(prev => [...prev, recommendation.id])
    onRecommendationAccept?.(recommendation)
  }

  const getTypeIcon = (type: StudyRecommendation['type']) => {
    switch (type) {
      case 'weakness': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'strength': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'schedule': return <Clock className="w-4 h-4 text-blue-500" />
      case 'method': return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'motivation': return <Target className="w-4 h-4 text-purple-500" />
    }
  }

  const getTypeLabel = (type: StudyRecommendation['type']) => {
    switch (type) {
      case 'weakness': return 'Improvement Area'
      case 'strength': return 'Leverage Strength'
      case 'schedule': return 'Schedule Optimization'
      case 'method': return 'Study Method'
      case 'motivation': return 'Motivation Boost'
    }
  }

  const getPriorityColor = (priority: StudyRecommendation['priority']) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
    }
  }

  const getImpactColor = (impact: number) => {
    if (impact >= 80) return 'text-green-600'
    if (impact >= 60) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-500" />
          AI Study Recommendations
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Personalized suggestions based on your learning patterns and performance
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((recommendation) => {
          const isAccepted = acceptedRecommendations.includes(recommendation.id)
          
          return (
            <div
              key={recommendation.id}
              className={`p-4 rounded-lg border transition-all ${
                isAccepted 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(recommendation.type)}
                  <span className="font-medium">{recommendation.title}</span>
                  {recommendation.subject && (
                    <Badge variant="outline" className="text-xs">
                      {recommendation.subject}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(recommendation.priority)} className="text-xs">
                    {recommendation.priority}
                  </Badge>
                  {isAccepted && <CheckCircle className="w-4 h-4 text-green-500" />}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                {recommendation.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{recommendation.timeRequired}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span className={getImpactColor(recommendation.estimatedImpact)}>
                      {recommendation.estimatedImpact}% impact
                    </span>
                  </div>
                </div>

                {!isAccepted && recommendation.actionable && (
                  <Button
                    size="sm"
                    onClick={() => handleAcceptRecommendation(recommendation)}
                    className="text-xs"
                  >
                    Apply
                  </Button>
                )}
              </div>

              {/* Impact visualization */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Estimated Impact</span>
                  <span className={getImpactColor(recommendation.estimatedImpact)}>
                    {recommendation.estimatedImpact}%
                  </span>
                </div>
                <Progress 
                  value={recommendation.estimatedImpact} 
                  className="h-1"
                />
              </div>
            </div>
          )
        })}

        {recommendations.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recommendations available yet.</p>
            <p className="text-sm">Complete more study sessions to get personalized suggestions!</p>
          </div>
        )}

        {/* Summary Stats */}
        {recommendations.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-red-600">
                  {recommendations.filter(r => r.priority === 'high').length}
                </div>
                <div className="text-xs text-muted-foreground">High Priority</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {acceptedRecommendations.length}
                </div>
                <div className="text-xs text-muted-foreground">Applied</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {Math.round(recommendations.reduce((acc, r) => acc + r.estimatedImpact, 0) / recommendations.length)}%
                </div>
                <div className="text-xs text-muted-foreground">Avg Impact</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
