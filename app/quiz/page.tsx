"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, CheckCircle2, XCircle, Clock, Target, Play, RotateCcw, Award } from "lucide-react"
import Link from "next/link"

interface Question {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "multiple-select"
  options: string[]
  correctAnswers: number[]
  explanation: string
  subject: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

interface QuizResult {
  questionId: string
  selectedAnswers: number[]
  isCorrect: boolean
  timeSpent: number
}

export default function QuizPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isQuizComplete, setIsQuizComplete] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  // Mock quiz questions
  const [questions] = useState<Question[]>([
    {
      id: "1",
      question: "Which of the following principles is fundamental to quantum mechanics?",
      type: "multiple-choice",
      options: [
        "Conservation of energy",
        "Wave-particle duality",
        "Newton's laws of motion",
        "Thermodynamic equilibrium",
      ],
      correctAnswers: [1],
      explanation:
        "Wave-particle duality is a fundamental principle of quantum mechanics, stating that particles exhibit both wave and particle properties depending on how they are observed.",
      subject: "Quantum Physics",
      difficulty: "medium",
      points: 10,
    },
    {
      id: "2",
      question: "The entropy of an isolated system always increases over time.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswers: [0],
      explanation:
        "This statement is true and represents the Second Law of Thermodynamics. In an isolated system, entropy (disorder) tends to increase over time until equilibrium is reached.",
      subject: "Thermodynamics",
      difficulty: "easy",
      points: 5,
    },
    {
      id: "3",
      question: "Which of the following are examples of electromagnetic radiation? (Select all that apply)",
      type: "multiple-select",
      options: ["Visible light", "X-rays", "Sound waves", "Radio waves", "Gamma rays"],
      correctAnswers: [0, 1, 3, 4],
      explanation:
        "Electromagnetic radiation includes visible light, X-rays, radio waves, and gamma rays. Sound waves are mechanical waves, not electromagnetic radiation.",
      subject: "Physics",
      difficulty: "hard",
      points: 15,
    },
    {
      id: "4",
      question: "What is the relationship between energy and mass according to Einstein's theory?",
      type: "multiple-choice",
      options: ["E = mc", "E = mc²", "E = m/c²", "E = m + c²"],
      correctAnswers: [1],
      explanation:
        "Einstein's mass-energy equivalence formula is E = mc², where E is energy, m is mass, and c is the speed of light in a vacuum.",
      subject: "Modern Physics",
      difficulty: "easy",
      points: 5,
    },
  ])

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Timer effect
  useEffect(() => {
    if (isQuizStarted && !isQuizComplete && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isQuizStarted, isQuizComplete, timeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: Question["difficulty"]) => {
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

  const handleAnswerSelect = (answerIndex: number) => {
    if (currentQuestion.type === "multiple-select") {
      setSelectedAnswers((prev) =>
        prev.includes(answerIndex) ? prev.filter((i) => i !== answerIndex) : [...prev, answerIndex],
      )
    } else {
      setSelectedAnswers([answerIndex])
    }
  }

  const submitAnswer = () => {
    const timeSpent = Date.now() - questionStartTime
    const isCorrect =
      selectedAnswers.length === currentQuestion.correctAnswers.length &&
      selectedAnswers.every((answer) => currentQuestion.correctAnswers.includes(answer))

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswers: [...selectedAnswers],
      isCorrect,
      timeSpent,
    }

    setQuizResults((prev) => [...prev, result])
    setShowExplanation(true)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswers([])
      setShowExplanation(false)
      setQuestionStartTime(Date.now())
    } else {
      setIsQuizComplete(true)
    }
  }

  const startQuiz = () => {
    setIsQuizStarted(true)
    setQuestionStartTime(Date.now())
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setQuizResults([])
    setIsQuizStarted(false)
    setIsQuizComplete(false)
    setShowExplanation(false)
    setTimeRemaining(1800)
  }

  const calculateScore = () => {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
    const earnedPoints = quizResults.reduce((sum, result) => {
      const question = questions.find((q) => q.id === result.questionId)
      return sum + (result.isCorrect ? question?.points || 0 : 0)
    }, 0)
    return { earnedPoints, totalPoints, percentage: Math.round((earnedPoints / totalPoints) * 100) }
  }

  if (!isQuizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Target className="w-8 h-8 text-cyan-400" />
                Physics Quiz
              </CardTitle>
              <p className="text-slate-400">Test your knowledge with interactive questions</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">{questions.length}</div>
                  <div className="text-sm text-slate-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400">30</div>
                  <div className="text-sm text-slate-400">Minutes</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-white">Question Types:</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    Multiple Choice
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    True/False
                  </Badge>
                  <Badge variant="outline" className="border-slate-600 text-slate-300">
                    Multiple Select
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-white">Subjects Covered:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(questions.map((q) => q.subject))).map((subject) => (
                    <Badge key={subject} variant="secondary" className="bg-cyan-500/20 text-cyan-400">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white" onClick={startQuiz}>
                <Play className="w-4 h-4 mr-2" />
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isQuizComplete) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                <Award className="w-8 h-8 text-cyan-400" />
                Quiz Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold text-cyan-400 mb-2">{score.percentage}%</div>
                <p className="text-slate-400">
                  {score.earnedPoints} out of {score.totalPoints} points
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-400">
                    {quizResults.filter((r) => r.isCorrect).length}
                  </div>
                  <div className="text-sm text-slate-400">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {quizResults.filter((r) => !r.isCorrect).length}
                  </div>
                  <div className="text-sm text-slate-400">Incorrect</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" onClick={resetQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Quiz
                </Button>
                <Link href="/dashboard" className="flex-1">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-cyan-400 hover:bg-cyan-500/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Exit Quiz
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Badge variant="secondary" className={getDifficultyColor(currentQuestion.difficulty)}>
            {currentQuestion.difficulty.toUpperCase()}
          </Badge>
        </div>

        {/* Progress */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-slate-400">{currentQuestion.points} points</span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-6">
          <CardHeader>
            <Badge variant="outline" className="border-slate-600 text-slate-300 w-fit">
              {currentQuestion.subject}
            </Badge>
            <CardTitle className="text-xl text-white leading-relaxed">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            {currentQuestion.type === "multiple-choice" || currentQuestion.type === "true-false" ? (
              <RadioGroup
                value={selectedAnswers[0]?.toString()}
                onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="text-slate-200 cursor-pointer flex-1 py-2">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${index}`}
                      checked={selectedAnswers.includes(index)}
                      onCheckedChange={() => handleAnswerSelect(index)}
                    />
                    <Label htmlFor={`option-${index}`} className="text-slate-200 cursor-pointer flex-1 py-2">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Explanation */}
        {showExplanation && (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/50 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {quizResults[quizResults.length - 1]?.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span
                  className={`font-medium ${
                    quizResults[quizResults.length - 1]?.isCorrect ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {quizResults[quizResults.length - 1]?.isCorrect ? "Correct!" : "Incorrect"}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">{currentQuestion.explanation}</p>
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <div className="flex justify-center">
          {!showExplanation ? (
            <Button
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={submitAnswer}
              disabled={selectedAnswers.length === 0}
            >
              Submit Answer
            </Button>
          ) : (
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white" onClick={nextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
