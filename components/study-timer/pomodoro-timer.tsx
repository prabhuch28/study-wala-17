"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, Coffee, Brain, Target, Volume2, VolumeX } from "lucide-react"

interface PomodoroTimerProps {
  onSessionComplete?: (sessionData: {
    type: 'focus' | 'short-break' | 'long-break'
    duration: number
    completed: boolean
  }) => void
  subject?: string
}

type TimerState = 'idle' | 'running' | 'paused' | 'completed'
type SessionType = 'focus' | 'short-break' | 'long-break'

const TIMER_PRESETS = {
  focus: { duration: 25 * 60, label: 'Focus Time', icon: Brain, color: 'bg-blue-500' },
  'short-break': { duration: 5 * 60, label: 'Short Break', icon: Coffee, color: 'bg-green-500' },
  'long-break': { duration: 15 * 60, label: 'Long Break', icon: Coffee, color: 'bg-purple-500' }
}

export default function PomodoroTimer({ onSessionComplete, subject }: PomodoroTimerProps) {
  const [sessionType, setSessionType] = useState<SessionType>('focus')
  const [timeLeft, setTimeLeft] = useState(TIMER_PRESETS.focus.duration)
  const [timerState, setTimerState] = useState<TimerState>('idle')
  const [sessionsCompleted, setSessionsCompleted] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [customDuration, setCustomDuration] = useState(25)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Initialize audio for notifications
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification-sound.mp3') // Add sound file to public folder
    }
  }, [])

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [timerState])

  const handleTimerComplete = () => {
    setTimerState('completed')
    
    // Play notification sound
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    // Send session data
    onSessionComplete?.({
      type: sessionType,
      duration: TIMER_PRESETS[sessionType].duration,
      completed: true
    })

    // Auto-suggest next session
    if (sessionType === 'focus') {
      setSessionsCompleted(prev => prev + 1)
      const nextSession = (sessionsCompleted + 1) % 4 === 0 ? 'long-break' : 'short-break'
      setTimeout(() => {
        setSessionType(nextSession)
        setTimeLeft(TIMER_PRESETS[nextSession].duration)
        setTimerState('idle')
      }, 3000)
    } else {
      setTimeout(() => {
        setSessionType('focus')
        setTimeLeft(TIMER_PRESETS.focus.duration)
        setTimerState('idle')
      }, 3000)
    }
  }

  const startTimer = () => {
    setTimerState('running')
  }

  const pauseTimer = () => {
    setTimerState('paused')
  }

  const resetTimer = () => {
    setTimerState('idle')
    setTimeLeft(TIMER_PRESETS[sessionType].duration)
  }

  const changeSessionType = (type: SessionType) => {
    setSessionType(type)
    setTimeLeft(TIMER_PRESETS[type].duration)
    setTimerState('idle')
  }

  const setCustomTime = (minutes: number) => {
    const seconds = minutes * 60
    setTimeLeft(seconds)
    setCustomDuration(minutes)
    setTimerState('idle')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalTime = TIMER_PRESETS[sessionType].duration
    return ((totalTime - timeLeft) / totalTime) * 100
  }

  const getCurrentIcon = () => {
    const IconComponent = TIMER_PRESETS[sessionType].icon
    return <IconComponent className="w-6 h-6" />
  }

  const getMotivationalMessage = () => {
    if (timerState === 'completed') {
      return sessionType === 'focus' 
        ? "🎉 Great focus session! Time for a well-deserved break."
        : "✨ Break complete! Ready to dive back into studying?"
    }
    
    if (timerState === 'running') {
      const percentage = getProgress()
      if (percentage < 25) return "🚀 Just getting started! You've got this!"
      if (percentage < 50) return "💪 Keep going! You're building momentum!"
      if (percentage < 75) return "🔥 Halfway there! Stay focused!"
      return "⚡ Almost done! Push through to the finish!"
    }
    
    return sessionType === 'focus' 
      ? `Ready to focus on ${subject || 'your studies'}?`
      : "Time to recharge and refresh your mind!"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <CardTitle className="flex items-center justify-center gap-2">
          {getCurrentIcon()}
          {TIMER_PRESETS[sessionType].label}
        </CardTitle>
        {subject && (
          <Badge variant="secondary" className="w-fit mx-auto">
            {subject}
          </Badge>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className={`text-6xl font-mono font-bold ${
            timerState === 'running' ? 'text-blue-600' : 
            timerState === 'completed' ? 'text-green-600' : 'text-gray-700'
          }`}>
            {formatTime(timeLeft)}
          </div>
          
          <Progress 
            value={getProgress()} 
            className="h-2"
          />
          
          <p className="text-sm text-muted-foreground">
            {getMotivationalMessage()}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-2">
          {timerState === 'idle' || timerState === 'paused' ? (
            <Button onClick={startTimer} className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {timerState === 'paused' ? 'Resume' : 'Start'}
            </Button>
          ) : (
            <Button onClick={pauseTimer} variant="outline" className="flex items-center gap-2">
              <Pause className="w-4 h-4" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetTimer} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Session Type Selector */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(TIMER_PRESETS) as SessionType[]).map((type) => (
            <Button
              key={type}
              variant={sessionType === type ? "default" : "outline"}
              size="sm"
              onClick={() => changeSessionType(type)}
              disabled={timerState === 'running'}
              className="text-xs"
            >
              {TIMER_PRESETS[type].label}
            </Button>
          ))}
        </div>

        {/* Custom Duration */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Custom:</span>
          <Select 
            value={customDuration.toString()} 
            onValueChange={(value) => setCustomTime(parseInt(value))}
            disabled={timerState === 'running'}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[15, 20, 25, 30, 45, 60, 90].map(mins => (
                <SelectItem key={mins} value={mins.toString()}>
                  {mins}m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="ml-auto p-2"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>

        {/* Session Stats */}
        <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>Sessions: {sessionsCompleted}</span>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-4 h-4" />
            <span>Next: {sessionsCompleted % 4 === 3 ? 'Long Break' : 'Short Break'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
