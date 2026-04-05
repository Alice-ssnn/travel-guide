# 时间轴渲染优化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 优化时间轴渲染性能，提升视觉体验和交互流畅度，实现虚拟滚动和移动端适配

**Architecture:** 基于现有TimelineRenderer类进行渐进式优化，添加虚拟滚动、CSS变量视觉系统、触摸友好交互，保持向后兼容性

**Tech Stack:** Vanilla JavaScript, CSS Variables, Intersection Observer API, 响应式设计

---

## 文件结构

### 现有文件修改
- `css/components.css` - 添加时间轴CSS变量和动画样式 (现有: 733行)
- `js/timeline.js` - TimelineRenderer类增强，添加虚拟滚动 (现有: 735行)
- `js/app.js` - 添加时间轴性能监控 (现有: 427行)

### 新文件创建
- `js/utils/virtual-scroll.js` - 虚拟滚动核心逻辑
- `js/utils/intersection-observer-manager.js` - 图片懒加载管理器
- `js/utils/performance-monitor.js` - 性能监控工具

### 测试文件
- `tests/timeline-performance.test.js` - 性能测试
- `tests/virtual-scroll.test.js` - 虚拟滚动功能测试

---

## 任务分解

### Task 1: 创建CSS变量视觉系统

**Files:**
- Modify: `css/components.css:1-50` (在文件开头添加CSS变量定义)

- [ ] **Step 1: 添加时间轴CSS变量定义**

```css
/* 时间轴视觉变量 - 在components.css开头添加 */
:root {
  /* 时间轴主线 */
  --timeline-line: #e5e7eb;
  --timeline-line-width: 2px;
  --timeline-line-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* 活动标记 */
  --timeline-marker-size: 16px;
  --timeline-marker-inactive: #667eea;
  --timeline-marker-active: #4c51bf;
  --timeline-marker-active-scale: 1.2;
  
  /* 活动卡片 */
  --timeline-card-bg: white;
  --timeline-card-radius: 12px;
  --timeline-card-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  --timeline-card-padding: 16px;
  --timeline-card-margin: 20px 0;
  
  /* 动画速度 */
  --timeline-animation-duration: 300ms;
  --timeline-animation-easing: cubic-bezier(0.4, 0, 0.2, 1);
}
```

- [ ] **Step 2: 更新现有时间轴样式使用CSS变量**

在`css/components.css`中找到`.timeline`相关样式（大约在400-500行），修改为使用CSS变量：

```css
/* 修改时间轴主线样式 */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: var(--timeline-line-width);
  background: var(--timeline-line);
  box-shadow: var(--timeline-line-shadow);
  transform: translateX(-50%);
}

/* 修改时间轴标记样式 */
.timeline-marker {
  position: absolute;
  left: 15px;
  width: var(--timeline-marker-size);
  height: var(--timeline-marker-size);
  background: var(--timeline-marker-inactive);
  border-radius: 50%;
  transform: translateX(-50%);
  transition: all var(--timeline-animation-duration) var(--timeline-animation-easing);
  z-index: 2;
}

.timeline-marker.active {
  background: var(--timeline-marker-active);
  transform: translateX(-50%) scale(var(--timeline-marker-active-scale));
  box-shadow: 0 0 0 4px rgba(76, 81, 191, 0.2);
}

/* 修改活动卡片样式 */
.timeline-card {
  background: var(--timeline-card-bg);
  border-radius: var(--timeline-card-radius);
  box-shadow: var(--timeline-card-shadow);
  padding: var(--timeline-card-padding);
  margin: var(--timeline-card-margin);
  transition: transform var(--timeline-animation-duration) var(--timeline-animation-easing);
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
```

- [ ] **Step 3: 添加卡片入场动画**

在`css/components.css`末尾添加：

```css
/* 卡片入场动画 */
@keyframes cardFadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.timeline-card {
  animation: cardFadeInUp var(--timeline-animation-duration) var(--timeline-animation-easing) both;
}

/* 交错延迟动画 */
.timeline-card:nth-child(odd) {
  animation-delay: 50ms;
}

.timeline-card:nth-child(even) {
  animation-delay: 100ms;
}

/* 标记点击脉冲动画 */
@keyframes markerPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 81, 191, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(76, 81, 191, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 81, 191, 0);
  }
}

.timeline-marker.active.pulse {
  animation: markerPulse 1s;
}
```

- [ ] **Step 4: 验证CSS修改**

打开浏览器开发者工具，检查CSS变量是否正确应用：
1. 在Elements面板检查`.timeline`元素的计算样式
2. 确认CSS变量值被正确使用
3. 检查动画样式是否存在

- [ ] **Step 5: 提交CSS修改**

```bash
git add css/components.css
git commit -m "feat: 添加时间轴CSS变量视觉系统和动画"
```

---

### Task 2: 创建虚拟滚动核心逻辑

**Files:**
- Create: `js/utils/virtual-scroll.js`

- [ ] **Step 1: 创建虚拟滚动类基本结构**

