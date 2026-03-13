import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateTownPostcard(townName: string, year: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          text: `A vintage-style historical postcard of ${townName}, New Jersey, as it might have looked in the year ${year}. The style should reflect the era: hand-colored lithograph for 1800s, sepia photograph for early 1900s, or woodcut for 1700s. Include the town name and year in elegant period-appropriate typography.`,
        },
      ],
      config: {
        imageConfig: {
          aspectRatio: "4:3",
          imageSize: "1K",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating postcard:", error);
    return null;
  }
}
