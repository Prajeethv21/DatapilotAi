# 🌌 DataPilot AI

An intelligent conversational analytics platform powered by AI that automatically generates interactive dashboards from natural language requests.

![DataPilot AI](https://img.shields.io/badge/AI-Powered-purple) ![React](https://img.shields.io/badge/React-18.2-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Security](https://img.shields.io/badge/Security-OWASP-red)

## 🎯 Project Overview

DataPilot AI is a full-stack intelligent analytics platform that combines business intelligence dashboarding with conversational AI capabilities. Users can upload datasets, visualize data through interactive charts, and interact with their data using natural language queries.

### Key Features

1. 🔐 **Authentication System** - Secure login/signup with flip-card animation
2. 📤 **Multi-Format Data Upload** - CSV and Excel support
3. 🤖 **Conversational AI Chat** - Natural language data querying
4. 📊 **Dynamic Visualizations** - Auto-generated chart recommendations
5. 🎨 **Cyberpunk UI** - Custom styled radio buttons with glitch effects
6. 💾 **Database Connectivity** - MySQL and PostgreSQL support
7. 📥 **Export Dashboard** - PNG and PDF export with custom format selector
8. 🔒 **OWASP Hardened** - Enterprise-grade security
9. ⚡ **3D Loading Animation** - Isometric box loader
10. 🎯 **AI-Powered Insights** - Chart explanations and recommendations

## 🛠️ Tech Stack

### Frontend
- **React 18.2** with Vite 5.0 (fast build tool)
- **Tailwind CSS 3.3** (cyberpunk dark theme with cosmic design)
- **Styled Components 6.3** (custom cyber radio buttons)
- **Recharts 2.10** (interactive data visualizations)
- **Framer Motion 10.16** (smooth animations & 3D loader)
- **React Router 6.30** (authentication & protected routes)
- **html2canvas & jsPDF** (dashboard export functionality)
- **Axios 1.6** (API communication)

### Backend
- **Node.js** with Express 4.18
- **Multi-Provider AI System**:
  - Google Gemini 2.0 Flash (primary, free tier)
  - Groq AI (secondary, free tier)
  - OpenAI GPT (fallback, paid)
- **PapaParse 5.4** (CSV processing)
- **xlsx 0.18** (Excel file support)
- **Node-Cache 5.1** (dataset caching)
- **Multer 1.4** (file upload handling)

### Security (OWASP Best Practices)
- **Helmet.js** (security headers)
- **Express Rate Limit** (DDoS protection)
- **Express Validator** (input validation)
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