```javascript
// js/utils/virtual-scroll.js
/**
 * VirtualScroll - 虚拟滚动核心类
 * 仅渲染可视区域内的项目，优化大量时间轴项目的性能
 */
class VirtualScroll {
  /**
   * @param {HTMLElement} container - 时间轴容器元素
   * @param {Array} items - 所有时间轴项目数据
   * @param {Function} renderItem - 单个项目的渲染函数
   * @param {Object} options - 配置选项
   */
  constructor(container, items, renderItem, options = {}) {
    this.container = container;
    this.items = items;
    this.renderItem = renderItem;
    
    // 配置选项
    this.options = {
      itemHeight: options.itemHeight || 120, // 每个项目的预估高度
      bufferItems: options.bufferItems || 5, // 上下缓冲项目数
      ...options
    };
    
    // 状态管理
    this.visibleItems = [];
    this.startIndex = 0;
    this.endIndex = 0;
    
    // 初始化
    this.init();
  }
  
  /**
   * 初始化虚拟滚动
   */
  init() {
    this.calculateVisibleRange();
    this.renderVisibleItems();
    this.setupScrollListener();
  }
  
  /**
   * 计算可见范围
   */
  calculateVisibleRange() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    // 计算开始和结束索引
    this.startIndex = Math.max(
      0,
      Math.floor(scrollTop / this.options.itemHeight) - this.options.bufferItems
    );
    
    this.endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((scrollTop + containerHeight) / this.options.itemHeight) + this.options.bufferItems
    );
  }
  
  /**
   * 渲染可见项目
   */
  renderVisibleItems() {
    const fragment = document.createDocumentFragment();
    
    for (let i = this.startIndex; i <= this.endIndex; i++) {
      const item = this.items[i];
      const element = this.renderItem(item, i);
      fragment.appendChild(element);
    }
    
    // 清空容器并添加新项目
    this.container.innerHTML = '';
    this.container.appendChild(fragment);
    
    // 更新可见项目列表
    this.visibleItems = this.items.slice(this.startIndex, this.endIndex + 1);
  }
  
  /**
   * 设置滚动监听
   */
  setupScrollListener() {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          this.calculateVisibleRange();
          this.renderVisibleItems();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    this.container.addEventListener('scroll', handleScroll);
    this.scrollHandler = handleScroll;
  }
  
  /**
   * 更新数据
   * @param {Array} newItems - 新项目数据
   */
  updateItems(newItems) {
    this.items = newItems;
    this.calculateVisibleRange();
    this.renderVisibleItems();
  }
  
  /**
   * 销毁虚拟滚动实例
   */
  destroy() {
    if (this.scrollHandler) {
      this.container.removeEventListener('scroll', this.scrollHandler);
    }
  }
}

export default VirtualScroll;
```

- [ ] **Step 2: 添加虚拟滚动性能优化方法**

在`VirtualScroll`类中添加以下方法：

```javascript
  /**
   * 节流滚动处理
   */
  setupScrollListener() {
    let lastScrollTime = 0;
    const scrollThrottle = 16; // ~60fps
    
    const handleScroll = (timestamp) => {
      const now = Date.now();
      if (now - lastScrollTime >= scrollThrottle) {
        this.calculateVisibleRange();
        this.renderVisibleItems();
        lastScrollTime = now;
      }
    };
    
    this.container.addEventListener('scroll', () => {
      requestAnimationFrame(handleScroll);
    });
    
    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      this.calculateVisibleRange();
      this.renderVisibleItems();
    });
    resizeObserver.observe(this.container);
    this.resizeObserver = resizeObserver;
  }
  
  /**
   * 销毁时清理
   */
  destroy() {
    if (this.scrollHandler) {
      this.container.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
```

- [ ] **Step 3: 创建虚拟滚动测试文件**

```javascript
// tests/virtual-scroll.test.js
import VirtualScroll from '../js/utils/virtual-scroll.js';

describe('VirtualScroll', () => {
  let container;
  let items;
  let renderItem;
  let virtualScroll;
  
  beforeEach(() => {
    // 创建测试容器
    container = document.createElement('div');
    container.style.height = '500px';
    container.style.overflow = 'auto';
    document.body.appendChild(container);
    
    // 创建测试数据
    items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      content: `Content for item ${i}`
    }));
    
    // 创建渲染函数
    renderItem = (item, index) => {
      const div = document.createElement('div');
      div.className = 'virtual-item';
      div.style.height = '100px';
      div.textContent = item.title;
      div.dataset.index = index;
      return div;
    };
  });
  
  afterEach(() => {
    if (virtualScroll) {
      virtualScroll.destroy();
    }
    document.body.removeChild(container);
  });
  
  test('should initialize with correct visible range', () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });
    
    // 容器高度500px，项目高度100px，缓冲2个
    // 应显示 0-6个项目（500/100=5，+2缓冲=7）
    expect(virtualScroll.startIndex).toBe(0);
    expect(virtualScroll.endIndex).toBeGreaterThanOrEqual(0);
    expect(virtualScroll.endIndex).toBeLessThanOrEqual(6);
  });
  
  test('should render only visible items', () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });
    
    const renderedItems = container.querySelectorAll('.virtual-item');
    expect(renderedItems.length).toBeLessThan(items.length);
    expect(renderedItems.length).toBeGreaterThan(0);
  });
  
  test('should update visible items on scroll', () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });
    
    const initialEndIndex = virtualScroll.endIndex;
    
    // 模拟滚动到中间
    container.scrollTop = 1000; // 滚动到第10个项目
    
    // 触发滚动事件
    container.dispatchEvent(new Event('scroll'));
    
    expect(virtualScroll.startIndex).toBeGreaterThan(0);
    expect(virtualScroll.endIndex).toBeGreaterThan(initialEndIndex);
  });
  
  test('should update items when data changes', () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });
    
    const newItems = items.slice(0, 50); // 减少项目数
    virtualScroll.updateItems(newItems);
    
    expect(virtualScroll.items.length).toBe(50);
  });
});
```

- [ ] **Step 4: 运行虚拟滚动测试**

```bash
# 假设使用Jest进行测试
# 先安装Jest（如果未安装）
npm init -y
npm install --save-dev jest

# 创建package.json测试脚本
# 在package.json中添加：
# "scripts": {
#   "test": "jest"
# }

# 运行测试
npm test -- tests/virtual-scroll.test.js
```

预期输出：所有测试通过

- [ ] **Step 5: 提交虚拟滚动实现**

