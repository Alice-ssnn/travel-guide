// tests/virtual-scroll.test.js
/**
 * @jest-environment jsdom
 */
const VirtualScroll = require('../js/utils/virtual-scroll.js');

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

  test('should update visible items on scroll', async () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });

    const initialEndIndex = virtualScroll.endIndex;

    // 模拟滚动到中间
    container.scrollTop = 1000; // 滚动到第10个项目

    // 触发滚动事件
    container.dispatchEvent(new Event('scroll'));

    // 等待requestAnimationFrame执行
    await new Promise(resolve => requestAnimationFrame(resolve));

    // 等待节流逻辑（至少16ms）
    await new Promise(resolve => setTimeout(resolve, 20));

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

  test('should clean up event listeners on destroy', () => {
    virtualScroll = new VirtualScroll(container, items, renderItem, {
      itemHeight: 100,
      bufferItems: 2
    });

    // 模拟添加事件监听器
    const scrollHandler = virtualScroll.scrollHandler;
    expect(scrollHandler).toBeDefined();

    virtualScroll.destroy();

    // 检查事件监听器是否被移除（通过检查内部状态）
    expect(virtualScroll.scrollHandler).toBeNull();
  });
});