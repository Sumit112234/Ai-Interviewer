// export async function POST(request) {
//   try {
//     const { resumeData, conversation, questionCount,count, conver, context, personality } = await request.json()

//     console.log({ resumeData, conversation, questionCount, count,conver, context, personality })
//     const questions = generateQuestionBasedOnResume(resumeData, conversation, questionCount, personality, context)

//     return Response.json({ question: questions })
//   } catch (error) {
//     console.error("Error generating question:", error)
//     return Response.json({ error: "Failed to generate question" }, { status: 500 })
//   }
// }

function generateQuestionBasedOnResume(resumeData, conversation, questionCount, personality, context) {
  const { roleAppliedFor, workExperience, projects, skills, education } = resumeData

  console.log({conversation})
  const personalityStyles = {
    professional: {
      prefix: "I'd like to understand",
      tone: "formal and structured",
      followUp: "Could you elaborate on"
    },
    friendly: {
      prefix: "I'm really curious about",
      tone: "warm and conversational",
      followUp: "That sounds interesting! Tell me more about"
    },
    technical: {
      prefix: "Let's dive deep into",
      tone: "analytical and detailed",
      followUp: "From a technical perspective, how did you"
    },
    senior: {
      prefix: "From a strategic standpoint",
      tone: "executive and big-picture",
      followUp: "Considering the business impact, how would you"
    }
  }

  const style = personalityStyles[personality] || personalityStyles.professional

  // Context-aware follow-up questions
  if (context && conversation.length > 2) {
    const contextQuestions = [
      `${style.followUp} the challenges you mentioned in that project?`,
      `That's a great example. How did you measure the success of that initiative?`,
      `${style.prefix} how you would apply those learnings to this role?`,
      `What would you do differently if you had to approach that situation again?`,
      `${style.followUp} your experience with limited resources or tight deadlines?`
    ]
    return contextQuestions[Math.floor(Math.random() * contextQuestions.length)]
  }

  // Role-specific question banks
  const roleSpecificQuestions = {
    "software-engineer": [
      `${style.prefix} your experience with system design. Can you walk me through how you'd architect a scalable application?`,
      `Tell me about a time when you had to debug a particularly challenging issue. What was your approach?`,
      `How do you stay current with new technologies and decide which ones to adopt in your projects?`,
      `${style.followUp} your experience with code reviews and maintaining code quality?`
    ],
    "frontend-developer": [
      `${style.prefix} your approach to creating responsive and accessible user interfaces?`,
      `How do you optimize web applications for performance, especially on mobile devices?`,
      `Tell me about a challenging UI/UX problem you solved and your thought process?`,
      `${style.followUp} your experience with modern frontend frameworks and state management?`
    ],
    "data-scientist": [
      `${style.prefix} your approach to handling messy, real-world data in your projects?`,
      `How do you communicate complex analytical findings to non-technical stakeholders?`,
      `Tell me about a machine learning model you built and how you validated its performance?`,
      `${style.followUp} your experience with A/B testing and experimental design?`
    ]
  }

  // General interview questions with personality flavor
  const generalQuestions = [
    `${style.prefix} what motivates you most about working in ${roleAppliedFor}. What drives your passion for this field?`,
    `Tell me about a time when you had to learn something completely new under pressure. How did you approach it?`,
    `${style.followUp} a situation where you disagreed with a team member or manager. How did you handle it?`,
    `What's the most challenging project you've worked on, and what made it so difficult?`,
    `How do you prioritize tasks when everything seems urgent?`,
    `${style.prefix} your long-term career goals and how this position fits into that vision?`,
    `Tell me about a failure or mistake you made and what you learned from it.`,
    `How do you handle feedback, especially when it's critical of your work?`,
    `${style.followUp} a time when you had to work with limited resources or tight deadlines?`,
    `What questions do you have about our company culture and this role?`
  ]

  // Skill-based questions
  const skillKeywords = skills.toLowerCase().split(',').map(s => s.trim())
  const skillQuestions = [
    `I see you have experience with ${skillKeywords[0]}. Can you describe a specific project where you used this skill effectively?`,
    `${style.prefix} how you approach learning new technologies. What's your process?`,
    `Tell me about a time when you had to use ${skillKeywords[1] || skillKeywords[0]} to solve a complex problem.`,
    `How do you balance technical excellence with meeting business deadlines?`
  ]

  // Progressive question difficulty based on question count
  let questionPool = []
  
  if (questionCount <= 2) {
    // Start with easier, getting-to-know-you questions
    questionPool = [...generalQuestions.slice(0, 4), ...skillQuestions.slice(0, 2)]
  } else if (questionCount <= 5) {
    // Move to more specific technical/role questions
    questionPool = [
      ...(roleSpecificQuestions[roleAppliedFor] || []),
      ...generalQuestions.slice(4, 8),
      ...skillQuestions.slice(2)
    ]
  } else {
    // Final questions - more challenging and forward-looking
    questionPool = [
      ...generalQuestions.slice(8),
      `${style.prefix} how you would approach your first 90 days in this role?`,
      `What do you think will be the biggest challenge in this position, and how would you tackle it?`,
      `How do you see the ${roleAppliedFor} role evolving in the next few years?`
    ]
  }

  // Select question based on personality and context
  const selectedQuestion = questionPool[questionCount % questionPool.length] || generalQuestions[0]
  
  return selectedQuestion
}