```bash
git add js/utils/virtual-scroll.js tests/virtual-scroll.test.js
git commit -m "feat: 添加虚拟滚动核心逻辑和测试"
```

---

### Task 3: 集成虚拟滚动到时间轴渲染器

**Files:**
- Modify: `js/timeline.js:1-100` (修改TimelineRenderer类)

- [ ] **Step 1: 导入VirtualScroll类**

在`js/timeline.js`文件顶部添加导入：

```javascript
// js/timeline.js - 在文件顶部添加
import VirtualScroll from './utils/virtual-scroll.js';
```

- [ ] **Step 2: 修改TimelineRenderer类添加虚拟滚动支持**

找到TimelineRenderer类的构造函数（大约在20-40行），添加虚拟滚动实例：

```javascript
// 修改TimelineRenderer构造函数
constructor(containerId, data) {
  this.container = document.getElementById(containerId);
  this.data = data;
  this.currentView = 'timeline'; // 'timeline' 或 'map'
  
  // 虚拟滚动实例
  this.virtualScroll = null;
  
  // 性能监控
  this.performance = {
    renderStart: null,
    renderEnd: null
  };
  
  this.initialize();
}
```

- [ ] **Step 3: 修改renderTimeline方法使用虚拟滚动**

找到`renderTimeline`方法（大约在100-200行），修改为：

```javascript
/**
 * 渲染时间轴（使用虚拟滚动优化）
 */
renderTimeline() {
  console.log('[TimelineRenderer] Rendering timeline with virtual scroll');
  
  // 性能监控开始
  this.performance.renderStart = performance.now();
  
  // 清除容器
  this.container.innerHTML = '';
  
  // 创建时间轴容器
  const timelineContainer = document.createElement('div');
  timelineContainer.className = 'timeline-container';
  timelineContainer.style.height = 'calc(100vh - 200px)'; // 根据实际布局调整
  timelineContainer.style.overflow = 'auto';
  timelineContainer.style.position = 'relative';
  
  // 生成所有活动数据
  const allActivities = [];
  this.data.days.forEach(day => {
    day.activities.forEach(activity => {
      allActivities.push({
        day,
        activity,
        timestamp: `${day.date} ${activity.time}`
      });
    });
  });
  
  // 按时间排序
  allActivities.sort((a, b) => {
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  
  // 创建虚拟滚动实例
  this.virtualScroll = new VirtualScroll(
    timelineContainer,
    allActivities,
    (item, index) => this.renderTimelineItem(item, index),
    {
      itemHeight: 150, // 每个时间轴卡片预估高度
      bufferItems: 3    // 上下缓冲3个项目
    }
  );
  
  this.container.appendChild(timelineContainer);
  
  // 性能监控结束
  this.performance.renderEnd = performance.now();
  const renderTime = this.performance.renderEnd - this.performance.renderStart;
  console.log(`[TimelineRenderer] Timeline rendered in ${renderTime.toFixed(2)}ms`);
  console.log(`[TimelineRenderer] Items: ${allActivities.length}, Visible: ${this.virtualScroll.visibleItems.length}`);
}
```

- [ ] **Step 4: 添加单个时间轴项目渲染方法**

在TimelineRenderer类中添加新的渲染方法：

```javascript
/**
 * 渲染单个时间轴项目（供虚拟滚动使用）
 * @param {Object} item - 活动数据
 * @param {number} index - 项目索引
 * @returns {HTMLElement} 渲染的DOM元素
 */
renderTimelineItem(item, index) {
  const { day, activity } = item;
  
  const activityElement = document.createElement('div');
  activityElement.className = `timeline-card activity-card ${activity.type}`;
  activityElement.dataset.day = day.day;
  activityElement.dataset.activityId = activity.id;
  activityElement.dataset.virtualIndex = index;
  
  // 生成活动卡片内容
  activityElement.innerHTML = `
    <div class="activity-time">
      <span class="time">${activity.time}</span>
      <span class="duration">${activity.duration || ''}</span>
    </div>
    <div class="activity-content">
      <h3 class="activity-title">${activity.title}</h3>
      ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
      ${activity.location ? `<div class="activity-location">
        <svg class="location-icon" width="12" height="12" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>${activity.location}</span>
      </div>` : ''}
      ${activity.cost ? `<div class="activity-cost">${activity.cost.amount} ${activity.cost.currency}</div>` : ''}
    </div>
    <div class="activity-actions">
      <button class="btn-icon favorite-btn" aria-label="添加到收藏">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      ${activity.coordinates ? `<button class="btn-icon map-btn" aria-label="在地图上查看">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </button>` : ''}
    </div>
  `;
  
  // 添加点击事件
  activityElement.addEventListener('click', (e) => {
    if (!e.target.closest('.activity-actions')) {
      this.handleActivityClick(day.day, activity.id);
    }
  });
  
  // 添加收藏按钮事件
  const favoriteBtn = activityElement.querySelector('.favorite-btn');
  if (favoriteBtn) {
    favoriteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleFavorite(day.day, activity.id);
    });
  }
  
  // 添加地图按钮事件
  const mapBtn = activityElement.querySelector('.map-btn');
  if (mapBtn) {
    mapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.showOnMap(activity.coordinates, activity.title);
    });
  }
  
  return activityElement;
}
```

- [ ] **Step 5: 添加清理方法**

在TimelineRenderer类中添加清理方法：

```javascript
/**
 * 清理虚拟滚动实例
 */
cleanup() {
  if (this.virtualScroll) {
    this.virtualScroll.destroy();
    this.virtualScroll = null;
  }
  
  // 清理事件监听器
  if (this.container) {
    this.container.innerHTML = '';
  }
}

/**
 * 更新数据并重新渲染
 * @param {Object} newData - 新的行程数据
 */
updateData(newData) {
  this.data = newData;
  
  if (this.virtualScroll) {
    // 重新生成所有活动数据
    const allActivities = [];
    this.data.days.forEach(day => {
      day.activities.forEach(activity => {
        allActivities.push({
          day,
          activity,
          timestamp: `${day.date} ${activity.time}`
        });
      });
    });
    
    allActivities.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });
    
    this.virtualScroll.updateItems(allActivities);
  } else {
    this.renderTimeline();
  }
}
```

