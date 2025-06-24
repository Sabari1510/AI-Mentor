require('dotenv').config();

const express = require('express');
<<<<<<< HEAD
const mongoose = require('mongoose');
const session = require('express-session');
const bcrypt = require('bcrypt');
=======
const Groq = require('groq-sdk');
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
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

<<<<<<< HEAD
// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userAuth', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', UserSchema);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

const groq = new (require('groq-sdk'))({ apiKey: process.env.GROQ_API_KEY });
const upload = multer({ dest: 'uploads/' });
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

// Middleware to validate input
function validateInput(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'No input provided' });
    }
    next();
}

// Error handling middleware
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', message: err.message });
}

// Signup Route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.json({ success: false, message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ success: true });
});

// Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.json({ success: false, message: 'Invalid credentials' });
    }
    req.session.user = user;
    res.json({ success: true });
});

// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Check Session Route
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Serve index.html
=======
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
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

<<<<<<< HEAD
// Learning Paths Endpoint
=======
// Learning Paths Endpoint (unchanged)
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
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
<<<<<<< HEAD
                    The current date is March 26, 2025.` 
=======
                    The current date is March 23, 2025.` 
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
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
<<<<<<< HEAD
app.post('/api/study-materials', validateInput, async (req, res, next) => {
    const { topic, filter = 'all' } = req.body;

    try {
        const results = {};

        if (filter === 'all' || filter === 'book') {
            const googleBooks = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${topic}&maxResults=10`);
            const openLibrary = await axios.get(`https://openlibrary.org/search.json?q=${topic}&limit=10`);
            
            const books = [];
            if (googleBooks.status === 200) {
                googleBooks.data.items?.forEach(item => {
                    const volumeInfo = item.volumeInfo || {};
                    books.push({
                        title: volumeInfo.title || 'Unknown',
                        authors: volumeInfo.authors || ['Unknown'],
                        description: volumeInfo.description ? volumeInfo.description.slice(0, 200) + '...' : 'No description available',
                        link: volumeInfo.infoLink || '#',
                        source: 'Google Books'
                    });
                });
            }
            if (openLibrary.status === 200) {
                openLibrary.data.docs?.forEach(doc => {
                    books.push({
                        title: doc.title || 'Unknown',
                        authors: doc.author_name || ['Unknown'],
                        description: 'See Open Library for description',
                        link: doc.key ? `https://openlibrary.org${doc.key}` : '#',
                        source: 'Open Library'
                    });
                });
            }
            results.books = books.slice(0, 10);
        }

        if (filter === 'all' || filter === 'article') {
            const arxiv = await axios.get(`http://export.arxiv.org/api/query?search_query=all:${topic}&start=0&max_results=10`);
            const newsApi = await axios.get(`https://newsapi.org/v2/everything?q=${topic}&sortBy=relevancy&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`);
            
            const articles = [];
            if (arxiv.status === 200) {
                const $ = cheerio.load(arxiv.data, { xmlMode: true });
                $('entry').each((_, entry) => {
                    articles.push({
                        title: $(entry).find('title').text().trim() || 'Unknown',
                        authors: $(entry).find('author name').map((_, a) => $(a).text().trim()).get(),
                        description: $(entry).find('summary').text().trim().slice(0, 200) + '...' || 'No abstract available',
                        link: $(entry).find('id').text().trim() || '#',
                        source: 'arXiv'
                    });
                });
            }
            if (newsApi.status === 200) {
                newsApi.data.articles?.forEach(article => {
                    articles.push({
                        title: article.title || 'Unknown',
                        authors: [article.author || 'Unknown'],
                        description: article.description ? article.description.slice(0, 200) + '...' : 'No description available',
                        link: article.url || '#',
                        source: `News - ${article.source?.name || 'Unknown'}`
                    });
                });
            }
            results.articles = articles.slice(0, 10);
        }

        if (filter === 'all' || filter === 'course') {
            const classCentral = await axios.get(`https://www.classcentral.com/search?q=${topic}`, {
                headers: { "User-Agent": "Mozilla/5.0" }
            });
            
            const courses = [];
            if (classCentral.status === 200) {
                const $ = cheerio.load(classCentral.data);
                $('a.color-charcoal.course-name').slice(0, 10).each((_, course) => {
                    courses.push({
                        title: $(course).text().trim(),
                        instructor: 'Unknown',
                        description: 'Description not available',
                        link: `https://www.classcentral.com${$(course).attr('href')}`,
                        source: 'Class Central'
                    });
                });
            }
            results.courses = courses;
        }

        if (filter === 'all' || filter === 'video') {
            const searchResponse = await youtube.search.list({
                part: 'id,snippet',
                q: topic,
                maxResults: 25,
                type: 'video',
                relevanceLanguage: 'en',
                order: 'relevance',
                videoDuration: 'medium'
            });

            const videoIds = searchResponse.data.items
                .filter(item => item.id.kind === 'youtube#video')
                .map(item => item.id.videoId);

            const videosResponse = await youtube.videos.list({
                part: 'contentDetails,snippet',
                id: videoIds.join(',')
            });

            const videos = [];
            videosResponse.data.items.forEach(item => {
                const duration = parseDuration(item.contentDetails.duration);
                if (duration > 60) {
                    videos.push({
                        title: item.snippet.title,
                        channel: item.snippet.channelTitle,
                        description: item.snippet.description.slice(0, 200) + (item.snippet.description.length > 200 ? '...' : ''),
                        link: `https://www.youtube.com/watch?v=${item.id}`,
                        source: 'YouTube',
                        duration
                    });
                }
            });
            results.videos = videos.slice(0, 10);
        }

        res.json(results);
    } catch (error) {
        next(error);
    }
});

