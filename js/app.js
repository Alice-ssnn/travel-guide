// app.js - Main application logic and routing

/** 首页点击某天 → day.html 时，在部分 PWA/浏览器中 ?day= 会丢；用 sessionStorage + hash 双备份 */
const TRAVEL_GUIDE_TARGET_DAY_KEY = 'travelGuideTargetDay';

class TravelGuideApp {
  constructor() {
    this.currentDay = 1;
    this.favorites = new Set();
    this.initialize();
  }

  _setTargetDayHandoff(dayNumber) {
    try {
      sessionStorage.setItem(TRAVEL_GUIDE_TARGET_DAY_KEY, String(dayNumber));
    } catch (e) {
      /* 无痕模式等可忽略 */
    }
  }

  _clearTargetDayHandoff() {
    try {
      sessionStorage.removeItem(TRAVEL_GUIDE_TARGET_DAY_KEY);
    } catch (e) {
      /* ignore */
    }
  }

  _takeTargetDayHandoff(maxDay) {
    try {
      const raw = sessionStorage.getItem(TRAVEL_GUIDE_TARGET_DAY_KEY);
      if (raw == null) return null;
      const n = parseInt(raw, 10);
      if (isNaN(n) || n < 1 || n > maxDay) {
        this._clearTargetDayHandoff();
        return null;
      }
      this._clearTargetDayHandoff();
      return n;
    } catch (e) {
      return null;
    }
  }

  /** 优先 ?day=，没有则读 # 里的 day=（部分环境会保留 hash） */
  _getDayParamFromPage() {
    const fromQuery = new URLSearchParams(window.location.search).get('day');
    if (fromQuery != null && fromQuery !== '' && !isNaN(fromQuery)) {
      return fromQuery;
    }
    const h = (window.location.hash && window.location.hash.length > 1)
      ? window.location.hash.replace(/^#/, '')
      : '';
    if (h) {
      const fromHash = new URLSearchParams(h).get('day');
      if (fromHash != null && fromHash !== '' && !isNaN(fromHash)) {
        return fromHash;
      }
    }
    return null;
  }

  /**
   * 是否为单日行程页（day.html 或静态服务器将 /day 指到同页时）
   */
  isDayViewPage() {
    const p = (window.location.pathname || '').toLowerCase();
    if (p.includes('day.html')) return true;
    if (p === '/day' || p.endsWith('/day/') || p.endsWith('/day')) return true;
    return false;
  }

  /**
   * 是否当前为「带行程列表」的首页（index 壳）
   */
  isHomeListPage() {
    return Boolean(document.getElementById('daysList'));
  }

  /**
   * Initialize the application
   */
  initialize() {
    this.loadFavorites();
    this.setupEventListeners();

    // Setup routing - if it doesn't handle a specific route (returns false),
    // then render the homepage
    const routeHandled = this.setupRouting();
    if (!routeHandled) {
      this.renderHomepage();
    }

    // Add performance monitoring button (development mode only)
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(() => {
      this.addPerformanceButton();
      // Initialize Google Maps if available
      if (typeof MapManager !== 'undefined' && typeof MapManager.init === 'function') {
        const apiKey = localStorage.getItem('googleMapsApiKey');
        MapManager.init(apiKey || undefined);
        console.log('Google Maps initialized', apiKey ? 'with API key' : 'in placeholder mode');
      }
    }, 100);
  }

  /**
   * Load favorites from localStorage
   */
  loadFavorites() {
    try {
      const saved = localStorage.getItem('travelGuideFavorites');
      if (saved) {
        this.favorites = new Set(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }

  /**
   * Save favorites to localStorage
   */
  saveFavorites() {
    try {
      localStorage.setItem('travelGuideFavorites', JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Today button
    const todayBtn = document.getElementById('todayBtn');
    if (todayBtn) {
      todayBtn.addEventListener('click', () => {
        const currentDay = TripData.getCurrentDay();
        this.navigateToDay(currentDay.day);
      });
    }

    // Search button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.openSearch();
      });
    }

    // Close search button
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    if (closeSearchBtn) {
      closeSearchBtn.addEventListener('click', () => {
        this.closeSearch();
      });
    }

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // Close search on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeSearch();
      }
    });

    // Handle back/forward navigation
    window.addEventListener('popstate', (event) => {
      this.handlePopState(event);
    });
  }

