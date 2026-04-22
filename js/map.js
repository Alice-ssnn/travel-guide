// map.js - Google Maps integration for travel guide

/**
 * 圆周旅迹为独立 App，无公开可嵌入的网页地图/路径规划接口。
 * 在地图页提供：复制本日地点（便于粘贴到 App）、Google 多站路线、官网/商店链接。
 * @see https://www.pitravel.cn/
 */
const PITRAVEL_INFO = {
  name: '圆周旅迹',
  home: 'https://www.pitravel.cn/',
  /** App Store 网页，桌面或备用 */
  ios: 'https://apps.apple.com/cn/app/圆周旅迹-旅游出行智能规划-复制行程攻略ai助手地图路线记录/id6473148424',
  /** iOS：调起系统 App Store 里该应用页（可安装/打开） */
  iosItms: 'itms-apps://itunes.apple.com/cn/app/id6473148424',
  android: 'https://sj.qq.com/appdetail/com.chaochaoshishi.slytherin'
};

/** 经 Google 地图网页路径规划的安全点数上限（避免 URL 过长） */
const MAX_GOOGLE_DIR_STOPS = 20;

/**
 * MapManager - Manages Google Maps integration
 */
const MapManager = {
  // Configuration
  config: {
    apiKey: null,
    mapContainerId: 'map-container',
    defaultZoom: 12,
    defaultCenter: { lat: 47.3769, lng: 8.5417 }, // Zurich coordinates
    mapStyles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'all',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#616161' }]
      }
    ]
  },

  // Map instance
  map: null,
  markers: [],
  directionsService: null,
  directionsRenderer: null,

  /**
   * Initialize Google Maps with API key
   * @param {string} apiKey - Google Maps API key
   */
  init(apiKey) {
    console.log('MapManager initializing...');

    if (apiKey) {
      this.config.apiKey = apiKey;
      console.log('API key set, loading Google Maps JavaScript API...');

      // Load Google Maps JavaScript API
      this.loadGoogleMapsAPI()
        .then(() => {
          console.log('Google Maps API loaded successfully');
          this.initializeMap();
        })
        .catch(error => {
          console.error('Failed to load Google Maps API:', error);
          this.showError('无法加载Google Maps API');
        });
    } else {
      console.warn('No API key provided, using placeholder mode');
      this.showAPIKeyWarning();
    }
  },

  /**
   * Load Google Maps JavaScript API dynamically
   */
  loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) {
        console.log('Google Maps API already loaded');
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.config.apiKey}&callback=MapManager.onGoogleMapsLoaded`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        console.log('Google Maps API script loaded');
        // The callback (onGoogleMapsLoaded) will handle resolution
      };

      script.onerror = () => {
        reject(new Error('Failed to load Google Maps API'));
      };

      window.MapManager = this; // Make sure callback can access this instance
      document.head.appendChild(script);
    });
  },

  /**
   * Callback when Google Maps API is loaded
   */
  onGoogleMapsLoaded() {
    console.log('Google Maps API callback triggered');
    if (typeof this.initializeMap === 'function') {
      this.initializeMap();
    }
  },

  /**
   * 当日时间线中带有坐标的停留点（顺序）
   */
  collectStopsWithCoords(day) {
    if (!day || !Array.isArray(day.timeline)) {
      return [];
    }
    return day.timeline
      .filter(
        a =>
          a &&
          a.location &&
          a.location.coordinates &&
          typeof a.location.coordinates.lat === 'number' &&
          typeof a.location.coordinates.lng === 'number'
      )
      .map(a => ({
        lat: a.location.coordinates.lat,
        lng: a.location.coordinates.lng,
        time: a.time || '',
        title: a.title || '',
        name: a.location.name || '',
        address: a.location.address || ''
      }));
  },

  /**
   * 多段路径的 Google 地图网页链接（无 API Key 也可用）
   */
  buildMultistopGoogleMapsUrl(stops) {
    if (!stops || stops.length === 0) {
      return null;
    }
    if (stops.length === 1) {
      const p = stops[0];
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.lat},${p.lng}`)}`;
    }
    const limited = stops.slice(0, MAX_GOOGLE_DIR_STOPS);
    const path = limited.map(s => `${s.lat},${s.lng}`).join('/');
    return `https://www.google.com/maps/dir/${path}`;
  },

  /**
   * 供复制到圆周旅迹等 App 的纯文本
   */
  buildDayStopsCopyText(day) {
    if (!day) {
      return '';
    }
    const head = `第${day.day}天 · ${day.city} · ${day.date}\n可粘贴到「${PITRAVEL_INFO.name}」等 App 的行程/导入中，再使用其一键规划。`;
    const body = [];
    let n = 1;
    (day.timeline || []).forEach(a => {
      if (!a || !a.location || !a.location.coordinates) {
        return;
      }
      const line1 = `${n}. ${a.time || ''} ${a.title || ''}`.replace(/\s+/g, ' ').trim();
      const line2 = [a.location.name, a.location.address].filter(Boolean).join(' · ');
      body.push(line1, line2 ? `   ${line2}` : '');
      n++;
    });
    if (body.length === 0) {
      return `${head}\n\n本日暂无带坐标的地点。`;
    }
    return `${head}\n\n${body.join('\n')}`;
  },

  /**
   * 尽量跳转到圆周旅迹 App / 各应用商店该应用页（无公开 URL Scheme，由系统/商店处理）
   */
  openPitravelApp() {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    if (isIOS) {
      window.location.assign(PITRAVEL_INFO.iosItms);
      return;
    }
    if (isAndroid) {
      window.location.assign(PITRAVEL_INFO.android);
      return;
    }
    // 电脑端：打开官网（可扫码下载）或 iOS/安卓商店网页
    window.open(PITRAVEL_INFO.home, '_blank', 'noopener');
  },

  /**
   * 与圆周旅迹衔接：说明 + 打开 App + 复制 + Google 多站 + 下载
   */
  renderPitravelBridge(day, container) {
    const stops = this.collectStopsWithCoords(day);
    const gUrl = this.buildMultistopGoogleMapsUrl(stops);
    const canOpenG = Boolean(gUrl);
    const gBtnText =
      stops.length === 0
        ? 'Google 路线'
        : stops.length < 2
          ? 'Google 地图中查看'
          : 'Google 多站路线';

    const panel = document.createElement('div');
    panel.className = 'pitravel-bridge';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', '圆周旅迹与路线');

    const inner = document.createElement('div');
    inner.className = 'pitravel-bridge__inner';
    inner.innerHTML = `
      <div class="pitravel-bridge__row">
        <span class="pitravel-bridge__emoji" aria-hidden="true">🧭</span>
        <div class="pitravel-bridge__text">
          <h3 class="pitravel-bridge__title">与 ${PITRAVEL_INFO.name} 规划衔接</h3>
          <p class="pitravel-bridge__desc">
            「${PITRAVEL_INFO.name}」的<strong>智能路径规划在 App 内</strong>，本站无法嵌入其官方地图。可复制本日地点到 App 中粘贴/导入，再用其一键规划；或先用 Google 地图查看本日有坐标地点的路线。
            ${stops.length > MAX_GOOGLE_DIR_STOPS ? `<span class="pitravel-bridge__note">（Google 路线最多含前 ${MAX_GOOGLE_DIR_STOPS} 个有坐标的点）</span>` : ''}
          </p>
        </div>
      </div>
      <div class="pitravel-bridge__actions pitravel-bridge__actions--primary">
        <button type="button" class="btn btn-primary pitravel-btn-open-app" title="iPhone 调起 App Store，安卓前往应用宝下载页" aria-label="打开圆周旅迹手机应用或前往应用商店">
          打开圆周旅迹 App
        </button>
      </div>
      <div class="pitravel-bridge__actions">
        <button type="button" class="btn btn-primary btn-small pitravel-btn-copy">复制本日地点</button>
        <button type="button" class="btn btn-secondary btn-small pitravel-btn-gm" ${!canOpenG ? 'disabled' : ''} title="在浏览器或 Google 地图 App 中打开">
          ${gBtnText}
        </button>
        <a class="btn btn-secondary btn-small" href="${PITRAVEL_INFO.home}" target="_blank" rel="noopener">官网</a>
        <a class="btn btn-secondary btn-small" href="${PITRAVEL_INFO.ios}" target="_blank" rel="noopener">iOS</a>
        <a class="btn btn-secondary btn-small" href="${PITRAVEL_INFO.android}" target="_blank" rel="noopener">Android</a>
      </div>
      <p class="pitravel-bridge__msg" role="status" aria-live="polite"></p>
    `;

    const copyText = this.buildDayStopsCopyText(day);
    const msgEl = inner.querySelector('.pitravel-bridge__msg');
    const btnOpenApp = inner.querySelector('.pitravel-btn-open-app');
    const btnCopy = inner.querySelector('.pitravel-btn-copy');
    const btnGm = inner.querySelector('.pitravel-btn-gm');

    if (btnOpenApp) {
      btnOpenApp.addEventListener('click', () => this.openPitravelApp());
    }

    const showMsg = t => {
      if (msgEl) {
        msgEl.textContent = t;
        window.clearTimeout(showMsg._t);
        showMsg._t = window.setTimeout(() => {
          if (msgEl) {
            msgEl.textContent = '';
          }
        }, 4500);
      }
    };

    btnCopy.addEventListener('click', () => {
      const t = copyText;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(
          () => showMsg('已复制，可打开「' + PITRAVEL_INFO.name + '」粘贴到行程'),
          () => this._fallbackCopy(t, showMsg)
        );
      } else {
        this._fallbackCopy(t, showMsg);
      }
    });

    btnGm.addEventListener('click', () => {
      if (gUrl) {
        window.open(gUrl, '_blank', 'noopener');
      }
    });

    panel.appendChild(inner);
    container.appendChild(panel);
  },

  _fallbackCopy(text, showMsg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-2000px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (showMsg) {
        showMsg('已复制到剪贴板');
      }
    } catch (e) {
      if (showMsg) {
        showMsg('自动复制失败，请长按全选下方行程文本手动复制');
      }
    }
  },

  /**
   * Initialize map instance
   */
  initializeMap() {
    console.log('Initializing map instance...');

    // Create directions service and renderer
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();

    console.log('MapManager ready');
  },

  /**
   * Render map for a specific day
   * @param {Object} day - Day data object
   * @param {HTMLElement} container - Container element for the map
   */
  /**
   * 移除地图/占位，保留顶部的圆周旅迹桥接区
   */
  _clearMapContentKeepBridge(container) {
    if (!container) {
      return;
    }
    Array.from(container.children).forEach(ch => {
      if (!ch.classList || !ch.classList.contains('pitravel-bridge')) {
        ch.remove();
      }
    });
  },

  renderDayMap(day, container) {
    console.log(`MapManager.renderDayMap called for day ${day.day}`);

    container.innerHTML = '';
    this.renderPitravelBridge(day, container);

    if (!this.config.apiKey) {
      this.appendPlaceholderMap(day, container);
      this._bindApiKeyInPlaceholder(day, container);
      this._tryLoadSavedKeyForMap(day, container);
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      this.appendPlaceholderMap(day, container);
      this._bindApiKeyInPlaceholder(day, container);
      return;
    }

    try {
      // Create map container
      const mapContainer = document.createElement('div');
      mapContainer.id = this.config.mapContainerId;
      mapContainer.className = 'day-map';
      mapContainer.style.height = '400px';
      mapContainer.style.borderRadius = '12px';
      mapContainer.style.overflow = 'hidden';
      container.appendChild(mapContainer);

      // Create map instance
      const mapOptions = {
        center: this.getDayCenter(day),
        zoom: this.config.defaultZoom,
        styles: this.config.mapStyles,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      };

      this.map = new google.maps.Map(mapContainer, mapOptions);

      // Add markers for day activities
      this.addDayMarkers(day);

      // Draw route if available
      if (day.route && day.route.steps && day.route.steps.length > 0) {
        this.drawDayRoute(day);
      }

      // Add map controls
      this.addMapControls(container, day);

    } catch (error) {
      console.error('Error rendering map:', error);
      container.innerHTML = '';
      this.renderPitravelBridge(day, container);
      this.appendPlaceholderMap(day, container);
      this._bindApiKeyInPlaceholder(day, container);
    }
  },

  appendPlaceholderMap(day, container) {
    this._clearMapContentKeepBridge(container);
    const wrap = document.createElement('div');
    wrap.className = 'map-placeholder-wrap';
    wrap.innerHTML = `
      <div class="map-placeholder">
        <div class="placeholder-icon">🗺️</div>
        <h3 class="placeholder-title">地图视图</h3>
        <p class="placeholder-text">
          ${this.config.apiKey ? '正在加载Google Maps...' : '需要Google Maps API密钥以启用内嵌地图'}
        </p>
        <div class="placeholder-info">
          <div class="info-city">${day.city} 行程概览</div>
          <div class="info-stats">
            ${day.timeline.length} 个地点 | ${day.route?.totalDistance || '--'} | ${day.route?.totalTime || '--'}
          </div>
        </div>
        ${!this.config.apiKey ? `
          <div class="placeholder-api-info">
            <p>要启用本页内嵌 Google 地图，可在此保存 API 密钥；无需密钥也可使用上方「Google 多站路线」在浏览器中查看路线。</p>
            <div class="api-input-container">
              <input type="text" class="api-key-input" placeholder="输入 Google Maps API 密钥" />
              <button type="button" class="btn btn-primary btn-small api-key-save">保存</button>
            </div>
            <p class="api-help">
              <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener">如何获取 API 密钥？</a>
            </p>
          </div>
        ` : ''}
      </div>
    `;
    container.appendChild(wrap);
  },

  _bindApiKeyInPlaceholder(day, container) {
    const saveBtn = container.querySelector('.api-key-save');
    const input = container.querySelector('.api-key-input');
    if (saveBtn && input) {
      saveBtn.addEventListener('click', () => {
        const apiKey = input.value.trim();
        if (apiKey) {
          this.config.apiKey = apiKey;
          localStorage.setItem('googleMapsApiKey', apiKey);
          window.alert('API 密钥已保存，正在重新加载地图...');
          this.renderDayMap(day, container);
        }
      });
    }
  },

  _tryLoadSavedKeyForMap(day, container) {
    if (this.config.apiKey) {
      return;
    }
    const savedKey = localStorage.getItem('googleMapsApiKey');
    if (savedKey) {
      this.config.apiKey = savedKey;
      setTimeout(() => this.renderDayMap(day, container), 100);
    }
  },

  /**
   * Get center coordinates for a day's map
   */
  getDayCenter(day) {
    // Use first activity's location or default center
    if (day.timeline.length > 0 && day.timeline[0].location?.coordinates) {
      const coords = day.timeline[0].location.coordinates;
      return new google.maps.LatLng(coords.lat, coords.lng);
    }
    return new google.maps.LatLng(this.config.defaultCenter.lat, this.config.defaultCenter.lng);
  },

  /**
   * Add markers for day activities
   */
  addDayMarkers(day) {
    if (!this.map) return;

    // Clear existing markers
    this.clearMarkers();

    day.timeline.forEach((activity, index) => {
      if (!activity.location?.coordinates) return;

      const position = new google.maps.LatLng(
        activity.location.coordinates.lat,
        activity.location.coordinates.lng
      );

      const marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: activity.title,
        label: {
          text: (index + 1).toString(),
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        },
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: day.color || '#ff385c',
          fillOpacity: 1,
          strokeColor: 'white',
          strokeWeight: 2
        }
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: this.createMarkerInfoContent(activity, day)
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
      });

      this.markers.push(marker);
    });

    // Fit bounds to show all markers
    if (this.markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      this.markers.forEach(marker => bounds.extend(marker.getPosition()));
      this.map.fitBounds(bounds, { padding: 50 });
    }
  },

  /**
   * Create marker info window content
   */
  createMarkerInfoContent(activity, day) {
    return `
      <div class="map-info-window" style="padding: 8px; max-width: 250px;">
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 4px; color: #1d1d1f;">
          ${activity.title}
        </div>
        <div style="font-size: 12px; color: #8e8e93; margin-bottom: 8px;">
          ${activity.time} • ${activity.duration}分钟
        </div>
        <div style="font-size: 13px; color: #1d1d1f; margin-bottom: 8px;">
          ${activity.description}
        </div>
        <div style="font-size: 12px; color: #8e8e93;">
          <div>📍 ${activity.location?.name || '未指定地点'}</div>
          ${activity.cost ? `<div>💰 ${activity.cost}</div>` : ''}
        </div>
        <div style="margin-top: 12px; display: flex; gap: 8px;">
          <button onclick="MapManager.openInGoogleMaps(${activity.location?.coordinates?.lat}, ${activity.location?.coordinates?.lng})"
                  style="padding: 4px 8px; background: #ff385c; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
            导航
          </button>
        </div>
      </div>
    `;
  },

  /**
   * Draw route for day activities
   */
  drawDayRoute(day) {
    if (!this.map || !this.directionsService || !this.directionsRenderer || day.timeline.length < 2) {
      return;
    }

    // Create waypoints from activity locations
    const waypoints = [];
    for (let i = 1; i < day.timeline.length - 1; i++) {
      const activity = day.timeline[i];
      if (activity.location?.coordinates) {
        waypoints.push({
          location: new google.maps.LatLng(
            activity.location.coordinates.lat,
            activity.location.coordinates.lng
          ),
          stopover: true
        });
      }
    }

    // Get start and end locations
    const startActivity = day.timeline[0];
    const endActivity = day.timeline[day.timeline.length - 1];

    if (!startActivity.location?.coordinates || !endActivity.location?.coordinates) {
      return;
    }

    const request = {
      origin: new google.maps.LatLng(
        startActivity.location.coordinates.lat,
        startActivity.location.coordinates.lng
      ),
      destination: new google.maps.LatLng(
        endActivity.location.coordinates.lat,
        endActivity.location.coordinates.lng
      ),
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
    };

    this.directionsService.route(request, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);

        // Customize route display
        this.directionsRenderer.setOptions({
          polylineOptions: {
            strokeColor: day.color || '#ff385c',
            strokeOpacity: 0.8,
            strokeWeight: 4
          },
          markerOptions: {
            visible: false // Hide default markers
          }
        });
      } else {
        console.warn('Directions request failed:', status);
      }
    });
  },

  /**
   * Add map controls and info
   */
  addMapControls(container, day) {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'map-controls';
    controlsContainer.style.marginTop = '16px';
    controlsContainer.style.display = 'flex';
    controlsContainer.style.justifyContent = 'space-between';
    controlsContainer.style.alignItems = 'center';

    controlsContainer.innerHTML = `
      <div style="font-size: 14px; color: var(--text-secondary);">
        <strong>${day.city}</strong> • ${day.timeline.length} 个地点
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-small map-refresh"
                style="font-size: 12px; padding: 4px 8px;">
          刷新地图
        </button>
        <button class="btn btn-primary btn-small map-navigation"
                data-lat="${day.timeline[0]?.location?.coordinates?.lat || ''}"
                data-lng="${day.timeline[0]?.location?.coordinates?.lng || ''}"
                style="font-size: 12px; padding: 4px 8px;">
          开始导航
        </button>
      </div>
    `;

    container.appendChild(controlsContainer);

    // Add event listeners
    const refreshBtn = controlsContainer.querySelector('.map-refresh');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshMap(day));
    }

    const navBtn = controlsContainer.querySelector('.map-navigation');
    if (navBtn) {
      navBtn.addEventListener('click', () => {
        const lat = navBtn.dataset.lat;
        const lng = navBtn.dataset.lng;
        if (lat && lng) {
          this.openInGoogleMaps(parseFloat(lat), parseFloat(lng));
        }
      });
    }
  },

  /**
   * Refresh map view
   */
  refreshMap(day) {
    console.log('Refreshing map for day', day.day);
    if (this.map) {
      this.map.setCenter(this.getDayCenter(day));
      this.map.setZoom(this.config.defaultZoom);
    }
  },

  /**
   * Clear all markers
   */
  clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null));
    this.markers = [];
  },

  /**
   * Show API key warning
   */
  showAPIKeyWarning() {
    console.warn('Google Maps API key not provided');
    // Could show a notification or prompt
  },

  /**
   * Show error message
   */
  showError(message) {
    console.error('MapManager error:', message);
    // Could show user-friendly error message
  },

  /**
   * Open location in Google Maps app
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   */
  openInGoogleMaps(lat, lng) {
    if (!lat || !lng) {
      console.error('Invalid coordinates:', lat, lng);
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
    console.log(`Opening Google Maps for coordinates: ${lat}, ${lng}`);
  },

  /**
   * Show activity on map (called from timeline)
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {string} activityId - Activity ID
   * @param {Object} day - Day data object
   */
  showActivityOnMap(lat, lng, activityId, day) {
    console.log(`Showing activity ${activityId} on map at ${lat}, ${lng}`);

    // If we have a map instance, center on this activity
    if (this.map) {
      const position = new google.maps.LatLng(lat, lng);
      this.map.setCenter(position);
      this.map.setZoom(15);

      // Highlight the corresponding marker
      const markerIndex = day.timeline.findIndex(a => a.id === activityId);
      if (markerIndex >= 0 && this.markers[markerIndex]) {
        // Trigger marker click to show info window
        google.maps.event.trigger(this.markers[markerIndex], 'click');
      }
    } else {
      // No map available, open in Google Maps app
      this.openInGoogleMaps(lat, lng);
    }
  }
};

// Make MapManager globally available
window.MapManager = MapManager;