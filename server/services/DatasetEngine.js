/**
 * Dataset Processing Engine
 * Analyzes CSV data and computes statistics for visualization
 */

const Papa = require('papaparse');

class DatasetEngine {
  /**
   * Process raw CSV data into structured analytics
   * @param {string} rawCSV - Raw CSV data
   * @returns {Object} - Processed data with statistics and chart data
   */
  processDataset(rawCSV) {
    try {
      // Parse CSV
      const parsed = Papa.parse(rawCSV, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        preview: 5000  // Limit to first 5000 rows for performance
      });

      let data = parsed.data;
      const fields = parsed.meta.fields;

      // Limit data for performance (max 5000 rows)
      if (data.length > 5000) {
        console.log(`⚡ Limiting dataset from ${data.length} to 5000 rows for performance`);
        data = data.slice(0, 5000);
      }

      console.log(`📊 Processing ${data.length} rows with ${fields.length} columns`);

      // Analyze column types
      const columnTypes = this.detectColumnTypes(data, fields);
      
      // Calculate statistics
      const statistics = this.calculateStatistics(data, columnTypes);
      
      // Prepare chart data
      const chartData = this.prepareChartData(data, columnTypes);
      
      // Generate KPIs
      const kpis = this.generateKPIs(data, columnTypes, statistics);

      return {
        metadata: {
          totalRows: data.length,
          columns: fields.length,
          columnTypes: columnTypes
        },
        statistics: statistics,
        chartData: chartData,
        kpis: kpis,
        sampleData: data.slice(0, 10) // First 10 rows for preview
      };
    } catch (error) {
      console.error('Dataset Processing Error:', error.message);
      throw new Error('Failed to process dataset');
    }
  }

  /**
   * Detect column data types (numeric, date, categorical)
   */
  detectColumnTypes(data, fields) {
    const types = {};

    fields.forEach(field => {
      const values = data.map(row => row[field]).filter(v => v != null);
      
      if (values.length === 0) {
        types[field] = 'empty';
        return;
      }

      // Check if numeric
      const numericValues = values.filter(v => typeof v === 'number');
      if (numericValues.length / values.length > 0.8) {
        types[field] = 'numeric';
        return;
      }

      // Check if date
      const datePattern = /^\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}/;
      if (values.some(v => datePattern.test(String(v)))) {
        types[field] = 'date';
        return;
      }

      // Default to categorical
      types[field] = 'categorical';
    });

    return types;
  }

  /**
   * Calculate comprehensive statistics
   */
  calculateStatistics(data, columnTypes) {
    const stats = {};

    Object.entries(columnTypes).forEach(([field, type]) => {
      if (type === 'numeric') {
        const values = data.map(row => row[field]).filter(v => typeof v === 'number');
        
        stats[field] = {
          type: 'numeric',
          count: values.length,
          sum: values.reduce((a, b) => a + b, 0),
          average: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          median: this.calculateMedian(values)
        };
      } else if (type === 'categorical') {
        const values = data.map(row => row[field]).filter(v => v != null);
        const frequency = {};
        
        values.forEach(v => {
          frequency[v] = (frequency[v] || 0) + 1;
        });

        stats[field] = {
          type: 'categorical',
          uniqueValues: Object.keys(frequency).length,
          topValues: Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([value, count]) => ({ value, count }))
        };
      }
    });

    return stats;
  }

  /**
   * Prepare data optimized for different chart types
   */
  prepareChartData(data, columnTypes) {
    const charts = {};

    // Find numeric columns for visualization
    const numericColumns = Object.entries(columnTypes)
      .filter(([_, type]) => type === 'numeric')
      .map(([field, _]) => field);

    const dateColumns = Object.entries(columnTypes)
      .filter(([_, type]) => type === 'date')
      .map(([field, _]) => field);

    const categoricalColumns = Object.entries(columnTypes)
      .filter(([_, type]) => type === 'categorical')
      .map(([field, _]) => field);

    // Line/Area chart (time series)
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      const dateField = dateColumns[0];
      const valueField = numericColumns[0];
      
      charts.lineChart = data
        .slice(0, 50) // Limit to 50 points for performance
        .map(row => ({
          date: String(row[dateField]),
          value: row[valueField]
        }))
        .filter(item => item.date && item.value != null);
    }

    // Bar chart (categorical comparison)
    if (categoricalColumns.length > 0 && numericColumns.length > 0) {
      const categoryField = categoricalColumns[0];
      const valueField = numericColumns[0];
      
      // Aggregate by category
      const aggregated = {};
      data.forEach(row => {
        const cat = row[categoryField];
        if (cat) {
          aggregated[cat] = (aggregated[cat] || 0) + (row[valueField] || 0);
        }
      });

      charts.barChart = Object.entries(aggregated)
        .slice(0, 15)
        .map(([category, value]) => ({
          category: String(category).substring(0, 20), // Truncate long names
          value: value
        }));
    }

    // Pie chart (distribution)
    if (categoricalColumns.length > 0) {
      const categoryField = categoricalColumns[0];
      const frequency = {};
      
      data.forEach(row => {
        const cat = row[categoryField];
        if (cat) {
          frequency[cat] = (frequency[cat] || 0) + 1;
        }
      });

      charts.pieChart = Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([name, value]) => ({
          name: String(name).substring(0, 15),
          value: value
        }));
    }

    return charts;
  }

  /**
   * Generate Key Performance Indicators
   */
  generateKPIs(data, columnTypes, statistics) {
    const kpis = [];

    // Total records
    kpis.push({
      label: 'Total Records',
      value: data.length.toLocaleString(),
      icon: 'database'
    });

    // First numeric column stats
    const numericFields = Object.entries(columnTypes)
      .filter(([_, type]) => type === 'numeric')
      .map(([field, _]) => field);

    if (numericFields.length > 0) {
      const field = numericFields[0];
      const stat = statistics[field];

      kpis.push({
        label: `Total ${field}`,
        value: Math.round(stat.sum).toLocaleString(),
        icon: 'trending-up'
      });

      kpis.push({
        label: `Average ${field}`,
        value: Math.round(stat.average).toLocaleString(),
        icon: 'bar-chart'
      });

      kpis.push({
        label: `Min - Max`,
        value: `${Math.round(stat.min)} - ${Math.round(stat.max)}`,
        icon: 'activity'
      });
    }

    return kpis.slice(0, 4); // Return max 4 KPIs
  }

  /**
   * Calculate median value
   */
  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }
}

module.exports = new DatasetEngine();
