// api/evaluate/route.js
import { generateText } from "ai";
import { cohere } from "@ai-sdk/cohere";

export async function POST(request) {
  try {
    const { conversation, resumeData } = await request.json();

    // Validate input
    if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
      return Response.json(
        { error: "Invalid conversation data" },
        { status: 400 }
      );
    }

    if (!resumeData || typeof resumeData !== "object") {
      return Response.json(
        { error: "Invalid resume data" },
        { status: 400 }
      );
    }

    const evaluation = await generateAIEvaluation(conversation, resumeData);

    return Response.json(evaluation);
  } catch (error) {
    console.error("Error evaluating interview:", error);
    return Response.json(
      { error: "Failed to evaluate interview", details: error.message },
      { status: 500 }
    );
  }
}

async function generateAIEvaluation(conversation, resumeData) {
  const userPrompt = buildUserPrompt(conversation, resumeData);
  const systemPrompt = process.env.INTERVIEW_EVALUATION_PROMPT;

  if (!systemPrompt) {
    throw new Error("INTERVIEW_EVALUATION_PROMPT environment variable is not set");
  }

  try {
    const { text } = await generateText({
      model: cohere("command-a-03-2025"),
      temperature: 0.3,
      maxTokens: 2000,
      system: systemPrompt,
      prompt: userPrompt,
    });

    const evaluation = parseEvaluationResponse(text);
    return evaluation;
  } catch (error) {
    console.error("Cohere API error:", error);
    throw new Error("AI evaluation failed: " + error.message);
  }
}

function buildUserPrompt(conversation, resumeData) {
  // Format conversation for analysis
  const formattedConversation = conversation
    .map((msg, index) => {
      const speaker = msg.type === "ai" ? "Interviewer" : "Candidate";
      return `${index + 1}. ${speaker}: ${msg.content}`;
    })
    .join("\n\n");

  // Format resume data - handling both string and object formats
  const formattedResume = `
Full Name: ${resumeData.fullName || resumeData.name || "Not provided"}
Email: ${resumeData.email || "Not provided"}
Phone: ${resumeData.phone || "Not provided"}
Position Applied For: ${resumeData.roleAppliedFor || resumeData.position || "Not specified"}

Skills:
${resumeData.skills || "Not listed"}

Work Experience:
${resumeData.workExperience || resumeData.experience || "No work experience listed"}

Education:
${resumeData.education || "No education listed"}

Projects:
${resumeData.projects || "No projects listed"}

${resumeData.otherDetails ? `Other Details:\n${resumeData.otherDetails}` : ""}
  `.trim();

  return `# RESUME DATA
${formattedResume}

# INTERVIEW TRANSCRIPT
${formattedConversation}`;
}

function parseEvaluationResponse(responseText) {
  try {
    // Remove any potential markdown formatting
    let cleanedText = responseText.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    
    // Find JSON object in the response
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON found in response");
    }

    const evaluation = JSON.parse(jsonMatch[0]);

    // Validate and sanitize the response
    const sanitizedEvaluation = {
      overallScore: Math.min(Math.max(evaluation.overallScore || 0, 0), 100),
      verdict: ["pass", "needs_improvement", "fail"].includes(evaluation.verdict)
        ? evaluation.verdict
        : "needs_improvement",
      strengths: Array.isArray(evaluation.strengths)
        ? evaluation.strengths.slice(0, 5)
        : ["Unable to generate strengths"],
      improvements: Array.isArray(evaluation.improvements)
        ? evaluation.improvements.slice(0, 5)
        : ["Unable to generate improvements"],
      detailedFeedback:
        evaluation.detailedFeedback || "Evaluation completed successfully.",
      categoryScores: {
        technicalKnowledge: Math.min(Math.max(evaluation.categoryScores?.technicalKnowledge || 0, 0), 100),
        communication: Math.min(Math.max(evaluation.categoryScores?.communication || 0, 0), 100),
        problemSolving: Math.min(Math.max(evaluation.categoryScores?.problemSolving || 0, 0), 100),
        experience: Math.min(Math.max(evaluation.categoryScores?.experience || 0, 0), 100),
        professionalism: Math.min(Math.max(evaluation.categoryScores?.professionalism || 0, 0), 100),
      },
    };

    return sanitizedEvaluation;
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.error("Raw response:", responseText);
    
    // Return fallback evaluation
    return {
      overallScore: 50,
      verdict: "needs_improvement",
      strengths: ["Completed the interview"],
      improvements: [
        "Provide more detailed responses",
        "Include specific examples from experience",
        "Demonstrate deeper technical knowledge"
      ],
      detailedFeedback:
        "We encountered an issue generating your detailed evaluation. Please review the interview recording and consider scheduling a follow-up discussion.",
      categoryScores: {
        technicalKnowledge: 50,
        communication: 50,
        problemSolving: 50,
        experience: 50,
        professionalism: 50,
      },
    };
  }
}

// Optional: Helper function to calculate average score from categories
function calculateAverageScore(categoryScores) {
  const scores = Object.values(categoryScores);
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}