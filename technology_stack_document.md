# 📋 Project Design Phase-II: Technology Stack (Architecture & Stack)

**Date:** 5 July 2026  
**Project Name:** Nutrition Assistant  
**Marks:** 4 Marks  

---

## 🏗️ Technical Architecture Diagram

The diagram below details the 3-tier architecture of the Nutrition Assistant system, defining the demarcations between the local client, backend server logic, security middlewares, and the database tier.

```mermaid
graph TD
    %% Styling Definitions
    classDef client fill:#e0f7fa,stroke:#006064,stroke-width:2px;
    classDef server fill:#efebe9,stroke:#3e2723,stroke-width:2px;
    classDef security fill:#fff9c4,stroke:#f57f17,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;

    %% Client Tier
    subgraph Local Client (React Application)
        UI[User Interface: React.js App]:::client
        Router[React Router & Axios Client]:::client
    end

    %% Security Middleware
    subgraph Security Layer
        Auth[JWT Middleware / Auth Check]:::security
        Encrypt[Bcrypt Password Hashing]:::security
    end

    %% Backend Tier
    subgraph Backend Server (Node.js & Express.js)
        API[Express App / Router]:::server
        UController[User Controller]:::server
        NController[Nutrition Controller]:::server
    end

    %% Database Tier
    subgraph Data Tier (MongoDB / Atlas)
        Mongoose[Mongoose ODM]:::db
        DB[(MongoDB Database)]:::db
    end

    %% Flow Connections
    UI -->|1. User Interaction| Router
    Router -->|2. Secure HTTPS Requests| Auth
    Auth -->|3. Route Validation| API
    API -->|4. Business Logic| UController
    API -->|4. Business Logic| NController
    UController -->|5. Hash Verification| Encrypt
    UController -->|6. Map Schema| Mongoose
    NController -->|6. Map Schema| Mongoose
    Mongoose -->|7. Persist / Query Data| DB
```

---

## 📊 Table 1: Components & Technologies

| S.No | Component | Description | Technology |
|:---:|---|---|---|
| **1.** | **User Interface** | Provides the web UI for user registration, login, dashboard statistics, meal additions, and target configurations. | **HTML5, CSS3, JavaScript (ES6+), React.js, Axios, React Router** |
| **2.** | **Application Logic-1** | User Authentication & Account Security Logic. Manages registration, hashes passwords, generates JWT tokens, and protects private routes. | **Node.js, Express.js, jwt-simple, bcryptjs** |
| **3.** | **Application Logic-2** | Nutrition & Meal Logging Logic. Handles meal category routing, calculates cumulative daily nutrition totals, and filters user logs by date range. | **Node.js, Express.js** |
| **4.** | **Application Logic-3** | User Profile & Goal Tracking Logic. Saves user specifications (age, weight, height) and handles custom daily calorie budget updates. | **Node.js, Express.js** |
| **5.** | **Database** | Stores application schemas, user credentials, and daily nutritional logs locally. | **MongoDB (Local Server v6.0+), Mongoose ODM** |
| **6.** | **Cloud Database** | Cloud storage alternative to ensure data availability and synchronization across hosting platforms. | **MongoDB Atlas** |
| **7.** | **File Storage** | Storage mechanism for local project source files and static assets. | **Local Filesystem** |
| **8.** | **External API-1** | External integration interface for third-party tools. | *N/A (Not Applicable)* |
| **9.** | **External API-2** | External interface for third-party validation/services. | *N/A (Not Applicable)* |
| **10.** | **Machine Learning Model** | Smart model integration details. | *N/A (Not Applicable)* |
| **11.** | **Infrastructure (Server/Cloud)** | Hosts local environment and coordinates remote hosting server deployments. | **Localhost, Render (Backend API), Vercel (Frontend React Client)** |

---

## 📊 Table 2: Application Characteristics

| S.No | Characteristics | Description | Technology |
|:---:|---|---|---|
| **1.** | **Open-Source Frameworks** | Lists the open-source libraries and frameworks supporting the full-stack MERN workflow. | **React 18, Node.js (v18+), Express.js, Mongoose ODM** |
| **2.** | **Security Implementations** | Defines authentication mechanisms, password protections, and request-sharing policies. | **JWT (JSON Web Tokens) Session Tokens, Bcryptjs Hashing, Express CORS Middleware** |
| **3.** | **Scalable Architecture** | Justification of the multi-tier service structure to allow independent scaling. | **3-Tier Monorepo Architecture with separated Controllers, Models, and API Routes (MVC Pattern)** |
| **4.** | **Availability** | Design for server resilience, reliable database connection, and backups. | **MongoDB Atlas multi-region replication cluster, automated failovers, Process Process Manager (pm2)** |
| **5.** | **Performance** | Performance considerations to support higher requests/sec and decrease payload overhead. | **MongoDB Indexing on `userId` and `date`, React Virtual DOM updates, Gzip payload compression** |