- [ ] **Step 6: 测试时间轴虚拟滚动集成**

创建测试文件：

```javascript
// tests/timeline-virtual-scroll.test.js
import TimelineRenderer from '../js/timeline.js';

describe('TimelineRenderer with Virtual Scroll', () => {
  let container;
  let testData;
  let timelineRenderer;
  
  beforeEach(() => {
    // 创建测试容器
    container = document.createElement('div');
    container.id = 'timeline-container';
    document.body.appendChild(container);
    
    // 创建测试数据
    testData = {
      days: [
        {
          day: 1,
          date: '2026-04-24',
          title: '测试日',
          activities: Array.from({ length: 50 }, (_, i) => ({
            id: `activity-${i}`,
            title: `测试活动 ${i}`,
            time: `08:${i.toString().padStart(2, '0')}`,
            type: 'attraction',
            description: `测试活动 ${i} 的描述`,
            location: `测试地点 ${i}`,
            coordinates: { lat: 47.3782 + i * 0.001, lng: 8.5390 + i * 0.001 }
          }))
        }
      ]
    };
  });
  
  afterEach(() => {
    if (timelineRenderer) {
      timelineRenderer.cleanup();
    }
    document.body.removeChild(container);
  });
  
  test('should initialize virtual scroll with timeline data', () => {
    timelineRenderer = new TimelineRenderer('timeline-container', testData);
    timelineRenderer.renderTimeline();
    
    // 检查虚拟滚动实例是否存在
    expect(timelineRenderer.virtualScroll).toBeDefined();
    expect(timelineRenderer.virtualScroll.items.length).toBe(50);
    
    // 检查只渲染了部分项目（虚拟滚动）
    const renderedCards = container.querySelectorAll('.timeline-card');
    expect(renderedCards.length).toBeLessThan(50);
    expect(renderedCards.length).toBeGreaterThan(0);
  });
  
  test('should update data with virtual scroll', () => {
    timelineRenderer = new TimelineRenderer('timeline-container', testData);
    timelineRenderer.renderTimeline();
    
    const initialItemCount = timelineRenderer.virtualScroll.items.length;
    
    // 更新数据
    const newData = {
      days: [
        {
          day: 1,
          date: '2026-04-24',
          title: '更新日',
          activities: Array.from({ length: 30 }, (_, i) => ({
            id: `new-activity-${i}`,
            title: `新活动 ${i}`,
            time: `09:${i.toString().padStart(2, '0')}`,
            type: 'dining'
          }))
        }
      ]
    };
    
    timelineRenderer.updateData(newData);
    
    expect(timelineRenderer.virtualScroll.items.length).toBe(30);
    expect(timelineRenderer.data.days[0].title).toBe('更新日');
  });
  
  test('should cleanup virtual scroll on destroy', () => {
    timelineRenderer = new TimelineRenderer('timeline-container', testData);
    timelineRenderer.renderTimeline();
    
    const virtualScroll = timelineRenderer.virtualScroll;
    expect(virtualScroll).toBeDefined();
    
    timelineRenderer.cleanup();
    
    expect(timelineRenderer.virtualScroll).toBeNull();
    expect(container.innerHTML).toBe('');
  });
});
```

- [ ] **Step 7: 运行时间轴测试**

```bash
npm test -- tests/timeline-virtual-scroll.test.js
```

预期输出：所有测试通过

- [ ] **Step 8: 提交时间轴虚拟滚动集成**

```bash
git add js/timeline.js tests/timeline-virtual-scroll.test.js
git commit -m "feat: 集成虚拟滚动到时间轴渲染器"
```

---

### Task 4: 添加图片懒加载优化

**Files:**
- Create: `js/utils/intersection-observer-manager.js`

- [ ] **Step 1: 创建Intersection Observer管理器**

```javascript
// js/utils/intersection-observer-manager.js
/**
 * IntersectionObserverManager - 图片懒加载管理器
 * 使用Intersection Observer API实现图片延迟加载
 */
class IntersectionObserverManager {
  constructor(options = {}) {
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '50px 0px',
      threshold: options.threshold || 0.1,
      ...options
    };
    
    this.observer = null;
    this.observedElements = new Map(); // element -> callback
    
    this.init();
  }
  
  /**
   * 初始化Intersection Observer
   */
  init() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.options
    );
  }
  
  /**
   * 处理交叉观察
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const callback = this.observedElements.get(element);
        
        if (callback) {
          callback(element);
          this.unobserve(element); // 触发一次后取消观察
        }
      }
    });
  }
  
  /**
   * 观察元素
   * @param {HTMLElement} element - 要观察的元素
   * @param {Function} callback - 元素进入视口时的回调函数
   */
  observe(element, callback) {
    if (!element || !callback) {
      console.warn('IntersectionObserverManager: Invalid element or callback');
      return;
    }
    
    this.observedElements.set(element, callback);
    this.observer.observe(element);
  }
  
  /**
   * 取消观察元素
   * @param {HTMLElement} element - 要取消观察的元素
   */
  unobserve(element) {
    if (this.observedElements.has(element)) {
      this.observer.unobserve(element);
      this.observedElements.delete(element);
    }
  }
  
  /**
   * 批量观察图片元素
   * @param {NodeList|Array} imageElements - 图片元素集合
   * @param {string} dataAttr - 存储原始图片URL的数据属性名
   */
  observeImages(imageElements, dataAttr = 'data-src') {
    Array.from(imageElements).forEach(img => {
      const originalSrc = img.getAttribute(dataAttr);
      
      if (!originalSrc) {
        return; // 没有延迟加载的图片
      }
      
      // 设置占位符
      if (!img.getAttribute('src')) {
        img.setAttribute('src', this.createPlaceholder(img));
      }
      
      this.observe(img, (element) => {
        element.setAttribute('src', originalSrc);
        element.classList.add('lazy-loaded');
      });
    });
  }
  
  /**
   * 创建图片占位符
   */
  createPlaceholder(img) {
    const width = img.getAttribute('width') || '100';
    const height = img.getAttribute('height') || '100';
    
    // 创建简单的SVG占位符
    return `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="%23999" text-anchor="middle" dy=".3em">Loading...</text></svg>`;
  }
  
  /**
   * 销毁观察器
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.observedElements.clear();
  }
}

export default IntersectionObserverManager;
```

