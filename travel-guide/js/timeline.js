// timeline.js - Timeline rendering component for day detail view

/**
 * TimelineRenderer - Renders day timeline with activities
 */
const TimelineRenderer = {
  /**
   * Render a day's timeline
   * @param {Object} day - Day data object
   * @param {HTMLElement} container - Container element to render into
   */
  renderDay(day, container) {
    console.log('TimelineRenderer.renderDay called for day', day.day);

    // For now, show a placeholder with day information
    // Full implementation will come in Phase 2
    container.innerHTML = `
      <div class="day-header" style="background: linear-gradient(135deg, ${day.color}20 0%, ${day.color}40 100%); padding: 20px;">
        <div style="font-size: 14px; color: var(--text-secondary);">第${day.day}天</div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 8px 0 4px;">${day.title}</h1>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 8px; height: 8px; background: ${day.color}; border-radius: 50%;"></div>
          <span style="font-size: 16px;">${day.city}</span>
          <span style="color: var(--text-secondary);">· ${day.date}</span>
        </div>
      </div>

      <div class="day-content" style="padding: 20px;">
        <div class="card" style="margin-bottom: 20px;">
          <div class="card-body">
            <h2 style="font-size: 18px; margin-bottom: 12px;">当天概览</h2>
            ${day.overview ? `
              <div style="margin-bottom: 16px;">
                <div style="font-size: 15px; font-weight: 500; margin-bottom: 4px;">住宿</div>
                <div style="font-size: 14px; color: var(--text-primary);">${day.overview.accommodation.name}</div>
                <div style="font-size: 13px; color: var(--text-secondary);">${day.overview.accommodation.address}</div>
              </div>
              ${day.overview.transport ? `
                <div style="margin-bottom: 16px;">
                  <div style="font-size: 15px; font-weight: 500; margin-bottom: 4px;">交通</div>
                  <div style="font-size: 14px; color: var(--text-primary);">${day.overview.transport.type}: ${day.overview.transport.details}</div>
                </div>
              ` : ''}
            ` : ''}
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h2 style="font-size: 18px; margin-bottom: 12px;">时间线 (${day.timeline.length} 个活动)</h2>
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">
              完整时间线功能将在 Phase 2 实现
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${day.timeline.slice(0, 3).map(activity => `
                <div style="display: flex; gap: 12px; padding: 12px; background: var(--background-secondary); border-radius: 8px;">
                  <div style="font-size: 32px;">${activity.icon}</div>
                  <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <div style="font-weight: 500;">${activity.time} ${activity.title}</div>
                      <div style="font-size: 13px; color: var(--text-secondary);">${activity.duration}分钟</div>
                    </div>
                    <div style="font-size: 14px; color: var(--text-primary); margin-bottom: 4px;">${activity.description}</div>
                    <div style="font-size: 13px; color: var(--text-secondary);">${activity.location.name}</div>
                  </div>
                </div>
              `).join('')}

              ${day.timeline.length > 3 ? `
                <div style="text-align: center; padding: 12px; color: var(--text-secondary); font-size: 14px;">
                  还有 ${day.timeline.length - 3} 个活动未显示
                </div>
              ` : ''}
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button class="btn btn-primary" onclick="app.navigateToHome()">返回首页</button>
        </div>
      </div>
    `;
  }
};

// Make TimelineRenderer globally available
window.TimelineRenderer = TimelineRenderer;