function parseDuration(duration) {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0) * 3600;
    const minutes = parseInt(match[2] || 0) * 60;
    const seconds = parseInt(match[3] || 0);
    return hours + minutes + seconds;
}

// Career Guidance Endpoint
app.post('/api/career-guidance', validateInput, async (req, res, next) => {
    const { skills, interests, experience } = req.body;
    if (!skills || !interests || !experience) {
        return res.status(400).json({
            error: 'Missing required fields',
            message: 'Please provide skills, interests, and experience'
        });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [
                { 
                    role: 'system', 
                    content: `You are an expert career advisor tasked with providing personalized, unique career recommendations based on the user's input.
                    Given the user's skills (${skills}), interests (${interests}), and experience (${experience}), suggest 3-5 distinct career paths that align closely with these attributes.
                    Avoid generic or repetitive titles—each career path should reflect a specific role or niche that matches the input.
                    For each career suggestion, provide:
                    1. Title - a specific job title or career path (e.g., "Machine Learning Engineer" instead of "AI Specialist")
                    2. Description - 2-3 sentences explaining why this career fits the user's skills, interests, and experience
                    3. Match - a percentage (70-95%) reflecting how well their profile suits this role
                    4. Growth - job growth outlook (High, Medium, Low) based on current trends as of March 26, 2025
                    5. Solution - a practical, actionable step to pursue this career (e.g., "Learn TensorFlow", "Network at industry events")
                    Return your response as a valid JSON array of objects (e.g., [{"title": "...", ...}, ...]), with no additional text outside the JSON.
                    Ensure the suggestions are diverse and tailored to the specific combination of skills, interests, and experience provided.` 
                },
                { 
                    role: 'user', 
                    content: `Suggest career paths based on my skills (${skills}), interests (${interests}), and experience (${experience}).` 
                }
            ],
            max_tokens: 1000,
            temperature: 0.7
        });

        const rawCareers = completion.choices[0].message.content;
        let careers = [];

        try {
            careers = JSON.parse(rawCareers);
            if (!Array.isArray(careers) || careers.length < 3) {
                throw new Error('Response is not a valid array or has fewer than 3 suggestions');
            }

            careers = careers.map(career => ({
                title: career.title || 'Unknown Career',
                description: career.description || `A role leveraging ${skills} and ${interests} with ${experience} experience.`,
                match: career.match || `${Math.floor(Math.random() * 26) + 70}%`,
                growth: career.growth || 'Medium',
                solution: career.solution || `Explore opportunities in ${interests}.`
            }));

            if (careers.length < 3) throw new Error('Insufficient valid career suggestions');
        } catch (e) {
            console.log('JSON parsing failed or invalid data:', e.message, 'Raw response:', rawCareers);
            careers = [
                {
                    title: `${interests.split(',')[0].trim()} Developer`,
                    description: `Leverage your ${skills} skills and ${experience} experience to build solutions in ${interests}.`,
                    match: '85%',
                    growth: 'High',
                    solution: `Master a key tool or framework related to ${skills}.`
                },
                {
                    title: `${interests.split(',')[0].trim()} Project Coordinator`,
                    description: `Use ${skills} and ${experience} experience to manage projects in ${interests}, bridging technical and strategic goals.`,
                    match: '80%',
                    growth: 'Medium',
                    solution: `Gain project management certification relevant to ${interests}.`
                },
                {
                    title: `${interests.split(',')[0].trim()} Research Analyst`,
                    description: `Apply ${skills} with ${experience} experience to analyze trends and innovations in ${interests}.`,
                    match: '78%',
                    growth: 'Medium',
                    solution: `Publish a research paper or blog on ${interests}.`
                }
            ];
        }

        const uniqueCareers = [];
        const seenTitles = new Set();
        for (const career of careers) {
            if (!seenTitles.has(career.title)) {
                uniqueCareers.push(career);
                seenTitles.add(career.title);
            }
        }
        res.json({ careers: uniqueCareers.slice(0, 5) });
    } catch (error) {
        next(error);
    }
});

