// tests/timeline-virtual-scroll.test.js
/**
 * @jest-environment jsdom
 */

// Load required scripts
require('../js/utils/virtual-scroll.js'); // Sets window.VirtualScroll
require('../js/utils/intersection-observer-manager.js'); // Sets window.IntersectionObserverManager
require('../js/utils/performance-monitor.js'); // Sets window.PerformanceMonitor
require('../js/timeline.js'); // Sets window.TimelineRenderer

const TimelineRenderer = window.TimelineRenderer;

describe('TimelineRenderer Virtual Scroll Integration', () => {
  let dayData;
  let container;

  beforeEach(() => {
    // Create test day data with activities
    dayData = {
      day: 1,
      title: '测试日',
      city: '日内瓦',
      date: '2025-06-15',
      color: '#4A90E2',
      tags: ['自驾', '湖泊'],
      timeline: [
        {
          id: 'act-1',
          time: '09:00',
          duration: 120,
          title: '早餐',
          description: '酒店自助早餐',
          icon: '🍳',
          category: '餐饮',
          location: {
            name: '酒店餐厅',
            address: '酒店一楼'
          },
          cost: '已包含',
          important: false
        },
        {
          id: 'act-2',
          time: '11:00',
          duration: 180,
          title: '参观博物馆',
          description: '参观艺术历史博物馆',
          icon: '🏛️',
          category: '景点',
          location: {
            name: '艺术历史博物馆',
            address: '博物馆街1号'
          },
          cost: 'CHF 15',
          important: true
        },
        {
          id: 'act-3',
          time: '15:00',
          duration: 90,
          title: '湖边散步',
          description: '日内瓦湖滨散步',
          icon: '🚶‍♀️',
          category: '休闲',
          location: {
            name: '日内瓦湖',
            address: '湖滨大道'
          },
          cost: '免费',
          important: false
        },
        {
          id: 'act-4',
          time: '19:00',
          duration: 120,
          title: '晚餐',
          description: '当地餐厅晚餐',
          icon: '🍽️',
          category: '餐饮',
          location: {
            name: 'Le Café du Centre',
            address: '中心广场5号'
          },
          cost: 'CHF 45',
          important: false
        }
      ],
      overview: {
        accommodation: {
          name: '日内瓦酒店',
          address: '酒店街10号',
          checkin: '14:00',
          checkout: '12:00'
        },
        transport: {
          type: '自驾',
          details: '租车前往洛桑',
          duration: '1小时',
          cost: 'CHF 60'
        }
      }
    };

    // Create test container
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // Reset performance monitoring for each test
    TimelineRenderer.performance = {
      totalRenderTime: 0,
      totalRenderCount: 0,
      lastRenderStart: 0,
      lastRenderEnd: 0,
      renderStart: 0,
      renderEnd: 0,
      averageRenderTime: 0
    };
  });

  afterEach(() => {
    // Clean up
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
    // Destroy any virtual scroll instance
    if (TimelineRenderer.virtualScroll) {
      TimelineRenderer.cleanup();
    }
  });

  test('should render timeline with virtual scroll container', () => {
    // Render day
    TimelineRenderer.renderDay(dayData, container);

    // Check that timeline HTML is rendered
    expect(container.innerHTML).toContain('时间线');
    expect(container.innerHTML).toContain('4 个活动');

    // Check that virtual scroll container exists
    const timelineContainer = document.getElementById('timeline-container-1');
    expect(timelineContainer).toBeTruthy();
    expect(timelineContainer.className).toBe('timeline-container');
  });

  test('should initialize virtual scroll after render', (done) => {
    // Render day
    TimelineRenderer.renderDay(dayData, container);

    // Wait for virtual scroll initialization (setTimeout in initializeTimelineVirtualScroll)
    setTimeout(() => {
      // Check that virtual scroll instance was created
      expect(TimelineRenderer.virtualScroll).toBeTruthy();
      expect(TimelineRenderer.virtualScroll).toBeInstanceOf(window.VirtualScroll);

      // Check that virtual scroll has the correct number of items
      expect(TimelineRenderer.virtualScroll.items.length).toBe(4);

      // Check that items are sorted by time
      const times = TimelineRenderer.virtualScroll.items.map(item => item.time);
      expect(times).toEqual(['09:00', '11:00', '15:00', '19:00']);

      done();
    }, 100); // Wait longer than the 50ms delay
  });

  test('should render activity items via virtual scroll', (done) => {
    // Render day
    TimelineRenderer.renderDay(dayData, container);

    setTimeout(() => {
      const timelineContainer = document.getElementById('timeline-container-1');
      expect(timelineContainer).toBeTruthy();

      // Check that activity elements are rendered (not all 4 because of virtual scrolling)
      // At least some activities should be rendered
      const activityElements = timelineContainer.querySelectorAll('.activity');
      expect(activityElements.length).toBeGreaterThan(0);
      expect(activityElements.length).toBeLessThanOrEqual(4);

      // Check that activity data is present
      const firstActivity = activityElements[0];
      expect(firstActivity.querySelector('.activity-title').textContent).toBeTruthy();
      expect(firstActivity.dataset.activityId).toBeTruthy();

      done();
    }, 100);
  });

  test('should handle empty timeline', (done) => {
    const emptyDayData = {
      ...dayData,
      timeline: []
    };

    TimelineRenderer.renderDay(emptyDayData, container);

    setTimeout(() => {
      expect(TimelineRenderer.virtualScroll).toBeTruthy();
      expect(TimelineRenderer.virtualScroll.items.length).toBe(0);

      const timelineContainer = document.getElementById('timeline-container-1');
      expect(timelineContainer).toBeTruthy();
      // Container should be empty (loading placeholder cleared)
      // Note: With mobile touch optimization, a scroll-to-top button may be added
      // So we check that there are no activity elements, but may have other UI elements
      const activityElements = timelineContainer.querySelectorAll('.activity');
      expect(activityElements.length).toBe(0);

      done();
    }, 100);
  });

  test('should sort activities by time', () => {
    const unsortedDayData = {
      ...dayData,
      timeline: [
        { id: 'act-3', time: '15:00', title: '下午活动' },
        { id: 'act-1', time: '09:00', title: '早晨活动' },
        { id: 'act-2', time: '11:00', title: '上午活动' }
      ]
    };

    const sorted = TimelineRenderer.getAllActivitiesSorted(unsortedDayData);
    expect(sorted.map(item => item.time)).toEqual(['09:00', '11:00', '15:00']);
  });

  test('should destroy virtual scroll instance when new day is rendered', (done) => {
    // Render first day
    TimelineRenderer.renderDay(dayData, container);

    setTimeout(() => {
      const firstInstance = TimelineRenderer.virtualScroll;
      expect(firstInstance).toBeTruthy();

      // Render second day (simulating day change)
      const secondDayData = {
        ...dayData,
        day: 2,
        timeline: [{ id: 'act-new', time: '10:00', title: '新活动' }]
      };
      TimelineRenderer.renderDay(secondDayData, container);

      // Wait for new initialization
      setTimeout(() => {
        const secondInstance = TimelineRenderer.virtualScroll;
        expect(secondInstance).toBeTruthy();
        // Should be a new instance (old one destroyed)
        expect(secondInstance).not.toBe(firstInstance);
        // Should have correct data for second day
        expect(secondInstance.items.length).toBe(1);
        expect(secondInstance.items[0].id).toBe('act-new');

        done();
      }, 100);
    }, 100);
  });

  test('renderActivityItem should return DOM element', () => {
    const activity = dayData.timeline[0];
    const element = TimelineRenderer.renderActivityItem(activity, 0);

    expect(element).toBeInstanceOf(HTMLElement);
    expect(element.className).toContain('activity');
    expect(element.dataset.activityId).toBe('act-1');
    expect(element.querySelector('.activity-title').textContent).toBe('早餐');
  });

  test('updateData should update virtual scroll with new activities', (done) => {
    // Render day first
    TimelineRenderer.renderDay(dayData, container);

    setTimeout(() => {
      expect(TimelineRenderer.virtualScroll).toBeTruthy();
      expect(TimelineRenderer.virtualScroll.items.length).toBe(4);

      // Create new activities
      const newActivities = [
        { id: 'act-new-1', time: '08:00', title: '新活动1' },
        { id: 'act-new-2', time: '12:00', title: '新活动2' }
      ];

      // Update timeline data
      TimelineRenderer.updateData(newActivities);

      // Check that virtual scroll instance has new data
      expect(TimelineRenderer.virtualScroll.items.length).toBe(2);
      expect(TimelineRenderer.virtualScroll.items[0].id).toBe('act-new-1');
      expect(TimelineRenderer.virtualScroll.items[1].id).toBe('act-new-2');

      done();
    }, 100);
  });

  test('updateData should warn if virtual scroll not initialized', () => {
    // Ensure no virtual scroll instance exists
    if (TimelineRenderer.virtualScroll) {
      TimelineRenderer.cleanup();
    }

    const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const newActivities = [{ id: 'act-new', time: '08:00', title: '新活动' }];

    TimelineRenderer.updateData(newActivities);

    expect(consoleWarn).toHaveBeenCalledWith('updateData: virtualScroll not initialized yet');
    consoleWarn.mockRestore();
  });

  test('performance monitoring should track render times', (done) => {
    // Initial state
    expect(TimelineRenderer.performance).toBeTruthy();
    expect(TimelineRenderer.performance.totalRenderCount).toBe(0);
    expect(TimelineRenderer.performance.totalRenderTime).toBe(0);
    expect(TimelineRenderer.performance.averageRenderTime).toBe(0);

    // Render day
    TimelineRenderer.renderDay(dayData, container);

    setTimeout(() => {
      // Check that performance metrics were updated
      expect(TimelineRenderer.performance.totalRenderCount).toBeGreaterThan(0);
      expect(TimelineRenderer.performance.totalRenderTime).toBeGreaterThan(0);
      expect(TimelineRenderer.performance.averageRenderTime).toBeGreaterThan(0);
      expect(TimelineRenderer.performance.lastRenderStart).toBeGreaterThan(0);
      expect(TimelineRenderer.performance.lastRenderEnd).toBeGreaterThan(0);
      expect(TimelineRenderer.performance.lastRenderEnd).toBeGreaterThanOrEqual(TimelineRenderer.performance.lastRenderStart);

      done();
    }, 100);
  });
});