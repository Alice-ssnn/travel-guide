// app.js - Main application logic and routing

class TravelGuideApp {
  constructor() {
    this.currentDay = 1;
    this.favorites = new Set();
    this.initialize();
  }

  /**
   * Initialize the application
   */
  initialize() {
    this.loadFavorites();
    this.setupEventListeners();
    this.setupRouting();
    this.renderHomepage();
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
   */
  setupRouting() {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');

    if (dayParam && !isNaN(dayParam)) {
      const dayNumber = parseInt(dayParam, 10);
      if (dayNumber >= 1 && dayNumber <= TripData.getAllDays().length) {
        this.currentDay = dayNumber;
        this.renderDayDetail(dayNumber);
        return;
      }
    }

    // Default to homepage
    this.renderHomepage();
  }

  /**
   * Handle browser back/forward navigation
   */
  handlePopState(event) {
    const urlParams = new URLSearchParams(window.location.search);
    const dayParam = urlParams.get('day');

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

    // Update URL without page reload
    const newUrl = `${window.location.pathname}?day=${dayNumber}`;
    window.history.pushState({ day: dayNumber }, '', newUrl);

    // Render day detail
    this.renderDayDetail(dayNumber);
  }

  /**
   * Navigate back to homepage
   */
  navigateToHome() {
    this.currentDay = 1;
    window.history.pushState({}, '', window.location.pathname);
    this.renderHomepage();
  }

  /**
   * Render homepage with day cards
   */
  renderHomepage() {
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

    // Check if we're on day.html or index.html
    const isOnDayPage = window.location.pathname.includes('day.html');

    if (!isOnDayPage) {
      // Navigate to day.html with day parameter
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
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TravelGuideApp();
});