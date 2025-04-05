require('dotenv').config();

const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const axios = require('axios');
const cheerio = require('cheerio');
const { google } = require('googleapis');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ dest: 'uploads/' });
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// Middleware to validate incoming requests
const validateInput = (req, res, next) => {
    const { interest, topic, message, skills, learningGoal, interests, experience } = req.body;
    if (!interest && !topic && !message && !skills && !learningGoal && !interests && !experience) {
        return res.status(400).json({ 
            error: 'Missing required input parameters',
            message: 'Please provide at least one of: interest, topic, message, skills, learningGoal, interests, or experience'
        });
    }
    if (req.path === '/api/chat' && !message) {
        return res.status(400).json({ 
            error: 'Missing required input',
            message: 'Please provide a message for the chatbot'
        });
    }
    next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({ 
        error: 'Server error', 
        message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message 
    });
};

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Learning Paths Endpoint (unchanged)
app.post('/api/learning-paths', validateInput, async (req, res, next) => {
    const { interest, skill = 'beginner', time = '5-10' } = req.body;
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [
                { 
                    role: 'system', 
                    content: `You are an expert educator creating detailed learning paths. 
                    Provide a structured learning path with 5 clear steps for ${interest || 'general studies'}.
                    For each step, provide a title and 3-5 specific subtopics or lessons.
                    Consider the user's skill level (${skill}) and available time (${time} hours per week).
                    Format your response for easy parsing, with clear step titles followed by subtopics.
                    The current date is March 23, 2025.` 
                },
                { role: 'user', content: `Create a detailed learning path for ${interest || 'general studies'}` }
            ],
            max_tokens: 800,
            temperature: 0.7
        });

        const rawPath = completion.choices[0].message.content;
        const steps = [];
        const sections = rawPath.split(/\n\s*\n/);
        
        for (const section of sections) {
            const lines = section.split('\n').filter(line => line.trim());
            if (lines.length < 2) continue;
            
            const title = lines[0].replace(/^\d+[\.\)]\s*|Step\s*\d+[\.\)]\s*/i, '').trim();
            const subtopics = lines.slice(1)
                .map(line => line.replace(/^[-•*]\s*/, '').trim())
                .filter(line => line && !line.match(/^Step\s*\d+/i));
            
            if (title && subtopics.length) steps.push({ title, subtopics });
        }
        
        if (!steps.length) {
            const lines = rawPath.split('\n').filter(line => line.trim());
            let currentStep = null;
            for (const line of lines) {
                const stepMatch = line.match(/^(?:Step\s*)?(\d+)[\.\)]\s*(.*)/i);
                if (stepMatch) {
                    if (currentStep) steps.push(currentStep);
                    currentStep = { title: stepMatch[2].trim(), subtopics: [] };
                } else if (currentStep && line.trim()) {
                    const subtopic = line.replace(/^[-•*]\s*/, '').trim();
                    if (subtopic) currentStep.subtopics.push(subtopic);
                }
            }
            if (currentStep && currentStep.subtopics.length) steps.push(currentStep);
        }
        
        res.json({ path: steps, skill, time, interest });
    } catch (error) {
        next(error);
    }
});

// Study Materials Endpoint
a
// Career Guidance Endpoint (unchanged)

// Chat Endpoint (unchanged)
app.post('/api/chat', validateInput, async (req, res, next) => {
    const { message, learningGoal } = req.body;
    try {
        const chatHistory = req.body.history || [];
        const messages = [
            { 
                role: 'system', 
                content: `You are an AI mentor helping students with their learning journey. 
                Provide helpful, educational responses that are concise but informative.
                Your goal is to assist with learning questions, provide guidance on study approaches, and offer career advice related to the user's learning goal (${learningGoal || 'general education'}).
                Limit responses to 2-3 paragraphs maximum.
                If the user asks about specific learning resources or career paths:
                1. Suggest concrete next steps
                2. Explain the benefits of that learning approach
                3. Explain how they can apply what they learn
                Keep your tone friendly, encouraging, and motivational.
                The current date is March 23, 2025.` 
            },
            ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: message }
        ];
        
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages,
            max_tokens: 350,
            temperature: 0.7
        });

        const reply = completion.choices[0].message.content;
        res.json({ 
            reply,
            message: { role: 'assistant', content: reply }
        });
    } catch (error) {
        next(error);
    }
});


// Apply error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});