// js/utils/performance-monitor.js
/**
 * PerformanceMonitor - 性能监控工具类
 * 收集渲染时间、内存使用、交互延迟等性能指标
 * 监控长任务和布局偏移，生成优化建议
 */
class PerformanceMonitor {
  /**
   * @param {Object} options - 配置选项
   * @param {boolean} options.autoStart - 是否自动开始监控（默认：true）
   * @param {number} options.sampleInterval - 内存采样间隔（毫秒，默认：10000）
   * @param {boolean} options.trackLongTasks - 是否跟踪长任务（默认：true）
   * @param {boolean} options.trackLayoutShifts - 是否跟踪布局偏移（默认：true）
   * @param {boolean} options.enableMemoryTracking - 是否启用内存跟踪（默认：true）
   */
  constructor(options = {}) {
    this.options = {
      autoStart: true,
      sampleInterval: 10000, // 10秒
      trackLongTasks: true,
      trackLayoutShifts: true,
      enableMemoryTracking: true,
      ...options
    };

    // 性能指标存储
    this.metrics = {
      // 渲染性能
      renderTimes: {
        timeline: [], // 时间线渲染时间
        virtualScroll: [], // 虚拟滚动初始化时间
        imageLoading: [], // 图片加载时间
        average: 0,
        max: 0,
        min: Infinity
      },

      // 内存使用（如果浏览器支持）
      memorySamples: [],
      memoryAverage: 0,
      memoryPeak: 0,

      // 交互延迟
      interactionTimes: {
        click: [],
        touch: [],
        scroll: []
      },

      // 长任务跟踪
      longTasks: [],

      // 布局偏移跟踪
      layoutShifts: [],

      // 性能观察器
      observers: {
        longTask: null,
        layoutShift: null,
        memory: null
      }
    };

    // 时间标记
    this.timestamps = new Map();

    // 开发模式检测
    this.isDevelopment = this._checkDevelopmentMode();

    // 浏览器能力检测
    this.capabilities = this._checkCapabilities();

    // 自动开始监控
    if (this.options.autoStart) {
      this.start();
    }
  }

