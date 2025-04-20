<<<<<<< HEAD
document.addEventListener('DOMContentLoaded', () => {
    console.log('[DEBUG] DOM fully loaded');
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const mobileNav = document.querySelector('#mobile-nav');
    const themeToggle = document.querySelector('.theme-toggle');

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    initPageSpecific();

    function toggleMobileMenu() {
        mobileNav.classList.toggle('active');
        console.log('[DEBUG] Mobile menu toggled:', mobileNav.classList.contains('active') ? 'open' : 'closed');
    }

    document.addEventListener('click', (e) => {
        if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target) && mobileNav.classList.contains('active')) {
            mobileNav.classList.remove('active');
        }
    });

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
    }
});

function getElementOrWarn(id) {
    const element = document.getElementById(id);
    if (!element) console.warn(`[WARN] Element with ID '${id}' not found`);
    return element;
}

function validateFormInput(value, fieldName) {
    if (!value || value.trim() === '') {
        console.warn(`[WARN] ${fieldName} is empty`);
=======
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
const mobileMenuButton = document.querySelector('.mobile-menu');
const mobileNav = document.querySelector('.mobile-nav');
const themeToggle = document.querySelector('.theme-toggle');

let learningChatHistory = [];
let conversationStarted = false;
let currentLearningGoal = '';

function logDebug(message) { console.log(`[DEBUG] ${message}`); }
function getElementOrWarn(id) {
    const element = document.getElementById(id);
    if (!element) console.warn(`Element with ID '${id}' not found`);
    return element;
}
function validateFormInput(value, fieldName) {
    if (!value.trim()) {
        alert(`Please enter a valid ${fieldName}`);
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
        return false;
    }
    return true;
}

<<<<<<< HEAD
=======
document.addEventListener('DOMContentLoaded', () => {
    logDebug('Initializing application');
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initPageSpecific();
    checkMobile();
    logDebug('Application initialized');
});

function initTheme() {
    logDebug('Initializing theme');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    themeToggle.addEventListener('click', () => {
        logDebug('Toggling theme');
        document.body.classList.toggle('dark-theme');
        const newTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

function initMobileMenu() {
    logDebug('Setting up mobile menu');
    mobileMenuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileNav.classList.toggle('active');
        logDebug('Mobile menu toggled');
    });
    document.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        logDebug('Mobile menu closed via outside click');
    });
}

function initSmoothScroll() {
    logDebug('Initializing smooth scroll');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                const targetId = href.substring(1);
                document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.location.href = href;
            }
            mobileNav.classList.remove('active');
        });
    });
}

>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
function initPageSpecific() {
    const path = window.location.pathname.split('/').pop();
    switch (path) {
        case 'learning-path.html':
            initLearningPath();
            break;
        case 'study-materials.html':
            initStudyMaterials();
            break;
        case 'faqs.html':
            initFAQs();
            break;
        case 'career-guidance.html':
            initCareerGuidance();
            break;
        case 'dashboard.html':
<<<<<<< HEAD
=======
            // Dashboard-specific logic if needed
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
            break;
    }
}

function initLearningPath() {
<<<<<<< HEAD
    const learningForm = getElementOrWarn('learning-form');
    if (learningForm) learningForm.addEventListener('submit', (e) => { e.preventDefault(); generateLearningPath(); });
}

async function generateLearningPath() {
    const interest = getElementOrWarn('interest')?.value;
    const skill = getElementOrWarn('skill')?.value;
    const time = getElementOrWarn('time')?.value;
    const learningResult = getElementOrWarn('learning-result');
    if (!validateFormInput(interest, 'interest') || !learningResult) return;

    learningResult.innerHTML = '<p>Generating learning path...</p>';
=======
    const interestForm = getElementOrWarn('interest-form');
    const learningChatInput = getElementOrWarn('learning-chat-input');
    if (interestForm) interestForm.addEventListener('submit', (e) => { e.preventDefault(); generateLearningPath(); });
    if (learningChatInput) learningChatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendLearningMessage(); });
}

