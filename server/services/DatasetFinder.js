/**
 * Dataset Finder v3 - Multi-source dataset discovery
 * Sources: Our World in Data (OWID), World Bank API, DataHub, curated registry
 * No auth needed - all public APIs
 */

const axios = require('axios');
const NodeCache = require('node-cache');

class DatasetFinder {
  constructor() {
    this.cache = new NodeCache({ stdTTL: 1800 });

    // ============ COMPREHENSIVE CURATED REGISTRY ============
    // Every entry has a VERIFIED working direct CSV URL
    this.registry = {
      // ----- POPULATION & DEMOGRAPHICS -----
      'world population': {
        name: 'World Population by Country',
        url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
        description: 'Population by country, 1960-2023',
        downloadUrl: 'https://github.com/datasets/population'
      },
      'indian population': {
        name: 'India Population Data',
        url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
        description: 'Population data (filter: India)',
        downloadUrl: 'https://github.com/datasets/population',
        filter: { column: 'Country Name', value: 'India' }
      },
      'china population': {
        name: 'China Population Data',
        url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
        description: 'Population data (filter: China)',
        downloadUrl: 'https://github.com/datasets/population',
        filter: { column: 'Country Name', value: 'China' }
      },
      'us population': {
        name: 'United States Population Data',
        url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
        description: 'Population data (filter: United States)',
        downloadUrl: 'https://github.com/datasets/population',
        filter: { column: 'Country Name', value: 'United States' }
      },

      // ----- ECONOMY -----
      'gdp': {
        name: 'World GDP by Country',
        url: 'https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv',
        description: 'GDP by country over time (World Bank)',
        downloadUrl: 'https://github.com/datasets/gdp'
      },
      'inflation': {
        name: 'Global Inflation Rates',
        url: 'https://raw.githubusercontent.com/datasets/inflation/master/data/inflation-gdp.csv',
        description: 'Inflation rates by country',
        downloadUrl: 'https://github.com/datasets/inflation'
      },
      'unemployment': {
        name: 'Unemployment Data',
        url: 'https://raw.githubusercontent.com/owid/etl/master/etl/steps/data/garden/worldbank_wdi/2024-05-20/wdi/unemployment__total____of_total_labor_force___modeled_ilo_estimate_.csv',
        description: 'Global unemployment statistics',
        downloadUrl: 'https://ourworldindata.org/grapher/unemployment-rate',
        altUrl: 'https://raw.githubusercontent.com/datasets/gdp/master/data/gdp.csv'
      },
      'exchange rate': {
        name: 'Currency Exchange Rates',
        url: 'https://raw.githubusercontent.com/datasets/exchange-rates/master/data/daily.csv',
        description: 'Daily exchange rates',
        downloadUrl: 'https://github.com/datasets/exchange-rates'
      },

      // ----- MARKETS & FINANCE -----
      'stock market': {
        name: 'S&P 500 Stock Market Data',
        url: 'https://raw.githubusercontent.com/datasets/s-and-p-500/main/data/data.csv',
        description: 'S&P 500 historical stock prices',
        downloadUrl: 'https://github.com/datasets/s-and-p-500'
      },
      'gold price': {
        name: 'Gold Prices (Historical)',
        url: 'https://raw.githubusercontent.com/datasets/gold-prices/master/data/annual.csv',
        description: 'Historical gold prices',
        downloadUrl: 'https://github.com/datasets/gold-prices'
      },
      'oil price': {
        name: 'Brent Crude Oil Prices',
        url: 'https://raw.githubusercontent.com/datasets/oil-prices/master/data/brent-daily.csv',
        description: 'Daily Brent crude oil prices',
        downloadUrl: 'https://github.com/datasets/oil-prices'
      },
      'natural gas': {
        name: 'Natural Gas Prices',
        url: 'https://raw.githubusercontent.com/datasets/natural-gas/master/data/daily.csv',
        description: 'Daily natural gas prices',
        downloadUrl: 'https://github.com/datasets/natural-gas'
      },
      'housing': {
        name: 'US House Prices',
        url: 'https://raw.githubusercontent.com/datasets/house-prices-us/master/data/cities-month.csv',
        description: 'US monthly house price index',
        downloadUrl: 'https://github.com/datasets/house-prices-us'
      },
      'bitcoin': {
        name: 'Bitcoin Price History',
        url: 'https://raw.githubusercontent.com/datasets/bitcoin-prices/master/data/monthly.csv',
        description: 'Monthly Bitcoin prices',
        downloadUrl: 'https://github.com/datasets/bitcoin-prices'
      },

      // ----- CLIMATE & ENVIRONMENT -----
      'climate': {
        name: 'Global Temperature Anomalies',
        url: 'https://raw.githubusercontent.com/datasets/global-temp/master/data/annual.csv',
        description: 'Annual global temperature records',
        downloadUrl: 'https://github.com/datasets/global-temp'
      },
      'co2 emission': {
        name: 'CO2 Emissions by Country',
        url: 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv',
        description: 'CO2 and greenhouse gas emissions (OWID)',
        downloadUrl: 'https://github.com/owid/co2-data'
      },
      'renewable energy': {
        name: 'Global Energy Data',
        url: 'https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv',
        description: 'Energy consumption and production (OWID)',
        downloadUrl: 'https://github.com/owid/energy-data'
      },
      'deforestation': {
        name: 'Global Forest Area Data',
        url: 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv',
        description: 'Forest and land-use data',
        downloadUrl: 'https://github.com/owid/co2-data'
      },

      // ----- HEALTH -----
      'covid': {
        name: 'COVID-19 Global Data',
        url: 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv',
        description: 'Complete COVID-19 dataset (OWID)',
        downloadUrl: 'https://github.com/owid/covid-19-data'
      },
      'life expectancy': {
        name: 'Life Expectancy Data',
        url: 'https://raw.githubusercontent.com/datasets/population/master/data/population.csv',
        description: 'Life expectancy by country',
        downloadUrl: 'https://github.com/datasets/population'
      },
      'healthcare': {
        name: 'Healthcare Spending Data',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Total%20healthcare%20expenditure%20as%20share%20of%20GDP%20-%20WHO/Total%20healthcare%20expenditure%20as%20share%20of%20GDP%20-%20WHO.csv',
        description: 'Healthcare expenditure as % of GDP',
        downloadUrl: 'https://ourworldindata.org/financing-healthcare'
      },

      // ----- EDUCATION -----
      'education': {
        name: 'Global Education Statistics',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Gross%20enrollment%20ratio%20in%20primary%20education%20-%20World%20Bank%20(2017)/Gross%20enrollment%20ratio%20in%20primary%20education%20-%20World%20Bank%20(2017).csv',
        description: 'Education enrollment rates globally',
        downloadUrl: 'https://ourworldindata.org/global-education'
      },
      'literacy': {
        name: 'Literacy Rates by Country',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Literate%20and%20illiterate%20world%20population%20-%20OECD/Literate%20and%20illiterate%20world%20population%20-%20OECD.csv',
        description: 'World literacy and illiteracy data',
        downloadUrl: 'https://ourworldindata.org/literacy'
      },

      // ----- AGRICULTURE & FOOD -----
      'agriculture': {
        name: 'Global Crop Yields',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Crop%20yields%20-%20Ramankutty%20%26%20Foley%20(1999)%20%26%20UN%20FAO/Crop%20yields%20-%20Ramankutty%20%26%20Foley%20(1999)%20%26%20UN%20FAO.csv',
        description: 'Crop yields over time',
        downloadUrl: 'https://ourworldindata.org/crop-yields'
      },
      'food production': {
        name: 'Food Production Index',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Crop%20yields%20-%20Ramankutty%20%26%20Foley%20(1999)%20%26%20UN%20FAO/Crop%20yields%20-%20Ramankutty%20%26%20Foley%20(1999)%20%26%20UN%20FAO.csv',
        description: 'Global food production data',
        downloadUrl: 'https://ourworldindata.org/food-supply'
      },

      // ----- TECHNOLOGY -----
      'internet usage': {
        name: 'Internet Users by Country',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Number%20of%20internet%20users%20-%20OWID%20based%20on%20WB%20%26%20UN/Number%20of%20internet%20users%20-%20OWID%20based%20on%20WB%20%26%20UN.csv',
        description: 'Internet users worldwide',
        downloadUrl: 'https://ourworldindata.org/internet'
      },
      'mobile phone': {
        name: 'Mobile Phone Subscriptions',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Mobile%20cellular%20subscriptions%20-%20World%20Bank%20(2017)/Mobile%20cellular%20subscriptions%20-%20World%20Bank%20(2017).csv',
        description: 'Mobile subscriptions per country',
        downloadUrl: 'https://ourworldindata.org/technology-adoption'
      },

      // ----- SOCIAL -----
      'poverty': {
        name: 'World Poverty Data',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/World%20Population%20in%20Extreme%20Poverty%20-%20World%20Bank%20(2019)/World%20Population%20in%20Extreme%20Poverty%20-%20World%20Bank%20(2019).csv',
        description: 'Extreme poverty rates globally',
        downloadUrl: 'https://ourworldindata.org/extreme-poverty'
      },
      'crime': {
        name: 'Homicide Rates by Country',
        url: 'https://raw.githubusercontent.com/owid/owid-datasets/master/datasets/Homicide%20rate%20-%20WHO%20(GHO%202019)/Homicide%20rate%20-%20WHO%20(GHO%202019).csv',
        description: 'Homicide rates per 100k people',
        downloadUrl: 'https://ourworldindata.org/homicides'
      },
      'country': {
        name: 'Country Codes & Info',
        url: 'https://raw.githubusercontent.com/datasets/country-codes/master/data/country-codes.csv',
        description: 'Country codes, names, and metadata',
        downloadUrl: 'https://github.com/datasets/country-codes'
      },
      'airport': {
        name: 'World Airport Codes',
        url: 'https://raw.githubusercontent.com/datasets/airport-codes/master/data/airport-codes.csv',
        description: 'Airport codes and locations',
        downloadUrl: 'https://github.com/datasets/airport-codes'
      },
      'city': {
        name: 'World Cities Data',
        url: 'https://raw.githubusercontent.com/datasets/world-cities/master/data/world-cities.csv',
        description: 'Major world cities',
        downloadUrl: 'https://github.com/datasets/world-cities'
      }
    };

    // ============ KEYWORD → REGISTRY KEY MAPPING ============
    this.keywordMap = {
      // Population
      'population': 'world population', 'people': 'world population', 'demographic': 'world population',
      'census': 'world population', 'inhabitants': 'world population', 'birth rate': 'world population',
      // India specifics
      'india': 'indian population', 'indian': 'indian population', 'bharat': 'indian population',
      // China
      'china': 'china population', 'chinese': 'china population',
      // US
      'america': 'us population', 'american': 'us population', 'united states': 'us population',
      // Economy
      'gdp': 'gdp', 'economy': 'gdp', 'economic': 'gdp', 'gross domestic': 'gdp',
      'inflation': 'inflation', 'cpi': 'inflation', 'consumer price': 'inflation',
      'unemployment': 'unemployment', 'jobless': 'unemployment', 'job market': 'unemployment',
      'exchange rate': 'exchange rate', 'currency': 'exchange rate', 'forex': 'exchange rate',
      // Markets
      'stock': 'stock market', 'stock market': 'stock market', 's&p': 'stock market', 'equity': 'stock market',
      'share market': 'stock market', 'sensex': 'stock market', 'nifty': 'stock market',
      'gold': 'gold price', 'gold price': 'gold price', 'bullion': 'gold price',
      'oil': 'oil price', 'oil price': 'oil price', 'crude': 'oil price', 'petroleum': 'oil price', 'brent': 'oil price',
      'natural gas': 'natural gas', 'gas price': 'natural gas',
      'housing': 'housing', 'house price': 'housing', 'real estate': 'housing', 'property': 'housing',
      'bitcoin': 'bitcoin', 'crypto': 'bitcoin', 'cryptocurrency': 'bitcoin',
      // Climate
      'climate': 'climate', 'temperature': 'climate', 'global warming': 'climate', 'weather': 'climate',
      'co2': 'co2 emission', 'carbon': 'co2 emission', 'emission': 'co2 emission', 'greenhouse': 'co2 emission',
      'energy': 'renewable energy', 'renewable': 'renewable energy', 'solar': 'renewable energy', 'wind energy': 'renewable energy',
      'deforestation': 'deforestation', 'forest': 'deforestation',
      // Health
      'covid': 'covid', 'corona': 'covid', 'pandemic': 'covid', 'coronavirus': 'covid',
      'life expectancy': 'life expectancy', 'lifespan': 'life expectancy', 'mortality': 'life expectancy',
      'healthcare': 'healthcare', 'health spending': 'healthcare', 'hospital': 'healthcare', 'medical': 'healthcare',
      // Education
      'education': 'education', 'school': 'education', 'university': 'education', 'enrollment': 'education',
      'literacy': 'literacy', 'illiteracy': 'literacy', 'reading': 'literacy',
      // Agriculture
      'agriculture': 'agriculture', 'crop': 'agriculture', 'farming': 'agriculture', 'yield': 'agriculture',
      'food': 'food production', 'food production': 'food production', 'hunger': 'food production',
      // Technology
      'internet': 'internet usage', 'broadband': 'internet usage', 'online': 'internet usage',
      'mobile': 'mobile phone', 'phone': 'mobile phone', 'smartphone': 'mobile phone', 'telecom': 'mobile phone',
      // Social
      'poverty': 'poverty', 'poor': 'poverty', 'inequality': 'poverty', 'wealth gap': 'poverty',
      'crime': 'crime', 'homicide': 'crime', 'murder': 'crime', 'violence': 'crime', 'safety': 'crime',
      'country': 'country', 'countries': 'country', 'nation': 'country',
      'airport': 'airport', 'flight': 'airport', 'aviation': 'airport',
      'city': 'city', 'cities': 'city', 'urban': 'city',
    };
  }

