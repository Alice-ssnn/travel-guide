// js/utils/virtual-scroll.js
/**
 * VirtualScroll - 虚拟滚动核心类
 * 用占位总高度 + 仅渲染视窗内条目，保证 scrollHeight 与列表一致，可滚到底
 */
class VirtualScroll {
  /**
   * @param {HTMLElement} container - 可滚动容器 (overflow: auto)
   * @param {Array} items - 数据
   * @param {Function} renderItem  (item, index) => HTMLElement
   * @param {Object} options
   * @param {number} options.itemHeight 单行槽位中「卡片」的预估主高度
   * @param {number} [options.rowGap=0] 行间距（与 CSS gap 对齐，算进行步长 rowStride）
   * @param {number} [options.bufferItems=5] 视窗外多渲染几行
   */
  constructor(container, items, renderItem, options = {}) {
    if (!(container instanceof HTMLElement)) {
      throw new TypeError('container必须是有效的HTMLElement');
    }
    if (!Array.isArray(items)) {
      throw new TypeError('items必须是数组');
    }
    if (typeof renderItem !== 'function') {
      throw new TypeError('renderItem必须是函数');
    }

    this.container = container;
    this.items = items;
    this.renderItem = renderItem;

    this.options = {
      itemHeight: options.itemHeight || 120,
      rowGap: typeof options.rowGap === 'number' ? options.rowGap : 0,
      bufferItems: options.bufferItems ?? 5,
      ...options
    };

    if (this.options.itemHeight <= 0) {
      console.warn('itemHeight必须大于0，使用默认值120');
      this.options.itemHeight = 120;
    }
    if (this.options.bufferItems < 0) {
      console.warn('bufferItems不能为负数，设置为0');
      this.options.bufferItems = 0;
    }

    this.rowStride = this.options.itemHeight + this.options.rowGap;

    this.visibleItems = [];
    this.startIndex = 0;
    this.endIndex = 0;

    this._renderedStart = -1;
    this._renderedEnd = -2;
    this.scrollHandler = null;
    this._windowResizeHandler = null;
    this._scrollRaf = null;
    this._resizeRaf = null;
    this.lastScrollTime = 0;

    this.init();
  }

  getTotalHeight() {
    return this.items.length * this.rowStride;
  }

  init() {
    this.calculateVisibleRange();
    this.renderVisibleItems();
    this.setupScrollListener();
    this.setupWindowResize();
  }

  /**
   * 按滚动位置与行步长算可见下标
   */
  calculateVisibleRange() {
    if (this.items.length === 0) {
      this.startIndex = 0;
      this.endIndex = -1;
      return;
    }

    const scrollTop = this.container.scrollTop;
    const h = this.container.clientHeight;
    const stride = this.rowStride;
    const buf = this.options.bufferItems;

    this.startIndex = Math.max(0, Math.floor(scrollTop / stride) - buf);
    this.endIndex = Math.min(
      this.items.length - 1,
      Math.ceil((scrollTop + h) / stride) + buf
    );
  }

  _removePhantom() {
    const ph = this.container.querySelector('.vs-phantom');
    if (ph) {
      ph.remove();
    }
  }

  /**
   * 仅当可见区间变化时重算 DOM，减少闪动
   */
  renderVisibleItems() {
    if (this.items.length === 0) {
      this._removePhantom();
      this.visibleItems = [];
      this._renderedStart = -1;
      this._renderedEnd = -2;
      return;
    }

    if (this._renderedStart === this.startIndex && this._renderedEnd === this.endIndex) {
      return;
    }
    this._renderedStart = this.startIndex;
    this._renderedEnd = this.endIndex;

    const inner = document.createElement('div');
    inner.className = 'vs-phantom';
    inner.setAttribute('role', 'presentation');
    inner.style.height = `${this.getTotalHeight()}px`;
    inner.style.position = 'relative';
    inner.style.width = '100%';
    inner.style.boxSizing = 'border-box';

    for (let i = this.startIndex; i <= this.endIndex; i++) {
      const el = this.renderItem(this.items[i], i);
      const slot = document.createElement('div');
      slot.className = 'vs-item-slot';
      slot.style.position = 'absolute';
      slot.style.top = `${i * this.rowStride}px`;
      slot.style.left = '0';
      slot.style.right = '0';
      slot.style.minHeight = `${this.rowStride}px`;
      slot.style.boxSizing = 'border-box';
      slot.appendChild(el);
      inner.appendChild(slot);
    }

    this._removePhantom();
    this.container.appendChild(inner);
    this.visibleItems = this.items.slice(this.startIndex, this.endIndex + 1);
  }

  setupScrollListener() {
    const onScroll = () => {
      if (this._scrollRaf) {
        cancelAnimationFrame(this._scrollRaf);
      }
      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = null;
        this.lastScrollTime = Date.now();
        this.calculateVisibleRange();
        this.renderVisibleItems();
      });
    };

    this.container.addEventListener('scroll', onScroll, { passive: true });
    this.scrollHandler = onScroll;
  }

  /**
   * 仅监听 window resize；不再 observe 容器，避免子节点被替换时 ResizeObserver 循环触发
   */
  setupWindowResize() {
    this._windowResizeHandler = () => {
      if (this._resizeRaf) {
        cancelAnimationFrame(this._resizeRaf);
      }
      this._resizeRaf = requestAnimationFrame(() => {
        this._resizeRaf = null;
        this._renderedStart = -1;
        this._renderedEnd = -2;
        this.calculateVisibleRange();
        this.renderVisibleItems();
      });
    };
    window.addEventListener('resize', this._windowResizeHandler);
  }

  updateItems(newItems) {
    if (!Array.isArray(newItems)) {
      throw new TypeError('newItems必须是数组');
    }
    this.items = newItems;
    this._renderedStart = -1;
    this._renderedEnd = -2;
    this.calculateVisibleRange();
    this.renderVisibleItems();
  }

  destroy() {
    if (this._scrollRaf) {
      cancelAnimationFrame(this._scrollRaf);
      this._scrollRaf = null;
    }
    if (this._resizeRaf) {
      cancelAnimationFrame(this._resizeRaf);
      this._resizeRaf = null;
    }
    if (this.scrollHandler) {
      this.container.removeEventListener('scroll', this.scrollHandler);
      this.scrollHandler = null;
    }
    if (this._windowResizeHandler) {
      window.removeEventListener('resize', this._windowResizeHandler);
      this._windowResizeHandler = null;
    }
  }
}

window.VirtualScroll = VirtualScroll;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = VirtualScroll;
}
