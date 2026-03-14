import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
})

const safeParseJson = (text) => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const analyzeText = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Text must be a string")
  }

  const prompt = `
You are an API.

Analyze emotion from the text.

Return ONLY valid JSON.
Do not add explanation.
Do not add text before or after JSON.

Text: ${text}

Return format:
{
  "emotion": "string",
  "keywords": ["string"],
  "summary": "string"
}
`

  const result = await model.generateContent(prompt)

  const responseText = result.response.text()

  const parsed = safeParseJson(responseText)

  if (!parsed) {
    throw new Error("Invalid AI response")
  }

  return parsed
}

export default analyzeText