import { generateText } from "ai"
import { cohere } from "@ai-sdk/cohere"

function summarizeResume(resumeData) {
  if (!resumeData) return "No resume provided."

  const role = resumeData.roleAppliedFor || "Unknown role"
  const fullName = typeof resumeData.fullName === "string" ? resumeData.fullName.trim() : ""
  const otherDetails = typeof resumeData.otherDetails === "string" ? resumeData.otherDetails.trim() : ""

  const skills =
    typeof resumeData.skills === "string"
      ? resumeData.skills.trim()
      : Array.isArray(resumeData.skills)
        ? resumeData.skills.join(", ").trim()
        : ""

  function formatWorkExperience(we) {
    if (!we) return ""
    if (typeof we === "string") return `- ${we.trim()}`
    if (Array.isArray(we)) {
      return we
        .map((w) => {
          if (!w) return ""
          if (typeof w === "string") return `- ${w.trim()}`
          if (typeof w === "object") {
            const bits = [
              w.title ? `${w.title}` : "",
              w.company ? `@ ${w.company}` : "",
              w.tech ? `Tech: ${Array.isArray(w.tech) ? w.tech.join(", ") : String(w.tech)}` : "",
              w.achievements
                ? `Achievements: ${Array.isArray(w.achievements) ? w.achievements.join(" | ") : String(w.achievements)}`
                : "",
            ]
              .filter(Boolean)
              .join(" • ")
            return bits ? `- ${bits}` : ""
          }
          return ""
        })
        .filter(Boolean)
        .join("\n")
    }
    if (typeof we === "object") {
      const bits = [
        we.title ? `${we.title}` : "",
        we.company ? `@ ${we.company}` : "",
        we.tech ? `Tech: ${Array.isArray(we.tech) ? we.tech.join(", ") : String(we.tech)}` : "",
        we.achievements
          ? `Achievements: ${Array.isArray(we.achievements) ? we.achievements.join(" | ") : String(we.achievements)}`
          : "",
      ]
        .filter(Boolean)
        .join(" • ")
      return bits ? `- ${bits}` : ""
    }
    return ""
  }

  function formatProjects(p) {
    if (!p) return ""
    if (typeof p === "string") return `- ${p.trim()}`
    if (Array.isArray(p)) {
      return p
        .map((proj) => {
          if (!proj) return ""
          if (typeof proj === "string") return `- ${proj.trim()}`
          if (typeof proj === "object") {
            const bits = [
              proj.name ? `${proj.name}` : "",
              proj.description ? `— ${proj.description}` : "",
              proj.tech ? `Tech: ${Array.isArray(proj.tech) ? proj.tech.join(", ") : String(proj.tech)}` : "",
              proj.impact ? `Impact: ${proj.impact}` : "",
            ]
              .filter(Boolean)
              .join(" ")
            return bits ? `- ${bits}` : ""
          }
          return ""
        })
        .filter(Boolean)
        .join("\n")
    }
    if (typeof p === "object") {
      const bits = [
        p.name ? `${p.name}` : "",
        p.description ? `— ${p.description}` : "",
        p.tech ? `Tech: ${Array.isArray(p.tech) ? p.tech.join(", ") : String(p.tech)}` : "",
        p.impact ? `Impact: ${p.impact}` : "",
      ]
        .filter(Boolean)
        .join(" ")
      return bits ? `- ${bits}` : ""
    }
    return ""
  }

  function formatEducation(e) {
    if (!e) return ""
    if (typeof e === "string") return `- ${e.trim()}`
    if (Array.isArray(e)) {
      return e
        .map((ed) => {
          if (!ed) return ""
          if (typeof ed === "string") return `- ${ed.trim()}`
          if (typeof ed === "object") {
            const parts = [ed.degree, ed.institution, ed.year].filter(Boolean)
            return parts.length ? `- ${parts.join(", ")}` : ""
          }
          return ""
        })
        .filter(Boolean)
        .join("\n")
    }
    if (typeof e === "object") {
      const parts = [e.degree, e.institution, e.year].filter(Boolean)
      return parts.length ? `- ${parts.join(", ")}` : ""
    }
    return ""
  }

  const exp = formatWorkExperience(resumeData.workExperience)
  const projs = formatProjects(resumeData.projects)
  const edu = formatEducation(resumeData.education)

  return [
    fullName ? `Full Name: ${fullName}` : "",
    `Role Applied For: ${role}`,
    skills ? `Skills: ${skills}` : "",
    exp ? `Experience:\n${exp}` : "",
    projs ? `Projects:\n${projs}` : "",
    edu ? `Education:\n${edu}` : "",
    otherDetails ? `Other Details: ${otherDetails}` : "",
  ]
    .filter(Boolean)
    .join("\n")
}

