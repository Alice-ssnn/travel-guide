// map.js - Google Maps integration for travel guide

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
  renderDayMap(day, container) {
    console.log(`MapManager.renderDayMap called for day ${day.day}`);

    // Clear container
    container.innerHTML = '';

    if (!this.config.apiKey) {
      this.renderPlaceholderMap(day, container);
      return;
    }

    if (!window.google || !window.google.maps) {
      console.error('Google Maps API not loaded');
      this.renderPlaceholderMap(day, container);
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
      this.renderPlaceholderMap(day, container);
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
          fillColor: day.color || '#667eea',
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
                  style="padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
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
            strokeColor: day.color || '#667eea',
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
   * Render placeholder map (when no API key or API not loaded)
   */
  renderPlaceholderMap(day, container) {
    console.log('Rendering placeholder map for day', day.day);

    const placeholderHTML = `
      <div class="map-placeholder">
        <div class="placeholder-icon">🗺️</div>
        <h3 class="placeholder-title">地图视图</h3>
        <p class="placeholder-text">
          ${this.config.apiKey ? '正在加载Google Maps...' : '需要Google Maps API密钥以启用地图功能'}
        </p>
        <div class="placeholder-info">
          <div class="info-city">${day.city} 行程概览</div>
          <div class="info-stats">
            ${day.timeline.length} 个地点 | ${day.route?.totalDistance || '--'} | ${day.route?.totalTime || '--'}
          </div>
        </div>
        ${!this.config.apiKey ? `
          <div class="placeholder-api-info">
            <p>要启用完整地图功能，请设置Google Maps API密钥：</p>
            <div class="api-input-container">
              <input type="text" class="api-key-input" placeholder="输入API密钥" />
              <button class="btn btn-primary btn-small api-key-save">保存</button>
            </div>
            <p class="api-help">
              <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank">
                如何获取API密钥？
              </a>
            </p>
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = placeholderHTML;

    // Add event listener for API key input
    const saveBtn = container.querySelector('.api-key-save');
    const input = container.querySelector('.api-key-input');
    if (saveBtn && input) {
      saveBtn.addEventListener('click', () => {
        const apiKey = input.value.trim();
        if (apiKey) {
          this.config.apiKey = apiKey;
          localStorage.setItem('googleMapsApiKey', apiKey);
          alert('API密钥已保存，正在重新加载地图...');
          this.renderDayMap(day, container);
        }
      });
    }

    // Load saved API key if exists
    if (!this.config.apiKey) {
      const savedKey = localStorage.getItem('googleMapsApiKey');
      if (savedKey) {
        this.config.apiKey = savedKey;
        setTimeout(() => this.renderDayMap(day, container), 100);
      }
    }
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