const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this.providers = [];

    // Google Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        this.gemini = new GoogleGenerativeAI(geminiKey);
        this.geminiModel = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
        this.providers.push('gemini');
        console.log('✅ Google Gemini configured (free tier)');
      } catch (e) {
        console.warn('⚠️ Gemini init failed:', e.message);
      }
    }

    // Groq
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey !== 'your_groq_api_key_here') {
      try {
        this.groq = new Groq({ apiKey: groqKey });
        this.providers.push('groq');
        console.log('✅ Groq configured (free tier)');
      } catch (e) {
        console.warn('⚠️ Groq init failed:', e.message);
      }
    }

    // OpenAI
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey && openaiKey !== 'your_openai_api_key_here' && openaiKey.startsWith('sk-')) {
      try {
        this.openai = new OpenAI({ apiKey: openaiKey, timeout: 30000, maxRetries: 1 });
        this.providers.push('openai');
        console.log('✅ OpenAI configured');
      } catch (e) {
        console.warn('⚠️ OpenAI init failed:', e.message);
      }
    }

    this.failedProviders = new Set();
    setInterval(() => {
      if (this.failedProviders.size > 0) {
        console.log(`🔄 Retrying previously failed providers: ${[...this.failedProviders].join(', ')}`);
        this.failedProviders.clear();
      }
    }, 5 * 60 * 1000);

    if (this.providers.length === 0) {
      console.warn('⚠️ No AI providers configured - using intelligent fallback mode');
      console.warn('   Add GEMINI_API_KEY (free: aistudio.google.com) or GROQ_API_KEY (free: console.groq.com) to .env');
    } else {
      console.log(`🤖 AI providers available: ${this.providers.join(' → ')} → fallback`);
    }
  }

  /** Get list of working providers */
  get activeProviders() {
    return this.providers.filter(p => !this.failedProviders.has(p));
  }

  // =====================================================
  //  UNIFIED AI CALL - tries each provider in sequence
  // =====================================================

  /**
   * Call AI with automatic provider fallback.
   * @param {string} systemPrompt
   * @param {string} userPrompt
   * @param {object} opts - { json: bool, temperature: number, maxTokens: number }
   * @returns {string} AI response text
   */
  async _callAI(systemPrompt, userPrompt, opts = {}) {
    const { json = false, temperature = 0.7, maxTokens = 1000 } = opts;

    for (const provider of this.activeProviders) {
      try {
        switch (provider) {
          case 'gemini':
            return await this._callGemini(systemPrompt, userPrompt, { json, temperature, maxTokens });
          case 'groq':
            return await this._callGroq(systemPrompt, userPrompt, { json, temperature, maxTokens });
          case 'openai':
            return await this._callOpenAI(systemPrompt, userPrompt, { json, temperature, maxTokens });
        }
      } catch (error) {
        console.warn(`⚠️ ${provider} failed: ${error.message}`);
        // Mark as failed if quota/auth error
        if (error.status === 429 || error.status === 401 || error.status === 403 ||
            error.message?.includes('quota') || error.message?.includes('rate') ||
            error.message?.includes('billing') || error.message?.includes('API key')) {
          this.failedProviders.add(provider);
          console.warn(`   ❌ ${provider} disabled (will use next provider)`);
        }
      }
    }
    return null; // all providers failed, caller uses fallback
  }

  async _callGemini(systemPrompt, userPrompt, { json, temperature, maxTokens }) {
    const model = json
      ? this.gemini.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: {
            responseMimeType: 'application/json',
            temperature,
            maxOutputTokens: maxTokens
          }
        })
      : this.gemini.getGenerativeModel({
          model: 'gemini-2.0-flash',
          generationConfig: { temperature, maxOutputTokens: maxTokens }
        });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser: ${userPrompt}` }] }]
    });
    const text = result.response.text();
    if (!text) throw new Error('Empty Gemini response');
    return text;
  }

  async _callGroq(systemPrompt, userPrompt, { json, temperature, maxTokens }) {
    const completion = await this.groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {})
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error('Empty Groq response');
    return text;
  }

  async _callOpenAI(systemPrompt, userPrompt, { json, temperature, maxTokens }) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature,
      max_tokens: maxTokens,
      ...(json ? { response_format: { type: 'json_object' } } : {})
    });
    const text = completion.choices[0]?.message?.content;
    if (!text) throw new Error('Empty OpenAI response');
    return text;
  }

  // =====================================================
  //  PUBLIC METHODS
  // =====================================================

  /**
   * Full conversational chat - handles ANY question like a real chatbot
   */
  async chat(messages, systemPrompt, dashboardContext) {
    // Build conversation context from history (last 10 turns)
    const recent = messages.slice(-10);
    const conversationText = recent.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const last = messages[messages.length - 1]?.content || '';

    // Include dashboard context if available so AI can reference data when relevant
    let dashCtx = '';
    if (dashboardContext) {
      dashCtx = `\n\nThe user currently has a dashboard loaded with this data (use it ONLY if they ask about it):\n${this._compactContext(dashboardContext)}`;
    }

    const result = await this._callAI(
      (systemPrompt || this.defaultSystemPrompt) + dashCtx,
      conversationText ? `Conversation so far:\n${conversationText}\n\nRespond to the user's latest message.` : last,
      { temperature: 0.7, maxTokens: 1500 }
    );
    return result || this.fallbackChat(messages);
  }

  /**
   * Detect user intent
   */
  async detectIntent(userMessage, hasDashboardLoaded = false) {
    const contextNote = hasDashboardLoaded
      ? '\nIMPORTANT: The user has a dashboard loaded. Only classify as "dashboard_question" if they EXPLICITLY ask about the dashboard, the loaded data, KPIs, charts, or specific metrics shown. General questions like "what is gravity", "write me code", "explain X" should be "chat" even with a dashboard loaded.'
      : '';

    const systemPrompt = `Classify the user message into exactly one category:
- "dashboard": user explicitly wants to CREATE/BUILD/GENERATE a NEW dashboard or visualization on a specific topic
- "dashboard_question": user explicitly asks about their CURRENT dashboard, loaded data, KPIs, chart values, or dataset metrics (e.g. "what is the average?", "show me the KPIs", "what does the data say?")
- "database": user wants to connect to a database, run a SQL query, or query their own database
- "chat": ANY general conversation, knowledge question, coding help, math, science, greeting, or anything NOT specifically about dashboards/data${contextNote}

When in doubt, classify as "chat". Most messages are general chat.
Return ONLY valid JSON: {"intent":"dashboard"|"dashboard_question"|"database"|"chat","topic":"extracted topic if dashboard","keywords":["kw1","kw2"]}`;

    const result = await this._callAI(systemPrompt, userMessage, { json: true, temperature: 0.1, maxTokens: 200 });
    
    if (result) {
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonStr = result.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (e) {
        console.warn('Failed to parse intent JSON:', e.message);
      }
    }
    return this.fallbackIntentDetection(userMessage, hasDashboardLoaded);
  }

  /**
   * Extract search keywords from a topic
   */
  async extractSearchKeywords(topic) {
    const systemPrompt = `Given a topic, return JSON with search terms for finding CSV datasets online.
Return: {"searchTerms":["term1","term2","term3"],"dataType":"type","suggestedColumns":["col1","col2"]}`;

    const result = await this._callAI(systemPrompt, `Find datasets about: ${topic}`, { json: true, temperature: 0.3, maxTokens: 200 });

    if (result) {
      try {
        const jsonStr = result.replace(/```json?\s*/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);
      } catch (e) {
        console.warn('Failed to parse keywords JSON:', e.message);
      }
    }
    return this.fallbackKeywords(topic);
  }

  /**
   * Generate insights from processed data
   */
  async generateInsights(statistics, topic) {
    const result = await this._callAI(
      'You are a data analyst. Provide 4-5 concise, actionable insights. Use bullet points with emoji. Be specific about numbers and trends.',
      `Analyze this ${topic} dataset:\n${JSON.stringify(statistics, null, 2)}\n\nProvide key insights.`,
      { temperature: 0.7, maxTokens: 600 }
    );
    return result || this.fallbackInsights(statistics, topic);
  }

  /**
   * Answer questions about the current dashboard
   */
  async answerDashboardQuestion(question, dashboardContext) {
    // Build a compact data summary for the AI
    const compactCtx = this._compactContext(dashboardContext);

    const result = await this._callAI(
      `You are a data analyst. The user has a dashboard loaded with this data:\n${compactCtx}\n\nAnswer their question using SPECIFIC numbers from the data. Be concise and helpful. Use markdown.`,
      question,
      { temperature: 0.5, maxTokens: 500 }
    );
    return result || this.fallbackDashboardQA(question, dashboardContext);
  }

  /** Build compact context string to save tokens */
  _compactContext(ctx) {
    if (!ctx) return 'No data loaded.';
    let s = `Dataset: ${ctx.datasetName || 'Unknown'}\n`;
    if (ctx.metadata) {
      s += `Rows: ${ctx.metadata.totalRows || '?'}, Columns: ${ctx.metadata.totalColumns || '?'}\n`;
    }
    if (ctx.kpis?.length) {
      s += 'KPIs: ' + ctx.kpis.map(k => `${k.label||k.name}=${k.value}`).join(', ') + '\n';
    }
    if (ctx.statistics) {
      for (const [field, stat] of Object.entries(ctx.statistics)) {
        if (stat.type === 'numeric') {
          s += `${field}: avg=${stat.average}, min=${stat.min}, max=${stat.max}`;
          if (stat.median) s += `, median=${stat.median}`;
          if (stat.sum) s += `, sum=${stat.sum}`;
          s += '\n';
        } else {
          s += `${field}: (text, ${stat.uniqueValues || '?'} unique)\n`;
        }
      }
    }
    return s;
  }

  // =====================================================
  //  INTELLIGENT FALLBACKS (no AI needed)
  // =====================================================

  get defaultSystemPrompt() {
    return `You are a helpful, friendly, and knowledgeable AI assistant. You can:
1. Answer ANY question on ANY topic - science, math, coding, history, general knowledge, etc.
2. Create data dashboards when users ask (they say "create a dashboard about...")
3. Answer questions about loaded dashboard data using specific numbers
4. Have natural conversations, provide explanations, write code, help with tasks

You are a GENERAL PURPOSE chatbot first, with bonus data/dashboard capabilities.
Be conversational, clear, and helpful. Use markdown formatting. Give thorough answers.
Do NOT redirect users to dashboard features unless they specifically ask about dashboards.`;
  }

  fallbackChat(messages) {
    const last = (messages[messages.length - 1]?.content || '').toLowerCase();

    if (/^(hello|hi|hey|good morning|good evening|good afternoon|sup|yo)/i.test(last.trim())) {
      return "Hello! 👋 I'm your AI assistant. I can help with pretty much anything:\n\n- 💬 **Chat & answer questions** on any topic\n- 📊 **Create dashboards** - just say *\"Create a dashboard about...\"*\n- 🧮 **Math, science, coding** - ask away!\n- 📁 **Analyze data** - upload files or ask about loaded dashboards\n\nWhat's on your mind?";
    }
    if (/help|what can you do|what do you do|your capabilit/.test(last)) {
      return "I'm a general-purpose AI assistant! Here's what I can do:\n\n1. 💬 **Answer any question** - science, math, history, coding, explain concepts\n2. 📊 **Create Dashboards** - Say *\"Create a dashboard about world GDP\"*\n3. 📁 **Analyze Data** - Upload CSV/Excel files for instant analysis\n4. ❓ **Dashboard Q&A** - Ask about data in your current dashboard\n5. 💻 **Write code** - Python, JavaScript, SQL, and more\n6. 🧠 **Explain things** - Complex topics made simple\n\nJust type naturally! 🚀";
    }
    if (/thank|thanks|thx/.test(last)) {
      return "You're welcome! Let me know if there's anything else I can help with. 😊";
    }
    if (/who are you|what are you|your name/.test(last)) {
      return "I'm your **AI Assistant** - think of me like ChatGPT with data superpowers! 🤖\n\nI can answer general questions, help with coding, explain concepts, AND create interactive data dashboards. Ask me anything!";
    }
    if (/how.*work|how.*use/.test(last)) {
      return "Just chat with me naturally! Here are some examples:\n\n- *\"What is quantum computing?\"*\n- *\"Write a Python function to sort a list\"*\n- *\"Create a dashboard about climate change\"*\n- *\"What's the difference between TCP and UDP?\"*\n\nFor dashboards, say **\"Create a dashboard about [topic]\"** and I'll find real data and visualize it! 📊";
    }
    // Math
    if (/what is \d|calculate|\d\s*[+\-*/]\s*\d|square root|factorial/.test(last)) {
      try {
        const mathMatch = last.match(/(\d+\.?\d*)\s*([+\-*/])\s*(\d+\.?\d*)/);
        if (mathMatch) {
          const [, a, op, b] = mathMatch;
          const ops = { '+': (x, y) => x+y, '-': (x, y) => x-y, '*': (x, y) => x*y, '/': (x, y) => x/y };
          const result = ops[op]?.(parseFloat(a), parseFloat(b));
          if (result !== undefined) return `The answer is **${result}** ✅`;
        }
      } catch {}
      return "I'd love to help with math! Could you rephrase the calculation? For example: *\"What is 15 * 24?\"*";
    }
    // Programming
    if (/write.*code|write.*function|write.*program|code.*for|how to code|javascript|python|java\b/.test(last)) {
      return this._codingFallback(last);
    }
    // General knowledge - try to answer intelligently
    return this._knowledgeFallback(last);
  }

  /** Attempt to answer coding questions with templates */
  _codingFallback(query) {
    if (/sort/.test(query)) {
      if (/python/.test(query)) return "Here's a Python sort function:\n\n```python\ndef sort_list(arr):\n    return sorted(arr)\n\n# Example\nnumbers = [5, 2, 8, 1, 9]\nprint(sort_list(numbers))  # [1, 2, 5, 8, 9]\n```\n\nUse `sorted()` for a new list or `.sort()` for in-place sorting.";
      return "Here's a JavaScript sort function:\n\n```javascript\nconst sortArray = (arr) => [...arr].sort((a, b) => a - b);\n\n// Example\nconst nums = [5, 2, 8, 1, 9];\nconsole.log(sortArray(nums)); // [1, 2, 5, 8, 9]\n```";
    }
    if (/fetch|api|http|request/.test(query)) {
      return "Here's a JavaScript fetch example:\n\n```javascript\nasync function fetchData(url) {\n  try {\n    const response = await fetch(url);\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// Usage\nfetchData('https://api.example.com/data')\n  .then(data => console.log(data));\n```";
    }
    if (/hello world/.test(query)) {
      return "Here's Hello World in several languages:\n\n**Python:**\n```python\nprint('Hello, World!')\n```\n\n**JavaScript:**\n```javascript\nconsole.log('Hello, World!');\n```\n\n**Java:**\n```java\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}\n```";
    }
    return "I'd be happy to help with coding! 💻 Here's what I can do right now:\n\n- 📊 **Create dashboards** with real data visualizations\n- 🔢 **Math calculations** - try *\"What is 256 * 48?\"*\n- ❓ **Data analysis** - ask about your loaded dashboard\n\nFor more complex code generation, try asking about specific patterns like *\"write a sort function\"* or *\"write a fetch example\"*!";
  }

  /** Smart knowledge fallback for general questions */
  _knowledgeFallback(query) {
    // Common knowledge Q&A patterns
    const knowledge = [
      [/what is (machine learning|ml)/, "**Machine Learning** is a subset of artificial intelligence where computers learn patterns from data without being explicitly programmed.\n\n**Key types:**\n- 🔵 **Supervised Learning** - learns from labeled data (e.g., spam detection)\n- 🟢 **Unsupervised Learning** - finds patterns in unlabeled data (e.g., clustering)\n- 🟡 **Reinforcement Learning** - learns by trial and reward (e.g., game AI)\n\nPopular tools: Python, TensorFlow, PyTorch, scikit-learn."],
      [/what is (artificial intelligence|\bai\b)/, "**Artificial Intelligence (AI)** is the simulation of human intelligence by machines. It includes:\n\n- 🧠 **Machine Learning** - learning from data\n- 💬 **Natural Language Processing** - understanding text/speech\n- 👁️ **Computer Vision** - understanding images\n- 🤖 **Robotics** - physical AI agents\n\nAI powers everything from voice assistants to self-driving cars."],
      [/what is (blockchain|crypto)/, "**Blockchain** is a decentralized, distributed digital ledger that records transactions across many computers.\n\n**Key features:**\n- 🔗 **Immutable** - records can't be altered\n- 🌐 **Decentralized** - no single point of control\n- 🔒 **Secure** - cryptographically protected\n\nUsed in: cryptocurrencies, supply chain, voting systems, NFTs."],
      [/what is (quantum computing|quantum)/, "**Quantum Computing** uses quantum mechanical phenomena (superposition, entanglement) to process information.\n\n**Key concepts:**\n- ⚛️ **Qubits** - can be 0, 1, or both simultaneously (superposition)\n- 🔗 **Entanglement** - qubits can be correlated\n- ⚡ **Speedup** - solves certain problems exponentially faster\n\nCompanies: IBM, Google, Microsoft, IonQ. Still in early stages but promising for cryptography, drug discovery, and optimization."],
      [/what is (api|an api)/, "**API (Application Programming Interface)** is a set of rules that lets different software applications communicate with each other.\n\n**Example:** When you check weather on your phone, the app sends a request to a weather API, which returns the data.\n\n**Types:**\n- 🌐 **REST API** - uses HTTP methods (GET, POST, PUT, DELETE)\n- 📡 **GraphQL** - flexible query language\n- 🔌 **WebSocket** - real-time two-way communication"],
      [/what is (python|javascript|typescript|react|node)/, "Great question about programming technologies! Here's a quick overview:\n\n- 🐍 **Python** - versatile language for AI/ML, web, automation\n- 💛 **JavaScript** - the language of the web (frontend + backend)\n- 🔷 **TypeScript** - JavaScript with static types\n- ⚛️ **React** - UI library for building web interfaces\n- 🟢 **Node.js** - JavaScript runtime for server-side code\n\nWant to create a dashboard? Just say *\"Create a dashboard about [topic]\"*!"],
      [/what is (sql|database)/, "**SQL (Structured Query Language)** is the standard language for managing relational databases.\n\n**Common commands:**\n```sql\nSELECT * FROM users WHERE age > 25;\nINSERT INTO users (name, age) VALUES ('John', 30);\nUPDATE users SET age = 31 WHERE name = 'John';\nDELETE FROM users WHERE name = 'John';\n```\n\n**Popular databases:** MySQL, PostgreSQL, SQLite, SQL Server."],
      [/what is (cloud computing|cloud|aws|azure)/, "**Cloud Computing** provides on-demand IT resources (servers, storage, databases) over the internet.\n\n**Main providers:**\n- ☁️ **AWS** (Amazon) - largest market share\n- 🔷 **Azure** (Microsoft) - enterprise-focused\n- 🌐 **GCP** (Google) - strong in AI/ML\n\n**Service models:**\n- **IaaS** - virtual machines\n- **PaaS** - managed platforms\n- **SaaS** - ready-to-use software"],
      [/what is (git|github|version control)/, "**Git** is a distributed version control system for tracking code changes.\n\n**Essential commands:**\n```bash\ngit init          # Start a repo\ngit add .         # Stage changes\ngit commit -m \"msg\"  # Save changes\ngit push          # Upload to remote\ngit pull          # Download changes\ngit branch        # List branches\n```\n\n**GitHub** is a platform for hosting Git repositories and collaborating."],
      [/difference between.*(tcp|udp)/, "**TCP vs UDP:**\n\n| Feature | TCP | UDP |\n|---------|-----|-----|\n| Connection | Connection-oriented | Connectionless |\n| Reliability | Guaranteed delivery | No guarantee |\n| Speed | Slower | Faster |\n| Use case | Web, email, file transfer | Streaming, gaming, DNS |\n\n**TCP** = reliable but slower. **UDP** = fast but may lose packets."],
      [/difference between.*(let|const|var)/, "**JavaScript variable declarations:**\n\n| Feature | `var` | `let` | `const` |\n|---------|-------|-------|---------|\n| Scope | Function | Block | Block |\n| Reassign | ✅ | ✅ | ❌ |\n| Redeclare | ✅ | ❌ | ❌ |\n| Hoisting | Yes (undefined) | Yes (TDZ) | Yes (TDZ) |\n\n**Best practice:** Use `const` by default, `let` when reassignment is needed, avoid `var`."],
      [/how does.*(internet|web) work/, "**How the Internet works (simplified):**\n\n1. 🖥️ You type a URL in your browser\n2. 📡 DNS converts the domain to an IP address\n3. 🔗 Your browser opens a TCP connection to the server\n4. 📤 Browser sends an HTTP request\n5. 📥 Server processes and sends back HTML/CSS/JS\n6. 🎨 Browser renders the page\n\n**Key protocols:** HTTP/HTTPS, TCP/IP, DNS, TLS/SSL"],
      [/capital of|president of|population of/, "That's a great general knowledge question! I'm best at:\n\n- 📊 **Creating data dashboards** - *\"Create a dashboard about world population\"*\n- 🧮 **Math & calculations** - *\"What is 256 * 48?\"*\n- 💻 **Tech & coding topics** - *\"What is machine learning?\"*\n- 📁 **Analyzing your data** - Upload a file or ask about your dashboard\n\nTry asking about a tech topic or create a dashboard to explore data!"],
    ];

    for (const [pattern, answer] of knowledge) {
      if (pattern.test(query)) return answer;
    }

    // Generic fallback - sounds confident, not broken
    return `I'd love to help with that! Here are some things I'm great at:\n\n- 💬 **Tech & concepts** - *\"What is machine learning?\"*, *\"Explain blockchain\"*\n- 📊 **Data dashboards** - *\"Create a dashboard about world GDP\"*\n- 🔢 **Math** - *\"What is 145 * 23?\"*\n- 💻 **Code snippets** - *\"Write a Python sort function\"*\n- ❓ **Dashboard Q&A** - Ask about any loaded data\n\nTry one of these, or ask me a specific question! 🚀`;
  }

  fallbackIntentDetection(message, hasDashboardLoaded = false) {
    const lower = message.toLowerCase().trim();

    const strongDashboard = ['create a dashboard', 'create dashboard', 'build a dashboard', 'build dashboard',
      'show me a dashboard', 'make a dashboard', 'make dashboard', 'generate dashboard', 'generate a dashboard'];
    const mediumDashboard = ['new dashboard', 'dashboard about', 'dashboard for', 'dashboard on'];

    const isDbRequest = /\b(query|connect|sql|database|mysql|postgres|postgresql)\b/.test(lower) &&
                        /\b(database|db|mysql|postgres|postgresql|query|sql|table|connect)\b/.test(lower);
    const isStrongDashboard = strongDashboard.some(w => lower.includes(w));
    const isMediumDashboard = mediumDashboard.some(w => lower.includes(w));

    if (isDbRequest) return { intent: 'database', topic: message, keywords: [] };

    if (isStrongDashboard || isMediumDashboard) {
      const topic = lower
        .replace(/\b(create|build|show|display|make|generate|new|me|the|dashboard|about|for|analyze|analysis|of|please|can you|i want|a)\b/gi, '')
        .replace(/\s+/g, ' ').trim();
      return { intent: 'dashboard', topic: topic || message, keywords: topic.split(' ').filter(w => w.length > 2) };
    }

    // Only route to dashboard_question if explicitly asking about dashboard/data/chart/KPI
    if (hasDashboardLoaded) {
      const dashboardKeywords = /\b(dashboard|kpi|metric|chart|graph|column|field|row|statistic|insight|overview|data summary|loaded data|this data|the data|my data|current data|show me the|what are the)\b/;
      const dataAggregation = /\b(average|mean|avg|max|maximum|min|minimum|total|sum|count|median|trend)\b/;
      // If message explicitly mentions dashboard terms or asks about data aggregation
      if (dashboardKeywords.test(lower) || (dataAggregation.test(lower) && lower.length < 60)) {
        return { intent: 'dashboard_question', topic: message, keywords: [] };
      }
    }

    // Default: general chat
    return { intent: 'chat', topic: '', keywords: [] };
  }

  fallbackKeywords(topic) {
    return {
      searchTerms: topic.toLowerCase().split(' ').filter(w => w.length > 2).slice(0, 5),
      dataType: 'general',
      suggestedColumns: []
    };
  }

  fallbackInsights(statistics, topic) {
    const numericStats = Object.entries(statistics || {}).filter(([_, s]) => s.type === 'numeric');
    let text = `📊 **${topic} Analysis**\n\n`;
    numericStats.slice(0, 3).forEach(([field, stat]) => {
      text += `- **${field}**: Avg ${Math.round(stat.average).toLocaleString()}, Range ${Math.round(stat.min).toLocaleString()} – ${Math.round(stat.max).toLocaleString()}\n`;
    });
    text += `\n✅ Explore the dashboard charts and KPIs above for more detail!`;
    return text;
  }

  /**
   * Intelligent fallback Q&A that uses actual dashboard data
   */
  fallbackDashboardQA(question, ctx) {
    const q = (question || '').toLowerCase();
    const stats = ctx?.statistics || {};
    const kpis = ctx?.kpis || [];
    const metadata = ctx?.metadata || {};
    const datasetName = ctx?.datasetName || 'the loaded dataset';
    const numericFields = Object.entries(stats).filter(([_, s]) => s.type === 'numeric');
    const textFields = Object.entries(stats).filter(([_, s]) => s.type === 'text');

    for (const [field, stat] of numericFields) {
      const fLower = field.toLowerCase();
      if (q.includes(fLower) || q.includes(fLower.replace(/_/g, ' '))) {
        if (/average|mean|avg/.test(q)) return `📊 The **average ${field}** in ${datasetName} is **${this._fmt(stat.average)}**.\n\nRange: ${this._fmt(stat.min)} to ${this._fmt(stat.max)} (across ${metadata.totalRows || 'all'} rows).`;
        if (/max|maximum|highest|largest|biggest|top|most/.test(q)) return `📈 The **maximum ${field}** is **${this._fmt(stat.max)}**.\n\nAverage: ${this._fmt(stat.average)} | Min: ${this._fmt(stat.min)}`;
        if (/min|minimum|lowest|smallest|least/.test(q)) return `📉 The **minimum ${field}** is **${this._fmt(stat.min)}**.\n\nAverage: ${this._fmt(stat.average)} | Max: ${this._fmt(stat.max)}`;
        if (/total|sum/.test(q)) {
          const total = stat.sum || stat.average * (metadata.totalRows || 1);
          return `📊 The **total ${field}** is approximately **${this._fmt(total)}**.\n\nAverage per row: ${this._fmt(stat.average)}`;
        }
        return `📊 **${field}** in ${datasetName}:\n\n- **Average**: ${this._fmt(stat.average)}\n- **Min**: ${this._fmt(stat.min)}\n- **Max**: ${this._fmt(stat.max)}\n- **Median**: ${this._fmt(stat.median || stat.average)}\n\nDataset has ${metadata.totalRows || 'multiple'} rows.`;
      }
    }

    if (/kpi|key performance|metric|indicator/.test(q)) {
      if (kpis.length === 0) return `No KPIs were generated for ${datasetName}.`;
      let a = `📋 **Dashboard KPIs for ${datasetName}:**\n\n`;
      kpis.forEach((k, i) => { a += `${i + 1}. **${k.label || k.name}**: ${this._fmt(k.value)}\n`; });
      return a;
    }
    if (/summary|overview|tell me about|describe|what is this|what data|about this/.test(q)) {
      let a = `📊 **Dashboard Overview: ${datasetName}**\n\n`;
      if (metadata.totalRows) a += `- **Rows**: ${metadata.totalRows.toLocaleString()}\n`;
      if (metadata.totalColumns) a += `- **Columns**: ${metadata.totalColumns}\n`;
      if (numericFields.length > 0) { a += `\n**Numeric Fields:**\n`; numericFields.slice(0, 5).forEach(([f, s]) => { a += `- **${f}**: avg ${this._fmt(s.average)}, range ${this._fmt(s.min)} – ${this._fmt(s.max)}\n`; }); }
      if (kpis.length > 0) { a += `\n**Key Metrics:**\n`; kpis.slice(0, 4).forEach(k => { a += `- ${k.label || k.name}: **${this._fmt(k.value)}**\n`; }); }
      return a;
    }
    if (/column|field|variable|what.*data|what.*contain/.test(q)) {
      const all = [...numericFields.map(([f]) => f), ...textFields.map(([f]) => f)];
      return `📋 **Columns in ${datasetName}:**\n\n${all.map(f => `- ${f}`).join('\n')}\n\n${numericFields.length} numeric, ${textFields.length} text columns.`;
    }
    if (/trend|growth|change|increase|decrease|over time|year/.test(q) && numericFields.length > 0) {
      const [field, stat] = numericFields[0];
      return `📈 **Trend Analysis for ${field}:**\n\nRange: ${this._fmt(stat.min)} to ${this._fmt(stat.max)}, span of **${this._fmt(stat.max - stat.min)}**.\nAverage: ${this._fmt(stat.average)}.\n\nCheck the dashboard charts for visual trends!`;
    }
    if (/compare|vs|versus|difference|between/.test(q) && numericFields.length >= 2) {
      const [f1, s1] = numericFields[0]; const [f2, s2] = numericFields[1];
      return `📊 **Comparison:**\n\n| Metric | ${f1} | ${f2} |\n|--------|--------|--------|\n| Average | ${this._fmt(s1.average)} | ${this._fmt(s2.average)} |\n| Min | ${this._fmt(s1.min)} | ${this._fmt(s2.min)} |\n| Max | ${this._fmt(s1.max)} | ${this._fmt(s2.max)} |`;
    }
    if (/how many|count|number of|total.*row|row.*count/.test(q)) {
      return `📋 **${datasetName}** contains **${(metadata.totalRows || 0).toLocaleString()}** rows and **${metadata.totalColumns || Object.keys(stats).length}** columns.`;
    }

    // Default: show all data
    let a = `📊 Here's what I found in **${datasetName}**:\n\n`;
    if (kpis.length > 0) { a += `**Key Metrics:**\n`; kpis.slice(0, 4).forEach(k => { a += `- ${k.label || k.name}: **${this._fmt(k.value)}**\n`; }); a += '\n'; }
    if (numericFields.length > 0) { a += `**Data Summary:**\n`; numericFields.slice(0, 4).forEach(([f, s]) => { a += `- **${f}**: avg ${this._fmt(s.average)}, range ${this._fmt(s.min)} – ${this._fmt(s.max)}\n`; }); }
    a += `\n💡 Try asking about a specific column name, KPIs, trends, or a summary!`;
    return a;
  }

  _fmt(val) {
    if (val == null || isNaN(val)) return 'N/A';
    const num = Number(val);
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (Math.abs(num) >= 1e3) return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2);
  }
}

module.exports = new AIService();
