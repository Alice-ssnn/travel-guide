// timeline.js - Timeline rendering component for day detail view

/**
 * TimelineRenderer - Renders day timeline with activities
 */
const TimelineRenderer = {
  /**
   * Performance monitoring object
   */
  performance: {
    totalRenderTime: 0,
    totalRenderCount: 0,
    lastRenderStart: 0,
    lastRenderEnd: 0,
    renderStart: 0,
    renderEnd: 0,
    averageRenderTime: 0
  },

  /**
   * Performance monitor instance
   */
  performanceMonitor: null,

  /**
   * Initialize performance monitor
   */
  initPerformanceMonitor() {
    // Check if PerformanceMonitor class is available
    if (typeof PerformanceMonitor === 'undefined') {
      console.warn('PerformanceMonitor not available. Make sure performance-monitor.js is loaded.');
      return;
    }

    // Create performance monitor instance
    this.performanceMonitor = new PerformanceMonitor({
      autoStart: true,
      trackLongTasks: true,
      trackLayoutShifts: true,
      enableMemoryTracking: true
    });

    console.log('Timeline performance monitoring initialized');
  },

  /**
   * Get performance report
   * @returns {Object|null} Performance report or null if monitor not available
   */
  getPerformanceReport() {
    if (!this.performanceMonitor) {
      console.warn('Performance monitor not initialized. Call initPerformanceMonitor() first.');
      return null;
    }

    return this.performanceMonitor.getReport();
  },

  /**
   * Get performance summary for UI display
   * @returns {Object|null} Performance summary or null if monitor not available
   */
  getPerformanceSummary() {
    if (!this.performanceMonitor) {
      return null;
    }

    return this.performanceMonitor.getSummary();
  },

  /**
   * Print performance report to console
   */
  printPerformanceReport() {
    if (!this.performanceMonitor) {
      console.warn('Performance monitor not initialized. Call initPerformanceMonitor() first.');
      return;
    }

    this.performanceMonitor.printReport();
  },

  /**
   * Clear performance data
   */
  clearPerformanceData() {
    if (!this.performanceMonitor) {
      return;
    }

    this.performanceMonitor.clear();
  },

  /**
   * Mobile touch optimization constants
   */
  MOBILE_CONSTANTS: {
    // Touch thresholds
    MOVE_THRESHOLD: 10, // pixels - minimum movement to consider as scroll
    TAP_TIME_THRESHOLD: 500, // milliseconds - maximum time for a tap
    DOUBLE_TAP_INTERVAL: 300, // milliseconds - maximum interval between taps
    // Scroll button
    SCROLL_BUTTON_SHOW_THRESHOLD: 300, // pixels - show button after scrolling this far
    SCROLL_BUTTON_HIDE_BOTTOM_THRESHOLD: 10, // pixels - hide when near bottom
    // Animation durations
    TAP_FEEDBACK_DURATION: 150, // milliseconds
    DOUBLE_TAP_FEEDBACK_DURATION: 300 // milliseconds
  },

  /**
   * Event handler references for cleanup
   */
  _eventHandlers: {},

  /**
   * Image observer for lazy loading
   */
  imageObserver: null,

  /**
   * Mutation observer for detecting new lazy images
   */
  _imageMutationObserver: null,

  /**
   * Start performance measurement
   * @param {string} label - Optional label for the measurement
   * @returns {number} Start timestamp
   */
  startPerformanceMeasurement(label = '') {
    const startTime = performance.now();
    this.performance.lastRenderStart = startTime;
    this.performance.renderStart = startTime;

    // Also use PerformanceMonitor if available
    if (this.performanceMonitor) {
      this.performanceMonitor.startMeasurement(label);
    }

    return startTime;
  },

  /**
   * End performance measurement and log results
   * @param {number} startTime - Start timestamp from startPerformanceMeasurement
   * @param {string} label - Optional label for the measurement
   * @returns {number} Duration in milliseconds
   */
  endPerformanceMeasurement(startTime, label = '') {
    const endTime = performance.now();
    const duration = endTime - startTime;

    this.performance.lastRenderEnd = endTime;
    this.performance.renderEnd = endTime;
    this.performance.totalRenderCount += 1;
    this.performance.totalRenderTime += duration;
    this.performance.averageRenderTime = this.performance.totalRenderCount > 0
      ? this.performance.totalRenderTime / this.performance.totalRenderCount
      : 0;

    // Also use PerformanceMonitor if available
    if (this.performanceMonitor && label) {
      this.performanceMonitor.endMeasurement(label, startTime);
    }

    if (label) {
      console.log(`${label} completed in ${duration.toFixed(2)}ms`);
    }
    return duration;
  },

  /**
   * Render a day's timeline
   * @param {Object} day - Day data object
   * @param {HTMLElement} container - Container element to render into
   */
  renderDay(day, container) {
    console.log('TimelineRenderer.renderDay called for day', day.day);

    // Initialize performance monitoring if not already done
    if (!this.performanceMonitor) {
      this.initPerformanceMonitor();
    }

    // Render the complete day detail view with segmented control
    container.innerHTML = `
      <div class="day-detail-content" style="--day-color: ${day.color};">
        ${this.renderDayTopBar(day)}
        ${this.renderDayHeader(day)}
        ${this.renderSegmentedControl()}
        <div class="day-view-container">
          <div class="day-view day-view-timeline active">
            <div class="day-main-content">
              ${this.renderDayOverview(day)}
              ${this.renderTimeline(day)}
              ${this.renderImportantNotes(day)}
              ${this.renderDayActions(day)}
            </div>
          </div>
          <div class="day-view day-view-map">
            <div class="day-map-container" id="dayMapContainer"></div>
            <div class="day-main-content">
              ${this.renderDayActions(day)}
            </div>
          </div>
          <div class="day-view day-view-details">
            <div class="day-main-content">
              ${this.renderDayDetails(day)}
              ${this.renderDayActions(day)}
            </div>
          </div>
        </div>
      </div>
    `;

    // Setup event listeners for timeline actions (using event delegation)
    this.setupEventListeners(day, container);

    // Setup segmented control listeners
    this.setupSegmentedControlListeners(day);

    // Initialize virtual scroll for timeline
    this.initializeTimelineVirtualScroll(day);
  },

  /**
   * Sticky top bar with back link (mobile-friendly)
   */
  renderDayTopBar(day) {
    return `
      <div class="day-top-bar" role="navigation" aria-label="页面导航">
        <button type="button" class="day-back-btn" onclick="if(window.app) app.navigateToHome(); else window.location.href='index.html';" aria-label="返回首页">
          <span class="day-back-icon" aria-hidden="true">←</span>
          <span>首页</span>
        </button>
        <span class="day-top-bar-title">第${day.day}天 · ${day.city}</span>
        <span class="day-top-bar-spacer" aria-hidden="true"></span>
      </div>
    `;
  },

  /**
   * Render day header with title, date, and city
   */
  renderDayHeader(day) {
    const sub = day.locationContext ? `<p class="day-subtitle">${day.locationContext}</p>` : '';
    return `
      <div class="day-header" style="background: linear-gradient(135deg, ${day.color}20 0%, ${day.color}40 100%);">
        <div class="day-header-content">
          <div class="day-day-number">第${day.day}天</div>
          <h1 class="day-title">${day.title}</h1>
          ${sub}
          <div class="day-location">
            <div class="city-dot" style="background: ${day.color};"></div>
            <span class="city-name">${day.city}</span>
            <span class="day-date">${day.date}</span>
          </div>
          ${day.tags.length > 0 ? this.renderDayTags(day) : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render day tags
   */
  renderDayTags(day) {
    return `
      <div class="day-tags">
        ${day.tags.map(tag => {
          let labelClass = 'label-neutral';
          if (tag === '自驾') labelClass = 'label-secondary';
          if (tag === '飞行') labelClass = 'label-primary';
          if (tag === '酒店') labelClass = 'label-success';
          if (tag === '抵达') labelClass = 'label-success';
          if (tag === '湖泊') labelClass = 'label-primary';
          return `<div class="label ${labelClass}">${tag}</div>`;
        }).join('')}
      </div>
    `;
  },

  /**
   * Render day overview section
   */
  renderDayOverview(day) {
    if (!day.overview) return '';

    const { accommodation, transport, climate, scheduleHint, hikingRoute } = day.overview;

    return `
      <div class="day-overview card">
        <div class="card-body">
          <h2 class="section-title">当天概览</h2>

          ${scheduleHint ? `
            <div class="overview-section overview-aux">
              <div class="overview-icon">⏱️</div>
              <div class="overview-content">
                <div class="overview-label">班次建议</div>
                <div class="overview-prose">${scheduleHint}</div>
              </div>
            </div>
          ` : ''}

          ${climate ? `
            <div class="overview-section">
              <div class="overview-icon">🌤️</div>
              <div class="overview-content">
                <div class="overview-label">气候与着装</div>
                <div class="overview-value">${climate.temp}</div>
                <div class="overview-detail">${climate.weather}</div>
                ${climate.clothing ? `<div class="overview-subdetail">👔 ${climate.clothing}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${accommodation ? `
            <div class="overview-section">
              <div class="overview-icon">🏨</div>
              <div class="overview-content">
                <div class="overview-label">住宿</div>
                <div class="overview-value">${accommodation.name}</div>
                <div class="overview-detail">${accommodation.address}</div>
                ${accommodation.checkin ? `<div class="overview-subdetail">入住: ${accommodation.checkin} | 退房: ${accommodation.checkout || '12:00前'}</div>` : ''}
                ${accommodation.bookingRef ? `<div class="overview-subdetail overview-booking">预订号: ${accommodation.bookingRef}${accommodation.bookingPin ? ` · PIN: ${accommodation.bookingPin}` : ''}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${transport ? `
            <div class="overview-section">
              <div class="overview-icon">🚗</div>
              <div class="overview-content">
                <div class="overview-label">交通</div>
                <div class="overview-value">${transport.type}: ${transport.details}</div>
                ${transport.duration ? `<div class="overview-detail">时长: ${transport.duration}</div>` : ''}
                ${transport.cost ? `<div class="overview-subdetail">费用: ${transport.cost}</div>` : ''}
              </div>
            </div>
          ` : ''}

          ${hikingRoute ? `
            <div class="overview-section overview-hiking">
              <div class="overview-icon">🚶</div>
              <div class="overview-content">
                <div class="overview-label">徒步导航（不回头）</div>
                <div class="overview-prose">${hikingRoute}</div>
              </div>
            </div>
          ` : ''}

          ${day.route && day.route.totalDistance !== '0公里' ? `
            <div class="overview-section">
              <div class="overview-icon">🛣️</div>
              <div class="overview-content">
                <div class="overview-label">行程路线</div>
                <div class="overview-value">${day.route.totalDistance} | ${day.route.totalTime}</div>
                ${day.route.steps && day.route.steps.length > 0 ? `
                  <div class="overview-detail">
                    ${day.route.steps.map(step => `
                      <div class="route-step">
                        <span class="route-from">${step.from}</span>
                        <span class="route-arrow">→</span>
                        <span class="route-to">${step.to}</span>
                        <span class="route-details">(${step.distance}, ${step.time})</span>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  /**
   * Render complete timeline (virtual scroll ready)
   */
  renderTimeline(day) {
    // Performance measurement for timeline rendering
    const renderStart = this.startPerformanceMeasurement('Timeline rendering');

    const activities = day.timeline;
    // Generate a unique ID for the timeline container to allow multiple instances
    const containerId = `timeline-container-${day.day || 'day'}`;

    const timelineHTML = `
      <div class="day-timeline card">
        <div class="card-body">
          <div class="timeline-header">
            <h2 class="section-title">时间线</h2>
            <div class="timeline-stats">
              <span class="timeline-count">${activities.length} 个活动</span>
              ${this.calculateTotalTime(activities) > 0 ? `
                <span class="timeline-total-time">总计: ${this.calculateTotalTime(activities)}分钟</span>
              ` : ''}
            </div>
          </div>

          <div class="timeline-container" id="${containerId}">
            <!-- Virtual scroll will populate this container -->
            <div class="timeline-loading">时间线加载中...</div>
          </div>
        </div>
      </div>
    `;

    // End performance measurement
    this.endPerformanceMeasurement(renderStart, 'Timeline HTML rendered');

    return timelineHTML;
  },

  /**
   * Group activities by time of day
   */
  groupActivitiesByTime(activities) {
    const blocks = {
      morning: [],
      afternoon: [],
      evening: []
    };

    activities.forEach(activity => {
      const hour = parseInt(activity.time.split(':')[0]);
      if (hour < 12) {
        blocks.morning.push(activity);
      } else if (hour < 17) {
        blocks.afternoon.push(activity);
      } else {
        blocks.evening.push(activity);
      }
    });

    const result = [];
    if (blocks.morning.length > 0) {
      result.push({ period: '早晨', activities: blocks.morning, icon: '🌅' });
    }
    if (blocks.afternoon.length > 0) {
      result.push({ period: '下午', activities: blocks.afternoon, icon: '☀️' });
    }
    if (blocks.evening.length > 0) {
      result.push({ period: '晚上', activities: blocks.evening, icon: '🌙' });
    }

    return result;
  },

  /**
   * Render a time block (morning/afternoon/evening)
   */
  renderTimeBlock(block, blockIndex) {
    return `
      <div class="time-block ${block.period.toLowerCase()}">
        <div class="time-block-activities">
          ${block.activities.map((activity, index) => this.renderActivity(activity, blockIndex, index)).join('')}
        </div>
      </div>
    `;
  },

  /**
   * Render an individual activity
   */
  renderActivity(activity, blockIndex, activityIndex) {
    const status = this.getActivityStatus(activity);
    const statusClass = `activity-status-${status}`;
    const isImportant = activity.important || false;

    const actionButtons = `
              ${activity.actions && activity.actions.length > 0 ? activity.actions.map(action => `
                <button class="btn ${action.type === 'navigation' ? 'btn-primary' : 'btn-secondary'} btn-small activity-action"
                        data-action-type="${action.type}"
                        data-activity-id="${activity.id}"
                        ${action.type === 'map' || action.type === 'navigation' ? `data-lat="${activity.location?.coordinates?.lat}" data-lng="${activity.location?.coordinates?.lng}"` : ''}>
                  ${action.label}
                </button>
              `).join('') : ''}
              <button class="btn btn-small activity-action activity-action--fav btn-favorite"
                      data-action-type="favorite"
                      data-activity-id="${activity.id}"
                      type="button"
                      aria-label="${window.app && window.app.isFavorited(activity.id, 'activity') ? '取消收藏' : '收藏'}"
                      title="${window.app && window.app.isFavorited(activity.id, 'activity') ? '取消收藏' : '收藏'}">
                ${window.app && window.app.isFavorited(activity.id, 'activity') ? '❤️' : '🤍'}
              </button>
            `;

    return `
      <div class="activity ${statusClass} ${isImportant ? 'activity-important' : ''}" data-activity-id="${activity.id}">
        <div class="activity-time-row">
          <div class="activity-time-inline">
            <span class="inline-time">${activity.time}</span>
            <span class="inline-duration">${activity.duration}分钟</span>
          </div>
          <div class="activity-time-meta" aria-label="活动类型">
            ${isImportant ? '<span class="activity-important-badge activity-important-badge--time">重要</span>' : ''}
            ${activity.category ? `<span class="activity-cat label ${this.getCategoryLabelClass(activity.category)}">${activity.category}</span>` : ''}
          </div>
        </div>
        <div class="activity-card card">
          <div class="card-body activity-compact">
            <div class="activity-top">
              <div class="activity-top-primary">
                <span class="activity-ico" aria-hidden="true">${activity.icon}</span>
                <div class="activity-titles">
                  <div class="activity-title">${activity.title}</div>
                  <div class="activity-description">${activity.description}</div>
                </div>
              </div>
              <div class="activity-top-actions" role="toolbar" aria-label="行程操作">
                ${actionButtons}
              </div>
            </div>
            ${activity.image ? `
              <div class="activity-image-container">
                <img class="lazy-image"
                     data-src="${activity.image.src}"
                     alt="${activity.image.alt || activity.title}"
                     ${activity.image.width ? `width="${activity.image.width}"` : ''}
                     ${activity.image.height ? `height="${activity.image.height}"` : ''}
                     loading="lazy">
                ${activity.image.caption ? `<div class="image-caption">${activity.image.caption}</div>` : ''}
              </div>
            ` : ''}
            <div class="activity-detail-stack">
              ${activity.location ? `
                <div class="activity-loc-tight">
                  <div class="loc-line1"><span class="loc-ico" aria-hidden="true">📍</span><span class="loc-name">${activity.location.name}</span></div>
                  ${activity.location.address ? `<div class="loc-line2">${activity.location.address}</div>` : ''}
                </div>
              ` : ''}
              ${activity.transit && activity.transit.length > 0 ? `
                <div class="activity-transit-tight">
                  ${activity.transit.map((seg) => {
  const stopTxt = seg.stops
    ? `(${/站|次|分钟/.test(String(seg.stops)) ? seg.stops : `${seg.stops}站`})`
    : '';
  return `
                    <div class="transit-line-compact">
                      <span class="transit-ico" aria-hidden="true">🚇</span>
                      <span class="transit-join">${seg.line} <span class="t-from">${seg.boarding}</span> <span class="t-arr">→</span> <span class="t-to">${seg.alighting}</span> ${stopTxt ? `<span class="t-stops">${stopTxt}</span>` : ''}</span>
                    </div>`;
}).join('')}
                  ${activity.transit[0].payment ? `<div class="transit-payment-compact">${activity.transit[0].payment}</div>` : ''}
                </div>
              ` : ''}
              ${activity.cost ? `
                <div class="activity-foot">
                  <span class="activity-cost-tight">费用 <strong class="activity-cost-value">${activity.cost}</strong></span>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Get activity status (completed/in-progress/upcoming)
   */
  getActivityStatus(activity) {
    // Simplified status for Phase 2 - in production would compare with current time
    return 'upcoming';
  },

  /**
   * Get CSS class for category label
   */
  getCategoryLabelClass(category) {
    const categoryMap = {
      '交通': 'label-primary',
      '住宿': 'label-success',
      '餐饮': 'label-secondary',
      '景点': 'label-success',
      '自驾': 'label-secondary',
      '抵达': 'label-neutral',
      '购物': 'label-neutral'
    };
    return categoryMap[category] || 'label-neutral';
  },

  /**
   * Calculate total time for all activities
   */
  calculateTotalTime(activities) {
    return activities.reduce((total, activity) => total + (activity.duration || 0), 0);
  },

  /**
   * Render important notes section
   */
  renderImportantNotes(day) {
    if (!day.overview?.importantNotes || day.overview.importantNotes.length === 0) {
      return '';
    }

    return `
      <div class="day-notes card">
        <div class="card-body">
          <h2 class="section-title">重要提醒</h2>
          <div class="notes-list">
            ${day.overview.importantNotes.map((note, index) => `
              <div class="note-item">
                <div class="note-icon">${index + 1}.</div>
                <div class="note-text">${note}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render day action buttons
   */
  renderDayActions(day) {
    return `
      <div class="day-actions">
        <button class="btn btn-primary btn-wide" onclick="app.navigateToHome()">
          返回首页
        </button>
        <button class="btn btn-secondary btn-wide day-map-toggle" data-day="${day.day}">
          查看地图
        </button>
      </div>
    `;
  },

  /**
   * Render segmented control for view switching
   */
  renderSegmentedControl() {
    return `
      <div class="segmented-control-container">
        <div class="segmented-control">
          <button class="segment-btn active" data-view="timeline">
            <div class="segment-icon">⏰</div>
            <div class="segment-label">时间线</div>
          </button>
          <button class="segment-btn" data-view="map">
            <div class="segment-icon">🗺️</div>
            <div class="segment-label">地图</div>
          </button>
          <button class="segment-btn" data-view="details">
            <div class="segment-icon">📋</div>
            <div class="segment-label">详情</div>
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Render day details view
   */
  renderDayDetails(day) {
    return `
      <div class="day-details-view">
        <div class="card">
          <div class="card-body">
            <h2 class="section-title">行程详情</h2>
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon">📅</div>
                <div class="detail-content">
                  <div class="detail-label">日期</div>
                  <div class="detail-value">${day.date}</div>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon">📍</div>
                <div class="detail-content">
                  <div class="detail-label">城市</div>
                  <div class="detail-value">${day.city}</div>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon">⏱️</div>
                <div class="detail-content">
                  <div class="detail-label">活动数量</div>
                  <div class="detail-value">${day.timeline.length} 个活动</div>
                </div>
              </div>

              ${day.route && day.route.totalDistance !== '0公里' ? `
                <div class="detail-item">
                  <div class="detail-icon">🛣️</div>
                  <div class="detail-content">
                    <div class="detail-label">行程距离</div>
                    <div class="detail-value">${day.route.totalDistance}</div>
                  </div>
                </div>
              ` : ''}

              ${day.route && day.route.totalTime !== '0小时' ? `
                <div class="detail-item">
                  <div class="detail-icon">⏰</div>
                  <div class="detail-content">
                    <div class="detail-label">行程时间</div>
                    <div class="detail-value">${day.route.totalTime}</div>
                  </div>
                </div>
              ` : ''}

              ${day.summary ? `
                <div class="detail-item full-width">
                  <div class="detail-icon">📝</div>
                  <div class="detail-content">
                    <div class="detail-label">行程概要</div>
                    <div class="detail-value">${day.summary}</div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        ${day.overview?.importantNotes && day.overview.importantNotes.length > 0 ? this.renderImportantNotes(day) : ''}

        <div class="card">
          <div class="card-body">
            <h2 class="section-title">活动分类统计</h2>
            <div class="category-stats">
              ${this.renderCategoryStats(day)}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Render category statistics
   */
  renderCategoryStats(day) {
    const categories = {};
    day.timeline.forEach(activity => {
      const category = activity.category || '其他';
      categories[category] = (categories[category] || 0) + 1;
    });

    let html = '<div class="stats-container">';
    Object.entries(categories).forEach(([category, count]) => {
      html += `
        <div class="category-stat">
          <div class="stat-category ${this.getCategoryLabelClass(category)}">${category}</div>
          <div class="stat-count">${count} 个活动</div>
          <div class="stat-bar">
            <div class="stat-bar-fill" style="width: ${(count / day.timeline.length) * 100}%"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    return html;
  },

  /**
   * Setup segmented control listeners
   */
  setupSegmentedControlListeners(day) {
    const segmentButtons = document.querySelectorAll('.segment-btn');
    const viewContainers = document.querySelectorAll('.day-view');

    segmentButtons.forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;

        // Update active button
        segmentButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Show corresponding view
        viewContainers.forEach(container => {
          container.classList.remove('active');
          if (container.classList.contains(`day-view-${view}`)) {
            container.classList.add('active');

            // Special handling for map view
            if (view === 'map') {
              this.initializeMapView(day);
            }
          }
        });
      });
    });
  },

  /**
   * Initialize map view
   */
  initializeMapView(day) {
    const mapContainer = document.getElementById('dayMapContainer');
    if (mapContainer && typeof MapManager !== 'undefined') {
      console.log('Initializing map view for day', day.day);
      MapManager.renderDayMap(day, mapContainer);
    } else if (mapContainer) {
      console.warn('MapManager not available for map view');
      mapContainer.innerHTML = `
        <div class="map-placeholder">
          <div class="placeholder-icon">🗺️</div>
          <h3 class="placeholder-title">地图加载中...</h3>
          <p class="placeholder-text">
            地图功能正在初始化
          </p>
        </div>
      `;
    }
  },

  /**
   * Setup event listeners for timeline interactions
   */
  setupEventListeners(day, container) {
    // Generate a unique key for this container to track its event handlers
    const containerKey = `container_${day.day}`;

    // Clean up existing event handlers for this container
    this._cleanupEventHandlers(containerKey, container);

    // Create new event handler for click delegation
    const clickHandler = (e) => {
      const clickStartTime = performance.now();

      // Check if clicked element is an activity action button or inside one
      const actionButton = e.target.closest('.activity-action');
      if (actionButton) {
        const actionType = actionButton.dataset.actionType;
        const activityId = actionButton.dataset.activityId;
        const lat = actionButton.dataset.lat;
        const lng = actionButton.dataset.lng;

        this.handleActivityAction(actionType, activityId, day, lat, lng);
      }

      // Record click interaction latency
      const clickLatency = performance.now() - clickStartTime;
      if (this.performanceMonitor && clickLatency > 0) {
        this.performanceMonitor.recordInteraction('click', clickLatency);
      }
    };

    // Store handler reference and add event listener
    this._eventHandlers[containerKey] = {
      clickHandler,
      container: container
    };

    container.addEventListener('click', clickHandler);

    // Day map toggle button
    const mapToggle = container.querySelector('.day-map-toggle');
    if (mapToggle) {
      const mapToggleHandler = () => {
        this.showDayMap(day);
      };

      // Store handler reference
      this._eventHandlers[containerKey].mapToggleHandler = mapToggleHandler;
      mapToggle.addEventListener('click', mapToggleHandler);
    }
  },

  /**
   * Clean up event handlers for a container
   */
  _cleanupEventHandlers(containerKey, container) {
    if (this._eventHandlers[containerKey]) {
      const handlers = this._eventHandlers[containerKey];

      // Remove click event listener
      if (handlers.clickHandler) {
        container.removeEventListener('click', handlers.clickHandler);
      }

      // Remove map toggle event listener
      if (handlers.mapToggleHandler && handlers.container) {
        const mapToggle = handlers.container.querySelector('.day-map-toggle');
        if (mapToggle) {
          mapToggle.removeEventListener('click', handlers.mapToggleHandler);
        }
      }

      // Delete the handlers entry
      delete this._eventHandlers[containerKey];
    }
  },

  /**
   * Handle activity action button clicks
   */
  handleActivityAction(actionType, activityId, day, lat, lng) {
    console.log(`Activity action: ${actionType} for ${activityId}`);

    switch (actionType) {
      case 'details':
        this.showActivityDetails(activityId, day);
        break;
      case 'map':
        if (lat && lng) {
          this.showActivityOnMap(lat, lng, activityId, day);
        }
        break;
      case 'navigation':
        if (lat && lng) {
          this.navigateToActivity(lat, lng, activityId, day);
        }
        break;
      case 'favorite':
        this.toggleActivityFavorite(activityId, day);
        break;
      default:
        console.warn(`Unknown action type: ${actionType}`);
    }
  },

  /**
   * Toggle favorite status for an activity
   */
  toggleActivityFavorite(activityId, day) {
    console.log(`Toggling favorite for activity ${activityId}`);

    if (!window.app || typeof window.app.toggleFavorite !== 'function') {
      console.error('TravelGuideApp not available or toggleFavorite method not found');
      return;
    }

    const activity = day.timeline.find(a => a.id === activityId);
    if (!activity) {
      console.error(`Activity not found: ${activityId}`);
      return;
    }

    // Toggle favorite status
    const isNowFavorited = window.app.toggleFavorite(activityId, 'activity');

    // Show feedback
    const message = isNowFavorited ?
      `已收藏活动: ${activity.title}` :
      `已取消收藏: ${activity.title}`;

    // For Phase 2, show a simple alert
    alert(message);

    // TODO: In Phase 3, update the button UI without page reload
    // For now, we can update the button text directly
    const favoriteBtn = document.querySelector(`.activity-action[data-activity-id="${activityId}"][data-action-type="favorite"]`);
    if (favoriteBtn) {
      favoriteBtn.innerHTML = isNowFavorited ? '❤️ 已收藏' : '🤍 收藏';
      favoriteBtn.title = isNowFavorited ? '取消收藏' : '收藏';
    }
  },

  /**
   * Show activity details (placeholder for Phase 2)
   */
  showActivityDetails(activityId, day) {
    const activity = day.timeline.find(a => a.id === activityId);
    if (activity) {
      alert(`活动详情: ${activity.title}\n\n${activity.description}\n\n时间: ${activity.time}\n时长: ${activity.duration}分钟\n地点: ${activity.location?.name}\n费用: ${activity.cost || '未指定'}`);
    }
  },

  /**
   * Show activity on map
   */
  showActivityOnMap(lat, lng, activityId, day) {
    console.log(`Showing activity ${activityId} on map at ${lat}, ${lng}`);

    // Switch to map view first
    this.showDayMap(day);

    // Use MapManager to show the activity on map
    if (typeof MapManager !== 'undefined' && MapManager.showActivityOnMap) {
      // Small delay to ensure map view is initialized
      setTimeout(() => {
        MapManager.showActivityOnMap(lat, lng, activityId, day);
      }, 300);
    } else {
      console.warn('MapManager not available or showActivityOnMap method not found');
      alert(`活动: ${day.timeline.find(a => a.id === activityId)?.title}\n坐标: ${lat}, ${lng}`);
    }
  },

  /**
   * Navigate to activity (placeholder for Phase 2)
   */
  navigateToActivity(lat, lng, activityId, day) {
    console.log(`Navigating to activity ${activityId} at ${lat}, ${lng}`);
    // This will open Google Maps or Apple Maps
    const activity = day.timeline.find(a => a.id === activityId);
    if (activity && activity.location) {
      if (typeof MapManager !== 'undefined' && MapManager.openInGoogleMaps) {
        MapManager.openInGoogleMaps(parseFloat(lat), parseFloat(lng));
      } else {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
      }
    }
  },

  /**
   * Show day map (switch to map view)
   */
  showDayMap(day) {
    console.log(`Switching to map view for day ${day.day}`);

    // Find and click the map segment button
    const mapButton = document.querySelector('.segment-btn[data-view="map"]');
    if (mapButton) {
      mapButton.click();
    } else {
      console.warn('Map segment button not found');
      // Fallback: show alert if button not found
      alert(`地图功能将在Phase 2实现\n\n显示第${day.day}天行程地图`);
    }
  },

  /**
   * Get all activities sorted by time
   * @param {Object} day - Day data object
   * @returns {Array} Sorted activities array
   */
  getAllActivitiesSorted(day) {
    const activities = day.timeline || [];
    // Sort by time (assuming time format is "HH:MM")
    return activities.slice().sort((a, b) => {
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });
  },

  /**
   * Render a single activity item for virtual scroll
   * @param {Object} activity - Activity data object
   * @param {number} index - Index in the virtual scroll list
   * @returns {HTMLElement} DOM element for the activity
   */
  renderActivityItem(activity, index) {
    // Use template element for more efficient DOM creation
    const template = document.createElement('template');

    // Get HTML from existing renderActivity method (blockIndex and activityIndex not needed for virtual scroll)
    const html = this.renderActivity(activity, 0, index);
    template.innerHTML = html.trim();

    // Return the first child (the activity element)
    return template.content.firstElementChild;
  },

  /**
   * Initialize virtual scroll for timeline
   * @param {Object} day - Day data object
   * @param {HTMLElement} container - Timeline container element
   */
  initializeVirtualScroll(day, container) {
    // Start performance measurement
    const renderStart = this.startPerformanceMeasurement('Virtual scroll initialization');

    // Clean up existing instance if any
    if (this.virtualScroll) {
      this.virtualScroll.destroy();
      this.virtualScroll = null;
    }

    const activities = this.getAllActivitiesSorted(day);
    const isMobile =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(max-width: 768px)').matches;

    // 手机：全量流式布局。虚拟列表用绝对定位+固定行高，多行卡（轨交/地址）时易与下一条时间行叠字、破版
    // 一般单日 ≤32 点，直接渲染可接受
    if (!window.VirtualScroll || isMobile || activities.length <= 32) {
      if (!window.VirtualScroll) {
        console.error('VirtualScroll class not found. Make sure virtual-scroll.js is loaded.');
        this.endPerformanceMeasurement(renderStart, 'Virtual scroll initialization failed');
      }
      this.renderActivitiesFallback(day, container);
      this.endPerformanceMeasurement(
        renderStart,
        isMobile || activities.length <= 32 ? 'Timeline list (flow layout)' : 'Timeline fallback (no vscroll)'
      );
      return;
    }

    this.virtualScroll = new window.VirtualScroll(
      container,
      activities,
      (activity, index) => this.renderActivityItem(activity, index),
      {
        itemHeight: 220,
        rowGap: 12,
        bufferItems: 2
      }
    );

    this.endPerformanceMeasurement(renderStart, 'Timeline virtual scroll initialized');
  },

  /**
   * Fallback method to render activities directly when VirtualScroll is not available
   * @param {Object} day - Day data object
   * @param {HTMLElement} container - Timeline container element
   */
  renderActivitiesFallback(day, container) {
    console.log('Using fallback rendering for activities');

    const activities = this.getAllActivitiesSorted(day);
    const timeBlocks = this.groupActivitiesByTime(activities);

    let html = '';
    timeBlocks.forEach((block, blockIndex) => {
      html += this.renderTimeBlock(block, blockIndex);
    });

    container.innerHTML = html;

    console.log(`Rendered ${activities.length} activities using fallback method`);
  },

  /**
   * Initialize virtual scroll for timeline after DOM is rendered
   * @param {Object} day - Day data object
   */
  initializeTimelineVirtualScroll(day) {
    // Use requestAnimationFrame for reliable DOM readiness check
    requestAnimationFrame(() => {
      const containerId = `timeline-container-${day.day || 'day'}`;
      const container = document.getElementById(containerId);

      if (!container) {
        console.warn(`Timeline container not found: ${containerId}`);
        return;
      }

      // Clear loading placeholder
      container.innerHTML = '';

      // Initialize virtual scroll
      this.initializeVirtualScroll(day, container);

      // Initialize lazy loading for images
      this.initializeImageLazyLoading(container);

      // Setup mobile touch events support
      this.setupTouchEvents(container);

      // Add scroll to top button for easy navigation
      this.addScrollToTopButton(container);
    });
  },

  /**
   * Initialize lazy loading for images in timeline
   * @param {HTMLElement} container - Timeline container element
   */
  initializeImageLazyLoading(container) {
    // Clean up existing observers
    this._cleanupImageLazyLoading();

    // Check if IntersectionObserverManager is available
    if (!window.IntersectionObserverManager) {
      console.warn('IntersectionObserverManager not available. Image lazy loading disabled.');
      return;
    }

    // Create new image observer
    this.imageObserver = new window.IntersectionObserverManager({
      rootMargin: '100px 0px',
      threshold: 0.01,
      placeholderColor: '#f5f5f5',
      placeholderAspectRatio: 16/9
    });

    // Observe existing images in container
    const images = container.querySelectorAll('img.lazy-image');
    if (images.length > 0) {
      this.imageObserver.observeImages(images);
    }

    // Setup mutation observer to detect new lazy images added dynamically
    this._setupImageMutationObserver(container);

    console.log('Image lazy loading initialized for timeline');
  },

  /**
   * Setup mutation observer to detect new lazy images
   * @param {HTMLElement} container - Container element to observe
   */
  _setupImageMutationObserver(container) {
    // Check if MutationObserver is supported
    if (!('MutationObserver' in window)) {
      console.warn('MutationObserver not supported. New lazy images may not be observed.');
      return;
    }

    // Clean up existing mutation observer
    if (this._imageMutationObserver) {
      this._imageMutationObserver.disconnect();
      this._imageMutationObserver = null;
    }

    // Create mutation observer to detect new lazy images with debouncing
    let pendingImages = [];
    let rafId = null;

    this._imageMutationObserver = new MutationObserver((mutations) => {
      // Collect new images from all mutations
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if node itself is a lazy image
            if (node.matches && node.matches('img.lazy-image')) {
              pendingImages.push(node);
            }

            // Check for lazy images within the node
            const images = node.querySelectorAll && node.querySelectorAll('img.lazy-image');
            if (images && images.length > 0) {
              pendingImages.push(...Array.from(images));
            }
          }
        });
      });

      // Debounce with requestAnimationFrame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        // Process collected images
        if (pendingImages.length > 0 && this.imageObserver) {
          this.imageObserver.observeImages(pendingImages);
          pendingImages = [];
        }
        rafId = null;
      });
    });

    // Start observing the container for child list changes
    this._imageMutationObserver.observe(container, {
      childList: true,
      subtree: true
    });
  },

  /**
   * Clean up image lazy loading resources
   */
  _cleanupImageLazyLoading() {
    // Clean up image observer
    if (this.imageObserver) {
      this.imageObserver.destroy();
      this.imageObserver = null;
    }

    // Clean up mutation observer
    if (this._imageMutationObserver) {
      this._imageMutationObserver.disconnect();
      this._imageMutationObserver = null;
    }
  },

  /**
   * Update timeline data for virtual scroll
   * @param {Object|Array} newData - New data object (with timeline property) or activities array
   */
  updateData(newData) {
    let activities;

    // Support both data object with timeline property and direct activities array
    if (newData && Array.isArray(newData.timeline)) {
      // Extract activities from data object
      activities = newData.timeline;
    } else if (Array.isArray(newData)) {
      // Direct activities array (backward compatibility)
      activities = newData;
    } else {
      console.error('updateData: newData must be an array or an object with timeline property');
      return;
    }

    if (!this.virtualScroll) {
      console.warn('updateData: virtualScroll not initialized yet');
      return;
    }

    // Update the virtual scroll instance with new data
    this.virtualScroll.updateItems(activities);
    console.log(`Timeline data updated with ${activities.length} activities`);
  },

  /**
   * 设置移动端触摸事件支持
   * @param {HTMLElement} container - 时间线容器元素
   */
  setupTouchEvents(container) {
    if (!container) {
      console.warn('setupTouchEvents: container is required');
      return;
    }

    // 防止重复设置
    if (container._touchEventsSetup) {
      return;
    }

    // 触摸状态跟踪
    const touchState = {
      touchStartX: 0,
      touchStartY: 0,
      touchStartTime: 0,
      touchMoved: false,
      lastTapTime: 0,
      tapCount: 0
    };

    // 触摸开始事件
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;

      touchState.touchStartX = touch.clientX;
      touchState.touchStartY = touch.clientY;
      touchState.touchStartTime = Date.now();
      touchState.touchMoved = false;

      // 防止双击缩放
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // 触摸移动事件
    const handleTouchMove = (e) => {
      if (!touchState.touchStartTime) return;

      const touch = e.touches[0];
      if (!touch) return;

      const deltaX = Math.abs(touch.clientX - touchState.touchStartX);
      const deltaY = Math.abs(touch.clientY - touchState.touchStartY);

      // 如果垂直移动超过阈值，视为滚动，不是点击
      if (deltaY > this.MOBILE_CONSTANTS.MOVE_THRESHOLD) {
        touchState.touchMoved = true;
      }
    };

    // 触摸结束事件
    const handleTouchEnd = (e) => {
      if (!touchState.touchStartTime) return;

      const touchTime = Date.now() - touchState.touchStartTime;
      const isTap = !touchState.touchMoved && touchTime < this.MOBILE_CONSTANTS.TAP_TIME_THRESHOLD; // 短按视为点击

      if (isTap) {
        // Record touch interaction latency
        if (this.performanceMonitor) {
          this.performanceMonitor.recordInteraction('touch', touchTime);
        }

        this.handleMobileTap(e, container);

        // 检查双击
        const currentTime = Date.now();
        const timeSinceLastTap = currentTime - touchState.lastTapTime;

        if (timeSinceLastTap < this.MOBILE_CONSTANTS.DOUBLE_TAP_INTERVAL) { // 双击时间间隔内
          touchState.tapCount++;
          if (touchState.tapCount >= 2) {
            this.handleDoubleTap(e, container);
            touchState.tapCount = 0;
          }
        } else {
          touchState.tapCount = 1;
        }

        touchState.lastTapTime = currentTime;
      }

      // 重置触摸状态
      touchState.touchStartX = 0;
      touchState.touchStartY = 0;
      touchState.touchStartTime = 0;
      touchState.touchMoved = false;
    };

    // 添加事件监听器
    // touchstart may call preventDefault() for multi-touch, so cannot use passive: true
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // 标记为已设置
    container._touchEventsSetup = true;
    container._touchEventHandlers = {
      touchstart: handleTouchStart,
      touchmove: handleTouchMove,
      touchend: handleTouchEnd
    };

    console.log('Touch events setup for timeline container');
  },

  /**
   * 处理移动端点击事件
   * @param {TouchEvent} e - 触摸事件
   * @param {HTMLElement} container - 容器元素
   */
  handleMobileTap(e, container) {
    // 找到被点击的活动卡片
    const target = e.changedTouches[0];
    if (!target) return;

    const element = document.elementFromPoint(target.clientX, target.clientY);
    if (!element) return;

    // 检查是否点击了活动卡片或相关元素
    const activityCard = element.closest('.activity-card');
    // 确保点击的元素在时间线容器内
    if (activityCard && container.contains(activityCard)) {
      // 触发活动卡片的点击效果
      activityCard.style.transform = 'scale(0.98)';
      setTimeout(() => {
        activityCard.style.transform = '';
      }, this.MOBILE_CONSTANTS.TAP_FEEDBACK_DURATION);

      // 如果点击了活动动作按钮，让原生点击事件处理
      const activityAction = element.closest('.activity-action');
      if (!activityAction) {
        // 如果没有点击按钮，可以触发活动详情查看
        const activityElement = element.closest('.activity');
        if (activityElement) {
          const activityId = activityElement.dataset.activityId;
          if (activityId) {
            console.log(`Mobile tap on activity ${activityId}`);
            // 这里可以添加移动端特定的点击行为
            // 例如：展开活动详情或显示更多信息
          }
        }
      }
    }
  },

  /**
   * 处理双击事件（滚动到顶部）
   * @param {TouchEvent} e - 触摸事件
   * @param {HTMLElement} container - 容器元素
   */
  handleDoubleTap(e, container) {
    console.log('Double tap detected, scrolling to top');

    // CSS的touch-action: pan-y已经防止了双击缩放
    // 不需要调用e.preventDefault()以避免与passive事件监听器冲突

    // 平滑滚动到时间线顶部
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

    // 显示视觉反馈
    const timelineHeader = container.querySelector('.timeline-header');
    if (timelineHeader) {
      timelineHeader.style.backgroundColor = 'rgba(102, 126, 234, 0.1)';
      setTimeout(() => {
        timelineHeader.style.backgroundColor = '';
      }, this.MOBILE_CONSTANTS.DOUBLE_TAP_FEEDBACK_DURATION);
    }
  },

  /**
   * 添加快捷滚动到顶部按钮
   * @param {HTMLElement} container - 时间线容器元素
   */
  addScrollToTopButton(container) {
    if (!container) {
      console.warn('addScrollToTopButton: container is required');
      return;
    }

    // 检查按钮是否已存在
    let scrollButton = container.querySelector('.scroll-to-top');
    if (scrollButton) {
      return; // 按钮已存在
    }

    // 创建按钮元素
    scrollButton = document.createElement('button');
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', '滚动到顶部');
    scrollButton.setAttribute('title', '滚动到顶部');
    scrollButton.innerHTML = '↑';

    // 添加到容器中
    container.appendChild(scrollButton);

    // 滚动事件监听器（使用requestAnimationFrame防抖）
    const handleScroll = () => {
      if (container._scrollRafId) {
        cancelAnimationFrame(container._scrollRafId);
      }

      container._scrollRafId = requestAnimationFrame(() => {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        // 当滚动超过阈值时显示按钮
        if (scrollTop > this.MOBILE_CONSTANTS.SCROLL_BUTTON_SHOW_THRESHOLD) {
          scrollButton.classList.add('visible');
        } else {
          scrollButton.classList.remove('visible');
        }

        // 如果已滚动到底部，隐藏按钮
        if (scrollTop + clientHeight >= scrollHeight - this.MOBILE_CONSTANTS.SCROLL_BUTTON_HIDE_BOTTOM_THRESHOLD) {
          scrollButton.classList.remove('visible');
        }

        container._scrollRafId = null;
      });
    };

    // 按钮点击事件
    const handleButtonClick = () => {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // 添加事件监听器
    container.addEventListener('scroll', handleScroll);
    scrollButton.addEventListener('click', handleButtonClick);

    // 存储事件处理器引用以便清理
    container._scrollHandler = handleScroll;
    container._scrollRafId = null; // 初始化为null，将在handleScroll中更新
    scrollButton._clickHandler = handleButtonClick;

    console.log('Scroll to top button added to timeline container');
  },

  /**
   * Clean up virtual scroll instance and event handlers
   */
  cleanup() {
    // Clean up virtual scroll
    if (this.virtualScroll) {
      this.virtualScroll.destroy();
      this.virtualScroll = null;
    }

    // Clean up image lazy loading resources
    this._cleanupImageLazyLoading();

    // Clean up all event handlers
    Object.keys(this._eventHandlers).forEach(containerKey => {
      const handlers = this._eventHandlers[containerKey];
      if (handlers.container && handlers.clickHandler) {
        handlers.container.removeEventListener('click', handlers.clickHandler);
      }
    });
    this._eventHandlers = {};

    // Clean up touch events and scroll button
    this._cleanupTouchEvents();
  },

  /**
   * 清理触摸事件和滚动按钮
   */
  _cleanupTouchEvents() {
    // 查找所有时间线容器
    const timelineContainers = document.querySelectorAll('.timeline-container');
    timelineContainers.forEach(container => {
      // 清理触摸事件
      if (container._touchEventHandlers) {
        const handlers = container._touchEventHandlers;
        container.removeEventListener('touchstart', handlers.touchstart);
        container.removeEventListener('touchmove', handlers.touchmove);
        container.removeEventListener('touchend', handlers.touchend);
        delete container._touchEventHandlers;
        delete container._touchEventsSetup;
      }

      // 清理滚动按钮事件
      const scrollButton = container.querySelector('.scroll-to-top');
      if (scrollButton && scrollButton._clickHandler) {
        scrollButton.removeEventListener('click', scrollButton._clickHandler);
        delete scrollButton._clickHandler;
      }

      if (container._scrollHandler) {
        container.removeEventListener('scroll', container._scrollHandler);
        delete container._scrollHandler;
      }

      // 清理requestAnimationFrame引用
      if (container._scrollRafId) {
        cancelAnimationFrame(container._scrollRafId);
        delete container._scrollRafId;
      }

      // 移除滚动按钮
      if (scrollButton && scrollButton.parentNode) {
        scrollButton.parentNode.removeChild(scrollButton);
      }
    });
  }
};

// Make TimelineRenderer globally available
window.TimelineRenderer = TimelineRenderer;