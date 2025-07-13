import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `NEXT_PUBLIC_GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

export async function generateQuestionsWithGemini({ interviewType, experienceLevel, techStack, questionCount }) {
    const prompt = `
        You are an AI interview generator.
        
        Generate ${questionCount} diverse interview questions for a ${interviewType} interview.
        The candidate has ${experienceLevel} of experience and is familiar with: ${techStack.join(", ")}.
        
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
  