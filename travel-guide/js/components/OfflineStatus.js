// js/components/OfflineStatus.js
class OfflineStatus extends HTMLElement {
  constructor() {
    super();
    this.networkMonitor = window.networkMonitor;
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.innerHTML = `
      <div class="offline-status">
        <span class="status-indicator"></span>
        <span class="status-text">在线</span>
        <button class="refresh-btn" aria-label="刷新">刷新</button>
      </div>
    `;
  }

  updateStatus(quality) {
    const indicator = this.querySelector('.status-indicator');
    const text = this.querySelector('.status-text');

    if (!quality.online) {
      indicator.className = 'status-indicator offline';
      text.textContent = '离线';
      this.classList.add('offline');
    } else if (quality.latency > 1000) {
      indicator.className = 'status-indicator slow';
      text.textContent = '网络较慢';
      this.classList.add('slow');
    } else {
      indicator.className = 'status-indicator online';
      text.textContent = '在线';
      this.classList.remove('offline', 'slow');
    }
  }

  setupEventListeners() {
    if (this.networkMonitor) {
      this.networkMonitor.addEventListener((quality) => {
        this.updateStatus(quality);
      });

      // Initial update
      this.updateStatus(this.networkMonitor.checkQuality());
    }

    this.querySelector('.refresh-btn').addEventListener('click', () => {
      window.location.reload();
    });
  }

  connectedCallback() {
    console.log('OfflineStatus component connected');
  }

  disconnectedCallback() {
    console.log('OfflineStatus component disconnected');
  }
}

// Register custom element
if (typeof customElements !== 'undefined') {
  customElements.define('offline-status', OfflineStatus);
}

// Export for Node.js / Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { OfflineStatus };
}

// Export for browser
if (typeof self !== 'undefined') {
  self.OfflineStatus = OfflineStatus;
}