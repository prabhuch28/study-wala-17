"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Flame, Star, Zap, Target, BookOpen, Clock, Award } from "lucide-react"

interface UserProgress {
  level: number
  xp: number
  xpToNextLevel: number
  streak: number
  longestStreak: number
  totalStudyHours: number
  sessionsCompleted: number
  badges: Badge[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlockedAt?: Date
}

interface ProgressTrackerProps {
  userId?: string
  onLevelUp?: (newLevel: number) => void
  onBadgeUnlocked?: (badge: Badge) => void
}

const BADGES: Badge[] = [
  {
    id: 'first-session',
    name: 'Getting Started',
    description: 'Complete your first study session',
    icon: '🎯',
    rarity: 'common'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Study for 7 days in a row',
    icon: '🔥',
    rarity: 'rare'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Study before 8 AM',
    icon: '🌅',
    rarity: 'common'
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Study after 10 PM',
    icon: '🦉',
    rarity: 'common'
  },
  {
    id: 'pomodoro-master',
    name: 'Pomodoro Master',
    description: 'Complete 25 Pomodoro sessions',
    icon: '🍅',
    rarity: 'epic'
  },
  {
    id: 'marathon-runner',
    name: 'Marathon Runner',
    description: 'Study for 4+ hours in one day',
    icon: '🏃‍♂️',
    rarity: 'rare'
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 100% on 5 quizzes',
    icon: '💯',
    rarity: 'epic'
  },
  {
    id: 'scholar',
    name: 'Scholar',
    description: 'Reach level 10',
    icon: '🎓',
    rarity: 'legendary'
  }
]

export default function ProgressTracker({ userId, onLevelUp, onBadgeUnlocked }: ProgressTrackerProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 150,
    xpToNextLevel: 200,
    streak: 5,
    longestStreak: 12,
    totalStudyHours: 23.5,
    sessionsCompleted: 47,
    badges: [
      { ...BADGES[0], unlockedAt: new Date('2024-01-10') },
      { ...BADGES[1], unlockedAt: new Date('2024-01-15') },
      { ...BADGES[2], unlockedAt: new Date('2024-01-12') }
    ]
  })

  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false)
  const [newBadge, setNewBadge] = useState<Badge | null>(null)

  const addXP = (amount: number, activity: string) => {
    setUserProgress(prev => {
      const newXP = prev.xp + amount
      const newLevel = Math.floor(newXP / 200) + 1
      
      if (newLevel > prev.level) {
        setShowLevelUpAnimation(true)
        onLevelUp?.(newLevel)
        setTimeout(() => setShowLevelUpAnimation(false), 3000)
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: (newLevel * 200) - newXP
      }
    })

    // Check for badge unlocks
    checkBadgeUnlocks(activity)
  }

  const checkBadgeUnlocks = (activity: string) => {
    // Simple badge unlock logic - replace with more sophisticated system
    const unlockedBadgeIds = userProgress.badges.map(b => b.id)
    
    BADGES.forEach(badge => {
      if (!unlockedBadgeIds.includes(badge.id)) {
        let shouldUnlock = false

        switch (badge.id) {
          case 'first-session':
            shouldUnlock = userProgress.sessionsCompleted >= 1
            break
          case 'streak-7':
            shouldUnlock = userProgress.streak >= 7
            break
          case 'pomodoro-master':
            shouldUnlock = userProgress.sessionsCompleted >= 25
            break
          case 'scholar':
            shouldUnlock = userProgress.level >= 10
            break
        }

        if (shouldUnlock) {
          const unlockedBadge = { ...badge, unlockedAt: new Date() }
          setUserProgress(prev => ({
            ...prev,
            badges: [...prev.badges, unlockedBadge]
          }))
          setNewBadge(unlockedBadge)
          onBadgeUnlocked?.(unlockedBadge)
          setTimeout(() => setNewBadge(null), 5000)
        }
      }
    })
  }

  const getXPForActivity = (activity: string) => {
    const xpMap: Record<string, number> = {
      'study-session': 25,
      'quiz-completed': 50,
      'perfect-score': 100,
      'daily-goal': 30,
      'streak-bonus': 20
    }
    return xpMap[activity] || 10
  }

  const getRarityColor = (rarity: Badge['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
    }
  }

  const getProgressPercentage = () => {
    const currentLevelXP = (userProgress.level - 1) * 200
    const xpInCurrentLevel = userProgress.xp - currentLevelXP
    return (xpInCurrentLevel / 200) * 100
  }

  return (
    <div className="space-y-6">
      {/* Level Up Animation */}
      {showLevelUpAnimation && (
        <Card className="border-yellow-500 bg-gradient-to-r from-yellow-50 to-orange-50 animate-pulse">
          <CardContent className="text-center py-6">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-yellow-700">Level Up!</h3>
            <p className="text-yellow-600">You've reached level {userProgress.level}!</p>
          </CardContent>
        </Card>
      )}

      {/* New Badge Animation */}
      {newBadge && (
        <Card className="border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 animate-bounce">
          <CardContent className="text-center py-4">
            <div className="text-3xl mb-2">{newBadge.icon}</div>
            <h3 className="font-bold text-purple-700">Badge Unlocked!</h3>
            <p className="text-sm text-purple-600">{newBadge.name}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Level & XP */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-2xl font-bold">Level {userProgress.level}</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {userProgress.xp} XP • {userProgress.xpToNextLevel} XP to next level
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">{userProgress.streak}</span>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">{userProgress.totalStudyHours}h</span>
              </div>
              <p className="text-xs text-muted-foreground">Study Time</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Target className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{userProgress.sessionsCompleted}</span>
              </div>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </div>
            
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">{userProgress.badges.length}</span>
              </div>
              <p className="text-xs text-muted-foreground">Badges</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={() => addXP(25, 'study-session')}
              className="flex-1"
            >
              <Zap className="w-4 h-4 mr-1" />
              +25 XP
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => addXP(50, 'quiz-completed')}
              className="flex-1"
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Quiz +50
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Badges Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            Badge Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {userProgress.badges.map((badge) => (
              <div
                key={badge.id}
                className="text-center p-3 rounded-lg border bg-gradient-to-b from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-medium">{badge.name}</p>
                <Badge 
                  variant="secondary" 
                  className={`text-xs mt-1 ${getRarityColor(badge.rarity)} text-white`}
                >
                  {badge.rarity}
                </Badge>
              </div>
            ))}
            
            {/* Locked badges preview */}
            {BADGES.filter(badge => 
              !userProgress.badges.some(ub => ub.id === badge.id)
            ).slice(0, 3).map((badge) => (
              <div
                key={badge.id}
                className="text-center p-3 rounded-lg border bg-gray-100 opacity-50"
              >
                <div className="text-2xl mb-1 grayscale">🔒</div>
                <p className="text-xs text-gray-500">???</p>
                <Badge variant="outline" className="text-xs mt-1">
                  Locked
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
