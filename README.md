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
- **XSS-Clean** (XSS prevention)
- **HPP** (parameter pollution prevention)
- **Mongo-Sanitize** (NoSQL injection prevention)

### Architecture
```
User → Chatbot UI → AI Agent → Dataset Finder → Dataset Processor → Visualization Engine → Dashboard
```

## 📁 Project Structure

```
AI-BI-Dashboard/
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.jsx       # Landing page
│   │   │   ├── LoginPage.jsx         # Auth flip-card login/signup
│   │   │   ├── LoadingScreen.jsx     # 3D box loader animation
│   │   │   ├── DashboardPage.jsx     # Dashboard container
│   │   │   ├── Dashboard.jsx         # Main dashboard with export
│   │   │   ├── Chatbot.jsx           # Conversational AI interface
│   │   │   ├── DataUpload.jsx        # CSV/Excel upload
│   │   │   ├── KPICard.jsx          # KPI displays
│   │   │   ├── CyberRadio.jsx       # Custom radio buttons
│   │   │   ├── ProtectedRoute.jsx   # Auth guard
│   │   │   └── charts/
│   │   │       └── Charts.jsx        # Recharts visualizations
│   │   ├── services/
│   │   │   └── api.js               # API communication
│   │   ├── App.jsx                  # Main app with routing
│   │   ├── index.css                # Tailwind + custom styles
│   │   └── LoadingScreen.css        # 3D loader animations
│   ├── index.html
│   ├── datapilot-logo.svg          # Custom DP favicon
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                    # Backend Node.js server
│   ├── services/
│   │   ├── AIService.js             # Multi-provider AI (Gemini/Groq/OpenAI)
│   │   ├── DatasetFinder.js         # Auto dataset discovery
│   │   └── DatasetEngine.js         # Data processing
│   ├── routes/
│   │   ├── chatRoutes.js            # Chat endpoints
│   │   ├── uploadRoutes.js          # File upload endpoints
│   │   └── dataRoutes.js            # Data endpoints
│   ├── middleware/
│   │   ├── security.js              # OWASP security middleware
│   │   ├── rateLimiter.js           # Rate limiting
│   │   └── validator.js             # Input validation
│   ├── app.js                       # Express server
│   ├── .env
│   └── package.json
│
├── docs/                      # Documentation (not for deployment)
│   ├── TECHNICAL-DOCUMENTATION.md
│   ├── SECURITY.md
│   └── backup/
│
├── DEPLOYMENT.md              # Deployment guide
├── README.md
└── package.json
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- At least one AI provider API key:
  - **Google Gemini API** (recommended - free tier) - [Get here](https://ai.google.dev/)
  - **Groq API** (optional - free tier) - [Get here](https://console.groq.com/)
  - **OpenAI API** (optional - paid) - [Get here](https://platform.openai.com/api-keys)

### Installation

**1. Clone/Navigate to project:**
```powershell
cd C:\Users\praje\Documents\AI-BI-Dashboard
```

**2. Install root dependencies:**
```powershell
npm install
```

**3. Setup Backend:**
```powershell
cd server
npm install

# Create .env file with your API keys
# Add at least one AI provider key:
# GEMINI_API_KEY=your_gemini_key_here
# GROQ_API_KEY=your_groq_key_here
# OPENAI_API_KEY=sk-your-openai-key-here
```

**4. Setup Frontend:**
```powershell
cd ../client
npm install
```

### Running the Application

**Option 1: Run both servers simultaneously (from root):**
```powershell
npm run dev
```

**Option 2: Run separately:**

**Terminal 1 - Backend:**
```powershell
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd client
npm run dev
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 🎨 Design Features

The UI features a modern cyberpunk aesthetic with:
- 🌌 Dark gradient backgrounds (navy, purple, blue)
- ✨ Glass-morphism panels with backdrop blur
- 🎆 Vibrant accent colors (blue, cyan, purple)
- 🌊 Smooth Framer Motion animations
- 💫 Floating elements and glow effects
- 🎮 Custom cyberpunk-styled UI components

### Custom Components

