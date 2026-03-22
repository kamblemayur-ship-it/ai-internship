# AI Allocation Engine

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)

## Project Setup

### 1. Clone the Repository
Open your terminal and run:
\`\`\`bash
git clone https://github.com/kamblemayur-ship-it/ai-internship.git
cd ai-internship
\`\`\`

### 2. Backend Setup
The backend requires environment variables to connect to the database.
\`\`\`bash
cd backend
npm install
\`\`\`
**CRITICAL:** Create a file named `.env` inside the `backend` folder and add the keys provided by the project lead. Do not commit this file to GitHub.
\`\`\`text
PORT=5000
MONGODB_URI=your_database_string_here
JWT_SECRET=your_secret_here
GEMINI_API_KEY=your_api_key_here
\`\`\`

To start the backend server:
\`\`\`bash
node server.js
\`\`\`
*You should see "✅ MongoDB Connected Successfully" in the terminal.*

### 3. Frontend Setup
Open a new, separate terminal window.
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
Click the localhost link provided in the terminal to view the application in your browser.