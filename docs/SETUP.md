# DataPilot AI - Quick Setup Guide

## 🚀 Fast Setup (5 minutes)

### Step 1: Install Dependencies

Open PowerShell in the project root directory:

```powershell
cd C:\Users\praje\Documents\AI-BI-Dashboard

# Install all dependencies at once
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

### Step 2: Configure OpenAI API Key

**Get your API key:**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (starts with `sk-`)

**Add to .env file:**

Open `server/.env` and replace the empty OPENAI_API_KEY with your key:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### Step 3: Start the Application

**Option A - Run both servers together:**
```powershell
npm run dev
```

**Option B - Run separately (2 terminals):**

Terminal 1:
```powershell
cd server
npm run dev
```

Terminal 2:
```powershell
cd client  
npm run dev
```

### Step 4: Open the App

- Open browser: http://localhost:3000
- Backend API: http://localhost:5000/api

## ✅ Verify It's Working

1. Check that the header shows "API Connected" (green dot)
2. Type in chat: "Show global COVID statistics"
3. Wait 5-10 seconds for AI to process
4. Dashboard should populate with charts and insights

## 🎨 Try These Example Prompts

- "Show global COVID statistics"
- "Analyze world population trends"  
- "Display stock market data"
- "Climate change temperature data"

## ⚠️ Common Issues

**"API Offline" showing:**
- Backend server not running
- Check terminal for errors
- Restart with `npm run dev`

**No OpenAI responses:**
- Invalid API key in `.env`
- No credits in OpenAI account
- Check server console for error messages

**Charts not showing:**
- Wait for full data processing (10-15 seconds)
- Check browser console (F12) for errors
- Verify dataset was found (check server logs)

## 📦 Project Structure Quick Reference

```
AI-BI-Dashboard/
├── client/          → Frontend (React + Vite)
├── server/          → Backend (Node.js + Express)
├── package.json     → Root dependencies
└── README.md        → Full documentation
```

## 🔧 Development Commands

```powershell
# Start both servers
npm run dev

# Install all dependencies (first time only)
npm install && cd server && npm install && cd ../client && npm install

# Backend only
cd server && npm run dev

# Frontend only  
cd client && npm run dev

# Build frontend for production
cd client && npm run build
```

## 🎯 Next Steps

1. ✅ Get OpenAI API key
2. ✅ Run `npm install` in all directories
3. ✅ Add API key to `server/.env`
4. ✅ Run `npm run dev` from root
5. ✅ Test with example prompts
6. 🎨 Customize styling in `client/tailwind.config.js`
7. 📊 Add more datasets in `server/services/DatasetFinder.js`

---

**Need help?** Check console logs in both terminal and browser for detailed error messages.
