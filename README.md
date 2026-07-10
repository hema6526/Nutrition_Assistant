# 🥗 Nutrition Assistant - MERN Full Stack Application

A complete full-stack web application for tracking daily nutrition, meal logs, and fitness goals with integrated analytics trend charts.

---

## 🎨 Application Dashboard Preview
Below is the running interface of the application dashboard:

![Nutrition Assistant Dashboard](./nutrition_dashboard_mockup.jpg)

---

## 🏗️ Project Structure
```
nutrition-assistant/
├── client/                     # Frontend React Client
│   ├── public/                 # Static public assets
│   └── src/
│       ├── components/         # Navigation bar and shared UI elements
│       ├── pages/              # Dashboard, AddMeal, Profile, Login, Register, Analytics
│       ├── App.js              # Application routing & auth handling
│       └── index.js            # React App entry point
├── server/                     # Backend API Server
│   ├── controllers/            # User & Nutrition business controllers
│   ├── middleware/             # Auth check middlewares (JWT verification)
│   ├── models/                 # Mongoose schemas (User.js, NutritionLog.js)
│   ├── routes/                 # API endpoint definitions
│   └── server.js               # Entry point configuration file
└── .gitignore                  # Global project gitignore
```

---

## 🚀 Features
*   **Target Metrics Dashboard:** Real-time progress trackers for Calories, Protein, Carbs, and Fats.
*   **Weekly Calorie Trend Graph:** Interactive SVG line chart with hover-sensitive tooltips displaying daily calorie values.
*   **Meal Logger:** Simple interface to log breakfast, lunch, dinner, or snacks with custom macro values.
*   **Advanced Analytics Page:** Toggleable weekly trend views for calorie budgets and macronutrient distribution line charts.
*   **Secure Authentication:** User signups, password hashing using Bcryptjs, and token-based API authentication using JWT.

---

## 💻 Tech Stack
*   **Frontend:** React 18, React Router, Axios, Custom CSS3, Inline SVGs.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB, Mongoose ODM.
*   **Security:** Bcryptjs, JWT (JSON Web Tokens), CORS.

---

## 🔧 Setup & Installation

### Prerequisites
*   Node.js (v14+)
*   MongoDB installed and running locally on port `27017`

### Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Set up the `.env` file (already provided):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nutrition-assistant
   JWT_SECRET=your_super_secret_jwt_key_change_this
   NODE_ENV=development
   ```
4. Start the API server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the React development client:
   ```bash
   npm start
   ```
   *The application will open automatically at `http://localhost:3000`.*

---

## 📡 API Endpoints

### 🔑 Authentication (`/api/users`)
*   `POST /register` — Register a new account.
*   `POST /login` — Log in and receive a JWT token.
*   `GET /profile` — Retrieve personal profile specs (Requires Auth Header).
*   `PUT /profile` — Update calorie targets and specs (Requires Auth Header).

### 🍏 Nutrition Tracking (`/api/nutrition`) (All require Auth Header)
*   `POST /meal` — Log a meal with food items.
*   `GET /today` — Retrieve today's daily log totals.
*   `GET /range` — Retrieve logs between specified dates for charting.
