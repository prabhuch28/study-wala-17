"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, RotateCcw, CheckCircle2, XCircle, Brain, Shuffle, Play, Pause, Star } from "lucide-react"
import Link from "next/link"

interface Flashcard {
  id: string
  front: string
  back: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  lastReviewed?: string
  confidence: number
  studyGuideId?: string
}

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
  })
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [shuffled, setShuffled] = useState(false)

  // Mock flashcards data
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    {
      id: "1",
      front: "What is the Heisenberg Uncertainty Principle?",
      back: "The Heisenberg Uncertainty Principle states that it is impossible to simultaneously measure the exact position and momentum of a particle. The more precisely one property is measured, the less precisely the other can be known.",
      subject: "Quantum Physics",
      difficulty: "hard",
      confidence: 3,
      studyGuideId: "physics-guide-1",
    },
    {
      id: "2",
      front: "Define entropy in thermodynamics",
      back: "Entropy is a measure of the disorder or randomness in a system. In thermodynamics, it represents the amount of thermal energy unavailable to do work and tends to increase in isolated systems.",
      subject: "Thermodynamics",
      difficulty: "medium",
      confidence: 4,
    },
    {
      id: "3",
      front: "What is wave-particle duality?",
      back: "Wave-particle duality is the concept that every particle or quantum entity exhibits both wave and particle properties. Light, for example, can behave as both a wave and a stream of particles (photons).",
      subject: "Quantum Physics",
      difficulty: "medium",
      confidence: 2,
    },
    {
      id: "4",
      front: "State the First Law of Thermodynamics",
      back: "The First Law of Thermodynamics states that energy cannot be created or destroyed, only transferred or converted from one form to another. Mathematically: ΔU = Q - W, where ΔU is change in internal energy, Q is heat added, and W is work done by the system.",
      subject: "Thermodynamics",
      difficulty: "easy",
      confidence: 5,
    },
  ])

  const currentCard = flashcards[currentCardIndex]
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100

  const getDifficultyColor = (difficulty: Flashcard["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "hard":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getConfidenceStars = (confidence: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3 h-3 ${i < confidence ? "text-yellow-400 fill-yellow-400" : "text-slate-600"}`} />
    ))
  }

  const handleCardResponse = (isCorrect: boolean) => {
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1,
    }))

    // Update confidence based on response
    setFlashcards((prev) =>
      prev.map((card, index) =>
        index === currentCardIndex
          ? {
              ...card,
              confidence: Math.max(1, Math.min(5, card.confidence + (isCorrect ? 1 : -1))),
              lastReviewed: new Date().toISOString(),
            }
          : card,
      ),
    )

    // Move to next card
    setTimeout(() => {
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
        setIsFlipped(false)
        setShowAnswer(false)
      } else {
        setIsStudyMode(false)
        // Session complete
      }
    }, 1000)
  }

  const shuffleCards = () => {
    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffledCards)
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
    setShuffled(true)
  }

  const resetSession = () => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
    setShowAnswer(false)
    setSessionStats({ correct: 0, incorrect: 0, total: 0 })
    setIsStudyMode(false)
  }

  const startStudyMode = () => {
    setIsStudyMode(true)
    resetSession()
  }

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
                <Brain className="w-8 h-8 text-cyan-400" />
                Flashcards
              </h1>
              <p className="text-slate-400">Master concepts with spaced repetition</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
              onClick={shuffleCards}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
            <Button
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
              onClick={resetSession}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            {!isStudyMode ? (
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={startStudyMode}>
                <Play className="w-4 h-4 mr-2" />
                Start Study
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                onClick={() => setIsStudyMode(false)}
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                Card {currentCardIndex + 1} of {flashcards.length}
              </span>
              <span className="text-sm text-slate-400">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            {isStudyMode && sessionStats.total > 0 && (
              <div className="flex items-center gap-4 mt-3 text-sm">
                <span className="text-emerald-400">Correct: {sessionStats.correct}</span>
                <span className="text-red-400">Incorrect: {sessionStats.incorrect}</span>
                <span className="text-slate-400">
                  Accuracy: {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Flashcard */}
        <div className="relative mb-8">
          <Card
            className={`bg-slate-800/50 backdrop-blur-sm border-slate-700/50 min-h-[400px] cursor-pointer transition-all duration-500 transform-gpu ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className={getDifficultyColor(currentCard.difficulty)}>
                  {currentCard.difficulty.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Confidence:</span>
                  <div className="flex gap-1">{getConfidenceStars(currentCard.confidence)}</div>
                </div>
              </div>
              <Badge variant="outline" className="border-slate-600 text-slate-300 w-fit">
                {currentCard.subject}
              </Badge>
            </CardHeader>
            <CardContent className="flex items-center justify-center min-h-[280px] p-8">
              <div className="text-center">
                {!isFlipped ? (
                  <div>
                    <h2 className="text-xl font-medium text-white mb-4 leading-relaxed">{currentCard.front}</h2>
                    <p className="text-sm text-slate-400">Click to reveal answer</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg text-slate-200 leading-relaxed">{currentCard.back}</p>
                    {isStudyMode && <p className="text-sm text-slate-400 mt-4">How well did you know this?</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!isStudyMode ? (
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => {
                  if (currentCardIndex > 0) {
                    setCurrentCardIndex(currentCardIndex - 1)
                    setIsFlipped(false)
                  }
                }}
                disabled={currentCardIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {isFlipped ? "Show Question" : "Show Answer"}
              </Button>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                onClick={() => {
                  if (currentCardIndex < flashcards.length - 1) {
                    setCurrentCardIndex(currentCardIndex + 1)
                    setIsFlipped(false)
                  }
                }}
                disabled={currentCardIndex === flashcards.length - 1}
              >
                Next
              </Button>
            </div>
          ) : (
            isFlipped && (
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                  onClick={() => handleCardResponse(false)}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Didn't Know
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => handleCardResponse(true)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Got It Right
                </Button>
              </div>
            )
          )}
        </div>

        {/* Study Complete */}
        {isStudyMode && currentCardIndex === flashcards.length - 1 && sessionStats.total > 0 && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mt-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Study Session Complete!</h2>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-2xl font-bold text-emerald-400">{sessionStats.correct}</div>
                  <div className="text-sm text-slate-400">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">{sessionStats.incorrect}</div>
                  <div className="text-sm text-slate-400">Incorrect</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan-400">
                    {Math.round((sessionStats.correct / sessionStats.total) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Accuracy</div>
                </div>
              </div>
              <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={startStudyMode}>
                Study Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
