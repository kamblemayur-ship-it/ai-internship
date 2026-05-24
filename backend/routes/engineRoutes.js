const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. FIXED IMPORT PATH
const Internship = require('../models/Internship'); 

const upload = multer({ storage: multer.memoryStorage() });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', protect, upload.single('resume'), async (req, res) => {
  try {
    const userPrompt = req.body.prompt || "Analyze my profile.";

    // 2. FIXED DATABASE QUERY (Matching your exact schema)
    const liveInternships = await Internship.find().select('_id role companyName description skills');
    console.log("DATABASE PAYLOAD TO AI:", liveInternships);
    
    if (!liveInternships || liveInternships.length === 0) {
        console.warn("Engine Warning: The MongoDB Internship collection is empty.");
    }
    const databaseContext = JSON.stringify(liveInternships);

    // 3. STRICT MAPPING PROMPT
    const systemInstruction = `You are Allo, a highly efficient AI allocation engine. You MUST output your response in strict JSON format. 
    
    CRITICAL DIRECTIVE: Here is the live database of available internships in our system:
    """
    ${databaseContext}
    """
    
    RULES:
    1. Analyze the candidate against the live database above. YOU MUST ONLY RECOMMEND INTERNSHIPS FROM THIS EXACT LIST.
    2. BE BRUTALLY CONCISE. Your "analysis" text must be a maximum of 2 short sentences. No fluff, no detailed breakdowns.
    3. If they do not match, leave the "matches" array empty.

    Use this EXACT JSON schema and do not miss any keys:
    {
      "analysis": "A brutally brief, maximum 2-sentence summary of their fit.",
      "matches": [
        {
          "id": "Exact _id from database",
          "title": "Exact role name from database",
          "company": "Exact companyName from database",
          "matchScore": 95,
          "reason": "One short, punchy sentence explaining why they match."
        }
      ]
    }`;

    const finalPrompt = `${systemInstruction}\n\nUser Query: ${userPrompt}`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } 
    }); 

    let result;
    if (req.file) {
      if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ message: 'Engine Error: Only PDF format is supported.' });
      }
      const pdfPart = {
        inlineData: { data: req.file.buffer.toString("base64"), mimeType: "application/pdf" }
      };
      result = await model.generateContent([finalPrompt, pdfPart]);
    } else {
      result = await model.generateContent(finalPrompt);
    }

    const responseText = result.response.text(); 
    res.status(200).json({ reply: responseText });

  } catch (error) {
    console.error("🚨 ENGINE CORE FAILURE:", error);
    res.status(500).json({ message: `Engine Error: ${error.message}` });
  }
});

module.exports = router;