async function generateLearningPath() {
    const skillLevel = getElementOrWarn('skill-level')?.value;
    const learningGoal = getElementOrWarn('learning-goal')?.value;
    const weeklyTime = getElementOrWarn('weekly-time')?.value;
    if (!validateFormInput(learningGoal, 'learning goal')) return;

    currentLearningGoal = learningGoal;
    const chatOutput = getElementOrWarn('learning-chat-output');
    const chatContainer = document.querySelector('.chat-container');
    const learningPathContainer = document.querySelector('.learning-path-container');
    if (!chatOutput || !chatContainer || !learningPathContainer) return;

    const message = `Generating a learning path for ${learningGoal} with a skill level of ${skillLevel} and ${weeklyTime} hours per week available.`;
    chatOutput.innerHTML += `<div class="chat-message user"><p>${message}</p></div>`;
    learningChatHistory.push({ role: 'user', content: message });

    if (!conversationStarted) {
        conversationStarted = true;
        learningPathContainer.classList.add('conversation-active');
        chatContainer.classList.add('expanded');
    }
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4

    try {
        const response = await fetch('/api/learning-paths', {
            method: 'POST',
<<<<<<< HEAD
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ interest, skill, time })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        learningResult.innerHTML = `
            <h3>Learning Path for ${data.interest}</h3>
            <p>Skill Level: ${data.skill} | Time Commitment: ${data.time} hours/week</p>
            <ol>${data.path.map(step => `<li><strong>${step.title}</strong><ul>${step.subtopics.map(sub => `<li>${sub}</li>`).join('')}</ul></li>`).join('')}</ol>
        `;
    } catch (error) {
        learningResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function initStudyMaterials() {
    const materialsForm = getElementOrWarn('materials-form');
    if (materialsForm) materialsForm.addEventListener('submit', (e) => { e.preventDefault(); fetchStudyMaterials(); });
}

async function fetchStudyMaterials() {
    const topic = getElementOrWarn('topic')?.value;
    const filter = getElementOrWarn('filter')?.value;
    const materialsResult = getElementOrWarn('materials-result');
    if (!validateFormInput(topic, 'topic') || !materialsResult) return;

    materialsResult.innerHTML = '<p>Fetching study materials...</p>';
=======
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ interest: learningGoal, skill: skillLevel, time: weeklyTime })
        });

        if (!response.ok) throw new Error('Failed to fetch learning path');
        const data = await response.json();
        const pathOutput = data.path.map((step, index) => 
            `<strong>Step ${index + 1}: ${step.title}</strong><br>${step.subtopics.map(sub => `- ${sub}`).join('<br>')}`
        ).join('<br><br>');
        chatOutput.innerHTML += `<div class="chat-message bot"><p style="white-space: pre-line;">Here’s your learning path for ${learningGoal}:<br><br>${pathOutput}</p></div>`;
        learningChatHistory.push({ role: 'assistant', content: `Here’s your learning path for ${learningGoal}:\n\n${data.path.map((step, index) => `Step ${index + 1}: ${step.title}\n${step.subtopics.map(sub => `- ${sub}`).join('\n')}`).join('\n\n')}` });
    } catch (error) {
        chatOutput.innerHTML += `<div class="chat-message bot"><p>Error: ${error.message}</p></div>`;
    }
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

async function sendLearningMessage() {
    const input = getElementOrWarn('learning-chat-input')?.value.trim();
    if (!input) return;

    const chatOutput = getElementOrWarn('learning-chat-output');
    const chatContainer = document.querySelector('.chat-container');
    const learningPathContainer = document.querySelector('.learning-path-container');
    if (!chatOutput || !chatContainer || !learningPathContainer) return;

    chatOutput.innerHTML += `<div class="chat-message user"><p>${input}</p></div>`;
    learningChatHistory.push({ role: 'user', content: input });
    learningChatInput.value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;

    if (!conversationStarted) {
        conversationStarted = true;
        learningPathContainer.classList.add('conversation-active');
        chatContainer.classList.add('expanded');
    }

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, history: learningChatHistory, learningGoal: currentLearningGoal })
        });

        if (!response.ok) throw new Error('Chat response failed');
        const data = await response.json();
        chatOutput.innerHTML += `<div class="chat-message bot"><p style="white-space: pre-line;">${data.reply}</p></div>`;
        learningChatHistory.push({ role: 'assistant', content: data.reply });
    } catch (error) {
        chatOutput.innerHTML += `<div class="chat-message bot"><p>Error: ${error.message}</p></div>`;
    }
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function initStudyMaterials() {
    const materialsSearchInput = getElementOrWarn('materials-search');
    if (materialsSearchInput) materialsSearchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMaterials(); });
    initializeFilterButtons();
}