  /**
   * Setup client-side routing
   * @returns {boolean} True if a route was handled (e.g., day detail), false otherwise
   */
  setupRouting() {
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');
    const maxDay = TripData.getAllDays().length;
    const path = window.location.pathname;

    if (this.isDayViewPage()) {
      const effective = this._getDayParamFromPage();
      let dayNumber = 1;

      if (effective && !isNaN(effective)) {
        const parsed = parseInt(effective, 10);
        if (parsed >= 1 && parsed <= maxDay) {
          dayNumber = parsed;
        } else {
          dayNumber = Math.min(maxDay, Math.max(1, parsed));
        }
        this._clearTargetDayHandoff();
        const u = new URL(window.location.href);
        if (u.searchParams.get('day') !== String(dayNumber) || u.hash) {
          u.searchParams.set('day', String(dayNumber));
          u.hash = '';
          window.history.replaceState({}, '', `${u.pathname}${u.search}`);
        }
      } else {
        const fromHandoff = this._takeTargetDayHandoff(maxDay);
        if (fromHandoff != null) {
          dayNumber = fromHandoff;
        }
        window.history.replaceState({}, '', `${path}?day=${dayNumber}`);
      }
      this.currentDay = dayNumber;
      this.renderDayDetail(dayNumber);
      return true;
    }

    if (dayParam && !isNaN(dayParam)) {
      const dayNumber = parseInt(dayParam, 10);
      if (dayNumber >= 1 && dayNumber <= maxDay) {
        this.currentDay = dayNumber;
        this.renderDayDetail(dayNumber);
        return true;
      }
    }

    return false;
  }

  /**
   * Handle browser back/forward navigation
   */
  handlePopState(event) {
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');
    const maxDay = TripData.getAllDays().length;
    const path = window.location.pathname;

    if (this.isDayViewPage()) {
      const effective = this._getDayParamFromPage();
      let dayNumber = 1;
      if (effective && !isNaN(effective)) {
        const n = parseInt(effective, 10);
        dayNumber = n >= 1 && n <= maxDay ? n : Math.min(maxDay, Math.max(1, n));
        this._clearTargetDayHandoff();
        const u = new URL(window.location.href);
        if (u.searchParams.get('day') !== String(dayNumber) || u.hash) {
          u.searchParams.set('day', String(dayNumber));
          u.hash = '';
          window.history.replaceState(event.state || {}, '', `${u.pathname}${u.search}`);
        }
      } else {
        const fromHandoff = this._takeTargetDayHandoff(maxDay);
        if (fromHandoff != null) {
          dayNumber = fromHandoff;
        }
        window.history.replaceState(event.state || {}, '', `${path}?day=${dayNumber}`);
      }
      this.currentDay = dayNumber;
      this.renderDayDetail(dayNumber);
      return;
    }

    if (dayParam && !isNaN(dayParam)) {
      const dayNumber = parseInt(dayParam, 10);
      this.currentDay = dayNumber;
      this.renderDayDetail(dayNumber);
    } else {
      this.renderHomepage();
    }
  }

  /**
   * Navigate to a specific day
   */
  navigateToDay(dayNumber) {
    if (dayNumber < 1 || dayNumber > TripData.getAllDays().length) {
      console.error(`Invalid day number: ${dayNumber}`);
      return;
    }

    this.currentDay = dayNumber;

    if (this.isDayViewPage()) {
      const next = new URL(window.location.href);
      next.searchParams.set('day', String(dayNumber));
      window.history.pushState({ day: dayNumber }, '', `${next.pathname}${next.search}${next.hash}`);
      this.renderDayDetail(dayNumber);
      return;
    }

    // 从首页等进入：query/hash/sessionStorage 三重备份，避免 PWA/部分 WebView 丢 ?day= 时总落在第 1 天
    this._setTargetDayHandoff(dayNumber);
    const next = new URL('day.html', window.location.href);
    next.searchParams.set('day', String(dayNumber));
    next.hash = `day=${dayNumber}`;
    window.location.assign(next.href);
  }

