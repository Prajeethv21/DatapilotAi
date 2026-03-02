
# DataPilot AI
**Intelligent AI-powered Business Intelligence platform with conversational dashboards and automated data discovery**

![DataPilot AI](https://img.shields.io/badge/AI-Powered-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Security](https://img.shields.io/badge/Security-OWASP-red)

---

## Overview
DataPilot AI is a production-ready business intelligence platform that democratizes data analytics through conversational AI. The system employs a sophisticated multi-provider AI architecture powered by Google Gemini 2.0 Flash, Groq AI, and OpenAI for intelligent dashboard generation, automated dataset discovery, and natural language analytics - all through simple chat interactions.

## Architecture
The project comprises three primary layers:

### 1. Frontend Application
**React-based SPA with advanced UI components and real-time visualizations.**

**Key Features:**
- Flip-card authentication with protected routing
- Conversational AI chat interface with intent detection
- Real-time dashboard generation with interactive charts
- Custom cyberpunk UI components (CyberRadio, 3D Loader)
- Voice-enabled chat interactions
- Multi-format data upload (CSV, Excel)
- Export capabilities (PNG, PDF)
- Responsive design with dark cyberpunk theme

**Technology Stack:**
- React 18.2.0
- Vite 5.0.8 (build tool)
- Tailwind CSS 3.3.6
- Styled Components 6.3.11
- Framer Motion 10.16.16
- React Router DOM 6.30.3
- Recharts 2.10.3 (visualizations)

### 2. Backend API Server
**Express-based REST API with multi-provider AI routing and security hardening.**

**Core Capabilities:**
- Intelligent AI model routing (Gemini → Groq → OpenAI fallback)
- Natural language intent detection and classification
- Automated web dataset discovery and validation
- Data processing engine with type detection
- KPI calculation and insight generation
- Database connectivity (MySQL, PostgreSQL)
- OWASP Top 10 security compliance
- Rate limiting and request validation

**Architecture:**
- Service-oriented architecture
- RESTful API design
- Middleware-based security layers
- In-memory conversation management
- Modular service components

**Technology Stack:**
- Node.js + Express 4.18.2
- Google Generative AI SDK (@google/generative-ai 0.21.0)
- Groq SDK (groq-sdk 0.37.0)
- OpenAI SDK (openai 4.24.1)
- Helmet 7.1.0 (security headers)
- express-rate-limit 7.1.5
- express-validator 7.0.1

### 3. Data Processing Engine
**Intelligent data analysis and visualization recommendation system.**

**Features:**
- Automatic CSV/Excel parsing and validation
- Smart data type detection (temporal, numeric, categorical)
- Statistical analysis (mean, median, trends)
- Chart type recommendation based on data structure
- KPI extraction and calculation
- Missing value handling
- Outlier detection

**Technology Stack:**
- PapaParse 5.4.1 (CSV parsing)
- xlsx 0.18.5 (Excel processing)
- Multer 1.4.5 (file upload)
- csv-parser 3.0.0

---

## System Requirements

### Backend Server
- **Node.js** 16.0 or higher
- **npm** 8.0 or higher
- **RAM:** 2GB minimum
- **Storage:** 500MB free space
- **API Keys:** Google AI Studio, Groq Cloud, OpenAI (optional)

### Frontend Application
- **Node.js** 16.0 or higher
- **Modern Browser:** Chrome 90+, Firefox 88+, Edge 90+
- **Internet Connection:** Required for AI services

### Database (Optional)
- **MySQL** 8.0+ or **PostgreSQL** 12+
- Connection credentials for data integration

---

## Installation

### Backend Setup
**1. Navigate to server directory and install dependencies:**
```bash
cd server
npm install
```

**2. Configure environment variables:**
Create `.env` file in `server/` directory:
```env
# AI Provider API Keys
GEMINI_API_KEY=your_gemini_key_here
GROQ_API_KEY=your_groq_key_here
OPENAI_API_KEY=your_openai_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Database (Optional)
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=datapilot
```

**3. Start server:**
```bash
npm run dev
```
- **Server:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

### Frontend Setup
**1. Navigate to client directory and install dependencies:**
```bash
cd client
npm install
```

**2. Start development server:**
```bash
npm run dev
```
- **Application:** http://localhost:3000

### Full Stack Quick Start
From project root:
```bash
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000) concurrently.

---

## Configuration

### Backend (server/app.js)
```javascript
const PORT = process.env.PORT || 5000;
const UPLOAD_LIMIT = '5mb';
const RATE_LIMIT_WINDOW = 5 * 60 * 1000; // 5 minutes
const RATE_LIMIT_MAX = 30; // requests per window
```

### AI Service (server/services/AIService.js)
```javascript
const PRIMARY_MODEL = 'gemini-2.0-flash';
const SECONDARY_MODEL = 'llama-3.3-70b-versatile'; // via Groq
const FALLBACK_MODEL = 'gpt-4o-mini'; // via OpenAI
const MAX_RETRIES = 3;
```

### Frontend (client/src/services/api.js)
```javascript
const API_BASE_URL = 'http://localhost:5000';
const TIMEOUT = 30000; // 30 seconds
```

---

## API Documentation

### POST /api/chat/message
**Generate AI response with intelligent intent routing.**

**Request:**
```json
{
  "message": "Create a dashboard about Tesla stock prices",
  "conversationId": "conv_1234567890",
  "dashboardContext": {
    "data": [...],
    "insights": [...]
  }
}
```

**Response:**
```json
{
  "success": true,
  "type": "dashboard",
  "reply": "I found a dataset about Tesla stock prices...",
  "processedData": {
    "data": [...],
    "charts": [...],
    "kpis": [...]
  },
  "insights": ["Tesla stock grew 150% in 2024..."],
  "dataset": {
    "url": "https://example.com/data.csv",
    "source": "Yahoo Finance"
  }
}
```

### POST /api/upload
**Upload and analyze CSV/Excel files.**

**Request:**
```
Content-Type: multipart/form-data
file: [CSV/Excel file]
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "insights": ["Total sales: $1.2M", "Growth: 15%"],
  "charts": [
    {"type": "line", "data": [...], "title": "Sales Trend"}
  ]
}
```

### GET /api/health
**Health check endpoint.**
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T00:00:00Z",
  "uptime": 3600
}
```