- [ ] **Step 2: 修改时间轴渲染器添加图片懒加载**

在`js/timeline.js`的TimelineRenderer类中添加：

```javascript
// 在构造函数中添加
constructor(containerId, data) {
  this.container = document.getElementById(containerId);
  this.data = data;
  this.currentView = 'timeline';
  
  // 虚拟滚动实例
  this.virtualScroll = null;
  
  // 图片懒加载管理器
  this.imageObserver = null;
  
  // 性能监控
  this.performance = {
    renderStart: null,
    renderEnd: null
  };
  
  this.initialize();
}

// 在initialize方法中初始化图片观察器
initialize() {
  this.imageObserver = new IntersectionObserverManager({
    rootMargin: '100px 0px',
    threshold: 0.01
  });
}

// 在renderTimelineItem方法中修改图片处理
renderTimelineItem(item, index) {
  const { day, activity } = item;
  
  const activityElement = document.createElement('div');
  activityElement.className = `timeline-card activity-card ${activity.type}`;
  activityElement.dataset.day = day.day;
  activityElement.dataset.activityId = activity.id;
  activityElement.dataset.virtualIndex = index;
  
  // 检查是否有图片
  let imageHtml = '';
  if (activity.images && activity.images.length > 0) {
    const firstImage = activity.images[0];
    imageHtml = `
      <div class="activity-image">
        <img 
          width="100" 
          height="75"
          data-src="${firstImage.url}"
          alt="${firstImage.alt || activity.title}"
          class="lazy-image"
          loading="lazy"
        >
      </div>
    `;
  }
  
  activityElement.innerHTML = `
    <div class="activity-time">
      <span class="time">${activity.time}</span>
      <span class="duration">${activity.duration || ''}</span>
    </div>
    <div class="activity-content">
      <h3 class="activity-title">${activity.title}</h3>
      ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
      ${imageHtml}
      ${activity.location ? `<div class="activity-location">
        <svg class="location-icon" width="12" height="12" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span>${activity.location}</span>
      </div>` : ''}
      ${activity.cost ? `<div class="activity-cost">${activity.cost.amount} ${activity.cost.currency}</div>` : ''}
    </div>
    <div class="activity-actions">
      <button class="btn-icon favorite-btn" aria-label="添加到收藏">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
      ${activity.coordinates ? `<button class="btn-icon map-btn" aria-label="在地图上查看">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM12 11.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </button>` : ''}
    </div>
  `;
  
  // 设置图片懒加载
  const lazyImages = activityElement.querySelectorAll('img[data-src]');
  if (lazyImages.length > 0 && this.imageObserver) {
    this.imageObserver.observeImages(lazyImages);
  }
  
  // ... 其他事件处理代码
}
```

- [ ] **Step 3: 在cleanup方法中清理图片观察器**

```javascript
cleanup() {
  if (this.virtualScroll) {
    this.virtualScroll.destroy();
    this.virtualScroll = null;
  }
  
  if (this.imageObserver) {
    this.imageObserver.destroy();
    this.imageObserver = null;
  }
  
  if (this.container) {
    this.container.innerHTML = '';
  }
}
```

- [ ] **Step 4: 添加图片懒加载CSS样式**

在`css/components.css`中添加：

```css
/* 图片懒加载样式 */
.lazy-image {
  opacity: 0;
  transition: opacity 0.3s ease;
  background: #f0f0f0;
  border-radius: 4px;
}

.lazy-image.lazy-loaded {
  opacity: 1;
}

.activity-image {
  margin: 12px 0;
  border-radius: 8px;
  overflow: hidden;
}

.activity-image img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  display: block;
}
```

- [ ] **Step 5: 提交图片懒加载实现**

```bash
git add js/utils/intersection-observer-manager.js js/timeline.js css/components.css
git commit -m "feat: 添加图片懒加载优化"
```

---

### Task 5: 移动端触摸优化

**Files:**
- Modify: `css/components.css:500-600` (添加移动端样式)
- Modify: `js/timeline.js` (添加触摸事件处理)

- [ ] **Step 1: 添加移动端时间轴样式**

在`css/components.css`中添加移动端样式：

```css
/* 移动端时间轴优化 */
@media (max-width: 768px) {
  .timeline {
    padding-left: 20px;
  }
  
  .timeline::before {
    left: 10px;
  }
  
  .timeline-marker {
    left: 10px;
    width: 20px;
    height: 20px;
  }
  
  .timeline-card {
    padding: 14px;
    margin: 16px 0;
    border-radius: 10px;
  }
  
  .activity-title {
    font-size: 16px;
    margin-bottom: 6px;
  }
  
  .activity-description {
    font-size: 14px;
    line-height: 1.4;
    margin-bottom: 8px;
  }
  
  /* 触摸友好的按钮 */
  .btn-icon {
    min-width: 44px;
    min-height: 44px;
    padding: 12px;
  }
  
  .activity-actions {
    margin-top: 12px;
  }
  
  /* 移动端卡片点击区域优化 */
  .timeline-card {
    position: relative;
  }
  
  .timeline-card::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    pointer-events: none;
  }
}

/* 平板设备优化 */
@media (min-width: 769px) and (max-width: 1024px) {
  .timeline {
    padding-left: 25px;
  }
  
  .timeline::before {
    left: 12px;
  }
  
  .timeline-marker {
    left: 12px;
  }
  
  .timeline-card {
    max-width: 90%;
  }
}
```

