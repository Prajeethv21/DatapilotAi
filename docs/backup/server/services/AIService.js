/**
 * AI Service - OpenAI Integration
 * Handles natural language understanding and insight generation
 * Security: API key validation, error handling, no key exposure
 */

const OpenAI = require('openai');

class AIService {
  constructor() {
    // SECURITY: Validate API key exists and format
    this.validateAPIKey();
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      // SECURITY: Set timeout to prevent hanging requests
      timeout: 10000, // 10 seconds (reduced for faster responses)
      maxRetries: 1  // Reduced retries for speed
    });
    
    // Track quota status to skip API calls faster
    this.quotaExceeded = false;
    this.quotaResetTime = null;
  }

  /**
   * Validate OpenAI API key
   * SECURITY: Ensure key exists and has correct format
   */
  validateAPIKey() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not configured in environment variables');
    }

    // OpenAI keys start with 'sk-'
    if (!apiKey.startsWith('sk-')) {
      console.warn('⚠️  OpenAI API key format may be invalid');
    }

    // Ensure key is not the placeholder
    if (apiKey === 'your_openai_api_key_here') {
      throw new Error('Please set a valid OPENAI_API_KEY in .env file');
    }

    console.log('✅ OpenAI API key validated');
  }

  /**
   * Extract keywords and intent from user prompt
   * @param {string} userPrompt - Natural language request
   * @returns {Promise<Object>} - Extracted keywords and dataset type
   */
  async extractIntent(userPrompt) {
    // Skip API call if quota exceeded
    if (this.quotaExceeded) {
      console.log('⚡ Skipping OpenAI call - using fallback (quota exceeded)');
      return this.fallbackExtraction(userPrompt);
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a data analyst assistant. Extract key information from user requests for datasets.
Return JSON with:
- keywords: array of search terms
- dataType: type of data (sales, covid, stock, economic, etc)
- metrics: what metrics user wants to analyze
- timeframe: any time period mentioned`
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('AI Intent Extraction Error:', error.message);
      
      // Mark quota as exceeded if 429 error
      if (error.status === 429) {
        this.quotaExceeded = true;
        console.log('🚫 OpenAI quota exceeded - switching to fallback mode');
      }
      
      // Fallback to simple keyword extraction
      return this.fallbackExtraction(userPrompt);
    }
  }

  /**
   * Generate insights from processed dataset
   * @param {Object} dataStats - Aggregated statistics
   * @param {string} topic - Dataset topic
   * @returns {Promise<string>} - AI-generated insights
   */
  async generateInsights(dataStats, topic) {
    // Skip API call if quota exceeded
    if (this.quotaExceeded) {
      console.log('⚡ Skipping insight generation - quota exceeded');
      return "✅ Data analysis complete! Review the dashboard above for detailed visualizations, trends, and metrics.";
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a business intelligence analyst. Provide concise, actionable insights from data statistics."
          },
          {
            role: "user",
            content: `Analyze this ${topic} data and provide 3-4 key insights:\n\nStatistics:\n${JSON.stringify(dataStats, null, 2)}\n\nProvide brief, bullet-point insights focusing on trends, patterns, and notable findings.`
          }
        ],
        max_tokens: 300,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('AI Insight Generation Error:', error.message);
      
      // Mark quota as exceeded if 429 error
      if (error.status === 429) {
        this.quotaExceeded = true;
      }
      
      return "✅ Data analysis complete! Review the dashboard above for detailed visualizations, trends, and metrics.";
    }
  }

  /**
   * Fallback extraction when API fails
   */
  fallbackExtraction(prompt) {
    const keywords = prompt
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(' ')
      .filter(word => word.length > 3);

    return {
      keywords: keywords.slice(0, 5),
      dataType: this.detectDataType(prompt),
      metrics: ['total', 'average', 'trend'],
      timeframe: null
    };
  }

  /**
   * Detect data type from prompt keywords
   */
  detectDataType(prompt) {
    const types = {
      'covid|pandemic|virus|cases|deaths': 'covid',
      'sales|revenue|ecommerce|customers': 'sales',
      'stock|market|trading|prices': 'stock',
      'climate|weather|temperature': 'climate',
      'population|demographic': 'population'
    };

    for (const [pattern, type] of Object.entries(types)) {
      if (new RegExp(pattern, 'i').test(prompt)) {
        return type;
      }
    }

    return 'general';
  }
}

module.exports = new AIService();
