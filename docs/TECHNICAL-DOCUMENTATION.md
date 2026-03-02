# DataPilot AI - Technical Documentation

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Solution Architecture](#solution-architecture)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Core Features](#core-features)
- [Methodologies & Patterns](#methodologies--patterns)
- [Security Implementation](#security-implementation)
- [API Documentation](#api-documentation)
- [Database & Data Processing](#database--data-processing)
- [Deployment Guide](#deployment-guide)
- [Performance Optimization](#performance-optimization)

---

## 📖 Project Overview

**DataPilot AI** is an intelligent analytics platform that combines business intelligence dashboarding with conversational AI capabilities. It allows users to upload datasets, visualize data through interactive charts, and interact with their data using natural language queries powered by AI.

### Mission
Transform complex data analysis into an intuitive, conversational experience accessible to both technical and non-technical users.

---

## 🎯 Problem Statement

### Business Challenges
1. **Data Complexity**: Users struggle with traditional BI tools requiring SQL knowledge or complex query builders
2. **Insight Discovery**: Difficulty in identifying meaningful patterns and trends in large datasets
3. **Accessibility Gap**: Non-technical stakeholders cannot independently explore data
4. **Time Consumption**: Manual chart creation and data filtering is time-intensive
5. **Visualization Barriers**: Choosing appropriate chart types requires data visualization expertise

### User Pain Points
- Manual CSV/Excel data processing
- Steep learning curve for analytics tools
- Lack of AI-powered insights
- No conversational data querying
- Limited chart explanation capabilities

---

## 💡 Solution Architecture

### Core Solution Components

#### 1. **Intelligent Data Upload**
- Multi-format support (CSV, Excel)
- Automatic data parsing and type detection
- Smart column recognition
- Data validation and sanitization

#### 2. **AI-Powered Chat Interface**
- Natural language data querying
- Context-aware conversations
- Multi-provider AI fallback system (Gemini → Groq → OpenAI)
- Real-time response streaming

#### 3. **Dynamic Visualization Engine**
- Auto-generated chart recommendations
- Interactive chart components (Line, Bar, Pie, Area)
- AI-powered chart explanations
- Real-time data filtering

#### 4. **Export & Sharing**
- Dashboard export to PNG/PDF
- Chart downloads
- Shareable insights

---

## 🛠 Technology Stack

### Frontend Stack

#### Core Framework
- **React 18.2.0** - UI library for component-based architecture
- **Vite 5.0.8** - Next-generation build tool for fast development
- **React Router DOM 6.30.3** - Client-side routing

#### Styling & Animation
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Framer Motion 10.16.16** - Production-ready animation library
- **Custom CSS3 Animations** - 3D loader effects

#### Data Visualization
- **Recharts 2.10.3** - Composable charting library built on React components
- **Lucide React 0.294.0** - Beautiful icon library

#### Export & Graphics
- **html2canvas 1.4.1** - Screenshot generation for dashboard export
- **jsPDF 4.2.0** - PDF generation client-side
- **Three.js 0.170.0** - 3D graphics library

#### Communication
- **Axios 1.6.2** - Promise-based HTTP client
- **React Markdown 9.0.1** - Markdown rendering for AI responses

---

### Backend Stack

#### Core Server
- **Node.js** - JavaScript runtime
- **Express 4.18.2** - Web application framework
- **Nodemon 3.1.14** - Auto-restart development server

#### AI Providers (Multi-Fallback System)
1. **Google Gemini AI 0.24.1** - Primary provider (gemini-2.0-flash model)
   - Free tier: 15 requests/minute, 1M tokens/day
2. **Groq SDK 0.37.0** - Secondary provider (Llama/Mixtral models)
   - Free tier: 30 requests/minute
3. **OpenAI 4.24.1** - Tertiary provider (GPT models)
   - Paid fallback option

#### Security Middleware
- **Helmet 7.1.0** - HTTP header security (13 security headers)
- **express-rate-limit 7.1.5** - Rate limiting (100 requests/15 min)
- **express-validator 7.0.1** - Input validation and sanitization
- **express-mongo-sanitize 2.2.0** - NoSQL injection prevention
- **xss-clean 0.1.4** - XSS attack prevention
- **hpp 0.2.3** - HTTP Parameter Pollution protection

#### Data Processing
- **Multer 1.4.5-lts.1** - File upload handling
- **csv-parser 3.0.0** - CSV parsing
- **PapaParse 5.4.1** - Advanced CSV parser
- **xlsx 0.18.5** - Excel file processing

#### Database Support
- **MySQL2 3.18.2** - MySQL connector
- **pg 8.19.0** - PostgreSQL client

#### Performance
- **node-cache 5.1.2** - In-memory caching
- **express-slow-down 2.0.1** - Request rate slowing

#### Configuration
- **dotenv 16.3.1** - Environment variable management
- **CORS 2.8.5** - Cross-Origin Resource Sharing

---

## 🏗 System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Landing    │  │  Dashboard   │  │   Chatbot    │  │
│  │     Page     │  │     Page     │  │  Interface   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Components & Services                    │    │
│  │  - Charts.jsx (Visualization)                    │    │
│  │  - DataUpload.jsx (File Handling)               │    │
│  │  - api.js (HTTP Client)                          │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────┐
│                   Server Layer                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Security Middleware Stack                │    │
│  │  1. Helmet (HTTP Headers)                        │    │
│  │  2. CORS Policy                                  │    │
│  │  3. Rate Limiter                                 │    │
│  │  4. Input Validator                              │    │
│  │  5. XSS/NoSQL Sanitizer                          │    │
│  └─────────────────────────────────────────────────┘    │
│                            ↓                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Route Handlers                      │    │
│  │  - /api/upload → uploadRoutes.js                 │    │
│  │  - /api/data → dataRoutes.js                     │    │
│  │  - /api/chat → chatRoutes.js                     │    │
│  └─────────────────────────────────────────────────┘    │
│                            ↓                             │
│  ┌─────────────────────────────────────────────────┐    │
│  │            Business Logic Services               │    │
│  │  - AIService.js (Multi-provider AI)              │    │
│  │  - DatasetEngine.js (Data Processing)            │    │
│  │  - DatasetFinder.js (Smart Search)               │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   External Services                      │
│  ┌──────────┐  ┌──────────┐  ┌────────────┐            │
│  │  Gemini  │  │   Groq   │  │   OpenAI   │            │
│  │    AI    │  │    AI    │  │     GPT    │            │
│  └──────────┘  └──────────┘  └────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Request Flow

#### Data Upload Flow
```
User → DataUpload.jsx → /api/upload → multer → 
File Validation → CSV/Excel Parser → JSON Response → 
State Update → Auto-Chart Generation
```

#### Chat Query Flow
```
User Input → Chatbot.jsx → /api/chat/message → 
Input Validation → AIService.js → 
[Try Gemini → Try Groq → Try OpenAI] → 
Response Streaming → Markdown Rendering → UI Display
```

#### Chart Explanation Flow
```
Chart Click → Charts.jsx → /api/chat/explain → 
Chart Data + Type → AIService.generateInsight() → 
AI Analysis → Formatted Explanation → Modal Display
```

---

## ⚙️ Core Features

### 1. Multi-Format Data Upload
**Technology**: Multer, csv-parser, xlsx, PapaParse

**Process**:
- File upload to `/server/uploads/` directory
- Automatic format detection (CSV/Excel)
- Column header extraction
- Data type inference
- Row-by-row parsing with streaming for large files

**Security**:
- File type validation
- Maximum file size limits
- Filename sanitization
- Temporary storage with automatic cleanup

### 2. Conversational AI Chat
**Technology**: Multi-provider AI (Gemini/Groq/OpenAI), React Markdown

**Features**:
- Natural language data queries
- Context-aware responses
- Markdown formatting support
- Real-time typing indicators
- Error handling with graceful degradation

**Provider Fallback Logic**:
```javascript
1. Try Google Gemini (gemini-2.0-flash)
   - If available → return response
   - If rate limited/error → go to 2
2. Try Groq (llama-3.3-70b-versatile)
   - If available → return response
   - If rate limited/error → go to 3
3. Try OpenAI (gpt-3.5-turbo)
   - If available → return response
   - If all fail → return fallback message
```

### 3. Dynamic Chart Visualization
**Technology**: Recharts, D3.js (via Recharts), Framer Motion

**Supported Chart Types**:
- **Line Chart**: Time-series data, trends over time
- **Bar Chart**: Categorical comparisons, rankings
- **Pie Chart**: Proportional distributions, percentages
- **Area Chart**: Volume trends, cumulative data

**Smart Features**:
- Automatic chart type recommendation based on data structure
- Responsive sizing with viewport adaptation
- Interactive tooltips with formatted values
- Smooth animations and transitions
- Color-coded data series

### 4. AI-Powered Insights
**Technology**: GPT/Gemini analysis, statistical prompting

**Capabilities**:
- Chart pattern recognition
- Trend identification
- Anomaly detection
- Comparative analysis
- Business recommendations

### 5. Dashboard Export
**Technology**: html2canvas, jsPDF

**Export Options**:
- **PNG**: High-resolution image export
- **PDF**: Multi-page document generation
- Maintains visual fidelity
- Includes charts, KPIs, and titles

---

## 🔧 Methodologies & Patterns

### Software Architecture Patterns

#### 1. **Component-Based Architecture (React)**
- Atomic design principles
- Reusable UI components
- Props-based data flow
- Composition over inheritance

#### 2. **Service Layer Pattern**
- Business logic separation
- Single Responsibility Principle
- Service classes (AIService, DatasetEngine)
- Dependency injection ready

#### 3. **MVC-like Pattern**
- **Model**: Data structures and state
- **View**: React components
- **Controller**: API routes and handlers

#### 4. **Strategy Pattern**
- Multi-provider AI implementation
- Fallback mechanism with provider switching
- Runtime provider selection

#### 5. **Observer Pattern**
- React hooks (useState, useEffect)
- Event-driven UI updates
- Real-time state synchronization

### Development Methodologies

#### 1. **Progressive Enhancement**
- Core functionality without JavaScript
- Enhanced UX with client-side features
- Graceful degradation on failures

#### 2. **Defense in Depth (Security)**
- Multiple security layers
- Validation at every boundary
- Assume breach mentality

#### 3. **Fail-Safe Design**
- AI provider fallback
- Error boundaries in React
- User-friendly error messages

#### 4. **Performance First**
- Code splitting with Vite
- Lazy loading components
- Memoization for expensive operations
- Efficient re-rendering strategies

---

## 🔒 Security Implementation

### OWASP Top 10 Protection

#### 1. **Injection Prevention**
- **express-validator**: Input sanitization on all endpoints
- **express-mongo-sanitize**: NoSQL injection prevention
- **Parameterized queries**: For database operations
- **Type validation**: Strict TypeScript-like checks

#### 2. **Broken Authentication**
- **Rate limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Secure session management headers
- **HTTP-only cookies**: (if session-based auth added)

#### 3. **Sensitive Data Exposure**
- **Environment variables**: API keys in .env files
- **HTTPS enforcement**: Helmet's HSTS header
- **No client-side secrets**: API keys only on server

#### 4. **XML External Entities (XXE)**
- **File type validation**: Only CSV/Excel allowed
- **Disabled XML parsing**: Not accepting XML uploads

#### 5. **Broken Access Control**
- **CORS**: Restricted origin access
- **Input validation**: Authorization checks on data access

#### 6. **Security Misconfiguration**
- **Helmet**: 13 security headers configured
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security
  - Content-Security-Policy
- **Error handling**: No stack traces in production

#### 7. **Cross-Site Scripting (XSS)**
- **xss-clean**: Sanitizes user input
- **React**: Automatic XSS protection via JSX escaping
- **Content-Security-Policy**: Restricts inline scripts

#### 8. **Insecure Deserialization**
- **JSON parsing limits**: Request body size limits
- **Type validation**: Schema validation on all inputs

#### 9. **Using Components with Known Vulnerabilities**
- **Regular updates**: npm audit monthly
- **Dependency scanning**: Automated vulnerability checks

#### 10. **Insufficient Logging & Monitoring**
- **Request logging**: All API calls logged
- **Error tracking**: Comprehensive error logs
- **Rate limit monitoring**: IP-based tracking

### Security Middleware Stack
```javascript
app.use(helmet())                    // Security headers
app.use(cors({ origin: allowedOrigins }))  // CORS policy
app.use(rateLimiter)                 // Rate limiting
app.use(mongoSanitize())             // NoSQL injection prevention
app.use(xss())                       // XSS prevention
app.use(hpp())                       // HTTP Parameter Pollution
app.use(express.json({ limit: '10mb' }))   // Body size limit
```

---

## 📡 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Endpoints

#### 1. Health Check
```http
GET /api/health
```
**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-02T10:30:00.000Z",
  "uptime": 3600
}
```

#### 2. Upload Dataset
```http
POST /api/upload
Content-Type: multipart/form-data
```
**Request**:
```
file: <csv/excel file>
```
**Response**:
```json
{
  "success": true,
  "data": {
    "columns": ["name", "age", "city"],
    "rows": [
      {"name": "John", "age": 30, "city": "NYC"},
      {"name": "Jane", "age": 25, "city": "LA"}
    ],
    "rowCount": 2
  }
}
```

#### 3. Chat Message
```http
POST /api/chat/message
Content-Type: application/json
```
**Request**:
```json
{
  "message": "What is the average age?",
  "context": {
    "columns": ["name", "age", "city"],
    "sampleData": [...]
  }
}
```
**Response**:
```json
{
  "success": true,
  "response": "Based on the data, the average age is 27.5 years.",
  "provider": "gemini"
}
```

#### 4. Explain Chart
```http
POST /api/chat/explain
Content-Type: application/json
```
**Request**:
```json
{
  "chartType": "bar",
  "data": [...],
  "xKey": "month",
  "yKey": "sales"
}
```
**Response**:
```json
{
  "success": true,
  "explanation": "This bar chart shows sales trends across months..."
}
```

#### 5. Get Chart Recommendations
```http
POST /api/data/recommend-charts
Content-Type: application/json
```
**Request**:
```json
{
  "columns": ["month", "sales", "profit"],
  "sampleData": [...]
}
```
**Response**:
```json
{
  "recommendations": [
    {
      "type": "line",
      "title": "Sales Trend",
      "xKey": "month",
      "yKey": "sales",
      "reasoning": "Time-series data best visualized with line chart"
    }
  ]
}
```

---

## 💾 Database & Data Processing

### Current Implementation: In-Memory Processing
- **No persistent database required** for MVP
- Data stored temporarily in server memory during session
- Uploaded files processed and cached in RAM
- Automatic garbage collection after session ends

### Data Processing Pipeline

#### CSV Processing Flow
```
Upload → Multer Storage → csv-parser Stream →
Row Validation → Type Inference → JSON Conversion →
Cache in Memory → Send to Client
```

#### Excel Processing Flow
```
Upload → Multer Storage → xlsx.read() →
Sheet Selection → Row Extraction → Type Inference →
JSON Conversion → Cache in Memory → Send to Client
```

### Future Database Integration (Optional)

#### Recommended Stack
- **PostgreSQL**: For relational data storage
- **Redis**: For session caching and rate limiting
- **MongoDB**: For unstructured conversation history

#### Schema Design (PostgreSQL)
```sql
-- Users table (if auth added)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Datasets table
CREATE TABLE datasets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255),
  columns JSONB,
  row_count INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Chat history table
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  dataset_id INTEGER REFERENCES datasets(id),
  message TEXT,
  response TEXT,
  provider VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- API keys for at least one AI provider (Gemini recommended)

### Environment Setup

#### 1. Create `.env` file in `/server/`
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# AI Provider Keys (at least one required)
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Local Development

#### 1. Install Dependencies
```bash
# Root directory
npm run install-all

# Or manually
npm install
cd server && npm install
cd ../client && npm install
```

#### 2. Start Development Servers
```bash
# From root directory (starts both servers)
npm run dev

# Or separately
npm run server  # Backend on port 5000
npm run client  # Frontend on port 3000
```

#### 3. Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Production Deployment

#### Option 1: Traditional VPS (AWS EC2, DigitalOcean, etc.)

**Step 1: Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 process manager
sudo npm install -g pm2
```

**Step 2: Deploy Application**
```bash
# Clone repository
git clone <your-repo-url>
cd AI-BI-Dashboard

# Install dependencies
npm run install-all

# Build frontend
cd client
npm run build
cd ..

# Configure environment
cp server/.env.example server/.env
nano server/.env  # Add your API keys
```

**Step 3: Start with PM2**
```bash
# Start backend
cd server
pm2 start app.js --name datapilot-api

# Serve frontend build (using serve package)
npm install -g serve
cd ../client/dist
pm2 start "serve -s . -p 3000" --name datapilot-ui

# Save PM2 configuration
pm2 save
pm2 startup
```

**Step 4: Configure Nginx Reverse Proxy**
```nginx
# /etc/nginx/sites-available/datapilot

server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        client_max_body_size 10M;
    }
}
```

**Step 5: Enable SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

#### Option 2: Platform as a Service (Render, Railway, Heroku)

**Render Deployment** (Recommended)

1. **Create `render.yaml`** in root:
```yaml
services:
  # Backend
  - type: web
    name: datapilot-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: GEMINI_API_KEY
        sync: false
      - key: PORT
        value: 5000

  # Frontend
  - type: web
    name: datapilot-ui
    env: node
    buildCommand: cd client && npm install && npm run build
    startCommand: npm install -g serve && serve -s client/dist -p 3000
    envVars:
      - key: NODE_ENV
        value: production
```

2. Connect GitHub repository
3. Add environment variables in Render dashboard
4. Deploy automatically on git push

#### Option 3: Docker Deployment

**Create `Dockerfile`** for backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install --production
COPY server/ ./
EXPOSE 5000
CMD ["node", "app.js"]
```

**Create `Dockerfile`** for frontend:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose**:
```yaml
version: '3.8'
services:
  backend:
    build: 
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    env_file:
      - server/.env
    
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Post-Deployment Checklist
- [ ] Environment variables configured
- [ ] API keys validated
- [ ] CORS origins updated for production domain
- [ ] Rate limiting tested
- [ ] SSL certificate installed
- [ ] Health check endpoint responding
- [ ] Error logging configured
- [ ] Monitoring setup (optional: Sentry, LogRocket)
- [ ] Backup strategy defined
- [ ] CDN configured for static assets (optional)

---

## ⚡ Performance Optimization

### Frontend Optimizations

#### 1. Code Splitting
```javascript
// Lazy load routes
const Dashboard = lazy(() => import('./components/DashboardPage'));
const Landing = lazy(() => import('./components/LandingPage'));
```

#### 2. Memoization
```javascript
// Prevent unnecessary re-renders
const MemoizedChart = React.memo(LineChart);

// Memoize expensive calculations
const chartData = useMemo(() => processChartData(data), [data]);
```

#### 3. Virtual Scrolling
- For large datasets (1000+ rows)
- Implement react-window or react-virtualized
- Render only visible rows

#### 4. Image Optimization
- Use WebP format for images
- Lazy load images below fold
- Implement responsive images

### Backend Optimizations

#### 1. Response Caching
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 }); // 10 min cache

app.get('/api/data', (req, res) => {
  const cached = cache.get('data');
  if (cached) return res.json(cached);
  
  const data = fetchData();
  cache.set('data', data);
  res.json(data);
});
```

#### 2. Database Query Optimization
- Index frequently queried fields
- Use connection pooling
- Implement query result caching
- Limit result set sizes

#### 3. Compression
```javascript
const compression = require('compression');
app.use(compression()); // Gzip responses
```

#### 4. API Response Size Reduction
- Paginate large responses
- Use field selection (only return needed fields)
- Compress JSON payloads

### Monitoring & Metrics
- **Backend**: Response times, error rates, memory usage
- **Frontend**: First Contentful Paint (FCP), Time to Interactive (TTI)
- **AI**: Provider response times, fallback rates
- **Infrastructure**: CPU, memory, network I/O

---

## 📊 Key Metrics & KPIs

### Performance Targets
- **First Load**: < 2 seconds
- **API Response**: < 500ms (95th percentile)
- **AI Response**: < 3 seconds
- **Chart Render**: < 100ms

### Success Metrics
- **Uptime**: 99.9%
- **Error Rate**: < 0.1%
- **AI Accuracy**: User satisfaction rating
- **Chart Relevance**: Recommendation acceptance rate

---

## 🔄 CI/CD Pipeline (Future Enhancement)

### Recommended Setup

**GitHub Actions Workflow**:
```yaml
name: Deploy DataPilot AI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm run install-all
      - run: npm test
      
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
        run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

---

## 📚 Additional Resources

### API Provider Documentation
- [Google Gemini API](https://ai.google.dev/docs)
- [Groq Cloud API](https://console.groq.com/docs)
- [OpenAI API](https://platform.openai.com/docs)

### Framework Documentation
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Recharts Documentation](https://recharts.org)
- [Tailwind CSS](https://tailwindcss.com)

### Security References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Security](https://helmetjs.github.io/)

---

## 🤝 Contributing Guidelines

### Code Standards
- ESLint configuration for JavaScript
- Prettier for code formatting
- Conventional Commits for git messages
- Component naming: PascalCase
- Functions/variables: camelCase

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes

---

## 📄 License
MIT License - See LICENSE file for details

---

## 👥 Support
For technical support or questions:
- Create an issue on GitHub
- Email: support@datapilot-ai.com
- Documentation: [docs.datapilot-ai.com]

---

**Last Updated**: March 2, 2026  
**Version**: 1.0.0  
**Maintained By**: DataPilot AI Team