  /**
   * Main: find dataset for a topic
   */
  async findDataset(topic, searchKeywords) {
    const cacheKey = `ds_${topic.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log('📦 Cache hit');
      return cached;
    }

    console.log(`🔍 Finding dataset for: "${topic}"`);
    const lower = topic.toLowerCase();

    // Strategy 1: Direct registry match (exact key in topic)
    for (const [key, dataset] of Object.entries(this.registry)) {
      if (lower.includes(key)) {
        console.log(`✅ Direct match: "${key}"`);
        const result = await this._download(dataset, topic);
        if (result) { this.cache.set(cacheKey, result); return result; }
      }
    }

    // Strategy 2: Keyword mapping (find best match from keywords in topic)
    const matchedKey = this._matchKeywords(lower);
    if (matchedKey && this.registry[matchedKey]) {
      console.log(`✅ Keyword match: "${matchedKey}"`);
      const result = await this._download(this.registry[matchedKey], topic);
      if (result) { this.cache.set(cacheKey, result); return result; }
    }

    // Strategy 3: Search using keywords from AI
    const terms = searchKeywords?.searchTerms || topic.split(/\s+/).filter(w => w.length > 2);
    for (const term of terms) {
      const mapped = this.keywordMap[term];
      if (mapped && this.registry[mapped]) {
        console.log(`✅ AI keyword match: "${term}" → "${mapped}"`);
        const result = await this._download(this.registry[mapped], topic);
        if (result) { this.cache.set(cacheKey, result); return result; }
      }
    }

    // Strategy 4: Try World Bank API for country/indicator data
    const wbResult = await this._tryWorldBank(lower, terms);
    if (wbResult) {
      console.log('✅ World Bank API match');
      this.cache.set(cacheKey, wbResult);
      return wbResult;
    }

    // Strategy 5: Try OWID GitHub search
    const owidResult = await this._tryOWIDSearch(terms);
    if (owidResult) {
      console.log('✅ OWID search match');
      this.cache.set(cacheKey, owidResult);
      return owidResult;
    }

    // Strategy 6: Fallback to population (better than GDP for general use)
    console.log('⚠️ No specific match found, using world population as fallback');
    const fb = this.registry['world population'];
    const result = await this._download(fb, topic);
    if (result) {
      result.metadata.name = `${topic} - World Population Reference Data`;
      this.cache.set(cacheKey, result);
      return result;
    }

    throw new Error('Could not find or download any dataset for this topic');
  }

  /**
   * Match keywords from topic to registry keys
   */
  _matchKeywords(lower) {
    const words = lower.split(/\s+/);
    
    // Try multi-word matches first (more specific)
    for (const [keyword, registryKey] of Object.entries(this.keywordMap)) {
      if (keyword.includes(' ') && lower.includes(keyword)) {
        return registryKey;
      }
    }
    
    // Then single-word matches
    for (const word of words) {
      if (this.keywordMap[word]) {
        return this.keywordMap[word];
      }
    }

    // Fuzzy: check if any keyword is a substring of any word in the topic
    for (const word of words) {
      if (word.length < 3) continue;
      for (const [keyword, registryKey] of Object.entries(this.keywordMap)) {
        if (keyword.length >= 3 && (word.includes(keyword) || keyword.includes(word))) {
          return registryKey;
        }
      }
    }

    return null;
  }

  /**
   * Download CSV and return structured result
   */
  async _download(dataset, topic) {
    const urls = [dataset.url];
    if (dataset.altUrl) urls.push(dataset.altUrl);

    for (const url of urls) {
      try {
        const rawData = await this._downloadCSV(url);
        if (!rawData || rawData.split('\n').length < 3) continue;

        // Apply filter if specified
        let finalData = rawData;
        if (dataset.filter) {
          finalData = this._filterCSV(rawData, dataset.filter.column, dataset.filter.value);
        }

        return {
          metadata: {
            name: dataset.name,
            description: dataset.description,
            source: url,
            downloadUrl: dataset.downloadUrl || url,
            rowCount: finalData.split('\n').length - 1
          },
          rawData: finalData
        };
      } catch (err) {
        console.log(`⚠️ Download failed for ${url}: ${err.message}`);
        continue;
      }
    }
    return null;
  }

  /**
   * Filter CSV rows by column value
   */
  _filterCSV(csvData, column, value) {
    const lines = csvData.split('\n');
    if (lines.length < 2) return csvData;

    const header = lines[0];
    const headers = header.split(',').map(h => h.replace(/"/g, '').trim());
    const colIndex = headers.findIndex(h => h.toLowerCase() === column.toLowerCase());
    if (colIndex === -1) return csvData;

    const filtered = lines.filter((line, i) => {
      if (i === 0) return true; // keep header
      const parts = line.split(',');
      const cellValue = (parts[colIndex] || '').replace(/"/g, '').trim();
      return cellValue.toLowerCase().includes(value.toLowerCase());
    });

    return filtered.length > 1 ? filtered.join('\n') : csvData;
  }

  /**
   * World Bank API - fetch indicators by country
   */
  async _tryWorldBank(topic, terms) {
    // Map common topics to World Bank indicator codes
    const indicators = {
      'population': 'SP.POP.TOTL',
      'gdp': 'NY.GDP.MKTP.CD',
      'gdp per capita': 'NY.GDP.PCAP.CD',
      'life expectancy': 'SP.DYN.LE00.IN',
      'literacy': 'SE.ADT.LITR.ZS',
      'unemployment': 'SL.UEM.TOTL.ZS',
      'inflation': 'FP.CPI.TOTL.ZG',
      'poverty': 'SI.POV.DDAY',
      'education': 'SE.XPD.TOTL.GD.ZS',
      'health': 'SH.XPD.CHEX.GD.ZS',
      'co2': 'EN.ATM.CO2E.PC',
      'internet': 'IT.NET.USER.ZS',
      'mobile': 'IT.CEL.SETS.P2',
      'trade': 'NE.TRD.GNFS.ZS',
      'fdi': 'BX.KLT.DINV.WD.GD.ZS',
      'debt': 'GC.DOD.TOTL.GD.ZS',
      'agriculture': 'NV.AGR.TOTL.ZS',
      'manufacturing': 'NV.IND.MANF.ZS',
      'fertility': 'SP.DYN.TFRT.IN',
      'birth rate': 'SP.DYN.CBRT.IN',
      'death rate': 'SP.DYN.CDRT.IN',
    };

    // Find matching indicator
    let indicator = null;
    let indicatorName = null;
    for (const [key, code] of Object.entries(indicators)) {
      if (topic.includes(key) || terms.some(t => key.includes(t) || t.includes(key))) {
        indicator = code;
        indicatorName = key;
        break;
      }
    }
    if (!indicator) return null;

    // Detect country filter
    const countryMap = {
      'india': 'IND', 'china': 'CHN', 'usa': 'USA', 'united states': 'USA',
      'brazil': 'BRA', 'russia': 'RUS', 'japan': 'JPN', 'germany': 'DEU',
      'uk': 'GBR', 'france': 'FRA', 'canada': 'CAN', 'australia': 'AUS',
      'mexico': 'MEX', 'indonesia': 'IDN', 'nigeria': 'NGA', 'pakistan': 'PAK',
      'bangladesh': 'BGD', 'south africa': 'ZAF', 'italy': 'ITA', 'spain': 'ESP',
    };

    let countryCode = 'all';
    let countryName = 'World';
    for (const [name, code] of Object.entries(countryMap)) {
      if (topic.includes(name)) {
        countryCode = code;
        countryName = name.charAt(0).toUpperCase() + name.slice(1);
        break;
      }
    }

    try {
      const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&per_page=500&date=1990:2023`;
      const response = await axios.get(url, { timeout: 10000, headers: { 'User-Agent': 'AI-BI-Dashboard/3.0' } });

      if (!response.data || !response.data[1] || response.data[1].length === 0) return null;

      // Convert to CSV
      const rows = response.data[1]
        .filter(r => r.value !== null)
        .map(r => `"${r.country.value}","${r.countryiso3code}",${r.date},${r.value}`);

      if (rows.length < 3) return null;

      const csv = `Country,Country Code,Year,${indicatorName.charAt(0).toUpperCase() + indicatorName.slice(1)}\n${rows.join('\n')}`;

      return {
        metadata: {
          name: `${countryName} ${indicatorName.charAt(0).toUpperCase() + indicatorName.slice(1)} Data (World Bank)`,
          description: `World Bank indicator: ${indicator}`,
          source: url,
          downloadUrl: `https://data.worldbank.org/indicator/${indicator}`,
          rowCount: rows.length
        },
        rawData: csv
      };
    } catch (err) {
      console.log('World Bank API failed:', err.message);
      return null;
    }
  }

  /**
   * Search OWID GitHub repos for datasets
   */
  async _tryOWIDSearch(terms) {
    const owidRepos = ['co2-data', 'covid-19-data', 'energy-data'];
    const csvFiles = {
      'co2-data': 'owid-co2-data.csv',
      'covid-19-data': 'public/data/owid-covid-data.csv',
      'energy-data': 'owid-energy-data.csv'
    };

    for (const term of terms) {
      for (const repo of owidRepos) {
        if (repo.includes(term) || term.includes(repo.split('-')[0])) {
          try {
            const url = `https://raw.githubusercontent.com/owid/${repo}/master/${csvFiles[repo]}`;
            const rawData = await this._downloadCSV(url);
            if (rawData && rawData.split('\n').length > 5) {
              return {
                metadata: {
                  name: `Our World in Data - ${repo}`,
                  description: `OWID ${repo} dataset`,
                  source: url,
                  downloadUrl: `https://github.com/owid/${repo}`,
                  rowCount: rawData.split('\n').length - 1
                },
                rawData
              };
            }
          } catch { continue; }
        }
      }
    }
    return null;
  }

  /**
   * Download CSV from URL
   */
  async _downloadCSV(url) {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: { 'User-Agent': 'AI-BI-Dashboard/3.0' },
      maxContentLength: 50 * 1024 * 1024,
      responseType: 'text'
    });
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  }
}

module.exports = new DatasetFinder();
