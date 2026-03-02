/**
 * Dataset Finder Service
 * Automatically searches and retrieves relevant datasets from open sources
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class DatasetFinder {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour
    
    // Curated dataset URLs for common topics
    this.datasetRegistry = {
      covid: [
        {
          name: 'COVID-19 Global Cases',
          url: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv',
          type: 'timeseries',
          description: 'Global COVID-19 confirmed cases over time'
        }
      ],
      sales: [
        {
          name: 'Sample Retail Sales Data',
          url: 'https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv',
          type: 'economic',
          description: 'Economic indicators and sales metrics'
        }
      ],
      stock: [
        {
          name: 'Stock Market Data',
          url: 'https://raw.githubusercontent.com/datasets/s-and-p-500/master/data/data.csv',
          type: 'financial',
          description: 'S&P 500 stock market data'
        }
      ],
      population: [
        {
          name: 'World Population Data',
          url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
          type: 'demographic',
          description: 'Global population statistics'
        }
      ],
      climate: [
        {
          name: 'Global Temperature Data',
          url: 'https://raw.githubusercontent.com/datasets/global-temp/master/data/annual.csv',
          type: 'environmental',
          description: 'Annual global temperature records'
        }
      ]
    };
  }

  /**
   * Find and retrieve relevant dataset based on AI-extracted intent
   * @param {Object} intent - AI-extracted keywords and data type
   * @returns {Promise<Object>} - Dataset metadata and raw data
   */
  async findDataset(intent) {
    try {
      const { dataType, keywords } = intent;

      // Check cache first
      const cacheKey = `dataset_${dataType}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('📦 Returning cached dataset for:', dataType);
        return cached;
      }

      // Find matching dataset from registry
      const datasets = this.datasetRegistry[dataType] || this.datasetRegistry.sales;
      const selectedDataset = datasets[0]; // Use first match for simplicity

      console.log('🔍 Searching for dataset:', dataType);
      console.log('📊 Selected:', selectedDataset.name);

      // Download dataset
      const rawData = await this.downloadDataset(selectedDataset.url);

      const result = {
        metadata: {
          name: selectedDataset.name,
          type: selectedDataset.type,
          description: selectedDataset.description,
          source: selectedDataset.url,
          rowCount: rawData.split('\n').length - 1
        },
        rawData: rawData
      };

      // Cache the result
      this.cache.set(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Dataset Finder Error:', error.message);
      throw new Error('Unable to locate relevant dataset. Please refine your request.');
    }
  }

  /**
   * Download CSV dataset from URL
   * @param {string} url - Dataset URL
   * @returns {Promise<string>} - Raw CSV data
   */
  async downloadDataset(url) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'AI-BI-Dashboard/1.0'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Dataset Download Error:', error.message);
      throw new Error('Failed to download dataset');
    }
  }

  /**
   * Search external dataset APIs (extended functionality)
   * This can be expanded to use Kaggle API, data.gov, etc.
   */
  async searchExternalAPIs(keywords) {
    // Placeholder for external API integration
    // In production, this would call Kaggle, data.gov, World Bank, etc.
    console.log('🌐 External API search not yet implemented');
    return null;
  }
}

module.exports = new DatasetFinder();