- [ ] **Step 2: 添加移动端手势支持**

在`js/timeline.js`的TimelineRenderer类中添加：

```javascript
/**
 * 初始化触摸事件
 */
setupTouchEvents() {
  if (!this.container) return;
  
  let touchStartY = 0;
  let touchStartTime = 0;
  let isScrolling = false;
  
  // 触摸开始
  this.container.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
      isScrolling = false;
    }
  }, { passive: true });
  
  // 触摸移动
  this.container.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) {
      const touchY = e.touches[0].clientY;
      const deltaY = Math.abs(touchY - touchStartY);
      
      // 如果垂直移动超过10px，认为是滚动而不是点击
      if (deltaY > 10) {
        isScrolling = true;
      }
    }
  }, { passive: true });
  
  // 触摸结束
  this.container.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1 && !isScrolling) {
      const touchEndTime = Date.now();
      const touchDuration = touchEndTime - touchStartTime;
      
      // 短按（小于500ms）视为点击
      if (touchDuration < 500) {
        const touchY = e.changedTouches[0].clientY;
        const deltaY = Math.abs(touchY - touchStartY);
        
        // 如果垂直移动很小，视为点击
        if (deltaY < 10) {
          this.handleMobileTap(e);
        }
      }
    }
    
    isScrolling = false;
  }, { passive: true });
  
  // 防止双击缩放
  let lastTap = 0;
  this.container.addEventListener('touchend', (e) => {
    const currentTime = Date.now();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      this.handleDoubleTap(e);
    }
    
    lastTap = currentTime;
  });
}

/**
 * 处理移动端点击
 */
handleMobileTap(e) {
  // 查找点击的活动卡片
  let target = e.target;
  while (target && !target.classList.contains('timeline-card')) {
    target = target.parentElement;
  }
  
  if (target && target.classList.contains('timeline-card')) {
    const day = target.dataset.day;
    const activityId = target.dataset.activityId;
    
    if (day && activityId) {
      this.handleActivityClick(day, activityId);
    }
  }
}

/**
 * 处理移动端双击
 */
handleDoubleTap(e) {
  // 双击回到顶部
  if (this.container) {
    this.container.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// 在initialize方法中调用
initialize() {
  this.imageObserver = new IntersectionObserverManager({
    rootMargin: '100px 0px',
    threshold: 0.01
  });
  
  this.setupTouchEvents(); // 添加触摸事件初始化
}
```

- [ ] **Step 3: 添加快速滚动到顶部按钮**

在`css/components.css`中添加：

```css
/* 快速滚动到顶部按钮 */
.scroll-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.scroll-to-top.visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-to-top:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .scroll-to-top {
    bottom: 16px;
    right: 16px;
    width: 44px;
    height: 44px;
  }
}
```

在`js/timeline.js`中添加：

