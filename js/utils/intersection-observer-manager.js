// js/utils/intersection-observer-manager.js
/**
 * IntersectionObserverManager - 图片懒加载管理类
 * 使用Intersection Observer API实现图片延迟加载
 */
class IntersectionObserverManager {
  /**
   * @param {Object} options - 配置选项
   * @param {HTMLElement} options.root - 观察器的根元素
   * @param {string} options.rootMargin - 根元素的边距，用于提前加载
   * @param {number|number[]} options.threshold - 可见度阈值
   */
  constructor(options = {}) {
    // 配置选项
    this.options = {
      root: options.root || null,
      rootMargin: options.rootMargin || '50px 0px',
      threshold: options.threshold || 0.1,
      placeholderColor: options.placeholderColor || '#f0f0f0',
      placeholderAspectRatio: options.placeholderAspectRatio || 16/9,
      ...options
    };

    // 跟踪已观察的图片元素
    this.observedImages = new Map();

    // 检查IntersectionObserver支持
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver is not supported in this browser. Images will load immediately.');
      this.supportsIntersectionObserver = false;
      this.observer = null;
      return;
    }

    this.supportsIntersectionObserver = true;

    // 观察器实例
    this.observer = null;

    // 初始化观察器
    this.initObserver();
  }

  /**
   * 初始化IntersectionObserver
   */
  initObserver() {
    if (!this.supportsIntersectionObserver) {
      return;
    }

    try {
      this.observer = new IntersectionObserver(
        (entries) => this.handleIntersection(entries),
        {
          root: this.options.root,
          rootMargin: this.options.rootMargin,
          threshold: this.options.threshold
        }
      );
    } catch (error) {
      console.error('Failed to create IntersectionObserver:', error);
      this.supportsIntersectionObserver = false;
    }
  }

  /**
   * 处理交叉观察器回调
   * @param {IntersectionObserverEntry[]} entries - 观察器条目
   */
  handleIntersection(entries) {
    entries.forEach(entry => {
      const img = entry.target;

      if (entry.isIntersecting) {
        this.loadImage(img);

        // 图片加载后停止观察
        if (this.observer) {
          this.observer.unobserve(img);
          this.observedImages.delete(img);
        }
      }
    });
  }

  /**
   * 加载图片
   * @param {HTMLImageElement} img - 图片元素
   */
  loadImage(img) {
    const src = img.dataset.src;

    if (!src) {
      console.warn('Image element missing data-src attribute:', img);
      return;
    }

    // 添加加载类
    img.classList.add('lazy-loading');

    // 创建临时图片进行预加载
    const tempImage = new Image();

    tempImage.onload = () => {
      // 图片加载成功，设置src属性
      img.src = src;
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-loaded');

      // 触发自定义事件
      this.dispatchImageLoadedEvent(img, 'lazyImage:loaded');
    };

    tempImage.onerror = () => {
      console.error('Failed to load image:', src);
      img.classList.remove('lazy-loading');
      img.classList.add('lazy-error');

      // 触发错误事件
      this.dispatchImageLoadedEvent(img, 'lazyImage:error');
    };

    tempImage.src = src;
  }

  /**
   * 分发图片加载事件
   * @param {HTMLImageElement} img - 图片元素
   * @param {string} eventName - 事件名称
   */
  dispatchImageLoadedEvent(img, eventName) {
    try {
      const event = new CustomEvent(eventName, {
        detail: { element: img, src: img.src },
        bubbles: true
      });
      img.dispatchEvent(event);
    } catch (error) {
      console.warn('Failed to dispatch custom event:', error);
    }
  }

  /**
   * 观察图片元素
   * @param {HTMLImageElement[]|NodeList} images - 图片元素数组或NodeList
   */
  observeImages(images) {
    if (!this.supportsIntersectionObserver || !this.observer) {
      // 不支持IntersectionObserver，立即加载所有图片
      this.loadImagesImmediately(images);
      return;
    }

    const imageArray = Array.isArray(images) ? images : Array.from(images);

    imageArray.forEach(img => {
      // 检查是否已经是有效的图片元素
      if (!(img instanceof HTMLImageElement)) {
        console.warn('Element is not an HTMLImageElement:', img);
        return;
      }

      // 检查是否已经有data-src属性
      if (!img.dataset.src) {
        console.warn('Image element missing data-src attribute:', img);
        return;
      }

      // 检查图片是否已经加载完成
      if (img.complete && img.src && !this.isPlaceholder(img.src)) {
        // 图片已经加载完成，且不是占位符
        img.classList.add('lazy-loaded');
        return;
      }

      // 如果已经通过懒加载加载，跳过
      if (img.classList.contains('lazy-loaded') || img.src === img.dataset.src) {
        return;
      }

      // 检查是否有非占位符的src
      if (img.src && !this.isPlaceholder(img.src)) {
        // 图片已经有非占位符的src（可能正在加载或已加载）
        // 不设置占位符，但可能需要观察（如果未完成加载）
        if (!img.complete) {
          // 图片正在加载，添加懒加载类但不设置占位符
          img.classList.add('lazy-image');
        } else {
          // 图片已加载完成
          img.classList.add('lazy-loaded');
          return;
        }
      } else {
        // 没有src或src是占位符，添加懒加载类并设置占位符
        img.classList.add('lazy-image');

        // 设置占位符（如果没有src）
        if (!img.src) {
          this.setPlaceholder(img);
        }
      }

      // 开始观察
      this.observer.observe(img);
      this.observedImages.set(img, {
        src: img.dataset.src,
        observedAt: Date.now()
      });
    });
  }

  /**
   * 立即加载所有图片（回退方案）
   * @param {HTMLImageElement[]|NodeList} images - 图片元素数组或NodeList
   */
  loadImagesImmediately(images) {
    const imageArray = Array.isArray(images) ? images : Array.from(images);

    imageArray.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
        img.classList.add('lazy-loaded');
      }
    });
  }

  /**
   * 设置图片占位符
   * @param {HTMLImageElement} img - 图片元素
   */
  setPlaceholder(img) {
    // 如果图片已经有宽度和高度属性，使用它们创建占位符
    const width = img.width || 300;
    const height = img.height || Math.round(width / this.options.placeholderAspectRatio);

    // 创建SVG占位符
    const svgString = this.createSVGPlaceholder(width, height, this.options.placeholderColor);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  }

  /**
   * 创建SVG占位符
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {string} color - 背景颜色
   * @returns {string} SVG字符串
   */
  createSVGPlaceholder(width, height, color) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="${color}"/>
        <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="14" fill="#999" text-anchor="middle" dy=".3em">
          图片加载中...
        </text>
      </svg>
    `.trim().replace(/\s+/g, ' ');
  }

  /**
   * 创建图片占位符（规范兼容方法）
   * @param {HTMLImageElement} img - 图片元素
   * @returns {string} Data URL格式的SVG占位符
   */
  createPlaceholder(img) {
    const width = img.getAttribute('width') || img.width || '100';
    const height = img.getAttribute('height') || img.height || '100';
    const color = this.options.placeholderColor || '#f0f0f0';

    const svgString = this.createSVGPlaceholder(width, height, color);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
  }

  /**
   * 检查是否为占位符URL
   * @param {string} src - 图片src属性值
   * @returns {boolean} 是否为占位符
   */
  isPlaceholder(src) {
    return src && src.startsWith('data:image/svg+xml;charset=utf-8,');
  }

  /**
   * 创建图片元素并准备懒加载
   * @param {Object} options - 图片选项
   * @returns {HTMLImageElement} 图片元素
   */
  createLazyImage(options = {}) {
    const img = document.createElement('img');

    // 设置属性
    if (options.className) {
      img.className = options.className;
    }

    if (options.alt) {
      img.alt = options.alt;
    }

    if (options.width) {
      img.width = options.width;
    }

    if (options.height) {
      img.height = options.height;
    }

    // 设置data-src属性存储真实图片URL
    if (options.src) {
      img.dataset.src = options.src;
    }

    // 添加懒加载类
    img.classList.add('lazy-image');

    // 设置占位符
    this.setPlaceholder(img);

    return img;
  }

  /**
   * 停止观察图片元素
   * @param {HTMLImageElement} img - 图片元素
   */
  unobserve(img) {
    if (this.observer && this.observedImages.has(img)) {
      this.observer.unobserve(img);
      this.observedImages.delete(img);
    }
  }

  /**
   * 停止观察所有图片元素
   */
  unobserveAll() {
    if (this.observer) {
      this.observedImages.forEach((_, img) => {
        this.observer.unobserve(img);
      });
      this.observedImages.clear();
    }
  }

  /**
   * 检查图片是否已被观察
   * @param {HTMLImageElement} img - 图片元素
   * @returns {boolean} 是否被观察
   */
  isObserved(img) {
    return this.observedImages.has(img);
  }

  /**
   * 获取观察的图片数量
   * @returns {number} 观察的图片数量
   */
  getObservedCount() {
    return this.observedImages.size;
  }

  /**
   * 销毁观察器并清理资源
   */
  destroy() {
    // 停止观察所有图片
    this.unobserveAll();

    // 断开观察器连接
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // 清空已观察图片映射
    this.observedImages.clear();
  }
}

// 使IntersectionObserverManager全局可用
window.IntersectionObserverManager = IntersectionObserverManager;

// 兼容CommonJS模块系统（用于测试）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IntersectionObserverManager;
}