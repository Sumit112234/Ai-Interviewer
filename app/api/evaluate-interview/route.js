export async function POST(request) {
  try {
    const { conversation, resumeData } = await request.json()

    // Simulate AI evaluation (replace with actual Cohere API call)
    const evaluation = generateEvaluation(conversation, resumeData)

    return Response.json(evaluation)
  } catch (error) {
    console.error("Error evaluating interview:", error)
    return Response.json({ error: "Failed to evaluate interview" }, { status: 500 })
  }
}

function generateEvaluation(conversation, resumeData) {
  const answers = conversation.filter((msg) => msg.type === "user")
  const questions = conversation.filter((msg) => msg.type === "ai")

  // Simple evaluation logic (replace with AI-powered evaluation)
  let score = 70 // Base score

  // Evaluate based on answer length and quality
  const avgAnswerLength = answers.reduce((acc, answer) => acc + answer.content.split(" ").length, 0) / answers.length

  if (avgAnswerLength > 30) score += 10 // Good detail
  if (avgAnswerLength > 50) score += 5 // Excellent detail

  // Check for technical keywords
  const technicalKeywords = ["project", "experience", "challenge", "solution", "team", "result"]
  const keywordCount = answers.reduce((acc, answer) => {
    return acc + technicalKeywords.filter((keyword) => answer.content.toLowerCase().includes(keyword)).length
  }, 0)

  score += Math.min(keywordCount * 2, 15)

  const verdict = score >= 75 ? "pass" : "needs improvement"

  const strengths = [
    "Demonstrated good communication skills",
    "Provided relevant examples from experience",
    "Showed enthusiasm for the role",
    "Technical knowledge appears solid",
  ]

  const improvements = [
    "Provide more specific metrics and outcomes",
    "Elaborate more on leadership experiences",
    "Show more passion and energy in responses",
    "Prepare more detailed project examples",
  ]

  const detailedFeedback = `Your interview performance was ${verdict === "pass" ? "strong" : "adequate"} with a score of ${score}%. You demonstrated good technical knowledge and communication skills. ${verdict === "pass" ? "Continue to build on your strengths and prepare specific examples for future interviews." : "Focus on providing more detailed examples and showing greater enthusiasm for the role."}`

  return {
    overallScore: Math.min(score, 100),
    verdict,
    strengths: strengths.slice(0, Math.floor(Math.random() * 2) + 2),
    improvements: improvements.slice(0, Math.floor(Math.random() * 2) + 2),
    detailedFeedback,
  }
}