function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-selection .filter-btn');
    filterButtons.forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
        btn.addEventListener('click', handleFilterClick);
    });
}

function handleFilterClick(event) {
    const btn = event.target;
    const searchTerm = getElementOrWarn('materials-search')?.value.trim();
    if (!validateFormInput(searchTerm, 'search term')) return;

    document.querySelectorAll('.filter-selection .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    fetchMaterials(searchTerm, filter);
}

async function searchMaterials() {
    const searchTerm = getElementOrWarn('materials-search')?.value.trim();
    if (!validateFormInput(searchTerm, 'search term')) return;

    const materialsBox = document.querySelector('.materials-box');
    const filterSelection = document.querySelector('.filter-selection');
    const placeholderMessage = document.querySelector('.placeholder-message');
    if (!materialsBox || !filterSelection || !placeholderMessage) return;

    filterSelection.style.display = 'block';
    placeholderMessage.style.display = 'none';

    const activeFilter = document.querySelector('.filter-selection .filter-btn.active')?.dataset.filter;
    if (activeFilter) {
        await fetchMaterials(searchTerm, activeFilter);
        return;
    }

    materialsBox.innerHTML = `
        <div class="search-container">
            <input type="text" id="materials-search" placeholder="Search for topics (e.g., Python, AI)..." value="${searchTerm}">
            <button onclick="searchMaterials()" class="cta-button">Search</button>
        </div>
        <div class="filter-selection">
            <h3>Select Study Material Type</h3>
            <button class="filter-btn" data-filter="all">All</button>
            <button class="filter-btn" data-filter="book">Books</button>
            <button class="filter-btn" data-filter="article">Articles</button>
            <button class="filter-btn" data-filter="course">Courses</button>
            <button class="filter-btn" data-filter="video">Videos</button>
        </div>
    `;
    initializeFilterButtons();
}

async function fetchMaterials(searchTerm, filter) {
    const materialsBox = document.querySelector('.materials-box');
    if (!materialsBox) return;
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4

    try {
        const response = await fetch('/api/study-materials', {
            method: 'POST',
<<<<<<< HEAD
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic, filter })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        let html = `<h3>Study Materials for "${topic}"</h3>`;
        if (data.books) html += `<h4>Books</h4><ul>${data.books.map(b => `<li><a href="${b.link}" target="_blank">${b.title}</a> by ${b.authors.join(', ')} - ${b.source}</li>`).join('')}</ul>`;
        if (data.articles) html += `<h4>Articles</h4><ul>${data.articles.map(a => `<li><a href="${a.link}" target="_blank">${a.title}</a> by ${a.authors.join(', ')} - ${a.source}</li>`).join('')}</ul>`;
        if (data.courses) html += `<h4>Courses</h4><ul>${data.courses.map(c => `<li><a href="${c.link}" target="_blank">${c.title}</a> - ${c.source}</li>`).join('')}</ul>`;
        if (data.videos) html += `<h4>Videos</h4><ul>${data.videos.map(v => `<li><a href="${v.link}" target="_blank">${v.title}</a> by ${v.channel} - ${v.source} (${Math.floor(v.duration / 60)} min)</li>`).join('')}</ul>`;
        
        materialsResult.innerHTML = html || '<p>No materials found.</p>';
    } catch (error) {
        materialsResult.innerHTML = `<p>Error: ${error.message}</p>`;
=======
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: searchTerm, filter })
        });

        if (!response.ok) throw new Error('Failed to fetch materials');
        const data = await response.json();

        const formatUrl = (url) => {
            try {
                new URL(url);
                return url;
            } catch {
                return '#';
            }
        };

        materialsBox.innerHTML = `
            <div class="search-container">
                <input type="text" id="materials-search" placeholder="Search for topics (e.g., Python, AI)..." value="${searchTerm}">
                <button onclick="searchMaterials()" class="cta-button">Search</button>
            </div>
            <div class="filter-selection">
                <h3>Select Study Material Type</h3>
                <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="filter-btn ${filter === 'book' ? 'active' : ''}" data-filter="book">Books</button>
                <button class="filter-btn ${filter === 'article' ? 'active' : ''}" data-filter="article">Articles</button>
                <button class="filter-btn ${filter === 'course' ? 'active' : ''}" data-filter="course">Courses</button>
                <button class="filter-btn ${filter === 'video' ? 'active' : ''}" data-filter="video">Videos</button>
            </div>
            <h3>Recommended Resources for "${searchTerm}"</h3>
            ${Object.entries(data).flatMap(([type, resources]) => 
                resources.map(resource => `
                    <div class="search-result ${type}">
                        <span class="material-type">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <h4>${resource.title}</h4>
                        <p>
                            ${resource.description || 'No description available'} 
                            ${resource.authors ? `(Author(s): ${resource.authors.join(', ')})` : resource.channel ? `(Channel: ${resource.channel})` : resource.instructor ? `(Instructor: ${resource.instructor})` : ''}
                            ${resource.duration ? ` - Duration: ${Math.floor(resource.duration / 60)} min ${resource.duration % 60} sec` : ''}
                        </p>
                        <div class="button-container">
                            <a href="${formatUrl(resource.link)}" target="_blank" class="cta-button">View Resource</a>
                            <button class="cta-button learn-more-btn" onclick="getStudyDetails(this, '${resource.title.replace(/'/g, "\\'")}')">Learn More</button>
                        </div>
                        <div class="learn-more-content" style="display: none;"></div>
                        <p class="source">Source: ${resource.source}</p>
                    </div>
                `)
            ).join('')}
        `;
        initializeFilterButtons();
    } catch (error) {
        materialsBox.innerHTML = `
            <div class="search-container">
                <input type="text" id="materials-search" placeholder="Search for topics (e.g., Python, AI)..." value="${searchTerm}">
                <button onclick="searchMaterials()" class="cta-button">Search</button>
            </div>
            <div class="filter-selection">
                <h3>Select Study Material Type</h3>
                <button class="filter-btn ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="filter-btn ${filter === 'book' ? 'active' : ''}" data-filter="book">Books</button>
                <button class="filter-btn ${filter === 'article' ? 'active' : ''}" data-filter="article">Articles</button>
                <button class="filter-btn ${filter === 'course' ? 'active' : ''}" data-filter="course">Courses</button>
                <button class="filter-btn ${filter === 'video' ? 'active' : ''}" data-filter="video">Videos</button>
            </div>
            <p>Error: ${error.message}</p>
        `;
        initializeFilterButtons();
    }
}

