// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const Groq = require('groq-sdk');
const path = require('path');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests and serve static frontend files
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Groq client with API key from environment variable
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Middleware for input validation
const validateInput = (req, res, next) => {
    const { interest, topic, message, skills } = req.body;
    
    if (!interest && !topic && !message && !skills) {
        return res.status(400).json({ 
            error: 'Missing required input parameters',
            message: 'Please provide at least one of: interest, topic, message, or skills'
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

// Endpoint for Learning Paths
app.post('/api/learning-paths', validateInput, async (req, res, next) => {
    const { interest, skill = 'beginner', time = '5-10' } = req.body;
    
    try {
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [
                { 
                    role: 'system', 
                    content: `You are an expert educator creating detailed learning paths. 
                    Provide a structured learning path with 5 clear steps.
                    For each step, provide a title and 3-5 specific subtopics or lessons.
                    Consider the user's skill level (${skill}) and available time (${time} hours per week).
                    Format your response for easy parsing, with clear step titles followed by subtopics.` 
                },
                { role: 'user', content: `Create a detailed learning path for ${interest || 'general studies'}` }
            ],
            max_tokens: 800,
            temperature: 0.7
        });

        const rawPath = completion.choices[0].message.content;
        
        // Parse the raw text response into structured data
        const steps = [];
        const sections = rawPath.split(/\n\s*\n/); // Split by double newlines
        
        for (const section of sections) {
            const lines = section.split('\n').filter(line => line.trim());
            if (lines.length < 2) continue; // Skip sections without enough content
            
            const titleLine = lines[0];
            const title = titleLine.replace(/^\d+[\.\)]\s*|Step\s*\d+[\.\)]\s*/i, '').trim();
            
            const subtopics = lines.slice(1)
                .map(line => line.replace(/^[-•*]\s*/, '').trim())
                .filter(line => line.length > 0 && !line.match(/^Step\s*\d+/i));
            
            if (title && subtopics.length > 0) {
                steps.push({ title, subtopics });
            }
        }
        
        // If parsing failed or returned no steps, try a simpler approach
        if (steps.length === 0) {
            const lines = rawPath.split('\n').filter(line => line.trim());
            let currentStep = null;
            
            for (const line of lines) {
                const stepMatch = line.match(/^(?:Step\s*)?(\d+)[\.\)]\s*(.*)/i);
                if (stepMatch) {
                    if (currentStep) steps.push(currentStep);
                    currentStep = { title: stepMatch[2].trim(), subtopics: [] };
                } else if (currentStep && line.trim().length > 0) {
                    const subtopic = line.replace(/^[-•*]\s*/, '').trim();
                    if (subtopic) currentStep.subtopics.push(subtopic);
                }
            }
            
            if (currentStep && currentStep.subtopics.length > 0) {
                steps.push(currentStep);
            }
        }
        
        res.json({ 
            path: steps,
            skill,
            time,
            interest
        });
    } catch (error) {
        next(error);
    }
});

// Endpoint for Study Materials
app.post('/api/study-materials', validateInput, async (req, res, next) => {
    const { topic } = req.body;
    const filterType = req.body.filter || 'all';
    
    try {
        const completion = await groq.chat.completions.create({
            model: 'mixtral-8x7b-32768',
            messages: [
                { 
                    role: 'system', 
                    content: `You are a curator recommending 6 high-quality study materials about ${topic || 'general studies'}.
                    ${filterType !== 'all' ? `Focus on ${filterType} resources.` : ''}
                    For each resource, provide:
                    1. Title - clear and descriptive
                    2. Description - 1-2 sentences explaining what the resource covers and its value
                    3. URL - if you don't know the exact URL, provide a reasonable placeholder URL
                    4. Type - categorize as: video, article, course, book, or tool
                    5. Level - categorize as: beginner, intermediate, or advanced
                    Format your response for easy parsing as JSON.` 
                },
                { role: 'user', content: `Recommend study materials for ${topic || 'general studies'}` }
            ],
            max_tokens: 1000,
            temperature: 0.6
        });

        const rawMaterials = completion.choices[0].message.content;
        
        // Try to extract structured data from the response
        let materials = [];
        
        // Try parsing as JSON first (in case the AI formatted it properly)
        try {
            const jsonMatch = rawMaterials.match(/```json\n([\s\S]*?)\n```/) || 
                             rawMaterials.match(/\[\n?\s*\{[\s\S]*\}\n?\s*\]/);
                             
            if (jsonMatch) {
                materials = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
        } catch (e) {
            console.log('JSON parsing failed, trying alternative parsing');
        }
        
        // If JSON parsing failed, try manual parsing
        if (!materials.length) {
            const sections = rawMaterials.split(/\n\s*\n|\n\d+\./);
            
            materials = sections.map(section => {
                const lines = section.split('\n').filter(l => l.trim());
                if (lines.length < 2) return null;
                
                const titleLine = lines[0].replace(/^\d+[\.\)]\s*/, '').trim();
                const descLine = lines.find(l => l.includes('Description') || l.includes('description') || 
                                               (!l.includes('Title') && !l.includes('URL') && 
                                                !l.includes('Type') && !l.includes('Level')));
                const urlLine = lines.find(l => l.includes('URL') || l.includes('url') || l.includes('http'));
                const typeLine = lines.find(l => l.includes('Type') || l.includes('type'));
                const levelLine = lines.find(l => l.includes('Level') || l.includes('level'));
                
                const title = titleLine.replace(/^Title:?\s*/i, '').trim();
                const description = descLine ? descLine.replace(/^Description:?\s*/i, '').trim() : 'No description provided';
                const url = urlLine ? extractUrl(urlLine) : 'https://example.com/resource'; 
                const type = typeLine ? extractValue(typeLine, 'Type') : 'article';
                const level = levelLine ? extractValue(levelLine, 'Level') : 'intermediate';
                
                return { title, description, url, type, level };
            }).filter(Boolean);
        }
        
        // If we still don't have materials, create a fallback
        if (!materials.length) {
            materials = [{
                title: `Resources for ${topic}`,
                description: 'We could not parse the AI response correctly. Please try a different search.',
                url: 'https://example.com',
                type: 'article',
                level: 'beginner'
            }];
        }
        
        res.json({ materials });
    } catch (error) {
        next(error);
    }
});

