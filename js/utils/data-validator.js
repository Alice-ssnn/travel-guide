// js/utils/data-validator.js
/**
 * DataValidator - 旅行数据验证工具类
 * 检查行程数据结构的完整性、一致性和格式正确性
 * 主要在开发模式下使用，输出警告和建议，不阻塞生产环境
 */
class DataValidator {
  /**
   * @param {Object} options - 配置选项
   * @param {boolean} options.autoValidate - 是否自动验证（默认：开发模式下true）
   * @param {boolean} options.strictMode - 严格模式，发现错误时抛出异常（默认：false）
   * @param {Array<string>} options.skipChecks - 跳过的检查类型（默认：[]）
   * @param {Function} options.onWarning - 警告回调函数（默认：console.warn）
   * @param {Function} options.onError - 错误回调函数（默认：console.error）
   */
  constructor(options = {}) {
    this.options = {
      autoValidate: this._isDevelopmentMode(),
      strictMode: false,
      skipChecks: [],
      onWarning: (message, details) => {
        console.warn(`[数据验证] ${message}`, details || '');
      },
      onError: (message, details) => {
        console.error(`[数据验证] ${message}`, details || '');
      },
      ...options
    };

    this.validationResults = {
      passed: 0,
      warnings: 0,
      errors: 0,
      details: []
    };

    if (this.options.autoValidate && typeof TripData !== 'undefined') {
      setTimeout(() => this.validateAll(), 100);
    }
  }

