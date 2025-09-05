"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Mic, MicOff, Bot, User, Lightbulb, BookOpen, Target } from "lucide-react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'explanation' | 'example' | 'question' | 'encouragement'
}

interface ChatInterfaceProps {
  subject?: string
  topic?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
}

export default function ChatInterface({ subject, topic, difficulty = 'intermediate' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your AI tutor. I'm here to help you understand ${subject || 'any topic'} better. You can ask me to explain concepts, give examples, create practice questions, or just chat about what you're studying. What would you like to learn today?`,
      timestamp: new Date(),
      type: 'encouragement'
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Simulate AI response - replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = generateAIResponse(input, subject, difficulty)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        type: aiResponse.type
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userInput: string, subject?: string, difficulty?: string) => {
    const input = userInput.toLowerCase()
    
    // Simple response generation - replace with actual AI
    if (input.includes('explain') || input.includes('what is')) {
      return {
        content: `Great question! Let me break this down for you step by step:\n\n1. **Definition**: This concept is fundamental to ${subject || 'the subject'}\n2. **Key Points**: Here are the main ideas you need to understand\n3. **Example**: Let me give you a practical example\n4. **Practice**: Try thinking about how this applies to real situations\n\nWould you like me to elaborate on any of these points or give you some practice questions?`,
        type: 'explanation' as const
      }
    } else if (input.includes('example') || input.includes('show me')) {
      return {
        content: `Here's a concrete example to illustrate this concept:\n\n**Scenario**: [Practical example relevant to ${subject}]\n\n**Step-by-step breakdown**:\n• Step 1: [First step]\n• Step 2: [Second step]\n• Step 3: [Final step]\n\n**Why this works**: [Explanation of underlying principles]\n\nTry creating your own example now! What situation can you think of where this applies?`,
        type: 'example' as const
      }
    } else if (input.includes('question') || input.includes('quiz') || input.includes('test')) {
      return {
        content: `Perfect! Let me create some practice questions for you:\n\n**Question 1** (${difficulty} level):\n[Sample question based on the topic]\n\n**Question 2**:\n[Another practice question]\n\n**Question 3**:\n[Third question with different angle]\n\nTake your time answering these. I'll provide feedback and explanations once you respond!`,
        type: 'question' as const
      }
    } else {
      return {
        content: `I understand you're asking about "${userInput}". This is an interesting topic in ${subject || 'your studies'}!\n\nLet me help you with this. Based on your ${difficulty} level, I'd recommend:\n\n• Starting with the basic concepts\n• Working through some examples\n• Practicing with targeted questions\n\nWhat specific aspect would you like to focus on first? I can explain concepts, provide examples, or create practice problems for you.`,
        type: 'explanation' as const
      }
    }
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      setIsListening(true)
      // Implement speech recognition here
      setTimeout(() => {
        setIsListening(false)
        setInput("This is a voice input example")
      }, 2000)
    } else {
      setIsListening(false)
    }
  }

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'explanation':
        return <Lightbulb className="w-4 h-4 text-yellow-500" />
      case 'example':
        return <BookOpen className="w-4 h-4 text-blue-500" />
      case 'question':
        return <Target className="w-4 h-4 text-green-500" />
      case 'encouragement':
        return <Bot className="w-4 h-4 text-purple-500" />
      default:
        return <Bot className="w-4 h-4 text-gray-500" />
    }
  }

  const getMessageTypeLabel = (type?: string) => {
    switch (type) {
      case 'explanation': return 'Explanation'
      case 'example': return 'Example'
      case 'question': return 'Practice'
      case 'encouragement': return 'Support'
      default: return 'Response'
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          AI Tutor
          {subject && (
            <Badge variant="secondary" className="ml-2">
              {subject}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className="ml-1">
              {difficulty}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Bot className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && message.type && (
                    <div className="flex items-center gap-1 mb-2 text-xs opacity-70">
                      {getMessageIcon(message.type)}
                      <span>{getMessageTypeLabel(message.type)}</span>
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                  
                  <div className={`text-xs mt-2 opacity-70 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
                
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 mt-1">
                    <AvatarFallback className="bg-green-100 text-green-600">
                      <User className="w-4 h-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your studies..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="pr-12"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={handleVoiceInput}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!input.trim() || isLoading}
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Explain this concept in simple terms")}
              disabled={isLoading}
            >
              Explain
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Give me an example")}
              disabled={isLoading}
            >
              Example
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput("Create practice questions")}
              disabled={isLoading}
            >
              Quiz Me
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
