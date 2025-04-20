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
        return false;
    }
    return true;
}

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
            break;
    }
}

function initLearningPath() {
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

    try {
        const response = await fetch('/api/learning-paths', {
            method: 'POST',
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

    try {
        const response = await fetch('/api/study-materials', {
            method: 'POST',
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
    }
}

function initFAQs() {
    const faqForm = getElementOrWarn('faq-form');
    if (faqForm) faqForm.addEventListener('submit', (e) => { e.preventDefault(); generateFAQs(); });
}

async function generateFAQs() {
    const faqResult = getElementOrWarn('faq-result');
    if (!faqResult) return;

    faqResult.innerHTML = '<p>Generating FAQs...</p>';

    try {
        const response = await fetch('/api/faq-upload', {
            method: 'POST',
            body: new FormData(document.getElementById('faq-form'))
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        faqResult.innerHTML = data.questions.length 
            ? `<h3>Generated FAQs</h3><ul>${data.questions.map(q => `<li>${q}</li>`).join('')}</ul>` 
            : '<p>No questions generated.</p>';
    } catch (error) {
        faqResult.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function initCareerGuidance() {
    const careerForm = getElementOrWarn('career-form');
    const appointmentForm = getElementOrWarn('appointment-form');
    if (careerForm) careerForm.addEventListener('submit', (e) => { e.preventDefault(); exploreCareers(); });
    if (appointmentForm) appointmentForm.addEventListener('submit', (e) => { e.preventDefault(); bookAppointment(); });
}

async function exploreCareers() {
    const skills = getElementOrWarn('skills')?.value;
    const interests = getElementOrWarn('interests')?.value;
    const experience = getElementOrWarn('experience')?.value;
    const careerResults = getElementOrWarn('career-results');
    if (!validateFormInput(skills, 'skills') || !validateFormInput(interests, 'interests') || !experience || !careerResults) return;

    careerResults.innerHTML = '<p>Exploring career options...</p>';

    try {
        const response = await fetch('/api/career-guidance', {
            method: 'POST',
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