// data.js - Trip data model and loading utilities

/**
 * Complete trip data for Switzerland-France 12-day itinerary
 * Based on the markdown travel guide document
 */
const tripData = {
  id: "switzerland-france-2026",
  title: "瑞士·南法·巴黎12日深度游",
  duration: 12,
  dates: {
    start: "2026-04-24",
    end: "2026-05-05"
  },
  cities: [
    { name: "苏黎世", color: "#30d158" },
    { name: "因特拉肯", color: "#ff9500" },
    { name: "日内瓦", color: "#007aff" },
    { name: "尼斯", color: "#ff2d55" },
    { name: "埃兹", color: "#af52de" },
    { name: "戛纳", color: "#ff9500" },
    { name: "巴黎", color: "#ff3b30" }
  ],
  days: [
    // 第1天：原始数据
    {
      day: 1,
      date: "2026-04-24",
      title: "抵达苏黎世",
      city: "苏黎世",
      color: "#30d158",
      summary: "✈️ 上海→维也纳→苏黎世 | 🏨 ibis Styles Zurich",
      tags: ["飞行", "抵达", "酒店"],
      overview: {
        accommodation: {
          name: "ibis Styles Zurich City Center",
          address: "Stampfenbachstrasse 60, 8006 Zurich",
          checkin: "15:00-23:00",
          checkout: "12:00前",
          coordinates: { lat: 47.3782, lng: 8.5390 }
        },
        transport: {
          type: "飞机",
          details: "奥地利航空OS016 + OS145联程",
          airline: "Austrian Airlines",
          duration: "13小时30分（含转机）"
        },
        importantNotes: [
          "维也纳转机时间1小时55分，注意时间衔接",
          "苏黎世机场到酒店乘火车15分钟，费用约CHF 6-8",
          "酒店入住时间15:00-23:00，提前到达可寄存行李"
        ]
      },
      timeline: [
        {
          id: "day1-flight",
          time: "09:30",
          duration: 30,
          icon: "✈️",
          title: "上海浦东T2起飞",
          description: "奥地利航空OS016，经济舱",
          location: {
            name: "上海浦东国际机场T2",
            address: "浦东新区启航路300号",
            coordinates: { lat: 31.1434, lng: 121.8052 }
          },
          category: "交通",
          cost: "已包含在机票",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day1-transfer",
          time: "15:55",
          duration: 115,
          icon: "🔄",
          title: "维也纳转机",
          description: "转机时间1小时45分钟，无需取行李",
          location: {
            name: "维也纳国际机场T3",
            address: "Flughafen Wien, 1300 Wien, Austria",
            coordinates: { lat: 48.1103, lng: 16.5697 }
          },
          category: "交通",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day1-flight-vienna",
          time: "18:40",
          duration: 80,
          icon: "✈️",
          title: "维也纳T3起飞",
          description: "奥地利航空OS145，前往苏黎世",
          location: {
            name: "维也纳国际机场T3",
            address: "Flughafen Wien, 1300 Wien, Austria",
            coordinates: { lat: 48.1103, lng: 16.5697 }
          },
          category: "交通",
          cost: "已包含在机票",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day1-arrival",
          time: "20:00",
          duration: 30,
          icon: "🛄",
          title: "抵达苏黎世机场",
          description: "入境、提取行李（申根入境，填写入境卡）",
          location: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          category: "抵达",
          cost: "免费",
          actions: [
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day1-train",
          time: "20:30",
          duration: 15,
          icon: "🚆",
          title: "乘火车前往酒店",
          description: "机场站→Zürich HB，15分钟",
          location: {
            name: "苏黎世机场火车站",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          destination: {
            name: "Zürich HB",
            address: "Bahnhofplatz, 8001 Zürich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "交通",
          cost: "CHF 6-8",
          route: {
            distance: "10公里",
            time: "15分钟",
            steps: ["机场站→Zürich HB"],
            notes: "火车班次频繁"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day1-checkin",
          time: "20:45",
          duration: 30,
          icon: "🏨",
          title: "酒店入住",
          description: "ibis Styles Zurich City Center",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day1-dinner",
          time: "21:00",
          duration: 30,
          icon: "🍽️",
          title: "酒店周边简单晚餐",
          description: "火车站附近快餐",
          location: {
            name: "苏黎世火车站附近",
            address: "Zürich HB周边",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "餐饮",
          cost: "CHF 25-35/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day1-rest",
          time: "21:30",
          duration: 0,
          icon: "💤",
          title: "返回酒店休息",
          description: "调整时差，明日提车需早起",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "休息",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        }
      ],
      route: {
        totalDistance: "0公里",
        totalTime: "0小时",
        steps: []
      }
    },
    // 第2天：原始数据
    {
      day: 2,
      date: "2026-04-25",
      title: "苏黎世→因特拉肯自驾日",
      city: "因特拉肯",
      color: "#ff9500",
      summary: "🚗 取车自驾 | 🏔️ 图恩湖 | 🏨 Hotel Rosengärtli",
      tags: ["自驾", "酒店", "湖泊"],
      overview: {
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Hauptstrasse 73, 3706 Leissigen",
          checkin: "14:00-20:00",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾租车",
          details: "Europcar苏黎世机场取车",
          company: "Europcar",
          bookingRef: "1159263500",
          cost: "CHF 1066"
        },
        importantNotes: [
          "租车需准备：护照、中国驾照、国际驾照认证件、信用卡",
          "满油取还车，注意还车时间",
          "山区驾驶注意安全，部分路段有陡坡和弯道"
        ]
      },
      timeline: [
        {
          id: "day2-breakfast",
          time: "07:00",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐",
          description: "欧陆式自助早餐",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "餐饮",
          cost: "CHF 18/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-checkout",
          time: "07:30",
          duration: 30,
          icon: "🧳",
          title: "酒店退房+行李装车准备",
          description: "退房并准备行李装车",
          location: {
            name: "ibis Styles Zurich City Center",
            address: "Stampfenbachstrasse 60, 8006 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-to-airport",
          time: "08:00",
          duration: 60,
          icon: "🚆",
          title: "前往机场取车点",
          description: "火车13分钟+找到Parking 3",
          location: {
            name: "Zurich HB火车站",
            address: "Bahnhofplatz 1, 8001 Zurich",
            coordinates: { lat: 47.3782, lng: 8.5390 }
          },
          destination: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          category: "交通",
          cost: "CHF 6.8",
          route: {
            distance: "13分钟",
            time: "13分钟",
            steps: ["火车前往机场"],
            notes: "找到Parking 3租车点"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-wait-car",
          time: "09:00",
          duration: 60,
          icon: "⏳",
          title: "等待取车+熟悉环境",
          description: "Europcar Parking 3柜台，提前准备证件",
          location: {
            name: "Europcar Parking 3",
            address: "Zurich Airport, 8058 Zurich",
            coordinates: { lat: 47.4581, lng: 8.5550 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-rental-procedure",
          time: "10:00",
          duration: 60,
          icon: "📋",
          title: "租车手续+验车",
          description: "预订号：1159263500，全面验车拍照",
          location: {
            name: "Europcar Parking 3",
            address: "Zurich Airport, 8058 Zurich",
            coordinates: { lat: 47.4581, lng: 8.5550 }
          },
          category: "交通",
          cost: "CHF 1066 (5天租金)",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-gps-setup",
          time: "11:00",
          duration: 15,
          icon: "📍",
          title: "设置GPS+路线规划",
          description: "设置中文导航，确认因特拉肯路线",
          location: {
            name: "Europcar Parking 3",
            address: "Zurich Airport, 8058 Zurich",
            coordinates: { lat: 47.4581, lng: 8.5550 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-drive-interlaken",
          time: "11:15",
          duration: 135,
          icon: "🛣️",
          title: "自驾前往因特拉肯",
          description: "苏黎世机场→因特拉肯，自驾2小时15分",
          location: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          destination: {
            name: "因特拉肯",
            address: "Interlaken, Switzerland",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "自驾",
          cost: "油费约CHF 30，高速公路年票已含",
          route: {
            distance: "130公里",
            time: "2小时15分",
            steps: ["A1高速", "A6高速", "A8高速"],
            notes: "山区路段注意安全"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-hotel-checkin",
          time: "13:30",
          duration: 60,
          icon: "🏨",
          title: "抵达酒店+办理入住",
          description: "Hotel Rosengärtli，湖景房check-in",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-lunch-rest",
          time: "14:30",
          duration: 60,
          icon: "🍽️",
          title: "房间休息+简单午餐",
          description: "酒店简餐或附近咖啡厅",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮",
          cost: "CHF 15-20/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-thun-lake-walk",
          time: "15:30",
          duration: 90,
          icon: "🏞️",
          title: "图恩湖畔漫步",
          description: "熟悉环境，欣赏阿尔卑斯湖景",
          location: {
            name: "图恩湖畔",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-interlaken-town",
          time: "17:00",
          duration: 60,
          icon: "🏘️",
          title: "因特拉肯小镇游览",
          description: "开车15分钟，何维克街购物，跳伞公司确认明日安排",
          location: {
            name: "因特拉肯小镇",
            address: "Höheweg, Interlaken, Switzerland",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "景点",
          cost: "停车费CHF 5",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day2-lakeside-dinner",
          time: "18:00",
          duration: 120,
          icon: "🍽️",
          title: "酒店晚餐+日落",
          description: "湖畔餐厅，瑞士烤鱼配白酒",
          location: {
            name: "湖畔餐厅",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "餐饮",
          cost: "CHF 45-60/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-lakeside-walk-plan",
          time: "20:00",
          duration: 60,
          icon: "🌅",
          title: "湖边散步+明日规划",
          description: "查看跳伞天气预报，早休息",
          location: {
            name: "图恩湖畔",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "130公里",
        totalTime: "2小时15分",
        steps: [
          {
            from: "苏黎世机场",
            to: "因特拉肯",
            transport: "自驾",
            distance: "130km",
            time: "2h15m",
            route: "A1→A6→A8",
            details: "山区驾驶注意安全，部分路段有陡坡"
          }
        ]
      }
    },
    // 第3天：因特拉肯跳伞+徒步
    {
      day: 3,
      date: "2026-04-26",
      title: "因特拉肯跳伞+徒步",
      city: "因特拉肯",
      color: "#ff9500",
      summary: "🪂 直升机跳伞 | 🏞️ 厄希嫩湖徒步 | 🏰 施皮茨城堡日落",
      tags: ["跳伞", "徒步", "城堡", "冒险"],
      overview: {
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Hauptstrasse 73, 3706 Leissigen",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾",
          details: "因特拉肯周边自驾",
          cost: "油费约CHF 15"
        },
        importantNotes: [
          "直升机跳伞已预订：CHF 490×2，09:00集合",
          "跳伞高度：4000米，自由落体45秒，时速200km/h",
          "天气要求：能见度>1000米，风速<15km/h"
        ]
      },
      timeline: [
        {
          id: "day3-breakfast",
          time: "07:00",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐",
          description: "轻食为主，跳伞前不宜过饱",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮",
          cost: "包含在住宿内",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-drive-skydive",
          time: "07:30",
          duration: 75,
          icon: "🚗",
          title: "自驾前往跳伞基地",
          description: "酒店→Skydive Interlaken基地",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          destination: {
            name: "Skydive Interlaken",
            address: "Flugplatzstrasse 40, 3800 Interlaken",
            coordinates: { lat: 46.6875, lng: 7.8640 }
          },
          category: "交通",
          cost: "油费约CHF 5",
          route: {
            distance: "15公里",
            time: "15分钟",
            steps: ["自驾路线"],
            notes: "提前到达跳伞基地"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day3-skydive-checkin",
          time: "08:45",
          duration: 15,
          icon: "📝",
          title: "跳伞报到+体检",
          description: "填写免责声明，健康检查",
          location: {
            name: "Skydive Interlaken",
            address: "Flugplatzstrasse 40, 3800 Interlaken",
            coordinates: { lat: 46.6875, lng: 7.8640 }
          },
          category: "活动",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-skydive",
          time: "09:00",
          duration: 180,
          icon: "🪂",
          title: "直升机跳伞体验",
          description: "CHF 980，4000米高空，45秒自由落体，全程录像",
          location: {
            name: "Skydive Interlaken",
            address: "Flugplatzstrasse 40, 3800 Interlaken",
            coordinates: { lat: 46.6875, lng: 7.8640 }
          },
          category: "冒险",
          cost: "CHF 980（2人）",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-lunch",
          time: "12:00",
          duration: 90,
          icon: "🍽️",
          title: "庆祝午餐",
          description: "传统瑞士餐厅，奶酪火锅",
          location: {
            name: "瑞士传统餐厅",
            address: "因特拉肯附近",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "餐饮",
          cost: "CHF 40-55/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-drive-oseen",
          time: "13:30",
          duration: 30,
          icon: "🚗",
          title: "前往厄希嫩湖",
          description: "自驾前往厄希嫩湖，世界遗产观光路线",
          location: {
            name: "午餐餐厅",
            address: "因特拉肯附近",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          destination: {
            name: "厄希嫩湖",
            address: "Oeschinensee, Kandersteg",
            coordinates: { lat: 46.6850, lng: 7.7830 }
          },
          category: "交通",
          cost: "油费约CHF 5",
          route: {
            distance: "20公里",
            time: "20分钟",
            steps: ["山区道路"],
            notes: "山路驾驶注意安全"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day3-oseen-hike",
          time: "14:00",
          duration: 180,
          icon: "🥾",
          title: "厄希嫩湖徒步",
          description: "湖畔栈道，雪山倒影拍摄",
          location: {
            name: "厄希嫩湖",
            address: "Oeschinensee, Kandersteg",
            coordinates: { lat: 46.6850, lng: 7.7830 }
          },
          category: "徒步",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-return-hotel",
          time: "17:00",
          duration: 30,
          icon: "🚗",
          title: "返回酒店",
          description: "自驾返回酒店",
          location: {
            name: "厄希嫩湖",
            address: "Oeschinensee, Kandersteg",
            coordinates: { lat: 46.6850, lng: 7.7830 }
          },
          destination: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "交通",
          cost: "油费约CHF 5",
          route: {
            distance: "25公里",
            time: "25分钟",
            steps: ["山区道路"],
            notes: "山路驾驶注意安全"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day3-rest",
          time: "17:30",
          duration: 90,
          icon: "📱",
          title: "酒店休息+整理照片",
          description: "跳伞视频剪辑，社交分享",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day3-spiez-sunset",
          time: "19:00",
          duration: 90,
          icon: "🏰",
          title: "施皮茨城堡日落",
          description: "最美湖景城堡，19:30日落",
          location: {
            name: "施皮茨城堡",
            address: "Spiez Castle, Spiez",
            coordinates: { lat: 46.6881, lng: 7.6750 }
          },
          category: "景点",
          cost: "CHF 8/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day3-dinner",
          time: "20:30",
          duration: 60,
          icon: "🍽️",
          title: "酒店晚餐",
          description: "酒店餐厅，湖景晚餐",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮",
          cost: "CHF 35-50/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "80公里",
        totalTime: "3小时驾驶",
        steps: [
          {
            from: "Hotel Rosengärtli",
            to: "Skydive Interlaken",
            transport: "自驾",
            distance: "15km",
            time: "15m",
            route: "当地道路",
            details: "前往跳伞基地"
          },
          {
            from: "Skydive Interlaken",
            to: "厄希嫩湖",
            transport: "自驾",
            distance: "35km",
            time: "40m",
            route: "山区道路",
            details: "前往徒步地点"
          },
          {
            from: "厄希嫩湖",
            to: "施皮茨城堡",
            transport: "自驾",
            distance: "30km",
            time: "35m",
            route: "湖畔公路",
            details: "前往城堡看日落"
          }
        ]
      }
    },
    // 第4天：瑞士湖区→尼斯
    {
      day: 4,
      date: "2026-04-27",
      title: "瑞士湖区→尼斯",
      city: "尼斯",
      color: "#ff2d55",
      summary: "🚗 还车+日内瓦游览 | ✈️ 飞往尼斯 | 🏖️ 天使湾日落",
      tags: ["还车", "日内瓦", "飞行", "尼斯", "海滩"],
      overview: {
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "16:00-22:00",
          checkout: "11:00前",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "自驾+飞机",
          details: "因特拉肯→日内瓦机场还车，EasyJet飞往尼斯",
          company: "EasyJet",
          flight: "U21399",
          duration: "1小时5分",
          cost: "机票已预订"
        },
        importantNotes: [
          "租车需满油交还，附近有Shell加油站",
          "日内瓦机场→市区火车6分钟，CHF 3.6",
          "尼斯机场到市区Bus 98/99，50分钟，€1.7"
        ]
      },
      timeline: [
        {
          id: "day4-breakfast-checkout",
          time: "07:00",
          duration: 60,
          icon: "🍽️",
          title: "酒店早餐+退房",
          description: "提前退房，行李装车准备长途驾驶",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮+住宿",
          cost: "CHF 18/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-drive-geneva",
          time: "08:00",
          duration: 90,
          icon: "🚗",
          title: "自驾前往日内瓦机场",
          description: "因特拉肯→日内瓦机场，A6→A1高速",
          location: {
            name: "Hotel Rosengärtli",
            address: "Hauptstrasse 73, 3706 Leissigen",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          destination: {
            name: "日内瓦机场P51停车场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "自驾",
          cost: "油费约CHF 25",
          route: {
            distance: "140公里",
            time: "1小时30分",
            steps: ["A6高速", "A1高速"],
            notes: "前往机场还车"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day4-arrival-airport",
          time: "09:30",
          duration: 30,
          icon: "📍",
          title: "到达机场+找还车点",
          description: "Europcar柜台，Parking P51",
          location: {
            name: "日内瓦机场P51停车场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-car-return",
          time: "10:00",
          duration: 45,
          icon: "🚗",
          title: "还车手续+验车",
          description: "预约时间准时还车，全面检查",
          location: {
            name: "Europcar日内瓦机场",
            address: "Parking P51, Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "已包含在租金",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-train-city",
          time: "10:45",
          duration: 30,
          icon: "🚂",
          title: "机场→日内瓦市区",
          description: "火车6分钟直达Cornavin中央站",
          location: {
            name: "日内瓦机场站",
            address: "Geneva Airport Station",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          destination: {
            name: "日内瓦Cornavin中央站",
            address: "Gare de Genève-Cornavin",
            coordinates: { lat: 46.2100, lng: 6.1420 }
          },
          category: "交通",
          cost: "CHF 3.6/人",
          route: {
            distance: "5公里",
            time: "6分钟",
            steps: ["机场快线"],
            notes: "前往市区游览"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day4-lake-geneva",
          time: "11:15",
          duration: 45,
          icon: "🏞️",
          title: "日内瓦湖漫步",
          description: "寄存行李后湖畔游览",
          location: {
            name: "日内瓦湖畔",
            address: "Lake Geneva, Geneva",
            coordinates: { lat: 46.2074, lng: 6.1557 }
          },
          category: "景点",
          cost: "行李寄存CHF 8",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-jet-deau",
          time: "12:00",
          duration: 45,
          icon: "⛲",
          title: "日内瓦大喷泉",
          description: "标志性大喷泉，最佳拍照点",
          location: {
            name: "日内瓦大喷泉",
            address: "Jet d'Eau, Geneva",
            coordinates: { lat: 46.2074, lng: 6.1557 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-lunch-geneva",
          time: "12:45",
          duration: 60,
          icon: "🍽️",
          title: "湖畔午餐",
          description: "湖景餐厅，日内瓦湖鱼料理",
          location: {
            name: "日内瓦湖景餐厅",
            address: "Lake Geneva, Geneva",
            coordinates: { lat: 46.2074, lng: 6.1557 }
          },
          category: "餐饮",
          cost: "CHF 35-45/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-old-town",
          time: "13:45",
          duration: 30,
          icon: "🏛️",
          title: "日内瓦老城区",
          description: "圣彼得大教堂外观，石板老街",
          location: {
            name: "日内瓦老城区",
            address: "Old Town, Geneva",
            coordinates: { lat: 46.2022, lng: 6.1457 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-back-airport",
          time: "14:15",
          duration: 15,
          icon: "🚂",
          title: "返回机场",
          description: "取行李返回机场",
          location: {
            name: "日内瓦Cornavin中央站",
            address: "Gare de Genève-Cornavin",
            coordinates: { lat: 46.2100, lng: 6.1420 }
          },
          destination: {
            name: "日内瓦机场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "CHF 3.6/人",
          route: {
            distance: "5公里",
            time: "6分钟",
            steps: ["机场快线"],
            notes: "前往机场乘机"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day4-checkin-flight",
          time: "14:30",
          duration: 35,
          icon: "✈️",
          title: "机场办票+安检",
          description: "提前35分钟办理登机手续",
          location: {
            name: "日内瓦机场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-wait-boarding",
          time: "15:05",
          duration: 15,
          icon: "⏳",
          title: "候机+登机",
          description: "登机口通常提前30分钟开放",
          location: {
            name: "日内瓦机场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-flight-nice",
          time: "15:20",
          duration: 65,
          icon: "✈️",
          title: "日内瓦→尼斯航班",
          description: "EasyJet U21399，1小时5分短途航班",
          location: {
            name: "日内瓦机场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          destination: {
            name: "尼斯蔚蓝海岸机场",
            address: "Nice Côte d'Azur Airport",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          category: "交通",
          cost: "机票已预订",
          important: true,
          route: {
            distance: "450公里",
            time: "1小时5分",
            steps: ["EasyJet U21399"],
            notes: "欧盟内航班，安检相对快速"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day4-bus-nice",
          time: "16:25",
          duration: 50,
          icon: "🚌",
          title: "尼斯机场→市区",
          description: "Bus 98或99到市中心",
          location: {
            name: "尼斯蔚蓝海岸机场",
            address: "Nice Côte d'Azur Airport",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          destination: {
            name: "尼斯市中心",
            address: "Nice City Center",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "交通",
          cost: "€1.7/人",
          route: {
            distance: "8公里",
            time: "50分钟",
            steps: ["Bus 98/99"],
            notes: "前往酒店"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day4-checkin-nice",
          time: "17:15",
          duration: 30,
          icon: "🏨",
          title: "酒店入住",
          description: "Holiday Nice Studio入住",
          location: {
            name: "Holiday Nice Studio",
            address: "18 Rue Lamartine, 06000 Nice",
            coordinates: { lat: 43.7000, lng: 7.2667 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-beach-sunset",
          time: "17:45",
          duration: 75,
          icon: "🏖️",
          title: "尼斯海滩漫步+日落",
          description: "天使湾海滩，地中海日落",
          location: {
            name: "天使湾海滩",
            address: "Baie des Anges, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day4-dinner-nice",
          time: "19:00",
          duration: 90,
          icon: "🍽️",
          title: "尼斯老城晚餐",
          description: "尼斯传统菜，普罗旺斯风味",
          location: {
            name: "尼斯老城区",
            address: "Old Town, Nice",
            coordinates: { lat: 43.6958, lng: 7.2764 }
          },
          category: "餐饮",
          cost: "€25-35/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "590公里",
        totalTime: "1.5小时自驾+1小时飞行",
        steps: [
          {
            from: "Hotel Rosengärtli",
            to: "日内瓦机场",
            transport: "自驾",
            distance: "140km",
            time: "1h30m",
            route: "A6→A1",
            details: "还车前加满油"
          },
          {
            from: "日内瓦机场",
            to: "尼斯机场",
            transport: "飞机",
            distance: "450km",
            time: "1h05m",
            route: "EasyJet U21399",
            details: "欧盟内短途航班"
          }
        ]
      }
    },
    // 第5天：尼斯市内深度游
    {
      day: 5,
      date: "2026-04-28",
      title: "尼斯市内深度游",
      city: "尼斯",
      color: "#ff2d55",
      summary: "🌅 天使湾日出 | 🏰 城堡山 | 🛍️ 老城市场 | 🌊 英国人漫步大道",
      tags: ["日出", "城堡", "老城", "海滨", "购物"],
      overview: {
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "步行",
          details: "尼斯市区步行游览",
          cost: "步行免费"
        },
        importantNotes: [
          "城堡山电梯€1.2或步行20分钟登顶",
          "萨雷亚市场注意开放时间（上午）",
          "内格雷斯科酒店下午茶需提前预约"
        ]
      },
      timeline: [
        {
          id: "day5-sunrise",
          time: "07:30",
          duration: 60,
          icon: "🌅",
          title: "天使湾日出拍摄",
          description: "07:15日出，金色海岸线拍摄",
          location: {
            name: "天使湾海滩",
            address: "Baie des Anges, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "摄影",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-breakfast",
          time: "08:30",
          duration: 60,
          icon: "🍽️",
          title: "法式早餐",
          description: "可颂+咖啡，海滨咖啡厅",
          location: {
            name: "海滨咖啡厅",
            address: "Promenade des Anglais, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "餐饮",
          cost: "€8-12/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-castle-hill",
          time: "09:30",
          duration: 90,
          icon: "🏰",
          title: "城堡山登顶",
          description: "步行+电梯，360度俯瞰蔚蓝海岸",
          location: {
            name: "城堡山",
            address: "Colline du Château, Nice",
            coordinates: { lat: 43.6955, lng: 7.2775 }
          },
          category: "景点",
          cost: "电梯€1.2/人",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-castle-park",
          time: "11:00",
          duration: 60,
          icon: "🌳",
          title: "城堡山公园+瀑布",
          description: "地中海植物园，考古遗迹",
          location: {
            name: "城堡山公园",
            address: "Parc de la Colline du Château, Nice",
            coordinates: { lat: 43.6955, lng: 7.2775 }
          },
          category: "公园",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-lunch-oldtown",
          time: "12:00",
          duration: 60,
          icon: "🍽️",
          title: "老城午餐",
          description: "尼斯沙拉+Socca鹰嘴豆饼",
          location: {
            name: "尼斯老城区",
            address: "Old Town, Nice",
            coordinates: { lat: 43.6958, lng: 7.2764 }
          },
          category: "餐饮",
          cost: "€15-25/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-market",
          time: "13:00",
          duration: 90,
          icon: "🛍️",
          title: "萨雷亚市场+老城",
          description: "普罗旺斯香料，手工皂",
          location: {
            name: "萨雷亚市场",
            address: "Cours Saleya, Nice",
            coordinates: { lat: 43.6958, lng: 7.2764 }
          },
          category: "购物",
          cost: "€10-20购物",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-massena",
          time: "14:30",
          duration: 30,
          icon: "⛲",
          title: "马塞纳广场",
          description: "尼斯市中心，喷泉雕塑",
          location: {
            name: "马塞纳广场",
            address: "Place Masséna, Nice",
            coordinates: { lat: 43.6959, lng: 7.2707 }
          },
          category: "广场",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-promenade",
          time: "15:00",
          duration: 150,
          icon: "🌊",
          title: "英国人漫步大道",
          description: "7km海滨大道，蓝椅拍照",
          location: {
            name: "英国人漫步大道",
            address: "Promenade des Anglais, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "海滨",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-negresco",
          time: "17:30",
          duration: 60,
          icon: "🏨",
          title: "内格雷斯科酒店下午茶",
          description: "百年奢华酒店，粉色圆顶",
          location: {
            name: "内格雷斯科酒店",
            address: "37 Promenade des Anglais, Nice",
            coordinates: { lat: 43.6944, lng: 7.2639 }
          },
          category: "餐饮",
          cost: "€25-35/人",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-beach-sunset",
          time: "18:30",
          duration: 90,
          icon: "🏖️",
          title: "海滩休闲时光",
          description: "鹅卵石海滩，地中海日落",
          location: {
            name: "天使湾海滩",
            address: "Baie des Anges, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day5-dinner-seafood",
          time: "20:00",
          duration: 90,
          icon: "🍽️",
          title: "老城晚餐",
          description: "法式海鲜，配普罗旺斯玫瑰酒",
          location: {
            name: "尼斯老城区餐厅",
            address: "Old Town, Nice",
            coordinates: { lat: 43.6958, lng: 7.2764 }
          },
          category: "餐饮",
          cost: "€40-60/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "10公里步行",
        totalTime: "全天步行游览",
        steps: [
          {
            from: "天使湾",
            to: "城堡山",
            transport: "步行",
            distance: "1km",
            time: "15m",
            route: "沿海滨步行",
            details: "登顶观景"
          },
          {
            from: "城堡山",
            to: "老城区",
            transport: "步行",
            distance: "0.5km",
            time: "10m",
            route: "下山步道",
            details: "前往老城"
          },
          {
            from: "老城区",
            to: "英国人漫步大道",
            transport: "步行",
            distance: "2km",
            time: "25m",
            route: "沿海岸线",
            details: "海滨散步"
          }
        ]
      }
    },
    // 第6天：埃兹村+摩纳哥一日游
    {
      day: 6,
      date: "2026-04-29",
      title: "埃兹村+摩纳哥一日游",
      city: "尼斯",
      color: "#ff2d55",
      summary: "🚌 埃兹中世纪村 | 🏎️ 摩纳哥F1赛道 | 🏰 蒙特卡洛赌场 | ⛵ 摩纳哥港口",
      tags: ["埃兹", "摩纳哥", "赌场", "F1赛道", "悬崖小镇"],
      overview: {
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "公交",
          details: "尼斯→埃兹82路公交，埃兹→摩纳哥82路换乘，摩纳哥→尼斯100路公交",
          cost: "€1.70/段"
        },
        importantNotes: [
          "关键信息：82路公交15分钟一班，末班车19:30",
          "起点：Nice Gare Routière，终点：Èze Village",
          "摩纳哥王宫卫兵换岗11:55（可能会错过）"
        ]
      },
      timeline: [
        {
          id: "day6-breakfast",
          time: "08:00",
          duration: 30,
          icon: "🍽️",
          title: "住宿早餐",
          description: "简单早餐，准备一日游",
          location: {
            name: "Holiday Nice Studio",
            address: "18 Rue Lamartine, 06000 Nice",
            coordinates: { lat: 43.7000, lng: 7.2667 }
          },
          category: "餐饮",
          cost: "自理",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-bus-eze",
          time: "08:30",
          duration: 30,
          icon: "🚌",
          title: "尼斯→埃兹村",
          description: "公交82路，25分钟，€1.70，08:30发车，上车买票",
          location: {
            name: "Nice Gare Routière",
            address: "Nice Bus Station",
            coordinates: { lat: 43.7030, lng: 7.2660 }
          },
          destination: {
            name: "Èze Village",
            address: "Èze, France",
            coordinates: { lat: 43.7272, lng: 7.3619 }
          },
          category: "交通",
          cost: "€1.70/人",
          route: {
            distance: "8公里",
            time: "25分钟",
            steps: ["82路公交沿海公路"],
            notes: "15分钟一班，末班车19:30"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day6-eze-village",
          time: "09:00",
          duration: 150,
          icon: "🏰",
          title: "埃兹村中世纪探秘",
          description: "悬崖花园+石头小巷，€6门票",
          location: {
            name: "埃兹村",
            address: "Èze Village, France",
            coordinates: { lat: 43.7272, lng: 7.3619 }
          },
          category: "景点",
          cost: "€6/人",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-bus-monaco",
          time: "11:30",
          duration: 30,
          icon: "🚌",
          title: "埃兹村→摩纳哥",
          description: "公交82路，20分钟，下行至Èze Bord de Mer换乘，€1.70",
          location: {
            name: "Èze Village",
            address: "Èze, France",
            coordinates: { lat: 43.7272, lng: 7.3619 }
          },
          destination: {
            name: "Monaco Monte-Carlo",
            address: "Monte Carlo, Monaco",
            coordinates: { lat: 43.7384, lng: 7.4246 }
          },
          category: "交通",
          cost: "€1.70/人",
          route: {
            distance: "12公里",
            time: "20分钟",
            steps: ["82路公交沿海公路"],
            notes: "需在Èze Bord de Mer换乘"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day6-monaco-casino",
          time: "12:00",
          duration: 60,
          icon: "🎰",
          title: "蒙特卡洛赌场",
          description: "外观+内部参观，着装要求，€10门票",
          location: {
            name: "蒙特卡洛赌场",
            address: "Place du Casino, 98000 Monaco",
            coordinates: { lat: 43.7396, lng: 7.4279 }
          },
          category: "景点",
          cost: "€10/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-lunch-monaco",
          time: "13:00",
          duration: 60,
          icon: "🍽️",
          title: "摩纳哥午餐",
          description: "港口区餐厅，豪华游艇景观",
          location: {
            name: "摩纳哥港口区",
            address: "Port de Monaco, Monaco",
            coordinates: { lat: 43.7347, lng: 7.4210 }
          },
          category: "餐饮",
          cost: "€30-45/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-monaco-palace",
          time: "14:00",
          duration: 90,
          icon: "🏰",
          title: "摩纳哥王宫+卫兵换岗",
          description: "王宫参观，卫兵换岗仪式（11:55已错过），€10门票",
          location: {
            name: "摩纳哥王宫",
            address: "Palais Princier de Monaco",
            coordinates: { lat: 43.7314, lng: 7.4194 }
          },
          category: "景点",
          cost: "€10/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-f1-circuit",
          time: "15:30",
          duration: 60,
          icon: "🏎️",
          title: "F1赛道体验",
          description: "沿海公路，著名弯道拍照",
          location: {
            name: "摩纳哥F1赛道",
            address: "Circuit de Monaco",
            coordinates: { lat: 43.7347, lng: 7.4210 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-monaco-port",
          time: "16:30",
          duration: 60,
          icon: "⛵",
          title: "摩纳哥港口+游艇",
          description: "奢华生活体验，超跑拍照",
          location: {
            name: "摩纳哥港口",
            address: "Port de Monaco, Monaco",
            coordinates: { lat: 43.7347, lng: 7.4210 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-bus-nice",
          time: "17:30",
          duration: 45,
          icon: "🚌",
          title: "摩纳哥→尼斯",
          description: "公交100路，45分钟，沿海公路返程，海景，€1.70",
          location: {
            name: "Monaco Monte-Carlo",
            address: "Monte Carlo, Monaco",
            coordinates: { lat: 43.7384, lng: 7.4246 }
          },
          destination: {
            name: "Nice Port Lympia",
            address: "Port Lympia, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "交通",
          cost: "€1.70/人",
          route: {
            distance: "20公里",
            time: "45分钟",
            steps: ["100路公交沿海公路"],
            notes: "20分钟一班，欣赏海景"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day6-dinner-nice",
          time: "18:15",
          duration: 75,
          icon: "🍽️",
          title: "尼斯老城晚餐",
          description: "普罗旺斯炖菜，当地红酒",
          location: {
            name: "尼斯老城区",
            address: "Old Town, Nice",
            coordinates: { lat: 43.6958, lng: 7.2764 }
          },
          category: "餐饮",
          cost: "€35-50/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day6-beach-night",
          time: "19:30",
          duration: 90,
          icon: "🏖️",
          title: "海滨夜景漫步",
          description: "夜色下的天使湾",
          location: {
            name: "天使湾海滩",
            address: "Baie des Anges, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "60公里",
        totalTime: "2小时公交",
        steps: [
          {
            from: "尼斯市区",
            to: "埃兹村",
            transport: "公交82路",
            distance: "8km",
            time: "25m",
            route: "沿海公路",
            details: "15分钟一班，€1.70"
          },
          {
            from: "埃兹村",
            to: "摩纳哥",
            transport: "公交82路",
            distance: "12km",
            time: "20m",
            route: "沿海公路，需换乘",
            details: "€1.70，在Èze Bord de Mer换乘"
          },
          {
            from: "摩纳哥",
            to: "尼斯",
            transport: "公交100路",
            distance: "20km",
            time: "45m",
            route: "沿海公路",
            details: "20分钟一班，€1.70，欣赏海景"
          }
        ]
      }
    },
    // 第7天：尼斯周边+整理
    {
      day: 7,
      date: "2026-04-30",
      title: "尼斯周边+整理",
      city: "尼斯",
      color: "#ff2d55",
      summary: "🚄 安提布一日游 | 🛍️ 购物+纪念品 | 🖼️ 马蒂斯博物馆 | 🍽️ 告别尼斯晚餐",
      tags: ["安提布", "购物", "博物馆", "告别晚餐"],
      overview: {
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "火车+公交",
          details: "尼斯→安提布火车往返，尼斯市区公交",
          cost: "€4.10/段火车，€1.70公交"
        },
        importantNotes: [
          "安提布毕加索博物馆€4.10门票",
          "马蒂斯博物馆€10门票",
          "明日飞往巴黎，今晚整理行李"
        ]
      },
      timeline: [
        {
          id: "day7-breakfast",
          time: "09:00",
          duration: 30,
          icon: "🍽️",
          title: "住宿早餐",
          description: "轻松节奏，不赶行程",
          location: {
            name: "Holiday Nice Studio",
            address: "18 Rue Lamartine, 06000 Nice",
            coordinates: { lat: 43.7000, lng: 7.2667 }
          },
          category: "餐饮",
          cost: "自理",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-train-antibes",
          time: "09:30",
          duration: 30,
          icon: "🚄",
          title: "前往安提布",
          description: "火车前往安提布老城",
          location: {
            name: "Nice Ville Station",
            address: "Gare de Nice-Ville",
            coordinates: { lat: 43.7042, lng: 7.2620 }
          },
          destination: {
            name: "Antibes Station",
            address: "Gare d'Antibes",
            coordinates: { lat: 43.5808, lng: 7.1239 }
          },
          category: "交通",
          cost: "€4.10/人",
          route: {
            distance: "20公里",
            time: "20分钟",
            steps: ["沿海铁路"],
            notes: "欣赏沿海铁路风景"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day7-antibes-oldtown",
          time: "10:00",
          duration: 120,
          icon: "🏛️",
          title: "安提布老城",
          description: "毕加索博物馆，地中海艺术",
          location: {
            name: "安提布老城",
            address: "Old Town Antibes",
            coordinates: { lat: 43.5808, lng: 7.1239 }
          },
          category: "景点",
          cost: "€4.10/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-antibes-cape",
          time: "12:00",
          duration: 90,
          icon: "🌊",
          title: "安提布海角",
          description: "奢华别墅区，海岸步道",
          location: {
            name: "安提布海角",
            address: "Cap d'Antibes",
            coordinates: { lat: 43.5514, lng: 7.1308 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-lunch-seafood",
          time: "13:30",
          duration: 60,
          icon: "🍽️",
          title: "海鲜午餐",
          description: "渔港餐厅，新鲜海胆",
          location: {
            name: "安提布渔港",
            address: "Port Vauban, Antibes",
            coordinates: { lat: 43.5808, lng: 7.1239 }
          },
          category: "餐饮",
          cost: "€25-35/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-return-nice",
          time: "14:30",
          duration: 15,
          icon: "🚄",
          title: "返回尼斯",
          description: "火车返回尼斯",
          location: {
            name: "Antibes Station",
            address: "Gare d'Antibes",
            coordinates: { lat: 43.5808, lng: 7.1239 }
          },
          destination: {
            name: "Nice Ville Station",
            address: "Gare de Nice-Ville",
            coordinates: { lat: 43.7042, lng: 7.2620 }
          },
          category: "交通",
          cost: "€4.10/人",
          route: {
            distance: "20公里",
            time: "15分钟",
            steps: ["沿海铁路"],
            notes: "返回尼斯市区"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day7-shopping",
          time: "14:45",
          duration: 105,
          icon: "🛍️",
          title: "购物+纪念品",
          description: "普罗旺斯薰衣草制品",
          location: {
            name: "尼斯购物区",
            address: "Shopping Area, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "购物",
          cost: "€50-100购物",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-matisse",
          time: "16:30",
          duration: 90,
          icon: "🖼️",
          title: "马蒂斯博物馆",
          description: "20世纪艺术大师作品",
          location: {
            name: "马蒂斯博物馆",
            address: "Musée Matisse, Nice",
            coordinates: { lat: 43.7202, lng: 7.2760 }
          },
          category: "博物馆",
          cost: "€10/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-return-pack",
          time: "18:00",
          duration: 60,
          icon: "🧳",
          title: "返回住宿整理行李",
          description: "公交返回住宿，明日飞巴黎准备",
          location: {
            name: "马蒂斯博物馆",
            address: "Musée Matisse, Nice",
            coordinates: { lat: 43.7202, lng: 7.2760 }
          },
          destination: {
            name: "Holiday Nice Studio",
            address: "18 Rue Lamartine, 06000 Nice",
            coordinates: { lat: 43.7000, lng: 7.2667 }
          },
          category: "交通",
          cost: "€1.70/人",
          route: {
            distance: "3公里",
            time: "15分钟",
            steps: ["市区公交"],
            notes: "整理行李准备明日飞行"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day7-farewell-dinner",
          time: "19:00",
          duration: 120,
          icon: "🍽️",
          title: "告别尼斯晚餐",
          description: "米其林推荐餐厅，法式精致料理",
          location: {
            name: "尼斯高级餐厅",
            address: "Nice Restaurant",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "餐饮",
          cost: "€45-65/人",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day7-beach-farewell",
          time: "21:00",
          duration: 90,
          icon: "🌅",
          title: "海滨告别散步",
          description: "最后的地中海日落",
          location: {
            name: "天使湾海滩",
            address: "Baie des Anges, Nice",
            coordinates: { lat: 43.6951, lng: 7.2769 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "46公里",
        totalTime: "1小时火车+公交",
        steps: [
          {
            from: "尼斯",
            to: "安提布",
            transport: "火车",
            distance: "20km",
            time: "20m",
            route: "沿海铁路",
            details: "€4.10单程"
          },
          {
            from: "安提布",
            to: "尼斯",
            transport: "火车",
            distance: "20km",
            time: "15m",
            route: "沿海铁路",
            details: "€4.10单程"
          },
          {
            from: "马蒂斯博物馆",
            to: "住宿",
            transport: "公交",
            distance: "3km",
            time: "15m",
            route: "市区公交",
            details: "€1.70"
          }
        ]
      }
    },
    // 第8天：尼斯→巴黎（续）
    {
      day: 8,
      date: "2026-05-01",
      title: "尼斯→巴黎（续）",
      city: "巴黎",
      color: "#ff3b30",
      summary: "✈️ 飞往巴黎 | 🏨 Studio opéra paris | 🏛️ 歌剧院区初探",
      tags: ["飞行", "抵达", "巴黎", "歌剧院", "购物"],
      overview: {
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "14:00-20:00",
          checkout: "11:00前",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "飞机+公共交通",
          details: "尼斯→巴黎奥利 EasyJet U21633，OrlyBus+地铁到市区",
          company: "EasyJet",
          flight: "U21633",
          duration: "1小时30分",
          cost: "机票已预订 €873×2"
        },
        importantNotes: [
          "值机安检建议提前2小时到达机场",
          "奥利机场相对较小，提取行李较快",
          "交通：OrlyBus→Denfert换地铁4号线→1号线→Pyramides站"
        ]
      },
      timeline: [
        {
          id: "day8-checkin",
          time: "09:30",
          duration: 50,
          icon: "✈️",
          title: "值机、安检",
          description: "EasyJet建议提前2小时到达机场",
          location: {
            name: "尼斯蔚蓝海岸机场T2",
            address: "Nice Côte d'Azur Airport, Terminal 2",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          category: "交通",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day8-waiting",
          time: "10:20",
          duration: 10,
          icon: "⏳",
          title: "候机",
          description: "登机口通常提前30分钟开放",
          location: {
            name: "尼斯蔚蓝海岸机场T2",
            address: "Nice Côte d'Azur Airport, Terminal 2",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          category: "交通",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day8-flight",
          time: "10:30",
          duration: 90,
          icon: "✈️",
          title: "尼斯→巴黎奥利",
          description: "EasyJet U21633，1小时30分，T2→T1，€873×2已订机票",
          location: {
            name: "尼斯蔚蓝海岸机场T2",
            address: "Nice Côte d'Azur Airport, Terminal 2",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          destination: {
            name: "巴黎奥利机场T1",
            address: "Paris Orly Airport, Terminal 1",
            coordinates: { lat: 48.7250, lng: 2.3594 }
          },
          category: "交通",
          cost: "机票已预订",
          important: true,
          route: {
            distance: "685公里",
            time: "1小时30分",
            steps: ["EasyJet U21633"],
            notes: "T2→T1航班"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day8-baggage",
          time: "12:00",
          duration: 30,
          icon: "🛄",
          title: "提取行李、出机场",
          description: "奥利机场相对较小",
          location: {
            name: "巴黎奥利机场T1",
            address: "Paris Orly Airport, Terminal 1",
            coordinates: { lat: 48.7250, lng: 2.3594 }
          },
          category: "抵达",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day8-airport-city",
          time: "12:30",
          duration: 75,
          icon: "🚌",
          title: "奥利机场→巴黎市中心",
          description: "OrlyBus→Denfert，换地铁4号线，€8.70",
          location: {
            name: "巴黎奥利机场",
            address: "Paris Orly Airport",
            coordinates: { lat: 48.7250, lng: 2.3594 }
          },
          destination: {
            name: "巴黎市中心",
            address: "Paris City Center",
            coordinates: { lat: 48.8566, lng: 2.3522 }
          },
          category: "交通",
          cost: "€8.70/人",
          route: {
            distance: "15公里",
            time: "1小时15分",
            steps: ["OrlyBus", "地铁4号线"],
            notes: "OrlyBus→Denfert换乘"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day8-to-hotel",
          time: "13:45",
          duration: 30,
          icon: "🚇",
          title: "前往酒店",
          description: "4号线→1号线→Pyramides站，€2.15",
          location: {
            name: "Denfert-Rochereau站",
            address: "Denfert-Rochereau, Paris",
            coordinates: { lat: 48.8340, lng: 2.3324 }
          },
          destination: {
            name: "Pyramides站",
            address: "Pyramides, Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "交通",
          cost: "€2.15/人",
          route: {
            distance: "3公里",
            time: "30分钟",
            steps: ["地铁4号线", "地铁1号线"],
            notes: "前往歌剧院区酒店"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day8-checkin-hotel",
          time: "14:15",
          duration: 15,
          icon: "🏨",
          title: "酒店入住",
          description: "Studio opéra paris，22 Avenue de l'Opéra, 75001，步行5分钟",
          location: {
            name: "Studio opéra paris",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "住宿",
          cost: "已预订",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day8-rest-hotel",
          time: "14:30",
          duration: 60,
          icon: "🧳",
          title: "酒店休息、整理",
          description: "熟悉周边环境",
          location: {
            name: "Studio opéra paris",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day8-opera-district",
          time: "15:30",
          duration: 90,
          icon: "🏛️",
          title: "歌剧院区初探",
          description: "巴黎歌剧院、和平咖啡馆",
          location: {
            name: "歌剧院区",
            address: "Opéra District, Paris",
            coordinates: { lat: 48.8719, lng: 2.3319 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day8-galleries",
          time: "17:00",
          duration: 60,
          icon: "🛍️",
          title: "老佛爷/春天百货",
          description: "仅外观，明日购物",
          location: {
            name: "老佛爷百货",
            address: "Galeries Lafayette, Paris",
            coordinates: { lat: 48.8738, lng: 2.3324 }
          },
          category: "购物",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day8-dinner-opera",
          time: "18:00",
          duration: 120,
          icon: "🍽️",
          title: "歌剧区晚餐+散步",
          description: "体验巴黎咖啡文化",
          location: {
            name: "歌剧院区餐厅",
            address: "Opéra District, Paris",
            coordinates: { lat: 48.8719, lng: 2.3319 }
          },
          category: "餐饮",
          cost: "€35-50/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "700公里",
        totalTime: "1.5小时飞行+2小时交通",
        steps: [
          {
            from: "尼斯机场",
            to: "巴黎奥利机场",
            transport: "飞机",
            distance: "685km",
            time: "1h30m",
            route: "EasyJet U21633",
            details: "T2→T1，已订机票"
          },
          {
            from: "巴黎奥利机场",
            to: "巴黎市中心",
            transport: "公共交通",
            distance: "15km",
            time: "1h15m",
            route: "OrlyBus→地铁4号线",
            details: "€8.70"
          }
        ]
      }
    },
    // 第9天：埃兹+摩纳哥（简化）
    {
      day: 9,
      date: "2026-05-02",
      title: "埃兹与摩纳哥",
      city: "埃兹",
      color: "#af52de",
      summary: "🌵 埃兹植物园 | 🏎️ 摩纳哥",
      tags: ["悬崖小镇", "F1赛道", "赌场"],
      overview: {
        accommodation: {
          name: "Hotel Suisse",
          address: "15 Quai Rauba Capeu, 06300 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.6951, lng: 7.2769 }
        },
        transport: {
          type: "火车+公交",
          details: "尼斯→埃兹→摩纳哥→尼斯",
          cost: "€ 15/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day9-eze",
          time: "09:30",
          duration: 180,
          icon: "🌵",
          title: "埃兹小镇",
          description: "游览悬崖小镇，参观植物园",
          location: {
            name: "埃兹",
            address: "Èze, France",
            coordinates: { lat: 43.7272, lng: 7.3619 }
          },
          category: "景点",
          cost: "植物园€ 6/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "40公里",
        totalTime: "1小时车程",
        steps: []
      }
    },
    // 第10天：戛纳（简化）
    {
      day: 10,
      date: "2026-05-03",
      title: "戛纳",
      city: "戛纳",
      color: "#ff9500",
      summary: "🎬 戛纳电影节宫 | 🏖️ 海滨",
      tags: ["电影节", "海滨"],
      overview: {
        accommodation: {
          name: "Hotel Suisse",
          address: "15 Quai Rauba Capeu, 06300 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.6951, lng: 7.2769 }
        },
        transport: {
          type: "火车",
          details: "尼斯→戛纳",
          cost: "€ 10/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day10-cannes",
          time: "10:00",
          duration: 180,
          icon: "🎬",
          title: "戛纳电影节宫",
          description: "参观电影节宫",
          location: {
            name: "戛纳电影节宫",
            address: "Palais des Festivals, Cannes",
            coordinates: { lat: 43.5513, lng: 7.0193 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "32公里",
        totalTime: "30分钟",
        steps: []
      }
    },
    // 第11天：阿维尼翁（简化）
    {
      day: 11,
      date: "2026-05-04",
      title: "普罗旺斯：阿维尼翁",
      city: "阿维尼翁",
      color: "#af52de",
      summary: "🏰 教皇宫 | 🌉 断桥",
      tags: ["历史", "古城", "普罗旺斯"],
      overview: {
        accommodation: {
          name: "Hotel de l'Horloge",
          address: "1 Rue Félicien David, 84000 Avignon",
          checkin: "15:00后",
          checkout: "11:00前",
          coordinates: { lat: 43.9493, lng: 4.8053 }
        },
        transport: {
          type: "火车",
          details: "尼斯→阿维尼翁TGV",
          duration: "3小时",
          cost: "€ 75/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day11-palace",
          time: "14:00",
          duration: 150,
          icon: "🏰",
          title: "教皇宫",
          description: "参观教皇宫殿",
          location: {
            name: "阿维尼翁教皇宫",
            address: "Place du Palais, 84000 Avignon",
            coordinates: { lat: 43.9511, lng: 4.8079 }
          },
          category: "景点",
          cost: "€ 12/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "260公里",
        totalTime: "3小时",
        steps: []
      }
    },
    // 第12天：前往巴黎（简化）
    {
      day: 12,
      date: "2026-05-05",
      title: "前往巴黎",
      city: "巴黎",
      color: "#ff3b30",
      summary: "🚄 阿维尼翁→巴黎 | 🗼 埃菲尔铁塔",
      tags: ["高铁", "转场", "首都"],
      overview: {
        accommodation: {
          name: "Hotel Eiffel Turenne",
          address: "20 Avenue de Tourville, 75007 Paris",
          checkin: "15:00后",
          checkout: "11:00前",
          coordinates: { lat: 48.8550, lng: 2.3050 }
        },
        transport: {
          type: "高铁",
          details: "阿维尼翁→巴黎TGV",
          duration: "2小时40分",
          cost: "€ 85/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day12-eiffel",
          time: "16:00",
          duration: 120,
          icon: "🗼",
          title: "埃菲尔铁塔",
          description: "参观铁塔",
          location: {
            name: "埃菲尔铁塔",
            address: "Champ de Mars, Paris",
            coordinates: { lat: 48.8584, lng: 2.2945 }
          },
          category: "景点",
          cost: "登塔€ 25/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "650公里",
        totalTime: "2小时40分",
        steps: []
      }
    }
  ]
};

/**
 * Utility functions for trip data access
 */
const TripData = {
  /**
   * Get trip metadata
   */
  getTripInfo() {
    return {
      id: tripData.id,
      title: tripData.title,
      duration: tripData.duration,
      dates: tripData.dates,
      cities: tripData.cities
    };
  },

  /**
   * Get all days data
   */
  getAllDays() {
    return tripData.days;
  },

  /**
   * Get specific day data by day number (1-15)
   */
  getDay(dayNumber) {
    const day = tripData.days.find(d => d.day === dayNumber);
    if (!day) {
      throw new Error(`Day ${dayNumber} not found in trip data`);
    }
    return day;
  },

  /**
   * Get current day based on trip dates (simplified - returns day 1 for demo)
   */
  getCurrentDay() {
    // Simplified: always return day 1 for development
    // In production, this would compare with current date
    return this.getDay(1);
  },

  /**
   * Search across all trip data
   */
  search(query) {
    const results = [];
    const searchLower = query.toLowerCase();

    tripData.days.forEach(day => {
      // Search in day title and summary
      if (day.title.toLowerCase().includes(searchLower) ||
          day.summary.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'day',
          day: day.day,
          title: day.title,
          match: 'day title'
        });
      }

      // Search in timeline activities
      day.timeline.forEach(activity => {
        if (activity.title.toLowerCase().includes(searchLower) ||
            activity.description.toLowerCase().includes(searchLower) ||
            (activity.location && activity.location.name.toLowerCase().includes(searchLower))) {
          results.push({
            type: 'activity',
            day: day.day,
            activityId: activity.id,
            title: activity.title,
            time: activity.time,
            match: 'activity'
          });
        }
      });
    });

    return results;
  },

  /**
   * Get activities by category
   */
  getActivitiesByCategory(category) {
    const activities = [];
    tripData.days.forEach(day => {
      day.timeline.forEach(activity => {
        if (activity.category === category) {
          activities.push({
            day: day.day,
            ...activity
          });
        }
      });
    });
    return activities;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { tripData, TripData };
}