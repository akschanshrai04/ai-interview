import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

export async function generateQuestionsWithGemini(formData) {
  const prompt = `
    You are an AI interview generator.
    
    Generate ${formData.questionCount} diverse interview questions for a ${formData.interviewType} interview.
    The candidate has ${formData.experienceLevel} of experience and is familiar with: ${formData.techStack.join(", ")}.
    
    Include both technical and behavioral questions IF the type is mixed.
    
    Respond ONLY as a valid JSON array of strings. No explanations.
    Example format: ["Question 1", "Question 2", "Question 3"]
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    console.log("Gemini response:", text);
    
    // Extract JSON array from response (if it contains code blocks or extra formatting)
    const cleanedText = text.trim().replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    console.log(parsed);
    
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to generate questions with Gemini:", err);
    throw new Error("Failed to generate interview questions. Please try again.");
  }
}

export async function generateInterviewFeedback(transcript, interviewData) {
  const prompt = `You are an expert interview coach and technical recruiter. Please provide detailed feedback on this interview transcript.

  Interview Details:
  - Type: ${interviewData.interviewType}
  - Tech Stack: ${interviewData.techStack.join(', ')}
  - Experience Level: ${interviewData.experienceLevel}
  - Questions Asked: ${interviewData.questions.join(', ')}

  Interview Transcript:
  ${transcript.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

  Please provide a comprehensive feedback report including:

  1. **Overall Performance Score** (1-10)
  2. **Technical Knowledge Assessment**
     - Strengths
     - Areas for improvement
  3. **Communication Skills**
     - Clarity of responses
     - Confidence level
     - Articulation
  4. **Problem-Solving Approach**
     - Logical thinking
     - Solution methodology
  5. **Specific Feedback on Each Question**
  6. **Recommendations for Improvement**
  7. **Strengths to Highlight**
  8. **Next Steps for Development**

  Format the response in a clear, structured manner that would be helpful for both the candidate and a hiring manager.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    const text = response.text;
    return text;
  } catch (error) {
    console.error("Error generating feedback:", error);
    throw new Error("Failed to generate interview feedback");
  }
}
  