#### 🔘 **CyberRadio Buttons**
Animated radio buttons with glitch effects and cyberpunk styling:
- Used for database type selection (MySQL/PostgreSQL)
- Export format selection (PNG/PDF)
- Features:
  - Glitch animation on hover and selection
  - Color transition effects
  - Clip-path polygon shapes
  - Shadow layering

#### 🔐 **Flip-Card Login/Signup**
Beautiful 3D flip card animation for authentication:
- Single component for both login and signup
- Smooth card rotation transition
- Glass-morphism design
- Auto-authentication with localStorage

#### 📦 **3D Box Loader**
Isometric animated loading screen:
- 8-box stacking animation
- Ground plane with shine effect
- 5-second load duration synced with progress bar
- Responsive design (scales to 44% on mobile)

## 🚦 User Flow

1. **Landing Page** → Promotional content with feature highlights
2. **Click "Get Started"** → Navigate to Login Page
3. **Login/Signup** → Flip card authentication
4. **Dashboard** → Protected route (requires auth)
5. **Upload Data** → CSV/Excel file or Database connection
6. **Visualize** → Auto-generated charts with recommendations
7. **Chat** → Natural language AI queries
8. **Export** → Choose format (PNG/PDF) and download

## 🤖 How It Works

### Intelligent Workflow:

**1. User Input:**
- User types: "Show global COVID statistics"

**2. AI Intent Extraction (AIService.js):**
```javascript
{
  keywords: ["global", "covid", "statistics"],
  dataType: "covid",
  metrics: ["total", "trend"],
  timeframe: null
}
```

**3. Dataset Discovery (DatasetFinder.js):**
- Searches curated dataset registry
- Downloads CSV from public sources
- Caches result for performance

**4. Data Processing (DatasetEngine.js):**
- Parses CSV data
- Detects column types (numeric, date, categorical)
- Calculates statistics
- Generates chart-ready data

**5. AI Insight Generation (AIService.js):**
- Sends statistics to OpenAI
- Receives analytical summary
- Returns actionable insights

**6. Dashboard Rendering (Dashboard.jsx):**
- Displays KPI cards
- Renders multiple chart types
- Shows AI insights
- Presents statistics

## 📊 Features

### ✅ Completed Features

**Chat Interface:**
- Real-time conversational UI
- Loading states and animations
- Quick suggestion prompts
- Message history

**AI Processing:**
- Natural language understanding
- Intent extraction
- Automatic dataset discovery
- Smart keyword matching

**Data Processing:**
- Automatic column type detection
- Statistical calculations
- Data aggregation
- Chart data preparation

**Visualizations:**
- Line charts (trends)
- Bar charts (comparisons)
- Pie charts (distribution)
- Area charts (cumulative)
- KPI cards
- Statistical summaries

**UI/UX:**
- Responsive design
- Dark cosmic theme
- Smooth animations
- Glass-morphism effects
- Loading indicators

**Security (OWASP):**
- Rate limiting (IP-based, per-endpoint)
- Input validation & sanitization
- XSS prevention
- NoSQL injection prevention
- Secure API key handling
- Security headers (Helmet)
- CORS restrictions
- Request size limits
- Error sanitization
- Audit logging

## 🔧 Configuration

### Adding New Dataset Sources

Edit `server/services/DatasetFinder.js`:

```javascript
this.datasetRegistry = {
  your_topic: [
    {
      name: 'Dataset Name',
      url: 'https://example.com/data.csv',
      type: 'category',
      description: 'Description'
    }
  ]
}
```

### Customizing AI Behavior

Edit `server/services/AIService.js`:
- Modify system prompts for different AI personalities
- Adjust temperature for creativity vs. accuracy
- Add custom data type detection patterns

### Styling Customization

Edit `client/tailwind.config.js`:
```javascript
colors: {
  'space-dark': '#0a0e27',    // Background
  'nebula-pink': '#ec4899',    // Accent color
  // Add your colors
}
```

## 📝 API Endpoints

### POST `/api/chat/analyze`
Complete analysis workflow
```json
{
  "prompt": "show global covid trends"
}
```