function transcriptFromConversation(conversation, maxTurns = 20) {
  const lastN = conversation.slice(-maxTurns)
  return lastN.map((m) => (m.role === "ai" ? `Interviewer: ${m.content}` : `Candidate: ${m.content}`)).join("\n")
}


function extractJson(text) {
  const fence = /```(?:json)?\s*([\s\S]*?)\s*```/i
  const match = text.match(fence)
  if (match) return match[1]
  // fallback: try to locate first { and last }
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start !== -1 && end !== -1 && end > start) return text.slice(start, end + 1)
  return text
}


function createDefaultTotals() {
  return {
    communication: 0,
    technical: 0,
    problemSolving: 0,
    cultureFit: 0,
  }
}

function normalizeScores(scores) {
  const defaults = createDefaultTotals()
  if (!scores || typeof scores !== "object") return defaults
  
  return {
    communication: typeof scores.communication === "number" ? Math.max(0, Math.min(5, scores.communication)) : 0,
    technical: typeof scores.technical === "number" ? Math.max(0, Math.min(5, scores.technical)) : 0,
    problemSolving: typeof scores.problemSolving === "number" ? Math.max(0, Math.min(5, scores.problemSolving)) : 0,
    cultureFit: typeof scores.cultureFit === "number" ? Math.max(0, Math.min(5, scores.cultureFit)) : 0,
  }
}