  /**
   * Navigate back to homepage
   */
  navigateToHome() {
    if (this.isHomeListPage()) {
      this.currentDay = 1;
      window.history.pushState({}, '', window.location.pathname);
      this.renderHomepage();
      return;
    }
    // day.html 等没有 #daysList；若仅靠 isDayViewPage 易误判，整页回首页
    const home = new URL('index.html', window.location.href);
    window.location.assign(home.href);
  }

  /**
   * Render homepage with day cards
   */
  renderHomepage() {
    this._clearTargetDayHandoff();
    const appElement = document.querySelector('.app');
    if (!appElement) return;

    // Show homepage structure (already in index.html)
    const daysList = document.getElementById('daysList');
    if (!daysList) return;

    // Clear existing content
    daysList.innerHTML = '';

    // Get all days
    const days = TripData.getAllDays();

    // Create day cards
    days.forEach(day => {
      const dayCard = this.createDayCard(day);
      daysList.appendChild(dayCard);
    });

    // Update page title
    document.title = '瑞士法国旅行指南';
  }

  /**
   * Create a day card element
   */
  createDayCard(day) {
    const card = document.createElement('div');
    card.className = 'card day-card';
    card.dataset.day = day.day;

    const isToday = day.day === TripData.getCurrentDay().day;

    card.innerHTML = `
      <div class="card-body">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <div style="font-size: 14px; color: var(--text-secondary);">第${day.day}天</div>
            <div style="font-size: 17px; font-weight: 600;">${day.date}</div>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="width: 8px; height: 8px; background: ${day.color}; border-radius: 50%;"></div>
            <span style="font-size: 15px;">${day.city}</span>
          </div>
        </div>

        <div style="font-size: 15px; color: var(--text-primary); margin: 8px 0;">
          ${day.summary}
        </div>

        <div style="display: flex; gap: 8px; margin-top: 12px;">
          ${day.tags.map(tag => {
            let labelClass = 'label-neutral';
            if (tag === '自驾') labelClass = 'label-secondary';
            if (tag === '飞行') labelClass = 'label-primary';
            if (tag === '酒店') labelClass = 'label-success';
            return `<div class="label ${labelClass}">${tag}</div>`;
          }).join('')}
        </div>

        ${isToday ? '<div style="margin-top: 12px; padding: 4px 8px; background: var(--success); color: white; border-radius: 4px; font-size: 12px; display: inline-block;">今天</div>' : ''}
      </div>
    `;

    // Add click event
    card.addEventListener('click', () => {
      this.navigateToDay(day.day);
    });

    return card;
  }

