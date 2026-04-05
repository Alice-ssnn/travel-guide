# 瑞士法国旅行指南 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a responsive HTML/CSS/JS travel guide application for Switzerland-France trip with timeline view, Google Maps integration, search, and offline capabilities.

**Architecture:** Mobile-first progressive web app with vanilla JavaScript, using Google Maps JavaScript API for interactive maps, Service Workers for offline caching, and IndexedDB for local storage. Single-page application structure with dynamic day loading.

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), Google Maps JavaScript API, Service Workers, IndexedDB, PWA standards.

---

## Implementation Phases

This implementation is divided into two phases:

**Phase 1: Foundation & Core Features** (Tasks 1-4)
- Basic HTML/CSS structure
- Trip data model
- Main application logic with routing
- Homepage with day cards
- Basic search functionality

**Phase 2: Advanced Features** (Future tasks)
- Timeline rendering component
- Google Maps integration
- Day detail views (timeline, map, transport, details)
- Offline capabilities with Service Workers
- Favorites and local storage
- Responsive design refinements

## File Structure

```
travel-guide/
├── index.html              # Homepage with day cards overview
├── day.html                # Day detail page (dynamic loading via URL parameter ?day=1)
├── css/
│   ├── style.css          # Global styles, variables, base styles
│   ├── components.css     # Reusable UI components (cards, buttons, timeline)
│   └── responsive.css     # Responsive breakpoints and mobile-first styles
├── js/
│   ├── app.js             # Main application logic, routing, initialization
│   ├── data.js            # Trip data model and loading utilities
│   ├── timeline.js        # Timeline rendering and interaction
│   ├── map.js             # Google Maps integration and route display
│   ├── search.js          # Search functionality with filtering
│   ├── offline.js         # Service Worker registration and offline caching
│   └── storage.js         # IndexedDB operations for favorites and settings
├── images/                # Static images (fallback map, icons, etc.)
├── service-worker.js      # Service Worker for caching and offline support
└── manifest.json          # PWA manifest for installability
```

## Phase 1: Foundation & Core Features

### Task 1: Create Project Structure and Base HTML

**Files:**
- Create: `travel-guide/index.html`
- Create: `travel-guide/day.html`
- Create: `travel-guide/manifest.json`

- [ ] **Step 1: Create index.html with basic structure**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#667eea">
  <title>瑞士法国旅行指南</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/responsive.css">
  <link rel="manifest" href="manifest.json">
  <link rel="icon" type="image/png" href="images/favicon.png">
</head>
<body>
  <div class="app">
    <header class="header">
      <h1>瑞士法国之旅</h1>
      <div class="header-actions">
        <button class="btn btn-today" id="todayBtn">今天</button>
        <button class="btn btn-search" id="searchBtn">搜索</button>
      </div>
    </header>
    
    <main class="main">
      <div class="trip-summary">
        <div class="trip-dates">2026年4月24日 - 5月5日</div>
        <div class="trip-stats">12天 | 4个国家 | 7个城市</div>
      </div>
      
      <div class="days-list" id="daysList">
        <!-- Day cards will be inserted here by JavaScript -->
      </div>
    </main>
    
    <div class="search-overlay" id="searchOverlay">
      <div class="search-container">
        <input type="text" class="search-input" id="searchInput" placeholder="搜索景点、住宿、交通...">
        <button class="btn btn-close" id="closeSearchBtn">✕</button>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>
  </div>

  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
  <script src="js/search.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create day.html with detail page structure**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="theme-color" content="#667eea">
  <title>行程详情 - 瑞士法国旅行指南</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/responsive.css">
  <link rel="manifest" href="../manifest.json">
</head>
<body>
  <div class="app">
    <div class="day-detail" id="dayDetail">
      <!-- Content will be loaded dynamically by JavaScript -->
      <div class="loading">加载中...</div>
    </div>
  </div>

  <script src="js/data.js"></script>
  <script src="js/app.js"></script>
  <script src="js/timeline.js"></script>
  <script src="js/map.js"></script>
