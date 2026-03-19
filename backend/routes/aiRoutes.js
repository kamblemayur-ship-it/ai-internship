const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const User = require('../models/User');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper function to prevent JSON.parse crashes from markdown formatting
const cleanAndParseJSON = (text) => {
  try {
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Failed to parse Gemini output:", text);
    throw new Error("AI returned invalid data format.");
  }
};

// Endpoint 1: Smart Allocation Logic (Student finds Companies)
router.post('/allocate/:userId', async (req, res) => {
  try {
    const student = await User.findById(req.params.userId);
    const companies = await User.find({ role: 'company' }); // Changed from Internship to Company

    if (!student || companies.length === 0) {
      return res.status(404).json({ message: 'Data missing for allocation.' });
    }

    let recommendations;

    try {
      // PRIMARY: Try the AI Engine
      const prompt = `Match student ${student.name} (Skills: ${student.skills.join(', ')}) 
                      against these companies and their required skills: ${JSON.stringify(companies)}. 
                      Return a JSON array of objects with _id, matchPercentage, and reason.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      recommendations = cleanAndParseJSON(response.text);

    } catch (aiError) {
      console.warn("AI Engine failed, switching to Fallback Algorithm:", aiError.message);
      
      // FALLBACK: Simple Keyword Overlap Logic
      recommendations = companies.map(company => {
        const matches = company.skills.filter(s => 
          student.skills.map(us => us.toLowerCase()).includes(s.toLowerCase())
        );
        const percentage = company.skills.length > 0 
          ? Math.round((matches.length / company.skills.length) * 100) 
          : 0;
        
        return {
          _id: company._id,
          matchPercentage: percentage || 10,
          reason: "Matched via local keyword analysis (AI Offline)."
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
    }

    res.status(200).json({ student: student.name, recommendations });

  } catch (error) {
    res.status(500).json({ message: 'Critical System Error', error: error.message });
  }
});

// Endpoint 2: Company Sourcing Logic (Company finds Students)
router.post('/company-matches/:companyId', async (req, res) => {
  try {
    const company = await User.findById(req.params.companyId);
    if (!company) return res.status(404).json({ message: 'Company not found.' });

    // Only fetch students who are 'Available'
    const students = await User.find({ role: 'student', status: 'Available' }).select('_id name email skills');
    
    if (students.length === 0) return res.status(400).json({ message: 'No available students.' });

    let topCandidates;

    try {
      const prompt = `
        You are an expert AI technical recruiter.
        The company is looking for candidates with these skills: ${company.skills.join(', ')}.
        
        Here is the list of available students in the database:
        ${JSON.stringify(students)}
        
        Analyze the skill overlap. Return a strict JSON object with a single key "topCandidates" containing an array of objects. 
        Each object must have: "_id", "name", "email", "matchPercentage" (integer), and "reason" (1 short sentence why they fit).
        Rank them from highest percentage to lowest. Only output valid JSON.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      topCandidates = cleanAndParseJSON(response.text).topCandidates;

    } catch (aiError) {
      console.warn("AI Engine failed, switching to Fallback Algorithm...", aiError.message);
      
      // FALLBACK: Simple Keyword Overlap Logic
      topCandidates = students.map(student => {
        const matches = company.skills.filter(s => 
          student.skills.map(us => us.toLowerCase()).includes(s.toLowerCase())
        );
        const percentage = company.skills.length > 0 
          ? Math.round((matches.length / company.skills.length) * 100) 
          : 0;
        
        return {
          _id: student._id,
          name: student.name,
          email: student.email,
          matchPercentage: percentage || 10, 
          reason: "Matched via local keyword analysis (AI Offline)."
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3);
    }

    res.status(200).json({ topCandidates });

  } catch (error) {
    res.status(500).json({ message: 'AI Engine failed to rank students.', error: error.message });
  }
});

// Endpoint 3: AI Chatbot Interface
router.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required." });

        const prompt = `You are a helpful AI assistant for a PM Internship allocation scheme. Answer this user query accurately and concisely: ${message}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt
        });

        res.status(200).json({ reply: response.text });
    } catch (error) {
         res.status(500).json({ message: 'Chatbot Error', error: error.message });
    }
});

module.exports = router;