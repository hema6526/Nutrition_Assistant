# 🥗 Project Documentation: Nutrition Assistant

## 1. Introduction
*   **Project Title:** Nutrition Assistant
*   **Team Members:** 
    *   [Your Name] — Lead Developer (Full Stack Development, Database Design, and API Integration)

---

## 2. Project Overview
*   **Purpose:** The Nutrition Assistant is a full-stack MERN application designed to help users track their daily dietary intake, manage fitness goals, and monitor macronutrients (Protein, Carbs, Fats) and calories in real time.
*   **Features:**
    *   **Dashboard Tracker:** Visualizes daily calorie and macronutrient budgets.
    *   **Authentication & Security:** Secure JWT session tokens and password hashing via Bcrypt.
    *   **Meal Logger:** Allows logging breakfasts, lunches, dinners, and snacks.
    *   **Profile Target Configurator:** Set customized target calorie limits based on personal goals.
    *   **Day-by-Day Analytics:** Interactive SVG charts showing calorie intake and macronutrient trends over the last 7 days with hover tooltips.

---

## 3. Architecture
*   **Frontend:** Built as a single-page React app (React 18). It utilizes **React Router** for clean page navigation, **Axios** to fetch data from backend REST endpoints, and custom styled **CSS3** components with embedded interactive SVG data visualizations.
*   **Backend:** Powered by a **Node.js** runtime using the **Express.js** web framework. The backend logic follows the MVC (Model-View-Controller) design pattern with separate folders for controllers, routes, models, and middlewares.
*   **Database:** Powered by **MongoDB** document storage and modeled using **Mongoose ODM**. It runs locally on port 27017 and hosts schemas for users and nutrition logs.

---

## 4. Setup Instructions
*   **Prerequisites:** 
    *   Node.js (v14+)
    *   MongoDB Server installed locally and running on port `27017`.
*   **Installation:**
    1.  **Clone / open the repository root folder:**
        ```bash
        cd nutrition-assistant
        ```
    2.  **Set up Backend environment variables:**
        Create a `.env` file inside the `server/` directory and add:
        ```env
        PORT=5000
        MONGODB_URI=mongodb://localhost:27017/nutrition-assistant
        JWT_SECRET=your_super_secret_jwt_key
        NODE_ENV=development
        ```
    3.  **Install dependencies:**
        *   In the `server/` directory, run: `npm install`
        *   In the `client/` directory, run: `npm install`

---

## 5. Folder Structure
```
nutrition-assistant/
├── client/                     # Frontend React Client
│   ├── public/                 # Static public assets
│   └── src/
│       ├── components/         # Navigation and shared UI components
│       ├── pages/              # Dashboard, AddMeal, Profile, Login, Register, Analytics
│       ├── App.js              # Application router component
│       └── index.js            # React App entry point
├── server/                     # Backend API Server
│   ├── controllers/            # User & Nutrition business logic
│   ├── middleware/             # Auth check middlewares
│   ├── models/                 # Mongoose schemas (User.js, NutritionLog.js)
│   ├── routes/                 # API Routes config files
│   ├── .env                    # Environment secrets config
│   └── server.js               # Entry point configuration file
└── .gitignore                  # Global project gitignore
```

---

## 6. Running the Application
To run the full stack locally:
*   **Backend Server:** Run inside the `server/` directory:
    ```bash
    npm start
    ```
    *(Runs backend on `http://localhost:5000`)*
*   **Frontend Client:** Run inside the `client/` directory:
    ```bash
    npm start
    ```
    *(Launches web application on `http://localhost:3000`)*

---

## 7. API Documentation

### 🔑 Authentication Routes (`/api/users`)
*   **`POST /api/users/register`** — Registers a new user.
    *   **Request Body:**
        ```json
        {
          "username": "testuser",
          "email": "test@gmail.com",
          "password": "password123"
        }
        ```
    *   **Response (201 Created):**
        ```json
        {
          "message": "User registered successfully",
          "token": "eyJhbGciOi...",
          "user": { "id": "60d...", "username": "testuser", "email": "test@gmail.com" }
        }
        ```
*   **`POST /api/users/login`** — Logs in an existing user.
    *   **Response (200 OK):**
        ```json
        {
          "message": "Login successful",
          "token": "eyJhbGciOi..."
        }
        ```

### 🍎 Nutrition Tracking Routes (`/api/nutrition`) (Requires Authorization Header)
*   **`POST /api/nutrition/meal`** — Logs a meal.
    *   **Request Body:**
        ```json
        {
          "date": "2026-07-04T12:00:00Z",
          "meals": [{
            "mealType": "breakfast",
            "foodItems": [{
              "name": "Oatmeal",
              "quantity": 1,
              "unit": "bowl",
              "calories": 300,
              "protein": 10,
              "carbs": 45,
              "fat": 5
            }]
          }]
        }
        ```
*   **`GET /api/nutrition/today`** — Retrieves today's accumulated totals and logs.
*   **`GET /api/nutrition/range`** — Retrieves logs by date range (used for analytics).

---

## 8. Authentication
*   Authentication is handled using **JSON Web Tokens (JWT)**.
*   Upon successful registration or login, the server responds with a signed token containing the user's ID.
*   The client stores this token in browser local storage (`localStorage`) and attaches it in the HTTP request headers (`x-auth-token` or standard auth headers) to authorize access to protected database logs.

---

## 9. User Interface
*   **Auth Pages:** Clean, card-based interface for user logins and registration.
*   **Dashboard:** Displays progress circles for calorie targets, and progress bars for protein, carbohydrate, and fat limits.
*   **Add Meal Panel:** A simple form with drop-down type lists (Breakfast, Lunch, etc.) and direct inputs for nutritional value fields.
*   **Analytics Page:** Features a interactive tabbed trend chart (Calorie / Macronutrients) with custom hover-sensitive tooltips displaying detailed historical values.

---

## 10. Testing
*   Testing is done manually by using browser client verification.
*   Endpoints are validated using local port testing tools to ensure database CRUD procedures (like adding meals and profile updates) output correct statuses and data schemas.

---

## 11. Screenshots or Demo
*   You can access your live demo dashboard by running your project locally and opening `http://localhost:3000` in your web browser.

---

## 12. Known Issues
*   **Local Database Dependency:** The application requires a local MongoDB server running on port `27017`. If MongoDB is stopped, the server will log a connection error and database features will fail.

---

## 13. Future Enhancements
*   **Nutritional API Integration:** Fetch calorie data from external sources (e.g. Edamam/USDA API) to lookup foods automatically.
*   **Graphical Tracking:** Render weekly/monthly progress history charts using library plugins.