---

## Project Structure
```
DataPilot-AI/
├── client/                      # Frontend React Application ✅
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx      → Marketing homepage
│   │   │   ├── LoginPage.jsx        → Flip-card authentication
│   │   │   ├── DashboardPage.jsx    → Main dashboard container
│   │   │   ├── Dashboard.jsx        → Visualization panel
│   │   │   ├── Chatbot.jsx          → AI chat interface
│   │   │   ├── DataUpload.jsx       → File upload modal
│   │   │   ├── CyberRadio.jsx       → Custom radio buttons
│   │   │   ├── KPICard.jsx          → Metric display
│   │   │   ├── LoadingScreen.jsx    → 3D box loader
│   │   │   ├── ProtectedRoute.jsx   → Auth guard
│   │   │   └── charts/
│   │   │       └── Charts.jsx       → Recharts components
│   │   ├── services/
│   │   │   └── api.js               → API client
│   │   ├── App.jsx                  → Root + routing
│   │   ├── index.css                → Global styles
│   │   └── main.jsx                 → Entry point
│   ├── public/
│   │   └── datapilot-logo.svg       → Brand logo
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                      # Backend Node.js API ✅
│   ├── middleware/
│   │   ├── rateLimiter.js           → Rate limiting rules
│   │   ├── security.js              → Helmet config
│   │   └── validator.js             → Input validation
│   ├── routes/
│   │   ├── chatRoutes.js            → Chat & AI endpoints
│   │   ├── dataRoutes.js            → Data analysis
│   │   └── uploadRoutes.js          → File upload
│   ├── services/
│   │   ├── AIService.js             → Multi-provider AI
│   │   ├── DatasetFinder.js         → Web dataset search
│   │   └── DatasetEngine.js         → Data processing
│   ├── uploads/                     → Temp file storage
│   ├── app.js                       → Express setup
│   ├── package.json
│   └── .env.example
│
├── docs/                        # Documentation ✅
│   ├── PROJECT-OVERVIEW.md          → Full project guide
│   ├── TECHNICAL-DOCUMENTATION.md   → Technical specs
│   ├── SECURITY.md                  → Security details
│   └── SETUP.md                     → Installation guide
│
├── DEPLOYMENT.md                # Deployment instructions
├── README.md                    # This file
└── package.json                 # Root package file
```

---

## Current Status

### ✅ Frontend (Complete)
- [x] Modern React SPA with Vite
- [x] Flip-card authentication system
- [x] Protected route implementation
- [x] Conversational AI chat interface
- [x] Real-time dashboard generation
- [x] Interactive chart visualizations (Line, Bar, Pie, Area)
- [x] Custom CyberRadio component with glitch effects
- [x] 3D isometric box loader animation
- [x] Data upload modal (CSV/Excel)
- [x] Export functionality (PNG/PDF)
- [x] Responsive cyberpunk dark theme
- [x] Orbitron/Rajdhani font family
- [x] Full documentation

