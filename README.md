# AI Mentor Hackbuzz

## Project Overview
AI Mentor Hackbuzz is a comprehensive web application designed to provide users with career guidance, learning paths, study materials, and various resources to support their professional development. The platform includes multiple interactive pages for different user roles, such as employees and learners, and offers a seamless user experience through well-structured navigation and resource management.

## Features
- Career guidance and counseling pages
- User authentication (login and signup)
- Dashboard for users to track progress and access resources
- FAQs and help sections for user support
- Learning paths tailored to user goals
- Study materials and resources organized for easy access
- Responsive design with consistent styling across pages

## Folder Structure
- `Public/`  
  Contains the main public-facing assets including HTML pages, CSS stylesheets, JavaScript files, and JSON resources.  
  - HTML files: Various pages like `career-guidance.html`, `dashboard.html`, `employee-login.html`, `faqs.html`, `index.html`, `learning-path.html`, `login.html`, `signup.html`, `study-materials.html`.  
  - CSS files: Stylesheets for each page located in `Public/css/`.  
  - JavaScript: Main script file `script.js`.  
  - JSON: `resources.json` for resource data.

- `AI/`  
  Contains a similar structure to `Public/` with additional server-side code and package management files.  
  - `AI/server.js`: Node.js server file to run the backend.  
  - `AI/package.json` and `AI/package-lock.json`: Node.js dependencies and lock files.  
  - `AI/Public/`: Public assets for the AI module mirroring the main `Public/` folder.

- Root Directory  
  - `server.js`: Main server file if applicable.  
  - `package.json` and `package-lock.json`: Project-level Node.js dependencies.  
  - `.gitignore`: Git ignore rules.

## Technologies Used
- HTML5 for markup
- CSS3 for styling
- JavaScript for client-side scripting
- Node.js for server-side runtime
- npm for package management

## Installation and Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sabari1510/AI-Mentor.git
   ```

2. **Navigate to the project directory:**
   ```bash
   cd AI-Mentor
   ```

3. **Install dependencies for the root project:**
   ```bash
   npm install
   ```

4. **Install dependencies for the AI module:**
   ```bash
   cd AI
   npm install
   cd ..
   ```

5. **Start the server:**
   ```bash
   node server.js
   ```
   or if you want to start the AI module server separately:
   ```bash
   cd AI
   node server.js
   ```

6. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```
   (Adjust the port if configured differently)

## Usage

- Use the navigation links on the homepage to access different sections such as career guidance, dashboard, FAQs, learning paths, and study materials.
- Login and signup pages allow user authentication.
- Dashboard provides personalized user information and progress tracking.
- Resources and study materials are accessible via dedicated pages.
- The application is designed to be responsive and user-friendly.

## Development Workflow

- Clone the repository and install dependencies.
- Make changes in the appropriate folders (`Public/` for frontend assets, `AI/` for backend and AI module).
- Test changes locally by running the server.
- Commit changes with clear messages.
- Push to the remote repository.

## Testing

- Manual testing by navigating through all pages and verifying functionality.
- Check responsiveness on different devices.
- Verify user authentication flows.
- Validate resource loading and display.

## Known Issues or Limitations

- The AI module is a separate git repository nested inside the main project (previously), now removed.
- Some pages may require further backend integration for full functionality.
- Testing coverage is manual; automated tests are not included.

## Contact and Support

For questions, issues, or contributions, please contact the project maintainer or open an issue on the GitHub repository.