async function getStudyDetails(button, title) {
    const searchResult = button.closest('.search-result');
    const learnMoreContent = searchResult.querySelector('.learn-more-content');
    if (!searchResult || !learnMoreContent) return;

    // Toggle visibility if content already exists
    if (learnMoreContent.innerHTML.trim()) {
        learnMoreContent.style.display = learnMoreContent.style.display === 'none' ? 'block' : 'none';
        button.textContent = learnMoreContent.style.display === 'none' ? 'Learn More' : 'Hide Details';
        return;
    }

    try {
        button.disabled = true;
        button.textContent = 'Loading...';

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `Tell me more about ${title}` })
        });

        if (!response.ok) throw new Error('Failed to fetch details');
        const data = await response.json();

        learnMoreContent.innerHTML = `
            <h5>More About ${title}</h5>
            <p>${data.reply}</p>
        `;
        learnMoreContent.style.display = 'block';
        button.textContent = 'Hide Details';
    } catch (error) {
        learnMoreContent.innerHTML = `<p>Error: ${error.message}</p>`;
        learnMoreContent.style.display = 'block';
        button.textContent = 'Hide Details';
    } finally {
        button.disabled = false;
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
    }
}

function initFAQs() {
<<<<<<< HEAD
    const faqForm = getElementOrWarn('faq-form');
    if (faqForm) faqForm.addEventListener('submit', (e) => { e.preventDefault(); generateFAQs(); });
}

