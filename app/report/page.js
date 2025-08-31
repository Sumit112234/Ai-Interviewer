"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  Clock,
  User,
  Bot,
  ArrowLeft,
  Download,
  RotateCcw,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ReportPage() {
  const router = useRouter()
  const [interviewData, setInterviewData] = useState(null)
  const [evaluation, setEvaluation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load interview data from localStorage
    const savedData = localStorage.getItem("interviewData")
    if (savedData) {
      const data = JSON.parse(savedData)
      setInterviewData(data)
      generateEvaluation(data)
    } else {
      router.push("/")
    }
  }, [])

  const generateEvaluation = async (data) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/evaluate-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation: data.conversation,
          resumeData: data.resumeData,
        }),
      })

      const evaluationResult = await response.json()
      setEvaluation(evaluationResult)
    } catch (error) {
      console.error("Error generating evaluation:", error)
      // Fallback evaluation
      setEvaluation({
        overallScore: 75,
        verdict: "pass",
        strengths: ["Good technical knowledge", "Clear communication"],
        improvements: ["Be more specific about achievements", "Show more enthusiasm"],
        detailedFeedback: "Overall good performance with room for improvement.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReport = () => {
    const reportData = {
      interviewData,
      evaluation,
      generatedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `interview-report-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const retakeInterview = () => {
    localStorage.removeItem("interviewData")
    router.push("/")
  }

  if (!interviewData || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Generating your interview report...</p>
        </div>
      </div>
    )
  }

  const { conversation, resumeData, completedAt } = interviewData
  const questions = conversation.filter((msg) => msg.type === "ai")
  const answers = conversation.filter((msg) => msg.type === "user")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Report</h1>
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={downloadReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
            <Button onClick={retakeInterview}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Interview
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl flex items-center justify-center gap-3">
                  {evaluation?.verdict === "pass" ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-600" />
                  )}
                  Interview {evaluation?.verdict === "pass" ? "Passed" : "Needs Improvement"}
                </CardTitle>
                <CardDescription className="text-lg">
                  Interview completed on {new Date(completedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{evaluation?.overallScore || 75}%</div>
                    <p className="text-gray-600 dark:text-gray-300">Overall Score</p>
                    <Progress value={evaluation?.overallScore || 75} className="mt-2" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-2">{questions.length}</div>
                    <p className="text-gray-600 dark:text-gray-300">Questions Asked</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {Math.round(
                        answers.reduce((acc, answer) => acc + answer.content.split(" ").length, 0) / answers.length,
                      ) || 0}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">Avg Words per Answer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths and Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Strengths */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <TrendingUp className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evaluation?.strengths?.map((strength, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{strength}</p>
                      </div>
                    )) || (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">Good technical knowledge demonstrated</p>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">Clear and articulate communication</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="shadow-lg h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <TrendingUp className="h-5 w-5" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {evaluation?.improvements?.map((improvement, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300">{improvement}</p>
                      </div>
                    )) || (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            Provide more specific examples from your experience
                          </p>
                        </div>
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 dark:text-gray-300">
                            Show more enthusiasm and passion for the role
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Feedback */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Detailed Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {evaluation?.detailedFeedback ||
                    "Your interview performance showed good technical understanding and communication skills. To improve further, focus on providing more specific examples from your projects and experience. Practice articulating your achievements with concrete metrics and outcomes. Consider preparing STAR method responses for behavioral questions."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Full Conversation */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Full Interview Transcript
                </CardTitle>
                <CardDescription>Complete record of your interview conversation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {conversation.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-4 rounded-lg ${
                          message.type === "user"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        <div className="flex items-center mb-2">
                          {message.type === "user" ? (
                            <User className="h-4 w-4 mr-2" />
                          ) : (
                            <Bot className="h-4 w-4 mr-2" />
                          )}
                          <Badge variant={message.type === "user" ? "default" : "secondary"}>
                            {message.type === "user" ? "You" : "AI Interviewer"}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
