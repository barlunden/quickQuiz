# quickQuiz

This project is a quiz app with user authentication, quizzes from the Open Trivia API, persistent scoring and statistics, a scoreboard, and a user card.

## Features

- **User Authentication and Registration**
  - JWT-based authentication
  - Login, logout, and registration of new users
  - Username (nickname) and email

- **Quiz**
  - Questions fetched from the Open Trivia API
  - Select category, difficulty, type, and number of questions
  - Quiz flow on a single page
  - Answer options are shuffled for each question
  - Results and correct answers are shown after completing the quiz

- **Statistics and Scoring**
  - Results are saved in a database (SQLite via Prisma)
  - User card shows nickname, total score, number of questions, percent correct and best category
  - User card updates automatically after each quiz

- **Scoreboard**
  - Two leaderboards: one for total score, one for highest percent correct (min. 10 questions)
  - Top 3 players and their best category shown on the home page
  - Accessible from the navigation menu

- **Challenge a Friend**
  - Modal to send a quiz challenge to a friend's email (mocked, no real email sent)

- **Modern UI**
  - Responsive, mobile-friendly, and visually appealing
  - Sidebar stats, animated scoreboard, and more

- **Technology**
  - Backend: Node.js, Express, Prisma ORM, SQLite, JWT, dotenv
  - Frontend: React (Vite), TypeScript, Context API

## Running the Project Locally

1. Install dependencies:
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
2. Start the backend:
   - `cd backend && npm run dev` (or similar)
3. Start the frontend:
   - `cd frontend && npm run dev`
4. Open the app at `http://localhost:5173` (or the port from Vite)

## Folder Structure
- backend - Express API, Prisma models, routes for auth, quiz, stats, scoreboard
- frontend - React app, routes, components, context, UI

## Possible Extensions
- Emplement the Challenge friends-function fully
- Quiz history
- More advanced scoreboard or stats
- Category-specific scoreboards
- Profile editing