// Chat Endpoint
=======
a
// Career Guidance Endpoint (unchanged)

// Chat Endpoint (unchanged)
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
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
<<<<<<< HEAD
                The current date is March 26, 2025.` 
=======
                The current date is March 23, 2025.` 
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6
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

<<<<<<< HEAD
// FAQ Upload Endpoint
app.post('/api/faq-upload', upload.array('files'), async (req, res, next) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });

        console.log(`Received ${files.length} files`);
        const fileContents = await Promise.all(files.map(async (file) => {
            try {
                console.log(`Processing file: ${file.originalname}, MIME: ${file.mimetype}`);
                if (file.mimetype === 'application/pdf') {
                    const dataBuffer = fs.readFileSync(file.path);
                    const pdfData = await pdfParse(dataBuffer);
                    return { name: file.originalname, content: pdfData.text.slice(0, 1500) };
                } else if (file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    const result = await mammoth.extractRawText({ path: file.path });
                    return { name: file.originalname, content: result.value.slice(0, 1500) };
                }
                return null;
            } catch (error) {
                console.error(`Error processing file ${file.originalname}:`, error);
                return null;
            } finally {
                fs.unlinkSync(file.path);
            }
        }));

        const validContents = fileContents.filter(content => content && content.content);
        if (!validContents.length) {
            return res.status(400).json({ error: 'No valid file content extracted' });
        }

        const combinedContent = validContents.map(c => `${c.name}:\n${c.content}`).join('\n\n');
        console.log(`Extracted content length: ${combinedContent.length} characters`);

        const completion = await groq.chat.completions.create({
            model: 'llama3-8b-8192',
            messages: [
                { 
                    role: 'system', 
                    content: `You are an AI assistant that generates questions from text content.
                    Based on the provided text, create 4-6 concise, relevant questions that reflect key topics or details.
                    Each question should be answerable based on the text and encourage understanding of the material.
                    Return your response as a JSON array of strings (e.g., ["Question 1?", "Question 2?", ...]) with no additional text outside the JSON.
                    The current date is March 26, 2025.` 
                },
                { 
                    role: 'user', 
                    content: `Generate questions from this text:\n${combinedContent}` 
                }
            ],
            max_tokens: 500,
            temperature: 0.6
        });

        const rawQuestions = completion.choices[0].message.content;
        let questions = [];

        try {
            questions = JSON.parse(rawQuestions);
            if (!Array.isArray(questions) || questions.length < 4) {
                throw new Error('Response is not a valid array or has fewer than 4 questions');
            }
        } catch (e) {
            console.error('Question JSON parsing failed:', e.message, 'Raw response:', rawQuestions);
            const jsonMatch = rawQuestions.match(/\[\s*"[^"]*"(?:\s*,\s*"[^"]*")*\s*\]/);
            if (jsonMatch) {
                questions = JSON.parse(jsonMatch[0]);
            } else {
                questions = [
                    "What is the main topic of the document?",
                    "How does the content relate to current trends as of 2025?",
                    "What key details are provided in the document?",
                    "What can be inferred from the information presented?",
                    "How might this content be applied practically?"
                ];
            }
        }

        if (questions.length < 4) {
            questions = questions.concat([
                "What is a significant takeaway from the text?",
                "What additional information could clarify this content?"
            ]).slice(0, 6);
        }

        console.log('Sending questions to client:', questions);
        res.json({ questions });
    } catch (error) {
        next(error);
    }
});
=======
>>>>>>> 0a5ebd43909b1105ec3a0f86f4bc08c78cc281f6

// Apply error handling middleware
app.use(errorHandler);

// Start the server
app.listen(port, () => {
    console.log(`Visit at http://localhost:${port}`);
});