### ✅ Backend (Complete)
- [x] Express REST API server
- [x] Multi-provider AI integration (Gemini/Groq/OpenAI)
- [x] Intelligent intent detection
- [x] Automated dataset discovery
- [x] Data processing engine
- [x] KPI calculation system
- [x] Chart recommendation engine
- [x] OWASP security hardening
- [x] Rate limiting
- [x] Input validation & sanitization
- [x] File upload handling
- [x] Conversation memory management
- [x] Error handling & logging

### ✅ Security (Complete)
- [x] Helmet.js security headers
- [x] XSS protection
- [x] CSRF protection
- [x] Rate limiting (30 req/5min)
- [x] Input validation
- [x] File type validation
- [x] Size limits (5MB uploads)
- [x] SQL injection prevention
- [x] OWASP Top 10 compliance

### 🚀 Deployment Ready
- [x] Production build configuration
- [x] Environment variable setup
- [x] Deployment guides (VPS, PaaS, Docker)
- [x] Health check endpoints
- [x] Error monitoring
- [x] Logging system

---

## Quick Start

### Option 1: Full Stack Development
```bash
# Clone repository
git clone https://github.com/Prajeethv21/DatapilotAi.git
cd DatapilotAi

# Install all dependencies
npm install

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your API keys

# Start both servers
npm run dev
```
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:5000

### Option 2: Separate Terminals

**Terminal 1 - Backend:**
```bash
cd server
npm install
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm install
npm run dev
```

### Option 3: Production Build
```bash
# Build frontend
cd client
npm run build

# Build output: client/dist/

# Start backend in production mode
cd ../server
NODE_ENV=production npm start
```

---

## Design Theme

### Colors
- **Background:** Deep Space Dark (#030308, #0a0a0f)
- **Accent:** Electric Blue (#3b82f6, #60a5fa, #2563eb)
- **Secondary:** Cyan (#06b6d4, #22d3ee)
- **Text:** White (#ffffff), Gray (#9ca3af, #6b7280)
- **Success:** Emerald (#10b981)
- **Warning:** Amber (#f59e0b)
- **Error:** Rose (#f43f5e)

### Style
- **Theme:** Cyberpunk / Futuristic Tech
- **Mode:** Dark throughout
- **Effects:** Glow, blur, glass morphism
- **Animations:** Smooth, physics-based
- **Typography:** Orbitron (headings), Rajdhani (body)

### Components
- **Cards:** Glass panels with border glow
- **Buttons:** Gradient hover with shadow
- **Inputs:** Neon border on focus
- **Charts:** Gradient fills with animations
- **Loader:** 3D isometric boxes (5s duration)

---

## Tech Stack

### Frontend
```
React 18.2.0              → UI component library
Vite 5.0.8                → Fast build tool
Tailwind CSS 3.3.6        → Utility-first CSS
Styled Components 6.3.11  → CSS-in-JS
Framer Motion 10.16.16    → Animation library
React Router 6.30.3       → Client-side routing
Recharts 2.10.3           → Chart library
html2canvas 1.4.1         → Screenshot export
jsPDF 4.2.0               → PDF generation
PapaParse 5.4.1           → CSV parsing
xlsx 0.18.5               → Excel handling
```

### Backend
```
Node.js + Express 4.18.2  → Web server
@google/generative-ai     → Gemini AI
groq-sdk 0.37.0           → Groq AI (Llama)
openai 4.24.1             → OpenAI GPT
Helmet 7.1.0              → Security headers
express-rate-limit 7.1.5  → Rate limiting
express-validator 7.0.1   → Input validation
Multer 1.4.5              → File uploads
csv-parser 3.0.0          → CSV processing
mysql2 3.18.2             → MySQL driver
pg 8.19.0                 → PostgreSQL driver
```

### Development
```
nodemon 3.1.14            → Auto-restart
ESLint                    → Code linting
Prettier                  → Code formatting
```

---

## Documentation

- **Project Overview:** [docs/PROJECT-OVERVIEW.md](docs/PROJECT-OVERVIEW.md)
- **Technical Docs:** [docs/TECHNICAL-DOCUMENTATION.md](docs/TECHNICAL-DOCUMENTATION.md)  
- **Security Guide:** [docs/SECURITY.md](docs/SECURITY.md)
- **Setup Guide:** [docs/SETUP.md](docs/SETUP.md)
- **Deployment:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Contact

- **GitHub:** https://github.com/Prajeethv21/DatapilotAi
- **Demo:** Coming soon
- **Email:** prajeethv21@example.com

---

**© 2026 DataPilot AI. All rights reserved.**
