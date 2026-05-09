import { GoogleGenAI, Type, ThinkingLevel, Modality } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const getGeminiClient = () => {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeMarket = async (query: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  return response.text;
};

export const deepStrategyAnalysis = async (strategy: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Analyze this trading strategy in depth, considering risk management, psychological factors, and technical validity: ${strategy}`,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
    },
  });
  return response.text;
};

export const analyzeChartImage = async (base64Image: string, prompt: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/png", data: base64Image.split(",")[1] } },
        { text: prompt },
      ],
    },
  });
  return response.text;
};

export const editChartImage = async (base64Image: string, editPrompt: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: {
      parts: [
        { inlineData: { mimeType: "image/png", data: base64Image.split(",")[1] } },
        { text: editPrompt },
      ],
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const getTradingKnowledge = async (topic: string) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are a world-class trading educator. Provide a comprehensive, advanced, and highly detailed explanation of the following trading concept: "${topic}". Include practical examples, common pitfalls, and how professional traders use it. Format the response in Markdown.`,
  });
  return response.text;
};

export const simulateBacktest = async (strategyDetails: string, profile: any) => {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `As an expert quantitative analyst, simulate a backtest for the following trading strategy over the past 2 years.
    User Profile: ${JSON.stringify(profile)}
    Strategy: ${strategyDetails}
    
    Provide a realistic, hypothetical backtest report in JSON format. Do not use markdown blocks, just raw JSON.
    Schema:
    {
      "winRate": number (percentage),
      "totalTrades": number,
      "netProfit": number (percentage),
      "maxDrawdown": number (percentage),
      "profitFactor": number,
      "equityCurve": number[] (array of 20 data points representing account balance over time starting at 10000),
      "analysis": string (brief explanation of why this strategy performed this way)
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          winRate: { type: Type.NUMBER },
          totalTrades: { type: Type.NUMBER },
          netProfit: { type: Type.NUMBER },
          maxDrawdown: { type: Type.NUMBER },
          profitFactor: { type: Type.NUMBER },
          equityCurve: { type: Type.ARRAY, items: { type: Type.NUMBER } },
          analysis: { type: Type.STRING }
        },
        required: ["winRate", "totalTrades", "netProfit", "maxDrawdown", "profitFactor", "equityCurve", "analysis"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};

