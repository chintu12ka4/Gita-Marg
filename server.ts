import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middleware
app.use(express.json());

// Lazy-initialized Gemini Client to prevent starting crash if API key is missing
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please verify it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Gita Guidance API Endpoint
app.post("/api/gita-guidance", async (req, res) => {
  try {
    const { category = "General", problem, language = "English" } = req.body;

    if (!problem || typeof problem !== "string" || problem.trim() === "") {
      res.status(400).json({ error: "Problem description is required." });
      return;
    }

    const trimmedProblem = problem.trim();
    const client = getGeminiClient();

    const systemInstruction = `You are an elevated spiritual guide and authority on the complete Bhagavad Gita. Your purpose is to help people deal with any real-world problems (such as mental stress, decision dilemmas, life choices, family, values, purpose, anxiety, physical issues, etc.) by matching them with the single most precise, relevant, and powerful shloka from any portion of the 18 chapters of the Bhagavad Gita.

Analyze the user's specific problem. Retrieve the most appropriate authentic Bhagavad Gita shloka that acts as the precise divine medicine for this trouble.

FORMULATE ALL OF YOUR LOWERPAYLOAD EXPLANATIONS, MEANINGS, ANALYSES, ACTION STEPS, AND SUMMARY NOTES IN CRITICAL LANGUAGE: Conversational Everyday Simple Hindi (आम बोलचाल की हिन्दी - NOT Shudh Sanskritized Hindi, and NOT English). 
- Use simple, easy to understand conversational Hindi words that common people use on their phones daily (e.g. use "चिंता/टेंशन", "काम", "सलाह", "मदद", "रास्ता", "मन", "सोच", "दिक्कत" etc.). Avoid complex high-vocabulary/Shudh words.
- Ensure the Sanskrit original text (shlokaSanskrit) is preserved in pure Sanskrit form.
- The Roman transliteration (shlokaTransliterated) should be in roman text.
- The "shlokaMeaning", "problemAnalysis", "actionableGuidance" (3 items), and "summaryNote" fields MUST be completely in simple, warm, conversational Hindi.

Formulate a response containing:
1. The exact shloka in Devanagari script (Sanskrit original).
2. The phonetic English transliteration of the shloka.
3. The exact chapter and verse number (e.g. "अध्याय 2, श्लोक 47").
4. The literal meaning/translation of the shloka in VERY SIMPLE everyday Hindi (सरल हिन्दी अर्थ).
5. A warm, empathetic, reassuring analysis relating the shloka directly to the user's problem in simple spoken Hindi.
6. A set of exactly 3 practical, simple, real-world action steps in simple spoken Hindi that the user can do today.
7. A comforting note of encouragement in simple spoken Hindi.

Always output response in the exact JSON schema requested. Do not include any markdown wrappers like \`\`\`json outside of the JSON payload.`;

    const prompt = `User's problem description: "${trimmedProblem}"
Context Classification (Optional): ${category}
Response Language constraint: Simple Conversational Hindi (सरल बोलचाल की हिन्दी)

Provide the answer in warm, extremely simple colloquial Hindi (आम बोलचाल की हिन्दी) so someone using a smartphone for the first time can read and understand it instantly.`;

    let response: any = null;
    let lastError: any = null;
    const modelsToTry = ["gemini-3.5-flash", "gemini-2.5-flash"];

    for (const currentModel of modelsToTry) {
      try {
        console.log(`Attempting to generate guidance using model: ${currentModel}`);
        response = await client.models.generateContent({
          model: currentModel,
          contents: prompt,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                shlokaSanskrit: {
                  type: Type.STRING,
                  description: "The authentic Sanskrit shloka in Devanagari script. Ensure correct spelling and sandhi."
                },
                shlokaTransliterated: {
                  type: Type.STRING,
                  description: "The phonetic Roman transliteration of the Sanskrit shloka with appropriate diacritics or standard phonetics."
                },
                chapterAndVerse: {
                  type: Type.STRING,
                  description: "The specific chapter and verse reference from the Bhagavad Gita (e.g., Chapter 6, Verse 5)."
                },
                shlokaMeaning: {
                  type: Type.STRING,
                  description: "The accurate, faithful English translation of the verse's absolute meaning."
                },
                problemAnalysis: {
                  type: Type.STRING,
                  description: "Detailed, empathetic synthesis mixing the scriptural meaning with the user's problem. Direct call to their current reality."
                },
                actionableGuidance: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 3 clear, highly practical, actionable steps combining Gita wisdom and psychological/physical care for their specific situation."
                },
                summaryNote: {
                  type: Type.STRING,
                  description: "A final comforting, inspiring, or motivating sentence of hope and resilience."
                }
              },
              required: ["shlokaSanskrit", "shlokaTransliterated", "chapterAndVerse", "shlokaMeaning", "problemAnalysis", "actionableGuidance", "summaryNote"]
            },
          },
        });

        if (response && response.text) {
          console.log(`Successfully generated guidance using model: ${currentModel}`);
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${currentModel} failed:`, err.message || err);
        lastError = err;
        // Wait briefly (1 second) before trying the fallback or next step
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    if (!response || !response.text) {
      console.log("Triggering final emergency retry with gemini-2.5-flash after cooldown...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      response = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              shlokaSanskrit: {
                type: Type.STRING,
                description: "The authentic Sanskrit shloka in Devanagari script. Ensure correct spelling and sandhi."
              },
              shlokaTransliterated: {
                type: Type.STRING,
                description: "The phonetic Roman transliteration of the Sanskrit shloka with appropriate diacritics or standard phonetics."
              },
              chapterAndVerse: {
                type: Type.STRING,
                description: "The specific chapter and verse reference from the Bhagavad Gita (e.g., Chapter 6, Verse 5)."
              },
              shlokaMeaning: {
                type: Type.STRING,
                description: "The accurate, faithful English translation of the verse's absolute meaning."
              },
              problemAnalysis: {
                type: Type.STRING,
                description: "Detailed, empathetic synthesis mixing the scriptural meaning with the user's problem. Direct call to their current reality."
              },
              actionableGuidance: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 3 clear, highly practical, actionable steps combining Gita wisdom and psychological/physical care for their specific situation."
              },
              summaryNote: {
                type: Type.STRING,
                description: "A final comforting, inspiring, or motivating sentence of hope and resilience."
              }
            },
            required: ["shlokaSanskrit", "shlokaTransliterated", "chapterAndVerse", "shlokaMeaning", "problemAnalysis", "actionableGuidance", "summaryNote"]
          },
        },
      });
    }

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response generated from the AI model.");
    }

    const guidanceData = JSON.parse(resultText);
    res.json(guidanceData);
  } catch (error: any) {
    console.error("Error in Gita Guidance logic API:", error);
    res.status(500).json({
      error: "Failed to generate Bhagavad Gita guide response.",
      details: error.message || "Unknown error"
    });
  }
});

// Serve static assets / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