async function generateFAQs() {
    const faqResult = getElementOrWarn('faq-result');
    if (!faqResult) return;

    faqResult.innerHTML = '<p>Generating FAQs...</p>';
=======
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question && otherQuestion.parentElement.classList.contains('active')) {
                    otherQuestion.parentElement.classList.remove('active');
                }
            });
        });
    });

    const generateButton = getElementOrWarn('generate-faqs-btn');
    if (generateButton) generateButton.addEventListener('click', uploadFile);
}

async function uploadFile() {
    const fileInput = getElementOrWarn('faq-file-upload');
    const generatedFaqsContainer = getElementOrWarn('generated-faqs');
    if (!fileInput || !generatedFaqsContainer) return;

    const files = fileInput.files;
    if (files.length === 0) {
        alert('Please select a PDF or Word document to upload.');
        return;
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const invalidFiles = Array.from(files).filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
        alert('Only PDF (.pdf), Word (.doc), or Word (.docx) files are allowed.');
        return;
    }

    generatedFaqsContainer.innerHTML = '<p>Processing your files...</p>';

    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4

    try {
        const response = await fetch('/api/faq-upload', {
            method: 'POST',
<<<<<<< HEAD
            body: new FormData(document.getElementById('faq-form'))
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        faqResult.innerHTML = data.questions.length 
            ? `<h3>Generated FAQs</h3><ul>${data.questions.map(q => `<li>${q}</li>`).join('')}</ul>` 
            : '<p>No questions generated.</p>';
    } catch (error) {
        faqResult.innerHTML = `<p>Error: ${error.message}</p>`;
=======
            body: formData
        });

        if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
        const data = await response.json();

        if (data.questions && data.questions.length > 0) {
            generatedFaqsContainer.innerHTML = data.questions.map(question => `
                <div class="faq-item">
                    <div class="faq-question">${question}</div>
                    <div class="faq-answer">
                        <p>Ask me for the answer!</p>
                        <button class="cta-button" onclick="askAboutFile('${question.replace(/'/g, "\\'")}')">Get Answer</button>
                    </div>
                </div>
            `).join('');
            initFAQs();
        } else {
            generatedFaqsContainer.innerHTML = '<p>No questions generated. Please try a different file.</p>';
        }
    } catch (error) {
        generatedFaqsContainer.innerHTML = `<p>Error: ${error.message}. Please try again.</p>`;
    }
}

async function askAboutFile(question) {
    const faqItems = document.querySelectorAll('.faq-item');
    let targetFaqItem = null;

    faqItems.forEach(item => {
        const faqQuestion = item.querySelector('.faq-question');
        if (faqQuestion && faqQuestion.textContent === question) {
            targetFaqItem = item;
        }
    });

    if (!targetFaqItem) return;

    const faqAnswer = targetFaqItem.querySelector('.faq-answer');
    if (!faqAnswer) return;

    faqAnswer.innerHTML = '<p>Loading answer...</p>';

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: `Tell me more about: ${question}` })
        });

        if (!response.ok) throw new Error('Failed to get answer');
        const data = await response.json();
        faqAnswer.innerHTML = `<p>${data.reply}</p>`;
        targetFaqItem.classList.add('active');
    } catch (error) {
        faqAnswer.innerHTML = `<p>Sorry, I couldn’t fetch the answer. Try again later.</p>`;
        targetFaqItem.classList.add('active');
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
    }
}

function initCareerGuidance() {
    const careerForm = getElementOrWarn('career-form');
<<<<<<< HEAD
    const appointmentForm = getElementOrWarn('appointment-form');
    if (careerForm) careerForm.addEventListener('submit', (e) => { e.preventDefault(); exploreCareers(); });
    if (appointmentForm) appointmentForm.addEventListener('submit', (e) => { e.preventDefault(); bookAppointment(); });
}

async function exploreCareers() {
=======
    if (careerForm) careerForm.addEventListener('submit', (e) => { e.preventDefault(); generateCareerRecommendations(); });
}