  /**
   * Render day detail page
   */
  renderDayDetail(dayNumber) {
    const appElement = document.querySelector('.app');
    if (!appElement) return;

    if (!this.isDayViewPage()) {
      // 首页带 ?day= 时跳转到标准行程页（与静态部署路径一致用 day.html）
      window.location.href = `day.html?day=${dayNumber}`;
      return;
    }

    // We're on day.html, render the detail
    const dayDetailElement = document.getElementById('dayDetail');
    if (!dayDetailElement) return;

    try {
      const day = TripData.getDay(dayNumber);

      // Update page title
      document.title = `${day.title} - 瑞士法国旅行指南`;

      // Render day detail (to be implemented in timeline.js)
      dayDetailElement.innerHTML = `
        <div class="day-loading">加载行程详情...</div>
      `;

      // Initialize timeline rendering
      if (typeof TimelineRenderer !== 'undefined') {
        TimelineRenderer.renderDay(day, dayDetailElement);
      } else {
        console.error('TimelineRenderer not found');
        dayDetailElement.innerHTML = `
          <div class="day-error">
            <h2>${day.title}</h2>
            <p>无法加载时间线组件</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Failed to render day detail:', error);
      dayDetailElement.innerHTML = `
        <div class="day-error">
          <h2>加载失败</h2>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="app.navigateToHome()">返回首页</button>
        </div>
      `;
    }
  }

  /**
   * Open search overlay
   */
  openSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
      searchOverlay.style.display = 'flex';
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }

  /**
   * Close search overlay
   */
  closeSearch() {
    const searchOverlay = document.getElementById('searchOverlay');
    if (searchOverlay) {
      searchOverlay.style.display = 'none';
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.value = '';
      }
      const searchResults = document.getElementById('searchResults');
      if (searchResults) {
        searchResults.innerHTML = '';
      }
    }
  }

  /**
   * Handle search input
   */
  handleSearch(query) {
    const searchResults = document.getElementById('searchResults');
    if (!searchResults) return;

    if (!query || query.trim() === '') {
      searchResults.innerHTML = '';
      return;
    }

    const results = TripData.search(query);

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-secondary);">
          未找到"${query}"的相关结果
        </div>
      `;
      return;
    }

    let html = `
      <div style="margin-bottom: 12px; font-size: 14px; color: var(--text-secondary);">
        找到 ${results.length} 个结果
      </div>
    `;

    results.forEach(result => {
      if (result.type === 'day') {
        html += `
          <div class="card search-result" style="margin-bottom: 8px;" data-day="${result.day}">
            <div class="card-body" style="padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 15px; font-weight: 500;">第${result.day}天: ${result.title}</div>
                  <div style="font-size: 13px; color: var(--text-secondary);">${result.match}</div>
                </div>
                <button class="btn btn-primary" style="padding: 4px 8px; font-size: 12px;">查看</button>
              </div>
            </div>
          </div>
        `;
      } else if (result.type === 'activity') {
        html += `
          <div class="card search-result" style="margin-bottom: 8px;" data-day="${result.day}" data-activity="${result.activityId}">
            <div class="card-body" style="padding: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <div style="font-size: 15px; font-weight: 500;">${result.time} ${result.title}</div>
                  <div style="font-size: 13px; color: var(--text-secondary);">第${result.day}天 · ${result.match}</div>
                </div>
                <button class="btn btn-primary" style="padding: 4px 8px; font-size: 12px;">查看</button>
              </div>
            </div>
          </div>
        `;
      }
    });

    searchResults.innerHTML = html;

    // Add click events to search results
    const resultElements = searchResults.querySelectorAll('.search-result');
    resultElements.forEach(element => {
      element.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
          const day = element.dataset.day;
          this.navigateToDay(parseInt(day, 10));
          this.closeSearch();
        }
      });
    });
  }

  /**
   * Toggle favorite status for an item
   */
  toggleFavorite(itemId, itemType) {
    const key = `${itemType}:${itemId}`;

    if (this.favorites.has(key)) {
      this.favorites.delete(key);
    } else {
      this.favorites.add(key);
    }

    this.saveFavorites();
    return this.favorites.has(key);
  }

  /**
   * Check if an item is favorited
   */
  isFavorited(itemId, itemType) {
    const key = `${itemType}:${itemId}`;
    return this.favorites.has(key);
  }

  /**
   * Check if running in development mode
   * @returns {boolean} True if in development mode
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
   * Show performance report in a modal or console
   */
  showPerformanceReport() {
    // Check if TimelineRenderer and performance monitor are available
    if (typeof TimelineRenderer === 'undefined') {
      console.error('TimelineRenderer not available');
      return;
    }

    if (!TimelineRenderer.performanceMonitor) {
      console.warn('Performance monitor not initialized. Initializing now...');
      TimelineRenderer.initPerformanceMonitor();
    }

    // Get performance report
    const report = TimelineRenderer.getPerformanceReport();
    if (!report) {
      console.error('Failed to get performance report');
      return;
    }

    // For development mode, show detailed report in console
    if (this._isDevelopmentMode()) {
      TimelineRenderer.printPerformanceReport();
    }

    // Show simplified report in UI
    this.showPerformanceUI(report);
  }

  /**
   * Show performance monitoring UI
   * @param {Object} report - Performance report (optional)
   */
  showPerformanceUI(report = null) {
    // Remove existing performance UI if present
    const existingUI = document.getElementById('performance-monitor-ui');
    if (existingUI) {
      existingUI.remove();
    }

    // Get performance data
    if (!report && typeof TimelineRenderer !== 'undefined') {
      report = TimelineRenderer.getPerformanceSummary();
    }

    if (!report) {
      console.warn('No performance data available');
      return;
    }

    // Create performance UI container
    const performanceUI = document.createElement('div');
    performanceUI.id = 'performance-monitor-ui';
    performanceUI.className = 'performance-monitor-ui';
    performanceUI.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: rgba(0, 0, 0, 0.85);
      color: white;
      border-radius: 12px;
      padding: 16px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      z-index: 9999;
      max-width: 320px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `;

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    `;
    closeButton.addEventListener('click', () => {
      performanceUI.remove();
    });
    performanceUI.appendChild(closeButton);

    // Performance score
    const score = report.score || 0;
    let scoreColor = '#30d158'; // green
    if (score < 70) scoreColor = '#ff9500'; // orange
    if (score < 50) scoreColor = '#ff3b30'; // red

    const scoreHTML = `
      <div style="margin-bottom: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 600; font-size: 14px;">性能监控</div>
          <div style="font-size: 11px; color: #8e8e93;">${new Date().toLocaleTimeString()}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 48px; height: 48px; border-radius: 50%; background: conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg); display: flex; align-items: center; justify-content: center;">
            <div style="background: rgba(0, 0, 0, 0.8); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600;">${score}</div>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #8e8e93; margin-bottom: 4px;">性能得分</div>
            <div style="display: flex; gap: 12px;">
              <div>
                <div style="font-size: 11px; color: #8e8e93;">渲染时间</div>
                <div style="font-size: 13px; font-weight: 500;">${report.metrics?.renderTime ? report.metrics.renderTime.toFixed(1) + 'ms' : 'N/A'}</div>
              </div>
              <div>
                <div style="font-size: 11px; color: #8e8e93;">长任务</div>
                <div style="font-size: 13px; font-weight: 500;">${report.metrics?.longTasks || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Metrics grid
    const metricsHTML = `
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px;">
        <div style="background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 8px;">
          <div style="font-size: 11px; color: #8e8e93; margin-bottom: 2px;">内存使用</div>
          <div style="font-size: 13px; font-weight: 500;">${report.metrics?.memoryUsage ? this._formatBytes(report.metrics.memoryUsage) : 'N/A'}</div>
        </div>
        <div style="background: rgba(255, 255, 255, 0.05); padding: 8px; border-radius: 8px;">
          <div style="font-size: 11px; color: #8e8e93; margin-bottom: 2px;">布局偏移</div>
          <div style="font-size: 13px; font-weight: 500;">${report.metrics?.layoutShift ? report.metrics.layoutShift.toFixed(3) : '0.000'}</div>
        </div>
      </div>
    `;

    // Recommendations
    let recommendationsHTML = '';
    if (report.recommendations && report.recommendations > 0) {
      recommendationsHTML = `
        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
          <div style="font-size: 11px; color: #8e8e93; margin-bottom: 8px;">优化建议: ${report.recommendations}</div>
          <div style="font-size: 11px; color: #8e8e93;">在控制台查看详细报告</div>
        </div>
      `;
    }

    // Action buttons
    const actionsHTML = `
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button class="performance-action-btn" data-action="refresh" style="flex: 1; padding: 6px 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 6px; color: white; font-size: 12px; cursor: pointer;">刷新</button>
        <button class="performance-action-btn" data-action="console" style="flex: 1; padding: 6px 12px; background: rgba(102, 126, 234, 0.3); border: 1px solid rgba(102, 126, 234, 0.5); border-radius: 6px; color: white; font-size: 12px; cursor: pointer;">控制台</button>
        <button class="performance-action-btn" data-action="close" style="flex: 1; padding: 6px 12px; background: rgba(255, 59, 48, 0.2); border: 1px solid rgba(255, 59, 48, 0.4); border-radius: 6px; color: #ff3b30; font-size: 12px; cursor: pointer;">关闭</button>
      </div>
    `;

    performanceUI.innerHTML = scoreHTML + metricsHTML + recommendationsHTML + actionsHTML;

    // Add event listeners for action buttons
    performanceUI.querySelectorAll('.performance-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        this.handlePerformanceAction(action);
      });
    });

    // Add to document
    document.body.appendChild(performanceUI);
  }

  /**
   * Handle performance UI actions
   * @param {string} action - Action type
   */
  handlePerformanceAction(action) {
    switch (action) {
      case 'refresh':
        this.showPerformanceReport();
        break;
      case 'console':
        if (typeof TimelineRenderer !== 'undefined') {
          TimelineRenderer.printPerformanceReport();
        }
        break;
      case 'close':
        const ui = document.getElementById('performance-monitor-ui');
        if (ui) ui.remove();
        break;
    }
  }

  /**
   * Add performance monitoring button to header (development mode only)
   */
  addPerformanceButton() {
    // Only add button in development mode
    if (!this._isDevelopmentMode()) {
      return;
    }

    // Check if button already exists
    if (document.getElementById('performanceMonitorBtn')) {
      return;
    }

    // Find header actions container
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) {
      console.warn('Header actions container not found');
      return;
    }

    // Create performance button
    const performanceBtn = document.createElement('button');
    performanceBtn.id = 'performanceMonitorBtn';
    performanceBtn.className = 'btn btn-performance';
    performanceBtn.innerHTML = '📊';
    performanceBtn.title = '性能监控';
    performanceBtn.setAttribute('aria-label', '性能监控');

    // Add click event
    performanceBtn.addEventListener('click', () => {
      this.showPerformanceReport();
    });

    // Add to header
    headerActions.appendChild(performanceBtn);
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   * @private
   */
  _formatBytes(bytes) {
    if (bytes === 0 || !bytes) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

// Phase 3 PWA Offline Optimization Initialization
function initPhase3Services() {
  console.log('[Phase3] Initializing offline services...');

  // Initialize NetworkMonitor if available
  if (typeof NetworkMonitor !== 'undefined') {
    window.networkMonitor = new NetworkMonitor();
    console.log('[Phase3] NetworkMonitor initialized');
  } else {
    console.warn('[Phase3] NetworkMonitor not available');
  }

  // Initialize OfflineSyncManager if available
  if (typeof OfflineSyncManager !== 'undefined') {
    // Note: OfflineSyncManager is already initialized in service worker
    console.log('[Phase3] OfflineSyncManager available');
  }

  // Initialize OfflineMapService if available
  if (typeof OfflineMapService !== 'undefined') {
    window.offlineMapService = new OfflineMapService();
    console.log('[Phase3] OfflineMapService initialized');

    // Pre-cache static maps if install prompt is available
    if (window.PWAInstallManager && typeof window.PWAInstallManager.isInstallPromptAvailable === 'function') {
      if (window.PWAInstallManager.isInstallPromptAvailable()) {
        window.offlineMapService.precacheImportantAreas().catch(error => {
          console.warn('[Phase3] Failed to pre-cache maps:', error);
        });
      }
    }
  } else {
    console.warn('[Phase3] OfflineMapService not available');
  }

  // Register for background sync when online
  if (navigator.onLine && 'serviceWorker' in navigator && 'SyncManager' in window) {
    registerBackgroundSync();
  }
}

// Register background sync for offline actions
async function registerBackgroundSync() {
  try {
    const registration = await navigator.serviceWorker.ready;

    // Register for favorite sync
    await registration.sync.register('sync-favorites');
    console.log('[Phase3] Background sync registered for favorites');
  } catch (error) {
    console.error('[Phase3] Background sync registration failed:', error);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TravelGuideApp();

  // Initialize Phase 3 services after app is created
  setTimeout(() => {
    initPhase3Services();
  }, 100); // Small delay to ensure all scripts are loaded
});