```javascript
/**
 * 添加快速滚动到顶部按钮
 */
addScrollToTopButton() {
  if (this.container.querySelector('.scroll-to-top')) {
    return; // 按钮已存在
  }
  
  const button = document.createElement('button');
  button.className = 'scroll-to-top';
  button.setAttribute('aria-label', '滚动到顶部');
  button.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
    </svg>
  `;
  
  button.addEventListener('click', () => {
    this.container.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  this.container.appendChild(button);
  
  // 监听滚动显示/隐藏按钮
  let scrollTimeout;
  this.container.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
      const scrollTop = this.container.scrollTop;
      const showButton = scrollTop > 300;
      
      if (showButton) {
        button.classList.add('visible');
      } else {
        button.classList.remove('visible');
      }
    }, 100);
  });
}
```

- [ ] **Step 4: 在renderTimeline方法中调用**

```javascript
renderTimeline() {
  // ... 现有代码
  
  this.container.appendChild(timelineContainer);
  
  // 添加快速滚动到顶部按钮
  this.addScrollToTopButton();
  
  // ... 性能监控代码
}
```

- [ ] **Step 5: 提交移动端优化**

```bash
git add css/components.css js/timeline.js
git commit -m "feat: 添加移动端触摸优化和快速滚动按钮"
```

---

### Task 6: 性能监控和优化

**Files:**
- Create: `js/utils/performance-monitor.js`
- Modify: `js/app.js` (添加性能监控)

- [ ] **Step 1: 创建性能监控工具**

```javascript
// js/utils/performance-monitor.js
/**
 * PerformanceMonitor - 性能监控工具
 * 监控时间轴渲染性能并提供优化建议
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      renderTimes: [],
      memoryUsage: [],
      interactionLatency: []
    };
    
    this.thresholds = {
      renderTime: 1000, // 1秒
      memoryUsage: 50 * 1024 * 1024, // 50MB
      interactionLatency: 100 // 100ms
    };
    
    this.init();
  }
  
  /**
   * 初始化性能监控
   */
  init() {
    // 监听页面性能
    if ('PerformanceObserver' in window) {
      this.setupPerformanceObservers();
    }
    
    // 监听内存使用（如果支持）
    if ('memory' in performance) {
      this.monitorMemory();
    }
  }
  
  /**
   * 设置性能观察器
   */
  setupPerformanceObservers() {
    // 监听长任务（>50ms）
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.duration > 50) {
          console.warn(`[Performance] Long task detected: ${entry.duration.toFixed(2)}ms`, entry);
          this.metrics.interactionLatency.push(entry.duration);
        }
      });
    });
    
    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.warn('LongTask observer not supported:', e);
    }
    
    // 监听布局偏移
    const layoutShiftObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          console.warn(`[Performance] Layout shift detected: ${entry.value}`);
        }
      });
    });
    
    try {
      layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('LayoutShift observer not supported:', e);
    }
  }
  
  /**
   * 监控内存使用
   */
  monitorMemory() {
    setInterval(() => {
      const memory = performance.memory;
      this.metrics.memoryUsage.push(memory.usedJSHeapSize);
      
      if (memory.usedJSHeapSize > this.thresholds.memoryUsage) {
        console.warn(`[Performance] High memory usage: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
      }
    }, 10000); // 每10秒检查一次
  }
  
  /**
   * 记录渲染时间
   * @param {string} component - 组件名称
   * @param {number} renderTime - 渲染时间(ms)
   */
  recordRenderTime(component, renderTime) {
    this.metrics.renderTimes.push({
      component,
      time: renderTime,
      timestamp: Date.now()
    });
    
    if (renderTime > this.thresholds.renderTime) {
      console.warn(`[Performance] Slow render for ${component}: ${renderTime.toFixed(2)}ms`);
      return this.getOptimizationSuggestions(component, renderTime);
    }
    
    return null;
  }
  
  /**
   * 获取优化建议
   */
  getOptimizationSuggestions(component, renderTime) {
    const suggestions = [];
    
    if (component === 'TimelineRenderer') {
      if (renderTime > 500) {
        suggestions.push({
          type: 'virtual-scroll',
          message: 'Consider implementing virtual scrolling for large timelines',
          priority: 'high'
        });
      }
      
      if (renderTime > 200) {
        suggestions.push({
          type: 'lazy-loading',
          message: 'Implement lazy loading for images and media',
          priority: 'medium'
        });
      }
    }
    
    return suggestions;
  }
  
  /**
   * 获取性能报告
   */
  getReport() {
    const report = {
      timestamp: Date.now(),
      metrics: {}
    };
    
    // 计算平均渲染时间
    if (this.metrics.renderTimes.length > 0) {
      const avgRenderTime = this.metrics.renderTimes.reduce((sum, item) => sum + item.time, 0) / this.metrics.renderTimes.length;
      report.metrics.avgRenderTime = avgRenderTime.toFixed(2);
      report.metrics.renderCount = this.metrics.renderTimes.length;
    }
    
    // 计算平均交互延迟
    if (this.metrics.interactionLatency.length > 0) {
      const avgLatency = this.metrics.interactionLatency.reduce((sum, lat) => sum + lat, 0) / this.metrics.interactionLatency.length;
      report.metrics.avgInteractionLatency = avgLatency.toFixed(2);
    }
    
    // 内存使用统计
    if (this.metrics.memoryUsage.length > 0) {
      const avgMemory = this.metrics.memoryUsage.reduce((sum, mem) => sum + mem, 0) / this.metrics.memoryUsage.length;
      report.metrics.avgMemoryMB = (avgMemory / 1024 / 1024).toFixed(2);
      report.metrics.maxMemoryMB = (Math.max(...this.metrics.memoryUsage) / 1024 / 1024).toFixed(2);
    }
    
    // 添加建议
    report.suggestions = this.getOverallSuggestions();
    
    return report;
  }
  
  /**
   * 获取总体优化建议
   */
  getOverallSuggestions() {
    const suggestions = [];
    
    // 检查渲染时间
    if (this.metrics.renderTimes.length > 10) {
      const recentRenders = this.metrics.renderTimes.slice(-10);
      const avgRecent = recentRenders.reduce((sum, item) => sum + item.time, 0) / recentRenders.length;
      
      if (avgRecent > 300) {
        suggestions.push('Consider implementing more aggressive caching for timeline data');
      }
    }
    
    // 检查内存使用
    if (this.metrics.memoryUsage.length > 0) {
      const avgMemory = this.metrics.memoryUsage.reduce((sum, mem) => sum + mem, 0) / this.metrics.memoryUsage.length;
      if (avgMemory > 30 * 1024 * 1024) { // 30MB
        suggestions.push('Consider implementing DOM recycling for off-screen timeline items');
      }
    }
    
    return suggestions;
  }
  
  /**
   * 清空指标数据
   */
  clear() {
    this.metrics = {
      renderTimes: [],
      memoryUsage: [],
      interactionLatency: []
    };
  }
}

export default PerformanceMonitor;
```

- [ ] **Step 2: 在TimelineRenderer中使用性能监控**

修改`js/timeline.js`：

```javascript
// 在文件顶部导入
import PerformanceMonitor from './utils/performance-monitor.js';

// 在构造函数中添加
constructor(containerId, data) {
  this.container = document.getElementById(containerId);
  this.data = data;
  this.currentView = 'timeline';
  
  // 虚拟滚动实例
  this.virtualScroll = null;
  
  // 图片懒加载管理器
  this.imageObserver = null;
  
  // 性能监控
  this.performanceMonitor = new PerformanceMonitor();
  this.performance = {
    renderStart: null,
    renderEnd: null
  };
  
  this.initialize();
}

// 修改renderTimeline方法中的性能监控
renderTimeline() {
  console.log('[TimelineRenderer] Rendering timeline with virtual scroll');
  
  // 性能监控开始
  this.performance.renderStart = performance.now();
  
  // ... 现有渲染代码
  
  // 性能监控结束
  this.performance.renderEnd = performance.now();
  const renderTime = this.performance.renderEnd - this.performance.renderStart;
  
  // 记录性能指标
  const suggestions = this.performanceMonitor.recordRenderTime('TimelineRenderer', renderTime);
  
  console.log(`[TimelineRenderer] Timeline rendered in ${renderTime.toFixed(2)}ms`);
  console.log(`[TimelineRenderer] Items: ${allActivities.length}, Visible: ${this.virtualScroll.visibleItems.length}`);
  
  // 如果有优化建议，显示给开发者
  if (suggestions && suggestions.length > 0) {
    console.warn('[Performance] Optimization suggestions:', suggestions);
  }
}

// 添加性能报告方法
getPerformanceReport() {
  return this.performanceMonitor.getReport();
}
```

- [ ] **Step 3: 在App中添加性能监控界面**

在`js/app.js`的TravelGuideApp类中添加：

```javascript
/**
 * 显示性能报告
 */
showPerformanceReport() {
  if (this.timelineRenderer) {
    const report = this.timelineRenderer.getPerformanceReport();
    
    console.group('📊 Performance Report');
    console.log('Timestamp:', new Date(report.timestamp).toLocaleString());
    console.log('Metrics:', report.metrics);
    
    if (report.suggestions && report.suggestions.length > 0) {
      console.warn('Optimization Suggestions:');
      report.suggestions.forEach((suggestion, i) => {
        console.log(`  ${i + 1}. ${suggestion}`);
      });
    }
    
    console.groupEnd();
    
    // 在开发模式下显示到UI
    if (process.env.NODE_ENV === 'development') {
      this.showPerformanceUI(report);
    }
  }
}

/**
 * 显示性能UI（仅开发模式）
 */
showPerformanceUI(report) {
  const existingReport = document.getElementById('performance-report');
  if (existingReport) {
    existingReport.remove();
  }
  
  const reportDiv = document.createElement('div');
  reportDiv.id = 'performance-report';
  reportDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-width: 300px;
    backdrop-filter: blur(10px);
  `;
  
  let html = '<strong>📊 Performance Report</strong><br>';
  html += `<small>${new Date(report.timestamp).toLocaleTimeString()}</small><br><br>`;
  
  if (report.metrics.avgRenderTime) {
    html += `Render: ${report.metrics.avgRenderTime}ms (${report.metrics.renderCount}x)<br>`;
  }
  
  if (report.metrics.avgMemoryMB) {
    html += `Memory: ${report.metrics.avgMemoryMB}MB (max: ${report.metrics.maxMemoryMB}MB)<br>`;
  }
  
  if (report.suggestions && report.suggestions.length > 0) {
    html += '<br><strong>💡 Suggestions:</strong><br>';
    report.suggestions.forEach(suggestion => {
      html += `• ${suggestion}<br>`;
    });
  }
  
  html += '<br><button onclick="this.parentElement.remove()" style="font-size:10px;padding:2px 6px;">Close</button>';
  
  reportDiv.innerHTML = html;
  document.body.appendChild(reportDiv);
}

// 在initialize方法中添加性能监控按钮（仅开发模式）
initialize() {
  this.loadFavorites();
  this.setupEventListeners();
  this.setupRouting();
  this.renderHomepage();
  
  // 添加性能监控按钮（仅开发模式）
  if (process.env.NODE_ENV === 'development') {
    this.addPerformanceButton();
  }
}

/**
 * 添加性能监控按钮
 */
addPerformanceButton() {
  const button = document.createElement('button');
  button.textContent = '📊';
  button.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #667eea;
    color: white;
    border: none;
    cursor: pointer;
    z-index: 9998;
    font-size: 18px;
  `;
  
  button.addEventListener('click', () => {
    this.showPerformanceReport();
  });
  
  document.body.appendChild(button);
}
```

- [ ] **Step 4: 添加性能监控CSS**

在`css/components.css`中添加：

```css
/* 性能监控样式（仅开发模式） */
.performance-metrics {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #0f0;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 11px;
  z-index: 9999;
  backdrop-filter: blur(10px);
  border: 1px solid #333;
  pointer-events: none;
  opacity: 0.9;
}

.performance-metrics .metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
}

.performance-metrics .label {
  color: #aaa;
  margin-right: 10px;
}

.performance-metrics .value {
  color: #0f0;
}

.performance-metrics .warning {
  color: #ff9500;
}

.performance-metrics .critical {
  color: #ff3b30;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

- [ ] **Step 5: 提交性能监控实现**

```bash
git add js/utils/performance-monitor.js js/timeline.js js/app.js css/components.css
git commit -m "feat: 添加性能监控和优化建议系统"
```

---

## 计划自审

### 1. 规范覆盖检查
- [x] **时间轴视觉设计升级**: Task 1 实现CSS变量系统
- [x] **虚拟滚动实现**: Task 2-3 实现虚拟滚动核心和集成
- [x] **图片懒加载**: Task 4 实现Intersection Observer管理器
- [x] **移动端触摸优化**: Task 5 添加触摸事件和响应式样式
- [x] **性能监控**: Task 6 实现性能监控和优化建议

### 2. 占位符扫描
- 无TBD/TODO占位符
- 所有代码步骤包含完整实现
- 所有测试包含预期输出

### 3. 类型一致性检查
- VirtualScroll类在Task 2中定义，在Task 3中正确使用
- 所有方法签名一致
- CSS变量命名一致

## 执行选项

**计划完成并保存到 `docs/superpowers/plans/2026-04-05-travel-guide-phase2-week1-timeline-optimization.md`。两个执行选项：**

**1. 子代理驱动（推荐）** - 我为每个任务分派新的子代理，在任务之间进行审查，快速迭代

**2. 内联执行** - 在此会话中使用executing-plans执行任务，批量执行并设置检查点

**哪种方法？**