function detectRepeatRequest(lastUser) {
  const u = String(lastUser || "").toLowerCase()
  return /(?:\brepeat\b|say (?:that|it) again|pardon|didn'?t catch|again please|could you repeat|can you repeat|what did you ask|come again|one more time|dobara|phir se|sunai nahi diya)/i.test(u)
}

function detectUncertainty(lastUser) {
  return /(?:\bi (?:don['']?t|do not) know\b|\bnot confident\b|\bi'?m not confident\b|\bsorry\b|\bnot sure\b|\bno idea\b|\bcan'?t recall\b|\bpata nahi\b|\bmalum nahi\b)/i.test(
    String(lastUser || "")
  )
}


export async function POST(request) {
  // try {
    const body = await request.json()
    const {
      resumeData,
      conversation = [],
      questionCount = 0,
      personality = "professional",
      context,
      currentTotals
    } = body || {}

    // Basic validation
    if (!Array.isArray(conversation)) {
      return Response.json({ error: "conversation must be an array of {role, content}" }, { status: 400 })
    }

    console.log("[v0] POST /api/generate-question", {
      conversationLength: conversation.length,
      questionCount,
      hasResume: !!resumeData,
      personality,
      hasContext: !!context,
    })

    const resumeSummary = summarizeResume(resumeData)
    const transcript = transcriptFromConversation(conversation)

    const users = conversation.filter((m) => m.role === "user")
    const ais = conversation.filter((m) => m.role === "ai")
    const lastTwoUsers = users.slice(-2).map((m) => m.content)
    const lastTwoAIs = ais.slice(-2).map((m) => m.content)

    const lastUser = lastTwoUsers.slice(-1)[0] || ""
    const prevUser = lastTwoUsers.length > 1 ? lastTwoUsers[0] : ""

    const lastAI = lastTwoAIs.slice(-1)[0] || ""
    const prevAI = lastTwoAIs.length > 1 ? lastTwoAIs[0] : ""

    if (detectRepeatRequest(lastUser) && lastAI) {
      const safeTotals = normalizeScores(currentTotals)
      return Response.json({
        question: lastAI,
        crossQuestion: null,
        endInterview: false,
        reasoning: "User requested repetition; repeating the last question verbatim.",
        followUpTopics: [],
        selectionFlags: [],
        memoryUpdates: [],
        scores: createDefaultTotals(), // No new scores for repeat
        notes: "Repeated last question - no scoring applied",
        totals: safeTotals, // Totals unchanged
        emotion: "neutral",
        questionCountShouldIncrement: false, // CRITICAL: Don't increment for repeats
      })
    }

    const system = `You are a seasoned, human-like interviewer for ${resumeData?.roleAppliedFor || "the role"}.

CORE RESPONSIBILITIES:
1. Ask clear, targeted questions based on resume and conversation history
2. Support bilingual candidates (English/Hindi mixing is fine)
3. Handle ASR errors gracefully (e.g., "manstack" → "MERN stack")
4. Show empathy when candidates are uncertain
5. Keep questions concise (5-22 words; exceed only when essential)
6. Ask natural follow-up cross-questions based on candidate's last 1-2 replies
7. Evaluate each answer using the rubric: communication, technical, problemSolving, cultureFit (0-5 each)
8. Flag inappropriate behavior (sexual, abusive, flirting) professionally

QUESTION INCREMENT RULES:
- questionCountShouldIncrement = true ONLY for brand new main questions
- questionCountShouldIncrement = false for:
  * Cross-questions (follow-ups on candidate's answer)
  * Clarifications
  * Repeated/rephrased questions
  * Simplified versions of previous questions

CROSS-QUESTION RULES:
- If lastUser is non-empty, you MUST provide a crossQuestion
- crossQuestion should dig deeper into specific details from their last answer
- If candidate seems uncertain, crossQuestion should be supportive and simpler
- If candidate gave a strong answer, crossQuestion should explore technical depth

EMOTION DETECTION:
- Analyze candidate's tone and content in lastUser
- Return "neutral" (default), "happy" (enthusiastic/confident), or "angry" (frustrated/upset)
- If candidate is upset, be more supportive in your next question

INTERVIEW ENDING:
- Set endInterview=true only after 8+ questions AND when:
  * Candidate has demonstrated competency
  * Natural conclusion is reached
  * Candidate is clearly struggling and has been given fair chances`

    const prompt = `Resume Summary:
${resumeSummary}

Conversation Transcript:
${transcript}


Recent Context (use both, if present):
- Previous AI question: "${prevAI || "(none)"}"
- Last AI question: "${lastAI || "(none)"}"
- Previous candidate reply: "${prevUser || "(none)"}"
- Last candidate reply: "${lastUser || "(none)"}"


Interview State:
- questionCount: ${questionCount}
- context: "${context || ""}"
- personality: "${personality}"


- Consider the last two candidate replies and last two interviewer questions to maintain continuity.
- Handle potential ASR/mic errors or typos in candidate replies; clarify gently if meaning is ambiguous.
- Target 5–22 words per question; only exceed if the concept truly needs it.
- If the candidate's last reply suggests a topic (e.g., a project, challenge, tool), use a cross-question to dig deeper.
- When lastUser is non-empty, you MUST return a non-null crossQuestion that is directly related to the lastUser content.
- When appropriate, you may decide to end the interview (endInterview=true) after a strong closing question.

Return ONLY valid JSON with this EXACT structure:
{
  "nextQuestion": string, (5-22 words; exceed only if essential. This is mandatory feild.)
  "crossQuestion": string || null (if necessary ; else null)
  "endInterview": boolean,
  "reasoning": string,
  "followUpTopics": string[],
  "selectionFlags": string[],
  "memoryUpdates": string[],
  "emotion": "neutral | happy | angry" ( based on candidate's last response, If a candidate is upset or angry, reflect that in your tone and question choice. If he is giving wrong answers or is not able to answer properly then you can be a angry emotion and ask him other question )
  "questionCountShouldIncrement" : boolean,  ( true if the question is new and should increment the count; false if repeating or cross-question. Don't return true for every question, only when it genuinely advances the interview. If it is a cross-question then must return false )
  "scores": {
    "communication": number,
    "technical": number,
    "problemSolving": number,
    "cultureFit": number
  },
  "notes": string
}

Important:
- Tailor nextQuestion to ${resumeData?.roleAppliedFor || "the role"} using resume data and the last two replies.
- Keep it natural and realistic, like a human interviewer.
REMEMBER:
- questionCountShouldIncrement=false for ALL cross-questions and follow-ups
- questionCountShouldIncrement=true ONLY for new main interview questions
- Use crossQuestion when the last answer warrants a deeper probe.
`

    // Call Cohere via AI SDK
    const model = cohere("command-a-03-2025") 
    const { text } = await generateText({
      model,
      system,
      prompt,
    })

    let parsed = null
    // try {
      parsed = JSON.parse(extractJson(text))
    // } catch (e) {
    //   console.error("[v0] JSON parse failed, raw text:", text)
    //   return Response.json({ error: "Model returned invalid JSON." }, { status: 500 })
    // }

    console.log('parsed question:', parsed , ' from text:', text)

    if (!parsed?.nextQuestion) {
      return Response.json({ error: "Model did not provide nextQuestion." }, { status: 500 })
    }

    const lastUserNonEmpty = typeof lastUser === "string" && lastUser.trim().length > 0

    const userSoundsUnsure =
      /(?:\bi (?:don['’]?t|do not) know\b|\bnot confident\b|\bi'?m not confident\b|\bsorry\b|\bnot sure\b|\bno idea\b|\bcan'?t recall\b)/i.test(
        String(lastUser || ""),
      )

    const computedCrossQuestion = lastUserNonEmpty
      ? parsed.crossQuestion && String(parsed.crossQuestion).trim().length > 0
        ? parsed.crossQuestion
        : userSoundsUnsure
          ? "No worries—take your time. Could you share any project you felt comfortable with and what you learned?"
          : "Quick follow-up on your last point: could you walk me through a concrete example, your specific contribution, and any measurable impact?"
      : (parsed.crossQuestion ?? null)

    const baseTotals = {
      communication: 0,
      technical: 0,
      problemSolving: 0,
      cultureFit: 0,
    }
    const prior = { ...baseTotals, ...(currentTotals || {}) }
    const turn = parsed.scores || baseTotals
    const aggregated = {
      communication: (prior.communication || 0) + (turn.communication || 0),
      technical: (prior.technical || 0) + (turn.technical || 0),
      problemSolving: (prior.problemSolving || 0) + (turn.problemSolving || 0),
      cultureFit: (prior.cultureFit || 0) + (turn.cultureFit || 0),
    }
    
    const validEmotions = ["neutral", "happy", "angry"]
    const emotion = validEmotions.includes(parsed.emotion) ? parsed.emotion : "neutral"

     const shouldIncrement = parsed.questionCountShouldIncrement !== false && !computedCrossQuestion
    // Backward-compatible response while adding rich metadata
    return Response.json({
      question: parsed.nextQuestion ?? computedCrossQuestion ?? "Could you please elaborate?",
      crossQuestion: computedCrossQuestion,
      endInterview: !!parsed.endInterview,
      reasoning: parsed.reasoning || "",
      followUpTopics: parsed.followUpTopics || [],
      selectionFlags: parsed.selectionFlags || [],
      memoryUpdates: parsed.memoryUpdates || [],
      scores: parsed.scores || baseTotals,
      notes: parsed.notes || "",
      totals: aggregated,
      emotion,
      questionCountShouldIncrement: shouldIncrement, // default true
    })
  // } catch (error) {
  //   console.error("[v0] Error generating question:", error?.message || error)
  //   return Response.json({ error: "Failed to generate question" }, { status: 500 })
  // }
}