  /**
   * 检查是否处于开发模式
   * @returns {boolean} 是否是开发模式
   * @private
   */
  _checkDevelopmentMode() {
    try {
      // 检查常见的开发模式指示器
      return (
        process.env.NODE_ENV === 'development' ||
        window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.protocol === 'file:' ||
        typeof window.__DEV__ !== 'undefined'
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * 检查浏览器能力
   * @returns {Object} 能力对象
   * @private
   */
  _checkCapabilities() {
    return {
      // Performance API 支持
      performanceAPI: 'performance' in window && 'now' in performance,

      // PerformanceObserver 支持
      performanceObserver: 'PerformanceObserver' in window,

      // Memory API 支持
      memoryAPI: 'memory' in performance,

      // Long Tasks API 支持
      longTaskAPI: 'PerformanceObserver' in window &&
                  PerformanceObserver.supportedEntryTypes?.includes('longtask'),

      // Layout Shift API 支持
      layoutShiftAPI: 'PerformanceObserver' in window &&
                     PerformanceObserver.supportedEntryTypes?.includes('layout-shift'),

      // User Timing API 支持
      userTimingAPI: 'performance' in window && 'mark' in performance && 'measure' in performance,

      // 设备内存 API 支持
      deviceMemoryAPI: 'deviceMemory' in navigator
    };
  }

  /**
   * 开始性能监控
   */
  start() {
    console.log(`[PerformanceMonitor] 开始性能监控 (开发模式: ${this.isDevelopment})`);

    // 启动长任务监控
    if (this.options.trackLongTasks && this.capabilities.longTaskAPI) {
      this._startLongTaskObserver();
    }

    // 启动布局偏移监控
    if (this.options.trackLayoutShifts && this.capabilities.layoutShiftAPI) {
      this._startLayoutShiftObserver();
    }

    // 启动内存监控
    if (this.options.enableMemoryTracking && this.capabilities.memoryAPI) {
      this._startMemorySampling();
    }
  }

  /**
   * 停止性能监控
   */
  stop() {
    console.log('[PerformanceMonitor] 停止性能监控');

    // 停止所有观察器
    Object.values(this.metrics.observers).forEach(observer => {
      if (observer) {
        observer.disconnect();
      }
    });

    // 清除内存采样间隔
    if (this._memoryInterval) {
      clearInterval(this._memoryInterval);
      this._memoryInterval = null;
    }
  }

  /**
   * 开始长任务观察器
   * @private
   */
  _startLongTaskObserver() {
    try {
      this.metrics.observers.longTask = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          this.metrics.longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name,
            attribution: entry.attribution
          });

          if (this.isDevelopment) {
            console.warn(`[长任务] 检测到长任务: ${entry.duration.toFixed(2)}ms`, entry);
          }
        });
      });

      this.metrics.observers.longTask.observe({ entryTypes: ['longtask'] });
      console.log('[PerformanceMonitor] 长任务监控已启用');
    } catch (error) {
      console.warn('[PerformanceMonitor] 无法启用长任务监控:', error.message);
    }
  }

  /**
   * 开始布局偏移观察器
   * @private
   */
  _startLayoutShiftObserver() {
    try {
      let cumulativeLayoutShift = 0;

      this.metrics.observers.layoutShift = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          // 只计算没有用户输入的布局偏移
          if (!entry.hadRecentInput) {
            cumulativeLayoutShift += entry.value;
            this.metrics.layoutShifts.push({
              value: entry.value,
              cumulative: cumulativeLayoutShift,
              sources: entry.sources,
              startTime: entry.startTime
            });

            if (this.isDevelopment && entry.value > 0.1) {
              console.warn(`[布局偏移] CLS: ${entry.value.toFixed(4)} (累计: ${cumulativeLayoutShift.toFixed(4)})`, entry);
            }
          }
        });
      });

      this.metrics.observers.layoutShift.observe({ entryTypes: ['layout-shift'] });
      console.log('[PerformanceMonitor] 布局偏移监控已启用');
    } catch (error) {
      console.warn('[PerformanceMonitor] 无法启用布局偏移监控:', error.message);
    }
  }

  /**
   * 开始内存采样
   * @private
   */
  _startMemorySampling() {
    try {
      // 初始采样
      this._sampleMemory();

      // 设置定期采样
      this._memoryInterval = setInterval(() => {
        this._sampleMemory();
      }, this.options.sampleInterval);

      console.log(`[PerformanceMonitor] 内存监控已启用 (采样间隔: ${this.options.sampleInterval}ms)`);
    } catch (error) {
      console.warn('[PerformanceMonitor] 无法启用内存监控:', error.message);
    }
  }

  /**
   * 内存采样
   * @private
   */
  _sampleMemory() {
    try {
      const memory = performance.memory;
      const sample = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };

      this.metrics.memorySamples.push(sample);

      // 更新内存峰值
      if (sample.usedJSHeapSize > this.metrics.memoryPeak) {
        this.metrics.memoryPeak = sample.usedJSHeapSize;
      }

      // 计算平均内存使用
      if (this.metrics.memorySamples.length > 0) {
        const total = this.metrics.memorySamples.reduce((sum, s) => sum + s.usedJSHeapSize, 0);
        this.metrics.memoryAverage = Math.round(total / this.metrics.memorySamples.length);
      }

    } catch (error) {
      console.warn('[PerformanceMonitor] 内存采样失败:', error.message);
    }
  }

  /**
   * 开始测量特定操作
   * @param {string} label - 测量标签
   * @returns {number} 开始时间戳
   */
  startMeasurement(label) {
    const timestamp = performance.now();
    this.timestamps.set(label, timestamp);

    if (this.isDevelopment) {
      console.log(`[性能测量开始] ${label}`);
    }

    return timestamp;
  }

  /**
   * 结束测量并记录结果
   * @param {string} label - 测量标签
   * @param {number} [startTime] - 可选的开始时间戳（如果未提供，则使用timestamps中的值）
   * @returns {number} 持续时间（毫秒）
   */
  endMeasurement(label, startTime) {
    const endTime = performance.now();
    const start = startTime || this.timestamps.get(label);

    if (start === undefined) {
      console.warn(`[PerformanceMonitor] 未找到测量开始时间: ${label}`);
      return 0;
    }

    const duration = endTime - start;

    // 记录到对应的指标类别
    this._recordMeasurement(label, duration);

    // 清理时间戳
    this.timestamps.delete(label);

    if (this.isDevelopment) {
      console.log(`[性能测量结束] ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  /**
   * 记录测量结果到对应的指标类别
   * @param {string} label - 测量标签
   * @param {number} duration - 持续时间
   * @private
   */
  _recordMeasurement(label, duration) {
    // 根据标签分类
    if (label.includes('timeline') || label.includes('render')) {
      this._updateRenderMetrics('timeline', duration);
    } else if (label.includes('virtual') || label.includes('scroll')) {
      this._updateRenderMetrics('virtualScroll', duration);
    } else if (label.includes('image') || label.includes('lazy')) {
      this._updateRenderMetrics('imageLoading', duration);
    } else if (label.includes('click')) {
      this.metrics.interactionTimes.click.push(duration);
    } else if (label.includes('touch')) {
      this.metrics.interactionTimes.touch.push(duration);
    } else if (label.includes('scroll')) {
      this.metrics.interactionTimes.scroll.push(duration);
    }

    // 更新整体渲染统计数据
    this._updateRenderStats(duration);
  }

  /**
   * 更新渲染指标
   * @param {string} category - 类别
   * @param {number} duration - 持续时间
   * @private
   */
  _updateRenderMetrics(category, duration) {
    const times = this.metrics.renderTimes[category];
    if (times) {
      times.push(duration);

      // 保持最近的100个样本
      if (times.length > 100) {
        times.shift();
      }
    }
  }

  /**
   * 更新整体渲染统计数据
   * @param {number} duration - 持续时间
   * @private
   */
  _updateRenderStats(duration) {
    const stats = this.metrics.renderTimes;

    // 更新最大值
    if (duration > stats.max) {
      stats.max = duration;
    }

    // 更新最小值
    if (duration < stats.min) {
      stats.min = duration;
    }

    // 计算平均时间
    const allTimes = [
      ...stats.timeline,
      ...stats.virtualScroll,
      ...stats.imageLoading
    ];

    if (allTimes.length > 0) {
      const total = allTimes.reduce((sum, time) => sum + time, 0);
      stats.average = total / allTimes.length;
    }
  }

  /**
   * 记录交互延迟
   * @param {string} type - 交互类型 ('click', 'touch', 'scroll')
   * @param {number} duration - 延迟时间（毫秒）
   */
  recordInteraction(type, duration) {
    const interactions = this.metrics.interactionTimes[type];
    if (interactions) {
      interactions.push(duration);

      // 保持最近的50个样本
      if (interactions.length > 50) {
        interactions.shift();
      }

      if (this.isDevelopment && duration > 100) {
        console.warn(`[交互延迟] ${type}: ${duration.toFixed(2)}ms (超过100ms)`);
      }
    }
  }

  /**
   * 获取性能报告
   * @returns {Object} 性能报告对象
   */
  getReport() {
    return {
      // 基本信息
      timestamp: new Date().toISOString(),
      isDevelopment: this.isDevelopment,
      capabilities: this.capabilities,

      // 渲染性能
      renderPerformance: {
        timeline: this._getStats(this.metrics.renderTimes.timeline),
        virtualScroll: this._getStats(this.metrics.renderTimes.virtualScroll),
        imageLoading: this._getStats(this.metrics.renderTimes.imageLoading),
        overall: {
          average: this.metrics.renderTimes.average,
          max: this.metrics.renderTimes.max,
          min: this.metrics.renderTimes.min === Infinity ? 0 : this.metrics.renderTimes.min
        }
      },

      // 内存使用
      memoryUsage: {
        current: this.metrics.memorySamples.length > 0
          ? this.metrics.memorySamples[this.metrics.memorySamples.length - 1]
          : null,
        average: this.metrics.memoryAverage,
        peak: this.metrics.memoryPeak,
        samples: this.metrics.memorySamples.length
      },

      // 交互延迟
      interactionDelays: {
        click: this._getStats(this.metrics.interactionTimes.click),
        touch: this._getStats(this.metrics.interactionTimes.touch),
        scroll: this._getStats(this.metrics.interactionTimes.scroll)
      },

      // 长任务
      longTasks: {
        count: this.metrics.longTasks.length,
        totalDuration: this.metrics.longTasks.reduce((sum, task) => sum + task.duration, 0),
        averageDuration: this.metrics.longTasks.length > 0
          ? this.metrics.longTasks.reduce((sum, task) => sum + task.duration, 0) / this.metrics.longTasks.length
          : 0,
        tasks: this.metrics.longTasks.slice(-10) // 最近10个任务
      },

      // 布局偏移
      layoutShifts: {
        cumulativeScore: this.metrics.layoutShifts.length > 0
          ? this.metrics.layoutShifts[this.metrics.layoutShifts.length - 1].cumulative
          : 0,
        count: this.metrics.layoutShifts.length,
        shifts: this.metrics.layoutShifts.slice(-10) // 最近10个偏移
      },

      // 优化建议
      recommendations: this._generateRecommendations()
    };
  }

  /**
   * 获取统计信息
   * @param {Array} data - 数据数组
   * @returns {Object} 统计对象
   * @private
   */
  _getStats(data) {
    if (!data || data.length === 0) {
      return { count: 0, average: 0, max: 0, min: 0 };
    }

    const sum = data.reduce((a, b) => a + b, 0);
    const max = Math.max(...data);
    const min = Math.min(...data);

    return {
      count: data.length,
      average: sum / data.length,
      max: max,
      min: min,
      p95: this._calculatePercentile(data, 95),
      p99: this._calculatePercentile(data, 99)
    };
  }

  /**
   * 计算百分位数
   * @param {Array} data - 数据数组
   * @param {number} percentile - 百分位（0-100）
   * @returns {number} 百分位值
   * @private
   */
  _calculatePercentile(data, percentile) {
    if (!data || data.length === 0) return 0;

    const sorted = [...data].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  }

  /**
   * 生成优化建议
   * @returns {Array} 建议数组
   * @private
   */
  _generateRecommendations() {
    const recommendations = [];
    const report = this.getReport();

    // 检查长任务
    if (report.longTasks.count > 5) {
      recommendations.push({
        level: 'warning',
        title: '检测到多个长任务',
        description: `发现 ${report.longTasks.count} 个超过50ms的长任务，可能会影响用户体验`,
        suggestion: '考虑将长任务拆分为多个小任务，或使用Web Workers处理耗时操作',
        metric: 'longTasks',
        value: report.longTasks.count
      });
    }

    // 检查布局偏移
    if (report.layoutShifts.cumulativeScore > 0.1) {
      recommendations.push({
        level: 'warning',
        title: '累计布局偏移分数过高',
        description: `累计布局偏移分数为 ${report.layoutShifts.cumulativeScore.toFixed(3)}，超过0.1的推荐阈值`,
        suggestion: '为动态内容预留空间，避免布局抖动',
        metric: 'layoutShifts',
        value: report.layoutShifts.cumulativeScore
      });
    }

    // 检查渲染性能
    if (report.renderPerformance.overall.average > 100) {
      recommendations.push({
        level: 'warning',
        title: '平均渲染时间过长',
        description: `平均渲染时间为 ${report.renderPerformance.overall.average.toFixed(2)}ms`,
        suggestion: '优化渲染逻辑，减少DOM操作，使用虚拟滚动',
        metric: 'renderPerformance',
        value: report.renderPerformance.overall.average
      });
    }

    // 检查内存使用
    if (report.memoryUsage.peak > 100 * 1024 * 1024) { // 100MB
      recommendations.push({
        level: 'warning',
        title: '内存使用峰值较高',
        description: `内存使用峰值为 ${(report.memoryUsage.peak / 1024 / 1024).toFixed(2)}MB`,
        suggestion: '检查内存泄漏，及时释放不再使用的对象',
        metric: 'memoryUsage',
        value: report.memoryUsage.peak
      });
    }

    // 检查交互延迟
    if (report.interactionDelays.click.average > 100) {
      recommendations.push({
        level: 'warning',
        title: '点击响应延迟较高',
        description: `平均点击响应延迟为 ${report.interactionDelays.click.average.toFixed(2)}ms`,
        suggestion: '优化事件处理逻辑，避免阻塞主线程',
        metric: 'interactionDelays',
        value: report.interactionDelays.click.average
      });
    }

    // 如果没有问题，添加积极反馈
    if (recommendations.length === 0) {
      recommendations.push({
        level: 'success',
        title: '性能表现良好',
        description: '所有性能指标均在正常范围内',
        suggestion: '继续保持当前优化水平',
        metric: 'overall',
        value: 'good'
      });
    }

    return recommendations;
  }

  /**
   * 获取简化的性能摘要（用于UI显示）
   * @returns {Object} 性能摘要
   */
  getSummary() {
    const report = this.getReport();

    return {
      timestamp: report.timestamp,
      score: this._calculatePerformanceScore(report),
      metrics: {
        renderTime: report.renderPerformance.overall.average,
        memoryUsage: report.memoryUsage.current?.usedJSHeapSize || 0,
        longTasks: report.longTasks.count,
        layoutShift: report.layoutShifts.cumulativeScore
      },
      recommendations: report.recommendations.length
    };
  }

  /**
   * 计算性能得分（0-100）
   * @param {Object} report - 性能报告
   * @returns {number} 性能得分
   * @private
   */
  _calculatePerformanceScore(report) {
    let score = 100;

    // 扣除长任务分数
    score -= Math.min(report.longTasks.count * 5, 30);

    // 扣除布局偏移分数
    score -= Math.min(report.layoutShifts.cumulativeScore * 100, 30);

    // 扣除渲染时间分数
    if (report.renderPerformance.overall.average > 50) {
      score -= Math.min((report.renderPerformance.overall.average - 50) / 10, 20);
    }

    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * 清除所有性能数据
   */
  clear() {
    this.metrics = {
      renderTimes: {
        timeline: [],
        virtualScroll: [],
        imageLoading: [],
        average: 0,
        max: 0,
        min: Infinity
      },
      memorySamples: [],
      memoryAverage: 0,
      memoryPeak: 0,
      interactionTimes: {
        click: [],
        touch: [],
        scroll: []
      },
      longTasks: [],
      layoutShifts: [],
      observers: this.metrics.observers
    };

    this.timestamps.clear();

    console.log('[PerformanceMonitor] 性能数据已清除');
  }

  /**
   * 导出性能数据为JSON
   * @returns {string} JSON字符串
   */
  exportData() {
    return JSON.stringify(this.getReport(), null, 2);
  }

  /**
   * 在控制台打印性能报告
   */
  printReport() {
    const report = this.getReport();

    console.group('📊 性能监控报告');
    console.log('时间:', report.timestamp);
    console.log('开发模式:', report.isDevelopment);

    console.group('🎨 渲染性能');
    console.log('时间线渲染:', report.renderPerformance.timeline);
    console.log('虚拟滚动:', report.renderPerformance.virtualScroll);
    console.log('图片加载:', report.renderPerformance.imageLoading);
    console.log('整体:', report.renderPerformance.overall);
    console.groupEnd();

    if (report.memoryUsage.current) {
      console.group('💾 内存使用');
      console.log('当前:', this._formatBytes(report.memoryUsage.current.usedJSHeapSize));
      console.log('平均:', this._formatBytes(report.memoryUsage.average));
      console.log('峰值:', this._formatBytes(report.memoryUsage.peak));
      console.log('限制:', this._formatBytes(report.memoryUsage.current.jsHeapSizeLimit));
      console.groupEnd();
    }

    console.group('⚡ 交互延迟');
    console.log('点击:', report.interactionDelays.click);
    console.log('触摸:', report.interactionDelays.touch);
    console.log('滚动:', report.interactionDelays.scroll);
    console.groupEnd();

    console.group('⚠️  长任务');
    console.log('数量:', report.longTasks.count);
    console.log('总时长:', report.longTasks.totalDuration.toFixed(2) + 'ms');
    console.log('平均时长:', report.longTasks.averageDuration.toFixed(2) + 'ms');
    console.groupEnd();

    console.group('📐 布局偏移');
    console.log('累计分数:', report.layoutShifts.cumulativeScore.toFixed(4));
    console.log('次数:', report.layoutShifts.count);
    console.groupEnd();

    console.group('💡 优化建议');
    report.recommendations.forEach((rec, i) => {
      console.log(`${i + 1}. [${rec.level.toUpperCase()}] ${rec.title}: ${rec.description}`);
    });
    console.groupEnd();

    console.groupEnd();
  }

  /**
   * 格式化字节大小为易读格式
   * @param {number} bytes - 字节数
   * @returns {string} 格式化后的字符串
   * @private
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// 使PerformanceMonitor全局可用
if (typeof window !== 'undefined') {
  window.PerformanceMonitor = PerformanceMonitor;
}