**Response:**
```json
{
  "success": true,
  "response": {
    "message": "Analysis complete",
    "insights": "AI-generated text...",
    "dataset": { ... },
    "data": {
      "metadata": { ... },
      "statistics": { ... },
      "chartData": { ... },
      "kpis": [ ... ]
    }
  }
}
```

### GET `/api/health`
API health check

### GET `/api/data/status`
Service status check

## � Security

This application implements **OWASP Top 10 security best practices**:

✅ **Rate Limiting** - Prevents DDoS and brute force attacks  
✅ **Input Validation** - Schema-based validation with strict type checks  
✅ **XSS Prevention** - All inputs sanitized and encoded  
✅ **Injection Prevention** - NoSQL injection protection  
✅ **Secure Headers** - Helmet.js with CSP, HSTS, X-Frame-Options  
✅ **API Key Security** - Environment variables only, never exposed  
✅ **CORS Restrictions** - Whitelist-based origin control  
✅ **Error Handling** - No sensitive data leakage  
✅ **Audit Logging** - Suspicious activity detection  
✅ **Request Validation** - Content-Type and payload size limits  

**📖 Full Security Documentation:** See [SECURITY.md](SECURITY.md)

**🧪 Test Security Features:**
```powershell
.\test-security.ps1
```

**Rate Limits:**
- General API: 100 requests / 15 minutes
- AI Analysis: 10 requests / 10 minutes  
- Chat Messages: 30 requests / 5 minutes

## �🐛 Troubleshooting

**Issue: API Offline**
- Check if backend server is running on port 5000
- Verify `.env` file exists with valid OpenAI key

**Issue: No Charts Displayed**
- Check browser console for errors
- Verify dataset has numeric columns
- Check network tab for API response

**Issue: CORS Errors**
- Backend CORS is configured for all origins in development
- Production: Update CORS settings in `server/app.js`

**Issue: OpenAI Errors**
- Verify API key is valid
- Check OpenAI account has credits
- Fallback logic will activate if API fails

## ✨ Feature Highlights

### Recently Added
- ✅ **User Authentication** - Login/signup with flip-card animation
- ✅ **Protected Routes** - Dashboard requires authentication
- ✅ **Export Dashboard** - PNG and PDF export with format selector
- ✅ **Cyber Radio Buttons** - Custom styled radio components with glitch effects
- ✅ **Database Connectivity** - MySQL and PostgreSQL support
- ✅ **3D Loading Screen** - Isometric box loader animation
- ✅ **Multi-Provider AI** - Gemini, Groq, and OpenAI fallback system
- ✅ **Chart Explanations** - AI-powered insights for visualizations

## 🚀 Future Enhancements

- [ ] Persistent user sessions with JWT tokens
- [ ] Save dashboard configurations to database
- [ ] Real-time data streaming with WebSockets
- [ ] More visualization types (Scatter, Radar, Heatmap)
- [ ] Kaggle API integration for datasets
- [ ] Multi-language support (i18n)
- [ ] Dark/Light theme toggle
- [ ] Dashboard sharing via unique links
- [ ] Advanced filtering and data transformations
- [ ] Mobile app version (React Native)

## 📄 License

MIT License - feel free to use for your projects!

## 🙏 Credits

- **Google Gemini AI** - Primary AI provider
- **Groq AI** - Secondary AI provider  
- **OpenAI** - Fallback AI capabilities
- **Recharts** - Visualization library
- **Framer Motion** - Animation framework
- **Styled Components** - CSS-in-JS styling
- **Tailwind CSS** - Utility-first CSS framework
- **html2canvas & jsPDF** - Export functionality
- **React Router** - Client-side routing

---

**Built with ❤️ using AI-driven automation**

📚 **Documentation:** See [docs/TECHNICAL-DOCUMENTATION.md](docs/TECHNICAL-DOCUMENTATION.md) for comprehensive technical details

🚀 **Deployment:** See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions

🔒 **Security:** See [docs/SECURITY.md](docs/SECURITY.md) for security implementation details

For questions or issues, check the console logs for detailed debugging information.