</body>
</html>
```

- [ ] **Step 3: Create manifest.json for PWA**

```json
{
  "name": "瑞士法国旅行指南",
  "short_name": "旅行指南",
  "description": "瑞士法国12日深度游行程指南",
  "start_url": "./",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#667eea",
  "orientation": "portrait",
  "icons": [
    {
      "src": "images/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "images/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/icon-512.png", 
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

- [ ] **Step 4: Verify HTML structure**

Run: `python3 -m http.server 8000` (or any local server)
Navigate to: `http://localhost:8000/travel-guide/`
Expected: See basic page structure with header and empty content

- [ ] **Step 5: Commit foundation**

```bash
git add travel-guide/index.html travel-guide/day.html travel-guide/manifest.json
git commit -m "feat: create base HTML structure and PWA manifest"
```

### Task 2: Create CSS Foundation

**Files:**
- Create: `travel-guide/css/style.css`
- Create: `travel-guide/css/components.css`
- Create: `travel-guide/css/responsive.css`

- [ ] **Step 1: Create style.css with CSS variables and base styles**

```css
/* style.css - Global styles and CSS variables */

:root {
  /* Color system - Apple design inspired */
  --primary: #667eea;
  --primary-dark: #764ba2;
  --secondary: #ff9500;
  --success: #30d158;
  --danger: #ff3b30;
  --warning: #ffcc00;
  
  /* Neutral colors */
  --text-primary: #1d1d1f;
  --text-secondary: #8e8e93;
  --text-tertiary: #aeaeb2;
  --background: #ffffff;
  --background-secondary: #f2f2f7;
  --background-tertiary: #e5e5ea;
  --border: #c7c7cc;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  
  /* Border radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.16);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
  --transition-slow: 350ms ease;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-md);
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Utility classes */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }

.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--background-secondary); }
.bg-tertiary { background-color: var(--background-tertiary); }
```

- [ ] **Step 2: Create components.css with reusable UI components**

```css
/* components.css - Reusable UI components */

/* Header */
.header {
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header h1 {
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--space-sm);
}

/* Buttons */
.btn {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-sm);
  border: none;
  font-family: inherit;
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast), 
              transform var(--transition-fast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  user-select: none;
}

.btn:active {
  transform: scale(0.98);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
}

.btn-primary:hover {
  background-color: #5a6fd8;
}

.btn-secondary {
  background-color: var(--background-secondary);
  color: var(--text-primary);
}

.btn-secondary:hover {
  background-color: var(--background-tertiary);
}

.btn-today {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-search {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  padding: 0;
}

/* Cards */
.card {
  background-color: var(--background);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: box-shadow var(--transition-normal),
              transform var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.card-body {
  padding: var(--space-md);
}

.card-header {
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-footer {
  padding: var(--space-md);
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Labels */
.label {
  display: inline-flex;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  align-items: center;
  gap: var(--space-xs);
}

.label-primary {
  background-color: #e8f3ff;
  color: var(--primary);
}

.label-secondary {
  background-color: #fff0e6;
  color: var(--secondary);
}

.label-success {
  background-color: #e6f4ea;
  color: var(--success);
}

.label-neutral {
  background-color: var(--background-secondary);
  color: var(--text-secondary);
}

/* Trip summary */
.trip-summary {
  padding: var(--space-md) var(--space-lg);
  background-color: var(--background-secondary);
}

.trip-dates {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.trip-stats {
  font-size: var(--font-size-md);
  color: var(--text-primary);
  font-weight: 500;
}

/* Days list */
.days-list {
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* Search overlay */
.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: none;
  flex-direction: column;
}

.search-container {
  padding: var(--space-lg);
  background-color: var(--background);
  display: flex;
  gap: var(--space-md);
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--space-md);
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-family: inherit;
  font-size: var(--font-size-md);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-results {
  flex: 1;
  background-color: var(--background);
  overflow-y: auto;
  padding: var(--space-md);
}

/* Day detail */
.day-detail {
  flex: 1;
  overflow-y: auto;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
}
```

- [ ] **Step 3: Create responsive.css with mobile-first breakpoints**

```css
/* responsive.css - Responsive design */

/* Mobile-first: default styles are for < 768px */

/* Tablet: 768px and up */
@media (min-width: 768px) {
  .header {
    padding: var(--space-lg) var(--space-2xl);
  }
  
  .header h1 {
    font-size: var(--font-size-2xl);
  }
  
  .trip-summary {
    padding: var(--space-lg) var(--space-2xl);
  }
  
  .trip-dates {
    font-size: var(--font-size-md);
  }
  
  .trip-stats {
    font-size: var(--font-size-lg);
  }
  
  .days-list {
    padding: var(--space-lg) var(--space-2xl);
    gap: var(--space-lg);
  }
  
  .card {
    border-radius: var(--radius-lg);
  }
  
  .card-body {
    padding: var(--space-lg);
  }
  
  .btn {
    padding: var(--space-md) var(--space-lg);
    font-size: var(--font-size-md);
  }
}

/* Desktop: 1024px and up */
@media (min-width: 1024px) {
  .app {
    max-width: 1024px;
    margin: 0 auto;
    box-shadow: var(--shadow-lg);
  }
  
  .days-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-lg);
  }
  
  .search-overlay {
    max-width: 768px;
    margin: 0 auto;
    top: var(--space-xl);
    bottom: var(--space-xl);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
}

/* Large desktop: 1440px and up */
@media (min-width: 1440px) {
  .app {
    max-width: 1280px;
  }
}

/* Print styles */
@media print {
  .header-actions,
  .search-overlay {
    display: none !important;
  }
  
  .card {
    box-shadow: none;
    border: 1px solid var(--border);
  }
  
  body {
    font-size: 12pt;
  }
}
```

- [ ] **Step 4: Test CSS styles**

Run: `python3 -m http.server 8000`
Navigate to: `http://localhost:8000/travel-guide/`
Expected: See styled header with gradient, buttons, and proper spacing

Inspect elements to verify:
- Header has gradient background
- Buttons have correct styling
- CSS variables are applied
- Responsive view works (test with browser dev tools)

- [ ] **Step 5: Commit CSS foundation**

```bash
git add travel-guide/css/style.css travel-guide/css/components.css travel-guide/css/responsive.css
git commit -m "feat: create CSS foundation with variables, components, and responsive design"
```

### Task 3: Create Trip Data Model and Loading Utilities

**Files:**
- Create: `travel-guide/js/data.js`

- [ ] **Step 1: Create data.js with trip data structure**

```javascript
// data.js - Trip data model and loading utilities

/**
 * Complete trip data for Switzerland-France 12-day itinerary
 * Based on the markdown travel guide document
 */
const tripData = {
  id: "switzerland-france-2026",
  title: "瑞士·南法·巴黎12日深度游",
  duration: 12,
  dates: {
    start: "2026-04-24",
    end: "2026-05-05"
  },
  cities: [
    { name: "苏黎世", color: "#30d158" },
    { name: "因特拉肯", color: "#ff9500" },
    { name: "日内瓦", color: "#007aff" },
    { name: "尼斯", color: "#ff2d55" },
    { name: "埃兹", color: "#af52de" },
    { name: "戛纳", color: "#ff9500" },
    { name: "巴黎", color: "#ff3b30" }
  ],
  days: [
    {
      day: 1,
      date: "2026-04-24",
      title: "抵达苏黎世",
      city: "苏黎世",
      color: "#30d158",
      summary: "✈️ 上海→维也纳→苏黎世 | 🏨 ibis Styles Zurich",
      tags: ["飞行", "抵达", "酒店"],
      overview: {
        accommodation: {
          name: "ibis Styles Zurich City Center",
          address: "Stampfenbachstrasse 60, 8006 Zurich",
          checkin: "15:00-23:00",
          checkout: "12:00前",
          coordinates: { lat: 47.3782, lng: 8.5390 }
        },
        transport: {
          type: "飞机",
          details: "奥地利航空OS016 + OS377联程",
          airline: "Austrian Airlines",
          duration: "13小时30分（含转机）"
        },
        importantNotes: [
          "维也纳转机时间1小时55分，注意时间衔接",
          "苏黎世机场到酒店打车约30分钟，费用约CHF 50-60",
          "酒店入住时间15:00-23:00，提前到达可寄存行李"
        ]
      },
      timeline: [
        {
          id: "day1-flight",
          time: "09:30",
          duration: 30,
          icon: "✈️",
          title: "上海浦东T2起飞",
          description: "奥地利航空OS016，经济舱",
          location: {
            name: "上海浦东国际机场T2",
            address: "浦东新区启航路300号",
            coordinates: { lat: 31.1434, lng: 121.8052 }
          },
          category: "交通",
          cost: "已包含在机票",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day1-transfer",
          time: "15:55",
          duration: 115,
          icon: "🔄",
          title: "维也纳转机",
          description: "转乘OS377前往苏黎世",
          location: {
            name: "维也纳国际机场T3",
            address: "Flughafen Wien, 1300 Wien, Austria",
            coordinates: { lat: 48.1103, lng: 16.5697 }
          },
          category: "交通",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day1-arrival",
          time: "20:00",
          duration: 45,
          icon: "🛄",
          title: "抵达苏黎世",
          description: "提取行李，前往酒店",
          location: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          category: "抵达",
          cost: "出租车CHF 50-60",
          actions: [
            { type: "map", label: "地图" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day1-checkin",
          time: "20:45",
          duration: 30,
          icon: "🏨",
          title: "酒店入住",
          description: "ibis Styles Zurich City Center",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "0公里",
        totalTime: "0小时",
        steps: []
      }
    },
    {
      day: 2,
      date: "2026-04-25",
      title: "苏黎世→因特拉肯自驾日",
      city: "因特拉肯",
      color: "#ff9500",
      summary: "🚗 取车自驾 | 🏔️ 图恩湖 | 🏨 Hotel Rosengärtli",
      tags: ["自驾", "酒店", "湖泊"],
      overview: {
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Dorfstrasse 32, 3706 Leissigen",
          checkin: "14:00后",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾租车",
          details: "Europcar苏黎世机场取车",
          company: "Europcar",
          bookingRef: "1159263500",
          cost: "CHF 1066 (5天)"
        },
        importantNotes: [
          "租车需准备：护照、中国驾照、国际驾照认证件、信用卡",
          "满油取还车，注意还车时间",
          "山区驾驶注意安全，部分路段有陡坡和弯道"
        ]
      },
      timeline: [
        {
          id: "day2-breakfast",
          time: "07:00",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐",
          description: "欧陆式自助早餐",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "餐饮",
          cost: "CHF 18/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-rental",
          time: "09:00",
          duration: 60,
          icon: "🚗",
          title: "取车自驾",
          description: "苏黎世机场Europcar取车",
          location: {
            name: "Europcar Parking 3",
            address: "Zurich Airport, 8058 Zurich",
            coordinates: { lat: 47.4581, lng: 8.5550 }
          },
          category: "交通",
          cost: "CHF 1066 (5天租金)",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-drive",
          time: "11:15",
          duration: 135,
          icon: "🛣️",
          title: "自驾前往因特拉肯",
          description: "苏黎世机场→因特拉肯",
          location: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          destination: {
            name: "因特拉肯",
            address: "Interlaken, Switzerland",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "自驾",
          cost: "油费约CHF 30，高速公路年票已含",
          route: {
            distance: "130公里",
            time: "2小时15分",
            steps: ["A1高速", "A6高速", "A8高速"],
            notes: "山区路段注意安全"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-checkin",
          time: "14:00",
          duration: 30,
          icon: "🏨",
          title: "酒店入住",
          description: "Hotel Rosengärtli, Leissigen",
          location: {
            name: "Hotel Rosengärtli",
            address: "Dorfstrasse 32, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-lunch",
          time: "14:30",
          duration: 60,
          icon: "🍽️",
          title: "午餐",
          description: "当地餐厅",
          location: {
            name: "Leissigen镇中心",
            address: "Leissigen, Switzerland",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮",
          cost: "CHF 25-35/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-thun",
          time: "16:00",
          duration: 120,
          icon: "🏞️",
          title: "图恩湖漫步",
          description: "湖畔散步，欣赏湖光山色",
          location: {
            name: "图恩湖畔",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-dinner",
          time: "19:00",
          duration: 90,
          icon: "🍽️",
          title: "湖畔晚餐",
          description: "湖景餐厅晚餐",
          location: {
            name: "湖畔餐厅",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "餐饮",
          cost: "CHF 40-60/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "130公里",
        totalTime: "2小时15分",
        steps: [
          {
            from: "苏黎世机场",
            to: "因特拉肯",
            transport: "自驾",
            distance: "130km",
            time: "2h15m",
            route: "A1→A6→A8",
            details: "山区驾驶注意安全，部分路段有陡坡"
          }
        ]
      }
    }
    // Note: Additional days 3-12 would be added here following the same structure
  ]
};

/**
 * Utility functions for trip data access
 */
const TripData = {
  /**
   * Get trip metadata
   */
  getTripInfo() {
    return {
      id: tripData.id,
      title: tripData.title,
      duration: tripData.duration,
      dates: tripData.dates,
      cities: tripData.cities
    };
  },

  /**
   * Get all days data
   */
  getAllDays() {
    return tripData.days;
  },

  /**
   * Get specific day data by day number (1-12)
   */
  getDay(dayNumber) {
    const day = tripData.days.find(d => d.day === dayNumber);
    if (!day) {
      throw new Error(`Day ${dayNumber} not found in trip data`);
    }
    return day;
  },

  /**
   * Get current day based on trip dates (simplified - returns day 1 for demo)
   */
  getCurrentDay() {
    // Simplified: always return day 1 for development
    // In production, this would compare with current date
    return this.getDay(1);
  },

  /**
   * Search across all trip data
   */
  search(query) {
    const results = [];
    const searchLower = query.toLowerCase();
    
    tripData.days.forEach(day => {
      // Search in day title and summary
      if (day.title.toLowerCase().includes(searchLower) || 
          day.summary.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'day',
          day: day.day,
          title: day.title,
          match: 'day title'
        });
      }
      
      // Search in timeline activities
      day.timeline.forEach(activity => {
        if (activity.title.toLowerCase().includes(searchLower) ||
            activity.description.toLowerCase().includes(searchLower) ||
            (activity.location && activity.location.name.toLowerCase().includes(searchLower))) {
          results.push({
            type: 'activity',
            day: day.day,
            activityId: activity.id,
            title: activity.title,
            time: activity.time,
            match: 'activity'
          });
        }
      });
    });
    
    return results;
  },

  /**
   * Get activities by category
   */
  getActivitiesByCategory(category) {
    const activities = [];
    tripData.days.forEach(day => {
      day.timeline.forEach(activity => {
        if (activity.category === category) {
          activities.push({
            day: day.day,
            ...activity
          });
        }
      });
    });
    return activities;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tripData, TripData };
}
```

- [ ] **Step 2: Test data loading and access**

Create a simple test HTML file to verify data loading:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Data Test</title>
</head>
<body>
  <script src="js/data.js"></script>
  <script>
    console.log('Trip info:', TripData.getTripInfo());
    console.log('Day 1:', TripData.getDay(1));
    console.log('Day 2:', TripData.getDay(2));
    console.log('Search "自驾":', TripData.search('自驾'));
    console.log('Activities by category "交通":', TripData.getActivitiesByCategory('交通'));
  </script>
</body>
</html>
```

Save as `data-test.html` in travel-guide directory and open in browser.

Expected: Console should show trip data without errors.

- [ ] **Step 3: Verify data structure matches design requirements**

Check that:
1. Each day has the required fields (day, date, title, city, color, summary, tags)
2. Timeline activities have time, duration, icon, title, description, location, category, cost, actions
3. Location objects have coordinates for map integration
4. Route information is included for transportation days
5. Important notes are included in overview

- [ ] **Step 4: Commit data model**

```bash
git add travel-guide/js/data.js
git commit -m "feat: create trip data model with days 1-2 and utility functions"
```

### Task 4: Create Main Application Logic and Routing

**Files:**
- Create: `travel-guide/js/app.js`

- [ ] **Step 1: Create app.js with application initialization**

```javascript
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
```

- [ ] **Step 2: Test app initialization**

Create a test HTML file or use the existing index.html.

Expected behaviors:
1. Page loads without JavaScript errors
2. Header buttons exist
3. Console shows app initialized
4. Day cards should appear (after data.js is loaded)

Test by opening index.html in browser with console open.

- [ ] **Step 3: Test routing between pages**

Test the following scenarios:
1. Click on a day card → should navigate to day.html?day=X
2. Browser back button → should return to homepage
3. Direct access to day.html?day=2 → should load day 2 details

- [ ] **Step 4: Test search functionality**

1. Click search button → overlay should appear
2. Type in search box → results should update
3. Click on a result → should navigate to that day
4. Press Escape → search should close

- [ ] **Step 5: Commit app logic**

```bash
git add travel-guide/js/app.js
git commit -m "feat: create main application logic with routing, search, and navigation"
```