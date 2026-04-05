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

    // 性能优化
    this.scrollHandler = null;
    this.resizeObserver = null;
    this.lastScrollTime = 0;
    this.scrollThrottle = 16; // ~60fps

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
   * 节流滚动处理
   */
  setupScrollListener() {
    const handleScroll = (timestamp) => {
      const now = Date.now();
      if (now - this.lastScrollTime >= this.scrollThrottle) {
        this.calculateVisibleRange();
        this.renderVisibleItems();
        this.lastScrollTime = now;
      }
    };

    const scrollCallback = () => {
      requestAnimationFrame(handleScroll);
    };

    this.container.addEventListener('scroll', scrollCallback);
    this.scrollHandler = scrollCallback;

    // 监听容器大小变化
    if ('ResizeObserver' in window) {
      const resizeObserver = new ResizeObserver(() => {
        this.calculateVisibleRange();
        this.renderVisibleItems();
      });
      resizeObserver.observe(this.container);
      this.resizeObserver = resizeObserver;
    }
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
      this.scrollHandler = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }
}

// 使VirtualScroll全局可用
window.VirtualScroll = VirtualScroll;

// 兼容CommonJS模块系统（用于测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualScroll;
}