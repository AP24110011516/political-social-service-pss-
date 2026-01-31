
import { GoogleGenAI, Type } from "@google/genai";
import { Issue } from "../types";

// Always initialize with named parameter and use process.env.API_KEY directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeIssueTrends(issues: Issue[]) {
  const issueSummary = issues.map(i => `${i.category}: ${i.title}`).join("\n");

  try {
    // Strategic analysis for government officials is a complex text task, using gemini-3-pro-preview.
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze these civic issues and provide a brief (100 words) strategic summary for government officials: \n\n${issueSummary}`,
    });

    // Extract text from the response using the .text property directly.
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating AI insights.";
  }
}

export async function getPolicyRecommendations(category: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 actionable policy recommendations for a village level administrator to improve ${category} infrastructure in rural India. Keep it concise.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { 
                type: Type.STRING,
                description: 'The short title of the policy recommendation.'
              },
              description: { 
                type: Type.STRING,
                description: 'A brief description of the policy recommendation.'
              }
            },
            required: ["title", "description"],
            propertyOrdering: ["title", "description"]
          }
        }
      }
    });
    
    // Always use the .text property to access generated content.
    const text = response.text;
    return text ? JSON.parse(text.trim()) : [];
  } catch (error) {
    console.error("Gemini Policy Recommendations Error:", error);
    return [];
  }
}