async function generateCareerRecommendations() {
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
    const skills = getElementOrWarn('skills')?.value;
    const interests = getElementOrWarn('interests')?.value;
    const experience = getElementOrWarn('experience')?.value;
    const careerResults = getElementOrWarn('career-results');
<<<<<<< HEAD
    if (!validateFormInput(skills, 'skills') || !validateFormInput(interests, 'interests') || !experience || !careerResults) return;

    careerResults.innerHTML = '<p>Exploring career options...</p>';
=======
    if (!validateFormInput(skills, 'skills') || !validateFormInput(interests, 'interests') || !careerResults) return;

    careerResults.innerHTML = '<p>Loading career recommendations...</p>';
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4

    try {
        const response = await fetch('/api/career-guidance', {
            method: 'POST',
<<<<<<< HEAD
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills, interests, experience })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        careerResults.innerHTML = `
            <h3>Career Options</h3>
            <ul>${data.careers.map(career => `
                <li>
                    <strong>${career.title}</strong> (${career.match} match)<br>
                    ${career.description}<br>
                    <em>Growth:</em> ${career.growth} | <em>Next Step:</em> ${career.solution}
                </li>`).join('')}
            </ul>`;
    } catch (error) {
        careerResults.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

async function bookAppointment() {
    const skills = getElementOrWarn('appt-skills')?.value;
    const interests = getElementOrWarn('appt-interests')?.value;
    const experience = getElementOrWarn('appt-experience')?.value;
    const date = getElementOrWarn('appt-date')?.value;
    const time = getElementOrWarn('appt-time')?.value;
    const appointmentResult = getElementOrWarn('appointment-result');
    if (!validateFormInput(skills, 'skills') || !validateFormInput(interests, 'interests') || 
        !experience || !validateFormInput(date, 'date') || !validateFormInput(time, 'time') || !appointmentResult) return;

    appointmentResult.innerHTML = '<p>Booking appointment...</p>';

    try {
        const response = await fetch('/api/book-appointment', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ skills, interests, experience, date, time })
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (data.success) {
            appointmentResult.innerHTML = `
                <p>${data.message}</p>
                <p><strong>Date:</strong> ${data.appointment.date}</p>
                <p><strong>Time:</strong> ${data.appointment.time}</p>
                <p><strong>Meeting Link:</strong> <a href="${data.appointment.meetingLink}" target="_blank">${data.appointment.meetingLink}</a></p>
            `;
        } else {
            appointmentResult.innerHTML = '<p>Booking failed.</p>';
        }
    } catch (error) {
        appointmentResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}
=======
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skills, interests, experience })
        });

        if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
        const data = await response.json();

        if (data.careers && Array.isArray(data.careers) && data.careers.length > 0) {
            careerResults.innerHTML = `
                <h3>Your Career Recommendations</h3>
                ${data.careers.map(career => `
                    <div class="career-card">
                        <h4>${career.title || 'Unknown Career'}</h4>
                        <p>${career.description || 'No description available.'}</p>
                        <div class="career-stats">
                            <span>Match: ${career.match || 'N/A'}</span>
                            <span>Growth: ${career.growth || 'N/A'}</span>
                            <span>Solution: ${career.solution || 'Explore relevant opportunities.'}</span>
                        </div>
                        <button class="cta-button" onclick="getChatbotHelp('Tell me more about ${career.title.replace(/'/g, "\\'")}')">Learn More</button>
                    </div>
                `).join('')}
            `;
        } else {
            careerResults.innerHTML = '<p>No valid career recommendations received. Please try different inputs.</p>';
        }
    } catch (error) {
        careerResults.innerHTML = `<p>Error loading recommendations: ${error.message}</p>`;
    }
}

async function getChatbotHelp(message) {
    const careerResults = getElementOrWarn('career-results');
    if (!careerResults) return;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });

        if (!response.ok) throw new Error('Chatbot response failed');
        const data = await response.json();
        careerResults.innerHTML += `
            <div class="chat-message bot">
                <p>${data.reply}</p>
            </div>
        `;
    } catch (error) {
        careerResults.innerHTML += `<p>Chatbot error: ${error.message}</p>`;
    }
}

function checkMobile() {
    const isMobile = window.innerWidth <= 768;
    mobileMenuButton.style.display = isMobile ? 'flex' : 'none';
    document.querySelector('.nav-links').style.display = isMobile ? 'none' : 'flex';
}
window.addEventListener('resize', checkMobile);
>>>>>>> 88703c34c8f34bf16c862a0a844d9b370f8becf4
