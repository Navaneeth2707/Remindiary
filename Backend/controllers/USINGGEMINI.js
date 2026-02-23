import Groq from "groq-sdk";
import { parseDate } from "chrono-node";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";
import Entry from "../models/Entry.js";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

export const validatePromptInput = [
  body("input").isString().trim().isLength({ min: 1 }).escape(),
];

function extractDate(text) {
  return parseDate(text) || null;
}

async function callGroq(prompt) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(completion.choices[0].message.content);
}

export const handlePrompt = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  const input = sanitizeHtml(req.body.input, {
    allowedTags: [],
    allowedAttributes: {},
  });

  if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
    return res.status(400).json({
      success: false,
      error: "Invalid user ID",
    });
  }

  try {
    const scheduledDate = extractDate(input);

    const prompt = `
Analyze this user input:

"${input}"

Classify the content and extract tasks.

Return JSON:

{
"type":"diary | task | note | reminder",
"summary":"short summary",
"tasks":["task1","task2"]
}
`;

    const parsed = await callGroq(prompt);

    const entry = await Entry.create({
      userId: req.user.id,
      username: req.user.name,
      content: input,
      summary: parsed.summary || "",
      type: parsed.type || "note",
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      tags: [],
      scheduledFor: scheduledDate,
    });

    res.json({
      success: true,
      data: entry,
    });

  } catch (error) {
    console.error("Groq Error:", error.message || error);

    res.status(500).json({
      success: false,
      error: "Failed to process prompt",
    });
  }
};

export const getEntriesByDate = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: "Missing 'date'",
    });
  }

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await Entry.find({
      userId,
      scheduledFor: { $gte: start, $lte: end },
    });

    res.json({
      success: true,
      data: entries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch entries",
    });
  }
};

export const generateDiaryEntry = async (req, res) => {
  const { date, extraText } = req.body;

  const userId = req.user.id;
  const username = req.user.name;

  if (!userId) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized",
    });
  }

  if (!date) {
    return res.status(400).json({
      success: false,
      error: "Missing 'date'",
    });
  }

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const entries = await Entry.find({
      userId,
      scheduledFor: { $gte: start, $lte: end },
    });

    const entrySummaries =
      entries.map((e) => `• ${e.type}: ${e.summary}`).join("\n") ||
      "No entries.";

    const prompt = `
You are a diary writing assistant.

Date: ${new Date(date).toDateString()}

User notes and tasks:
${entrySummaries}

Extra context:
"${extraText}"

Return JSON:

{
"diaryText":"A short reflective diary entry",
"mood":"one word mood"
}
`;

    const parsed = await callGroq(prompt);

    const savedEntry = await Entry.create({
      userId,
      username,
      content: parsed.diaryText,
      summary: parsed.diaryText,
      type: "diary",
      scheduledFor: new Date(date),
      tags: ["auto-generated", "diary"],
      mood: parsed.mood,
      userInput: extraText,
    });

    res.json({
      success: true,
      diaryEntry: parsed.diaryText,
      saved: savedEntry,
    });

  } catch (error) {
    console.error("Diary Generation Error:", error.message || error);

    res.status(500).json({
      success: false,
      error: "Failed to generate diary entry",
    });
  }
};

export const getDiaryByDate = async (req, res) => {
  const { date } = req.query;
  const userId = req.user.id;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: "Missing 'date'",
    });
  }

  try {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const diary = await Entry.findOne({
      userId,
      type: "diary",
      scheduledFor: { $gte: start, $lte: end },
    });

    if (!diary) {
      return res.status(404).json({
        success: false,
        message: "No diary found",
      });
    }

    res.json({
      success: true,
      data: diary,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch diary",
    });
  }
};

export const getEntriesWithTaskTag = async (req, res) => {
  const userId = req.user.id;

  try {
    const entries = await Entry.find({ userId });

    res.json({
      success: true,
      data: entries,
    });

  } catch (error) {
    console.error("Get Tasks Error:", error.message || error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch entries",
    });
  }
};