  /**
   * 检查是否处于开发模式
   * @returns {boolean} 是否开发模式
   * @private
   */
  _isDevelopmentMode() {
    try {
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
   * 执行所有验证检查
   * @param {Object} tripData - 行程数据（可选，默认使用TripData.getAllDays()）
   * @returns {Object} 验证结果统计
   */
  validateAll(tripData = null) {
    this.validationResults = {
      passed: 0,
      warnings: 0,
      errors: 0,
      details: []
    };

    try {
      const data = tripData || this._getTripData();
      if (!data) {
        this._addResult('error', '无法获取行程数据', { reason: 'TripData未定义' });
        return this.validationResults;
      }

      // 执行各级验证
      this._validateTripStructure(data);
      this._validateDaysStructure(data.days);
      this._validateActivities(data.days);
      this._validateDatesAndSequence(data);
      this._validateCoordinates(data.days);

      // 输出汇总报告
      this._printSummary();

    } catch (error) {
      this._addResult('error', '验证过程中发生异常', { error: error.message, stack: error.stack });
      if (this.options.strictMode) {
        throw error;
      }
    }

    return this.validationResults;
  }

  /**
   * 获取行程数据
   * @returns {Object|null} 行程数据或null
   * @private
   */
  _getTripData() {
    if (typeof TripData !== 'undefined' && TripData.getTripInfo) {
      const tripInfo = TripData.getTripInfo();
      const days = TripData.getAllDays();
      return { ...tripInfo, days };
    }
    return null;
  }

  /**
   * 验证行程整体结构
   * @param {Object} tripData - 行程数据
   * @private
   */
  _validateTripStructure(tripData) {
    const requiredFields = ['id', 'title', 'duration', 'dates', 'cities', 'days'];
    const missingFields = requiredFields.filter(field => !tripData[field]);

    if (missingFields.length > 0) {
      this._addResult('error', '缺少必需的行程字段', { missingFields });
    } else {
      this._addResult('passed', '行程结构完整');
    }

    // 检查天数匹配
    if (tripData.duration && tripData.days) {
      if (tripData.days.length !== tripData.duration) {
        this._addResult('warning', '行程天数与数据天数不匹配', {
          expected: tripData.duration,
          actual: tripData.days.length
        });
      }
    }

    // 检查日期范围
    if (tripData.dates && tripData.dates.start && tripData.dates.end) {
      const startDate = new Date(tripData.dates.start);
      const endDate = new Date(tripData.dates.end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        this._addResult('error', '日期格式无效', { start: tripData.dates.start, end: tripData.dates.end });
      } else if (startDate > endDate) {
        this._addResult('error', '开始日期晚于结束日期', { start: tripData.dates.start, end: tripData.dates.end });
      }
    }
  }

  /**
   * 验证天数据结构
   * @param {Array} days - 天数据数组
   * @private
   */
  _validateDaysStructure(days) {
    if (!Array.isArray(days)) {
      this._addResult('error', 'days必须是数组', { type: typeof days });
      return;
    }

    const seenDays = new Set();
    const dayNumbers = [];

    days.forEach((day, index) => {
      // 检查必需字段
      const requiredFields = ['day', 'date', 'title', 'city', 'color', 'summary', 'tags', 'overview', 'timeline', 'route'];
      const missingFields = requiredFields.filter(field => !day[field] && day[field] !== 0);

      if (missingFields.length > 0) {
        this._addResult('warning', `第${index + 1}天缺少字段`, { day: day.day, missingFields });
      }

      // 检查天号唯一性和连续性
      if (day.day !== undefined) {
        if (seenDays.has(day.day)) {
          this._addResult('error', `天号重复: ${day.day}`, { day: day.day, index });
        } else {
          seenDays.add(day.day);
          dayNumbers.push(day.day);
        }
      }

      // 检查日期格式
      if (day.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(day.date)) {
          this._addResult('warning', `日期格式无效: ${day.date}`, { day: day.day, date: day.date });
        }
      }

      // 检查标签数组
      if (day.tags && !Array.isArray(day.tags)) {
        this._addResult('warning', `标签不是数组`, { day: day.day, tags: day.tags });
      }

      // 检查时间线数组
      if (day.timeline && !Array.isArray(day.timeline)) {
        this._addResult('error', `时间线不是数组`, { day: day.day, timeline: day.timeline });
      }
    });

    // 检查天号连续性
    if (dayNumbers.length > 0) {
      const sortedDays = [...dayNumbers].sort((a, b) => a - b);
      const expectedSequence = Array.from({ length: sortedDays.length }, (_, i) => i + 1);

      if (JSON.stringify(sortedDays) !== JSON.stringify(expectedSequence)) {
        this._addResult('warning', '天号不连续或不是从1开始', {
          actual: sortedDays,
          expected: expectedSequence
        });
      }
    }
  }

  /**
   * 验证活动数据
   * @param {Array} days - 天数据数组
   * @private
   */
  _validateActivities(days) {
    if (!Array.isArray(days)) return;

    days.forEach(day => {
      if (!day.timeline || !Array.isArray(day.timeline)) return;

      let prevEndTime = 0; // 上一个活动结束时间（分钟）
      let hasTimeOrderIssues = false;

      day.timeline.forEach((activity, index) => {
        // 检查必需字段
        const requiredFields = ['id', 'time', 'duration', 'icon', 'title', 'description', 'location', 'category', 'cost', 'actions'];
        const missingFields = requiredFields.filter(field => !activity[field] && activity[field] !== 0);

        if (missingFields.length > 0) {
          this._addResult('warning', `活动缺少字段`, {
            day: day.day,
            activityIndex: index,
            activityId: activity.id,
            missingFields
          });
        }

        // 检查时间格式
        if (activity.time) {
          const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
          if (!timeRegex.test(activity.time)) {
            this._addResult('warning', `时间格式无效: ${activity.time}`, {
              day: day.day,
              activityId: activity.id,
              time: activity.time
            });
          } else {
            // 计算分钟数并检查时间顺序
            const [hours, minutes] = activity.time.split(':').map(Number);
            const startMinutes = hours * 60 + minutes;

            if (startMinutes < prevEndTime) {
              hasTimeOrderIssues = true;
              this._addResult('warning', `活动时间顺序问题`, {
                day: day.day,
                activityId: activity.id,
                time: activity.time,
                previousEndTime: this._minutesToTime(prevEndTime),
                overlap: prevEndTime - startMinutes
              });
            }

            // 更新结束时间
            const duration = activity.duration || 0;
            prevEndTime = startMinutes + duration;
          }
        }

        // 检查持续时间
        if (activity.duration !== undefined) {
          if (typeof activity.duration !== 'number' || activity.duration < 0) {
            this._addResult('warning', `持续时间无效: ${activity.duration}`, {
              day: day.day,
              activityId: activity.id,
              duration: activity.duration
            });
          }
        }

        // 检查位置信息
        if (activity.location) {
          if (!activity.location.name) {
            this._addResult('warning', `活动缺少位置名称`, {
              day: day.day,
              activityId: activity.id
            });
          }

          if (!activity.location.coordinates) {
            this._addResult('warning', `活动缺少坐标`, {
              day: day.day,
              activityId: activity.id
            });
          }
        }

        // 检查费用格式
        if (activity.cost) {
          this._validateCostFormat(activity.cost, day.day, activity.id);
        }

        // 检查操作数组
        if (activity.actions && !Array.isArray(activity.actions)) {
          this._addResult('warning', `操作不是数组`, {
            day: day.day,
            activityId: activity.id,
            actions: activity.actions
          });
        }
      });

      if (!hasTimeOrderIssues && day.timeline.length > 0) {
        this._addResult('passed', `第${day.day}天活动时间顺序正常`, {
          day: day.day,
          activityCount: day.timeline.length
        });
      }
    });
  }

  /**
   * 验证费用格式
   * @param {string} cost - 费用字符串
   * @param {number} day - 天数
   * @param {string} activityId - 活动ID
   * @private
   */
  _validateCostFormat(cost, day, activityId) {
    const costPatterns = [
      /^免费$/,                          // 免费
      /^已包含$/,                        // 已包含
      /^已预订$/,                        // 已预订
      /^(CHF|€|¥|£)\s*\d+([.,]\d+)?$/,  // 单一货币金额
      /^(CHF|€|¥|£)\s*\d+([.,]\d+)?\s*[-~]\s*\d+([.,]\d+)?$/, // 金额范围
      /^(CHF|€|¥|£)\s*\d+([.,]\d+)?\s*\/\s*人$/, // 每人费用
      /^\d+([.,]\d+)?\s*(CHF|€|¥|£)\s*\/\s*人$/  // 每人费用（金额在前）
    ];

    const isValid = costPatterns.some(pattern => pattern.test(cost));

    if (!isValid) {
      this._addResult('warning', `费用格式可能无效: ${cost}`, {
        day,
        activityId,
        cost,
        suggestion: '使用格式如: "免费", "已包含", "CHF 50-60", "€ 89/人"'
      });
    }
  }

  /**
   * 验证日期和顺序
   * @param {Object} tripData - 行程数据
   * @private
   */
  _validateDatesAndSequence(tripData) {
    if (!tripData.days || !Array.isArray(tripData.days)) return;

    const dates = [];
    tripData.days.forEach(day => {
      if (day.date) {
        dates.push({
          day: day.day,
          date: day.date,
          dateObj: new Date(day.date)
        });
      }
    });

    // 检查日期连续性
    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i - 1].dateObj;
      const currDate = dates[i].dateObj;

      if (isNaN(prevDate.getTime()) || isNaN(currDate.getTime())) {
        continue;
      }

      // 计算日期差（天）
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays !== 1) {
        this._addResult('warning', '日期不连续', {
          day1: dates[i - 1].day,
          date1: dates[i - 1].date,
          day2: dates[i].day,
          date2: dates[i].date,
          diffDays: diffDays
        });
      }
    }
  }

  /**
   * 验证坐标范围
   * @param {Array} days - 天数据数组
   * @private
   */
  _validateCoordinates(days) {
    if (!Array.isArray(days)) return;

    days.forEach(day => {
      if (!day.timeline || !Array.isArray(day.timeline)) return;

      day.timeline.forEach(activity => {
        if (activity.location && activity.location.coordinates) {
          const { lat, lng } = activity.location.coordinates;

          // 检查纬度 (-90 to 90)
          if (lat < -90 || lat > 90 || isNaN(lat)) {
            this._addResult('warning', `纬度超出范围: ${lat}`, {
              day: day.day,
              activityId: activity.id,
              location: activity.location.name,
              coordinate: 'latitude',
              value: lat,
              validRange: '[-90, 90]'
            });
          }

          // 检查经度 (-180 to 180)
          if (lng < -180 || lng > 180 || isNaN(lng)) {
            this._addResult('warning', `经度超出范围: ${lng}`, {
              day: day.day,
              activityId: activity.id,
              location: activity.location.name,
              coordinate: 'longitude',
              value: lng,
              validRange: '[-180, 180]'
            });
          }

          // 检查坐标是否为0,0（可能是默认值）
          if (lat === 0 && lng === 0) {
            this._addResult('warning', `坐标可能是默认值 (0,0)`, {
              day: day.day,
              activityId: activity.id,
              location: activity.location.name
            });
          }
        }
      });
    });
  }

  /**
   * 添加验证结果
   * @param {string} type - 结果类型: 'passed', 'warning', 'error'
   * @param {string} message - 结果消息
   * @param {Object} details - 详细信息
   * @private
   */
  _addResult(type, message, details = {}) {
    const result = {
      type,
      message,
      details,
      timestamp: new Date().toISOString()
    };

    this.validationResults.details.push(result);

    switch (type) {
      case 'passed':
        this.validationResults.passed++;
        break;
      case 'warning':
        this.validationResults.warnings++;
        if (this.options.onWarning) {
          this.options.onWarning(message, details);
        }
        break;
      case 'error':
        this.validationResults.errors++;
        if (this.options.onError) {
          this.options.onError(message, details);
        }
        if (this.options.strictMode) {
          throw new Error(`数据验证错误: ${message}`);
        }
        break;
    }
  }

  /**
   * 输出验证摘要
   * @private
   */
  _printSummary() {
    const { passed, warnings, errors } = this.validationResults;
    const total = passed + warnings + errors;

    if (total === 0) {
      console.log('[数据验证] 未执行任何验证检查');
      return;
    }

    console.groupCollapsed(`[数据验证] 完成 ${total} 项检查: ✅ ${passed} ✓ ⚠️ ${warnings} ⚠️ ❌ ${errors} ✗`);

    if (errors > 0) {
      console.error(`发现 ${errors} 个错误，请修复`);
    }

    if (warnings > 0) {
      console.warn(`发现 ${warnings} 个警告，建议检查`);
    }

    if (passed > 0 && errors === 0 && warnings === 0) {
      console.log('所有检查通过！数据完整且格式正确。');
    }

    // 输出详细结果（可展开）
    this.validationResults.details.forEach((result, index) => {
      const prefix = result.type === 'passed' ? '✅' : result.type === 'warning' ? '⚠️' : '❌';
      console.log(`${prefix} ${result.message}`, result.details || '');
    });

    console.groupEnd();
  }

  /**
   * 将分钟数转换为时间字符串
   * @param {number} minutes - 分钟数
   * @returns {string} 时间字符串 (HH:MM)
   * @private
   */
  _minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * 获取验证报告
   * @returns {Object} 验证结果报告
   */
  getReport() {
    return {
      ...this.validationResults,
      timestamp: new Date().toISOString(),
      hasErrors: this.validationResults.errors > 0,
      hasWarnings: this.validationResults.warnings > 0,
      isPassing: this.validationResults.errors === 0
    };
  }

  /**
   * 重置验证结果
   */
  reset() {
    this.validationResults = {
      passed: 0,
      warnings: 0,
      errors: 0,
      details: []
    };
  }

  /**
   * 静态方法：快速验证
   * @param {Object} tripData - 行程数据
   * @returns {Object} 验证结果
   */
  static quickValidate(tripData) {
    const validator = new DataValidator({ autoValidate: false });
    return validator.validateAll(tripData);
  }
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataValidator;
}

// 全局注册（可选）
if (typeof window !== 'undefined') {
  window.DataValidator = DataValidator;
}