// Helper function to extract URLs from text
function extractUrl(text) {
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/) || 
                    text.match(/URL:?\s*([^\s]+)/i) || 
                    text.match(/link:?\s*([^\s]+)/i);
    return urlMatch ? urlMatch[1] : 'https://example.com/resource';
}

// Helper function to extract values from labeled lines
function extractValue(text, label) {
    return text.replace(new RegExp(`^${label}:?\\s*`, 'i'), '').trim();
}

// Endpoint for Career Guidance
app.post('/api/career-guidance', validateInput, async (req, res, next) => {
    const { skills, interests, experience } = req.body;
    
    try {
        const completion = await groq.chat.completions.create({
            model: 'mixtral-8x7b-32768',
            messages: [
                { 
                    role: 'system', 
                    content: `You are a career advisor providing personalized career recommendations.
                    Based on the user's skills (${skills}), interests (${interests}), and experience (${experience}),
                    suggest 3-5 career paths that would be a good match.
                    
                    For each career suggestion, provide:
                    1. Title - the job title or career path
                    2. Description - why this is a good match based on their background (2-3 sentences)
                    3. Match - a percentage indicating how well their profile matches (70-95%)
                    4. Growth - job growth outlook (High, Medium, or Low)
                    
                    Format your response for easy parsing as JSON.` 
                },
                { role: 'user', content: `Suggest career paths based on my skills (${skills}), interests (${interests}), and experience (${experience})` }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const rawCareers = completion.choices[0].message.content;
        
        // Try to parse the response
        let careers = [];
        
        // Try parsing as JSON first
        try {
            const jsonMatch = rawCareers.match(/```json\n([\s\S]*?)\n```/) || 
                             rawCareers.match(/\[\n?\s*\{[\s\S]*\}\n?\s*\]/);
                             
            if (jsonMatch) {
                careers = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            }
        } catch (e) {
            console.log('JSON parsing failed, trying alternative parsing');
        }
        
        // If JSON parsing failed, try manual parsing
        if (!careers.length) {
            const sections = rawCareers.split(/\n\s*\n|\n\d+\./);
            
            careers = sections.map(section => {
                const lines = section.split('\n').filter(l => l.trim());
                if (lines.length < 2) return null;
                
                const titleLine = lines[0].replace(/^\d+[\.\)]\s*/, '').trim();
                const descLines = lines.filter(l => !l.includes('Title') && !l.includes('Match') && 
                                                 !l.includes('Growth') && l !== titleLine);
                const matchLine = lines.find(l => l.includes('Match'));
                const growthLine = lines.find(l => l.includes('Growth'));
                
                const title = titleLine.replace(/^Title:?\s*/i, '').trim();
                const description = descLines.join(' ').replace(/^Description:?\s*/i, '').trim();
                
                // Extract match percentage
                let match = '85%';
                if (matchLine) {
                    const matchMatch = matchLine.match(/(\d+)%/);
                    if (matchMatch) match = matchMatch[1];
                }
                
                // Extract growth outlook
                let growth = 'Medium';
                if (growthLine) {
                    if (growthLine.toLowerCase().includes('high')) growth = 'High';
                    else if (growthLine.toLowerCase().includes('low')) growth = 'Low';
                }
                
                return { title, description, match, growth };
            }).filter(Boolean);
        }
        
        // If we still don't have careers, create fallbacks
        if (!careers.length) {
            careers = [
                {
                    title: 'Career Analyst',
                    description: `Based on your skills in ${skills} and interests in ${interests}, this could be a good match.`,
                    match: '80%',
                    growth: 'Medium'
                },
                {
                    title: 'Technology Specialist',
                    description: `With your experience level (${experience}) and skills, this path offers good opportunities.`,
                    match: '75%',
                    growth: 'High'
                }
            ];
        }
        
        res.json({ careers });
    } catch (error) {
        next(error);
    }
});

// Chatbot endpoint
app.post('/api/chat', validateInput, async (req, res, next) => {
    const { message } = req.body;
    
    try {
        // Use conversation history if provided
        const chatHistory = req.body.history || [];
        
        // Format the chat history for AI API
        const messages = [
            { 
                role: 'system', 
                content: `You are an AI mentor helping students with their learning journey. 
                Provide helpful, educational responses that are concise but informative.
                Your goal is to assist with learning questions, provide guidance on study approaches, and offer career advice.
                Limit responses to 2-3 paragraphs maximum.
                
                If the user asks about specific learning resources or career paths:
                1. Suggest concrete next steps they can take
                2. Explain the benefits of that learning approach
                3. Explain how they can apply what they learn
                
                Keep your tone friendly, encouraging, and motivational while remaining professional.`
            },
            ...chatHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: message }
        ];
        
        // Call AI API
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: messages,
            max_tokens: 350,
            temperature: 0.7
        });

        const reply = completion.choices[0].message.content;
        
        // Return the AI response
        res.json({ 
            reply,
            message: {
                role: 'assistant',
                content: reply
            }
        });
    } catch (error) {
        next(error);
    }
});

// Fallback route to serve index.html for SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Apply error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`AI Mentor server running at http://localhost:${port}`);
});