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
  meta: {
    sourceDoc: "巴黎12日攻略-最新版.md",
    lastSynced: "2026-04-23"
  },
  flightsSummary: [
    "4/24 上海浦东T2 → 维也纳T3 | OS016 | 09:30-15:55",
    "4/24 维也纳T3 → 苏黎世 | OS145 | 18:40-20:00",
    "4/27 日内瓦T1 → 尼斯T2 | easyJet U21399 | 15:20-16:25",
    "5/1 尼斯T2 → 巴黎奥利T1 | easyJet U21633 | 10:30-12:00",
    "5/5 巴黎戴高乐T1 → 法兰克福T1 | LH1029 | 10:35-11:50",
    "5/5 法兰克福T1 → 上海浦东T2 | LH728 | 15:40-09:15+1"
  ],
  days: [
    // 第1天：原始数据
    {
      day: 1,
      date: "2026-04-24",
      title: "抵达苏黎世",
      city: "苏黎世",
      color: "#30d158",
      locationContext: "瑞士 苏黎世（市中心/车站周边）",
      summary: "✈️ 上海→维也纳→苏黎世 | 🏨 ibis Styles Zurich",
      tags: ["飞行", "抵达", "酒店"],
      overview: {
        scheduleHint: "20:30–20:40 机场火车站上车 → S2/S24 → 约 20:45 到 Zürich HB（SBB Mobile 查当日最近一班）。",
        accommodation: {
          name: "ibis Styles Zurich City Center",
          address: "Stampfenbachstrasse 60, 8006 Zurich",
          checkin: "15:00-23:00",
          checkout: "12:00前",
          bookingRef: "2604240606",
          coordinates: { lat: 47.3782, lng: 8.5390 }
        },
        transport: {
          type: "飞机",
          details: "奥地利航空OS016 + OS145联程",
          airline: "Austrian Airlines",
          duration: "约13小时30分（含转机1小时45分）"
        },
        climate: {
          temp: "苏黎世日间约14-17°C，夜间约4-7°C",
          weather: "春季多变，阵雨常见",
          clothing: "洋葱式叠穿；防风防水薄外套；舒适步行鞋"
        },
        importantNotes: [
          "维也纳转机时间约1小时45分，注意登机口与衔接",
          "苏黎世机场站→Zürich HB 约 10–12 分钟，票价以购票时为准（约 CHF 6.80 市区段）",
          "酒店入住 15:00-23:00，提前到达可询前台寄存"
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
          duration: 105,
          icon: "🔄",
          title: "维也纳转机",
          description: "转机时间约1小时45分，无需取行李",
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
          transit: [
            { line: "S2/S24（往Zürich HB方向）", boarding: "Zürich Flughafen", alighting: "Zürich HB", stops: "约1次（常见经停Zürich Oerlikon）", payment: "SBB Mobile / 售票机 / 柜台；约CHF 6.80（二等座市区段）" }
          ],
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
      title: "取车直达因特拉肯",
      city: "因特拉肯",
      color: "#ff9500",
      locationContext: "苏黎世机场取车 → 自驾 → 因特拉肯 / Leissigen（图恩湖区）",
      summary: "🚗 取车自驾 | 🏔️ 图恩湖畔 | 🏨 Hotel Rosengärtli",
      tags: ["自驾", "酒店", "湖泊"],
      overview: {
        scheduleHint: "08:00–08:10 抵达 Zürich HB 站台 → 乘往机场 S2/S16/S24，08:20 前到 Zürich Flughafen。",
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Hauptstrasse 73, 3706 Leissigen",
          checkin: "14:00-20:00",
          checkout: "11:00前",
          bookingRef: "6574630467",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾租车",
          details: "Europcar 苏黎世机场 Parking 3 取车",
          company: "Europcar",
          bookingRef: "1159263500",
          cost: "CHF 1066"
        },
        climate: {
          temp: "苏黎世日间约14-17°C；湖区日间约12-18°C，夜间约2-8°C",
          weather: "湖风偏大，山区晴雨快变",
          clothing: "薄羽绒/抓绒；防风外套；舒适步行鞋；注意防晒"
        },
        importantNotes: [
          "取车点：Europcar Parking 3，提前备好护照、驾照、认证件、信用卡；全面验车拍照",
          "满油还车；瑞士高速通行含在租车/年票方案内，以合约为准",
          "山区与湖区弯多，控速、不疲劳驾驶"
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
          transit: [
            { line: "S2/S16/S24（往机场方向）", boarding: "Zürich HB", alighting: "Zürich Flughafen", stops: "约1次（常见经停Zürich Oerlikon）", payment: "SBB Mobile / 售票机；约CHF 6.80" }
          ],
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
          id: "day2-lake-walk",
          time: "15:30",
          duration: 90,
          icon: "🚶",
          title: "图恩湖畔漫步",
          description: "熟悉环境，欣赏阿尔卑斯与湖景",
          location: {
            name: "图恩湖（Leissigen 沿岸）",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "休闲",
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
          title: "因特拉肯小镇",
          description: "驾车约15分钟；何维克街购物，向跳伞基地确认明日集合与天气",
          location: {
            name: "因特拉肯市中心",
            address: "Interlaken, Switzerland",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "购物",
          cost: "停车约 CHF 5",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
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
      locationContext: "因特拉肯（跳伞）→ 厄希嫩湖徒步 → 施皮茨",
      summary: "🪂 直升机跳伞 | 🏞️ 厄希嫩湖徒步 | 🏰 施皮茨城堡日落",
      tags: ["跳伞", "徒步", "城堡", "冒险"],
      overview: {
        scheduleHint: "无固定班车主导行程；07:45 前自驾从酒店出发可从容衔接 09:00 跳伞集合。",
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Hauptstrasse 73, 3706 Leissigen",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾",
          details: "因特拉肯、厄希嫩湖、施皮茨间自驾",
          cost: "油费约CHF 15"
        },
        climate: {
          temp: "谷地日间约12-18°C，夜间约2-8°C；清晨跳伞前约5-10°C或更低",
          weather: "山区晴雨快变，厄希嫩湖比城区低约3-6°C",
          clothing: "防风外套、薄手套、遮阳帽；背包雨披；跳伞前加厚"
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
      locationContext: "因特拉肯 → 日内瓦机场还车 → 日内瓦市区短停 → 飞尼斯 → 英格大道/Rue Lamartine 住宿区",
      summary: "🚗 还车+日内瓦游览 | ✈️ 飞往尼斯 | 🏖️ 天使湾日落",
      tags: ["还车", "日内瓦", "飞行", "尼斯", "海滩"],
      overview: {
        scheduleHint: "还车后 10:45–10:50 上机场→市郊列车，11:00 前可开始市区游览；离境赴机场列车建议 14:18–14:22 从 Cornavin 发车。抵尼斯后 T2 建议 16:40–16:50 到 Grand Arénas 站。",
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "16:00-22:00",
          checkout: "11:00前",
          bookingRef: "6621102123",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "自驾+飞机+轨交",
          details: "因特拉肯→日内瓦机场还车；EasyJet 日内瓦→尼斯；抵机场后 T2 至 Jean Médecin",
          company: "EasyJet",
          flight: "U21399",
          duration: "1小时5分",
          cost: "机票已预订"
        },
        climate: {
          temp: "日内瓦日间约15-18°C，夜间约6-9°C；尼斯日间约17-21°C，夜间约10-14°C",
          weather: "日内瓦湖区偶阵雨；尼斯日照偏多，海风偏凉",
          clothing: "日内瓦同苏黎世+折叠伞；抵尼斯后加薄长袖+薄外套"
        },
        hikingRoute: "到住宿当晚若体力允许：「18 Rue Lamartine」→ Jean Médecin（约8分钟）→ Place Masséna（约12分钟）→ Promenade du Paillon（约10分钟）→ Cours Saleya（约8分钟）→ 英国人大道（约20分钟）→ 歌剧院/老城方向可乘 Tram L2 回 Jean Médecin，再步行回酒店。约 4–6 km / 1.5–2.5h。",
        importantNotes: [
          "还车：日内瓦机场 Europcar，满油、Parking P51，与工作人员共验车",
          "机场↔市郊铁路 Cornavin 约 6 分钟、约 CHF 3.60（以购票时为准）",
          "尼斯的机场衔接：T1/T2 按标识至 Grand Arénas 乘 Ligne T2 至 Jean Médecin 再步行至公寓（比公交绕路更少步行）"
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
          transit: [
            { line: "Léman Express S线/RegioExpress（往市中心方向）", boarding: "Genève-Aéroport", alighting: "Genève-Cornavin", stops: "多数车次0次（直达约6分钟）", payment: "SBB Mobile / 车站售票机 / 柜台；约CHF 3.60" }
          ],
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
          icon: "🚊",
          title: "尼斯机场→市区（T2）",
          description: "抵达后按 Tram 标识至 Grand Arénas 乘 T2，少步行优先",
          transit: [
            { line: "有轨电车T2（往 Jean Médecin / Port Lympia 方向，以屏幕为准）", boarding: "Grand Arénas", alighting: "Jean Médecin", stops: "约10-12次经停", payment: "Lignes d'Azur 卡/App/上车购票；单次约€1.70（以当年票价为准）" }
          ],
          location: {
            name: "尼斯蔚蓝海岸机场",
            address: "Nice Côte d'Azur Airport",
            coordinates: { lat: 43.6584, lng: 7.2159 }
          },
          destination: {
            name: "Jean Médecin 站附近",
            address: "步行至 18 Rue Lamartine 约5-8分钟",
            coordinates: { lat: 43.6951, lng: 7.2667 }
          },
          category: "交通",
          cost: "约€1.7/人",
          route: {
            distance: "约8公里",
            time: "约25-35分钟",
            steps: ["机场连廊/摆渡车→Grand Arénas", "T2→Jean Médecin"],
            notes: "Jean Médecin 下车步行到住宿"
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
      locationContext: "法国 尼斯：天使湾、城堡山、萨雷亚市场、英国人大道",
      summary: "🌅 天使湾日出 | 🏰 城堡山 | 🛍️ 老城市场 | 🌊 英国人漫步大道",
      tags: ["日出", "城堡", "老城", "海滨", "购物"],
      overview: {
        scheduleHint: "以步行与市内公交为主，无固定班次；公交约 10–15 分钟一班。",
        hikingRoute: "酒店 → Place Masséna → Cours Saleya → 城堡山（上）→ 从港口侧下山到 Port Lympia → 沿海到 Negresco 一带 → 可乘 Tram L2 回 Jean Médecin 收尾。约 8–10 km，4–6 小时含拍照。",
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6621102123",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "步行+轨交/公交",
          details: "尼斯市区步行与公交衔接",
          cost: "按次票/日票"
        },
        climate: {
          temp: "日间约17-21°C，夜间约10-14°C；清晨看日出体感可略低于10°C",
          weather: "日照偏多，海风偏凉；偶有阵雨",
          clothing: "轻薄长袖+薄开衫；海边加防风；舒适鞋"
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
      locationContext: "尼斯 → 埃兹山顶村（Èze Village）→ 摩纳哥 → 返尼斯",
      summary: "🚌 埃兹中世纪村 | 🏎️ 摩纳哥F1赛道 | 🏰 蒙特卡洛赌场 | ⛵ 摩纳哥港口",
      tags: ["埃兹", "摩纳哥", "赌场", "F1赛道", "悬崖小镇"],
      overview: {
        scheduleHint: "08:30 前到 Jean Médecin 乘 T2；08:45–08:50 在 Parc Phoenix 衔接 82 路；返城 100 路注意末班，以 Lignes d'Azur 当日时刻为准。",
        hikingRoute: "Jean Médecin (T2) → Parc Phoenix（转 82）→ Èze Village；Èze Gare（82 下山）→ Monte-Carlo Casino（100）→ 王宫/港口/赛道顺时针步行；返 Port Lympia 后 Tram L2 回 Jean Médecin。城市步行约 7–9 km（不含公交段）。",
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6621102123",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "公交",
          details: "尼斯→埃兹82路公交，埃兹→摩纳哥82路换乘，摩纳哥→尼斯100路公交",
          cost: "€1.70/段"
        },
        climate: {
          temp: "尼斯/摩纳哥一带日间约17-21°C，夜间约10-14°C",
          weather: "海岸公路风大，体感可再低2-4°C",
          clothing: "薄风衣/开衫；赌场入内宜整洁长裤/有领上衣"
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
          transit: [
            { line: "有轨电车T2", boarding: "Jean Médecin", alighting: "Parc Phoenix", stops: "约2-3次", payment: "Lignes d'Azur交通卡/App；约€1.70" },
            { line: "Bus 82", boarding: "Parc Phoenix", alighting: "Èze Village", stops: "约6-10次", payment: "同上；约€1.70（与T2是否合并计费以当地规则为准）" }
          ],
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
          transit: [
            { line: "Bus 82（下行）", boarding: "Èze Village", alighting: "Èze Gare SNCF", stops: "约1-3次（山路弯多）" },
            { line: "Bus 100", boarding: "Èze Gare SNCF", alighting: "Monte-Carlo Casino", stops: "沿海经停约4-8次", payment: "同上；每段约€1.70-2.50" }
          ],
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
          transit: [
            { line: "Bus 100（往尼斯方向）", boarding: "Monte-Carlo Casino", alighting: "Port Lympia", stops: "沿途经停约15-25次", payment: "上车购票/App/交通卡；约€1.70-2.50" }
          ],
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
      title: "昂蒂布+戛纳+马蒂斯",
      city: "尼斯",
      color: "#ff2d55",
      locationContext: "尼斯 → 昂蒂布（加鲁普海滩）→ 戛纳 → 返尼斯 → Cimiez 马蒂斯博物馆",
      summary: "🚄 TER 昂蒂布+戛纳 | 🖼️ 马蒂斯博物馆 | 🍽️ 告别晚餐",
      tags: ["安提布", "购物", "博物馆", "告别晚餐", "戛纳"],
      overview: {
        scheduleHint: "TER: Nice–Antibes 约 09:30–09:45；Antibes–Cannes 13:40–13:55；Cannes–Nice 16:45–17:00；上 Cimiez 可乘 Bus 17 约 17:30–17:40 从 Jean Médecin 出发。",
        hikingRoute: "昂蒂布老城/港口与加鲁普海滩为单向动线；戛纳 Suquet / Croisette 步行打卡后乘 TER 返尼斯；Cimiez 在山坡，全天步行约 10–14 km。",
        accommodation: {
          name: "Holiday Nice Studio",
          address: "18 Rue Lamartine, 06000 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6621102123",
          coordinates: { lat: 43.7000, lng: 7.2667 }
        },
        transport: {
          type: "火车+公交",
          details: "尼斯→安提布火车往返，尼斯市区公交",
          cost: "€4.10/段火车，€1.70公交"
        },
        climate: {
          temp: "尼斯/安提布海滨日间约17-21°C，夜间约10-14°C；Cimiez山坡略凉约1-2°C",
          weather: "日照偏多，偶有阵雨",
          clothing: "薄长袖（博物馆内空调偏凉）；舒适鞋"
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
          description: "TER火车前往安提布老城",
          transit: [
            { line: "TER（Provence-Alpes-Côte d'Azur）", boarding: "Nice-Ville", alighting: "Antibes", stops: "常见2-4次（经停Cagnes-sur-Mer、Juan-les-Pins等，视车次）", payment: "SNCF Connect / 售票机；约€4.10" }
          ],
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
          description: "TER火车返回尼斯",
          transit: [
            { line: "TER", boarding: "Antibes", alighting: "Nice-Ville", stops: "常见2-4次（视车次）", payment: "SNCF Connect / 售票机；约€4.10" }
          ],
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
          description: "公交17路返回住宿，明日飞巴黎准备",
          transit: [
            { line: "Bus 17（下山方向）", boarding: "Arènes / Musée Matisse", alighting: "Jean Médecin", stops: "约6-10次", payment: "交通卡/App/上车购票；约€1.70" }
          ],
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
      locationContext: "尼斯 → 巴黎奥利 → 1 区 Opéra / Pyramides 住宿",
      summary: "✈️ 飞往巴黎 | 🏨 Studio opéra paris | 🏛️ 歌剧院区初探",
      tags: ["飞行", "抵达", "巴黎", "歌剧院", "购物"],
      overview: {
        scheduleHint: "航班 10:30–12:00；取行李后 12:35–12:45 进 Aéroport d'Orly 地铁 M14 闸机，约 25–30 分钟到 Pyramides，衔接 13:45 后入住。",
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "14:00-20:00",
          checkout: "11:00前",
          bookingRef: "6302.471.188",
          bookingPin: "6645",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "飞机+轨交",
          details: "尼斯 T2 → 巴黎奥利 T1，EasyJet U21633；市区段地铁 M14",
          company: "EasyJet",
          flight: "U21633",
          duration: "1小时30分",
          cost: "机票已预订"
        },
        climate: {
          temp: "尼斯日间约17-21°C；巴黎5月上旬日间约16-20°C，夜间约9-13°C",
          weather: "巴黎阵雨多，尼斯日照偏多",
          clothing: "下飞机加衣；风衣+防水鞋；与尼斯温差大"
        },
        hikingRoute: "初到日下午可选步行环线（约 5–7 km / 2.5–4 h）：Palais Garnier → 老佛爷屋顶 → Passage des Panoramas → Palais-Royal → Vendôme 一带 → 回酒店。",
        importantNotes: [
          "EasyJet 建议提前 2 小时到机场办票与安检",
          "奥利→市区优先 M14 至 Pyramides（与 Avenue de l'Opéra 步行 3–6 分钟）；备 Navigo/机场段票，规则以 IDFM 当年为准",
          "巴黎 1–5 区 Navigo 周卡为自然周，与 5/5 凌晨去 CDG 需另购票（本日仍在当周覆盖市内轨交，见攻略说明）"
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
          icon: "🚇",
          title: "奥利机场→歌剧院区（M14）",
          description: "地铁 14 号线至 Pyramides，步行至 Avenue de l'Opéra",
          transit: [
            { line: "M14", boarding: "Aéroport d'Orly", alighting: "Pyramides", stops: "约8-10次经停", payment: "Navigo 周卡 1–5 区（若有效）或机场区间票约 €11–13/人（以当年 IDFM 为准）" }
          ],
          location: {
            name: "巴黎奥利机场",
            address: "Paris Orly Airport",
            coordinates: { lat: 48.7250, lng: 2.3594 }
          },
          destination: {
            name: "Pyramides 站 / Opéra 区",
            address: "22 Avenue de l'Opéra 步行约3-6分钟",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "交通",
          cost: "见票种/周卡",
          route: {
            distance: "约15公里",
            time: "约25-30分钟",
            steps: ["M14 直达 Pyramides"],
            notes: "Orly 段票规以现场为准"
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
            to: "Pyramides/Opéra 区",
            transport: "M14",
            distance: "约15km",
            time: "约25-30m",
            route: "Aéroport d'Orly → Pyramides",
            details: "见票种/机场段规则"
          }
        ]
      }
    },
    // 第9天 - 5月2日（周五）巴黎地标+奥赛（同步 巴黎12日攻略-最新版.md 第9天；卢浮宫日见第10天）
    {
      day: 9,
      date: "2026-05-02",
      title: "巴黎地标+奥赛博物馆",
      city: "巴黎",
      color: "#ff3b30",
      locationContext: "巴黎 1/4/5/6/7/8 区：铁塔、凯旋门、香街、奥赛、西岱/圣母院（外观）、莎士比亚书店、左岸、圣日耳曼、可选特罗卡德罗",
      summary: "🗼 埃菲尔 | 🏛️ 凯旋门 | 🖼️ 奥赛 | ⛪ 圣母院（外观） | 📚 莎士比亚书店 | 🌃 特罗卡德罗（可选）",
      tags: ["埃菲尔铁塔", "凯旋门", "奥赛博物馆", "巴黎圣母院", "莎士比亚书店", "西岱岛", "香榭丽舍大街", "夜景", "地铁", "巴黎"],
      overview: {
        scheduleHint: "为衔接 奥赛 15:00 入场，13:40–13:45 从 Étoile 进站，14:20 前到 Solférino。出馆后西岱+书店+晚餐+夜景按攻略时段顺接。",
        hikingRoute: "酒店（地铁）→ Bir-Hakeim → 铁塔 → Pont d'Iéna → Trocadéro；地铁至 Étoile → 香街至 Concorde → 经杜乐丽边至 Pont Royal → Musée d'Orsay（15:00）→ 出馆步行 Notre-Dame 外观（西岱）→ Shakespeare and Company → Saint-Germain 晚餐 →（可选）Trocadéro 夜景 → 地铁回 Pyramides。步行约 12–15 km（香街段可缩短）。",
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6302.471.188",
          bookingPin: "6645",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "地铁",
          details: "地铁高频；M8/M6、M1/M12 衔接奥赛与左岸；90 分钟内换乘以当年 IDFM 为准；Navigo/单次/Navigo Easy/感应卡",
          cost: "见 Navigo/单次"
        },
        climate: {
          temp: "日间约16–20°C，夜间约9–13°C",
          weather: "5 月巴黎阵雨多为短时；塞纳河与铁塔周边风大",
          clothing: "分层穿衣；舒适鞋与防风外套；博物馆内可存外套"
        },
        importantNotes: [
          "埃菲尔铁塔登顶需提前预订电梯顶层票（€29）",
          "凯旋门登顶 284 级台阶+电梯，香街全景（€13）",
          "奥赛博物馆已购 15:00 门票（已改签），建议提前 40 分钟到馆外排队+安检",
          "圣母院为外观参观（西岱岛黄昏）；莎士比亚书店热门时段常排队，到门口再机动"
        ]
      },
      timeline: [
        {
          id: "day9-breakfast",
          time: "08:30",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐",
          description: "附近咖啡厅，体验巴黎早餐文化",
          location: {
            name: "巴黎歌剧院区",
            address: "Opéra District, Paris",
            coordinates: { lat: 48.8719, lng: 2.3319 }
          },
          category: "餐饮",
          cost: "€8-12",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-to-eiffel",
          time: "09:00",
          duration: 30,
          icon: "🚇",
          title: "酒店（Opéra/Pyramides）→埃菲尔铁塔",
          description: "M8→M6：Opéra→Invalides→Bir-Hakeim（见攻略方案 A）",
          transit: [
            { line: "M8（往Balard方向）", boarding: "Opéra", alighting: "Invalides", stops: "2站（Madeleine、Concorde）" },
            { line: "M6（往Nation方向）", boarding: "Invalides", alighting: "Bir-Hakeim", stops: "2站（Alma-Marceau、Passy）" }
          ],
          location: {
            name: "Opéra地铁站",
            address: "Opéra, Paris",
            coordinates: { lat: 48.8719, lng: 2.3319 }
          },
          destination: {
            name: "Bir-Hakeim地铁站",
            address: "Bir-Hakeim, Paris",
            coordinates: { lat: 48.8550, lng: 2.2930 }
          },
          category: "交通",
          cost: "约€2.50（周卡或单次）",
          route: {
            distance: "3公里",
            time: "30分钟",
            steps: ["地铁8号线", "换乘", "地铁6号线"],
            notes: "前往埃菲尔铁塔"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day9-eiffel-tower",
          time: "09:30",
          duration: 90,
          icon: "🗼",
          title: "埃菲尔铁塔登顶",
          description: "电梯，⚠️ 需提前预订顶层票",
          location: {
            name: "埃菲尔铁塔",
            address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
            coordinates: { lat: 48.8584, lng: 2.2945 }
          },
          category: "景点",
          cost: "€29",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-to-arc",
          time: "11:00",
          duration: 30,
          icon: "🚇",
          title: "铁塔→凯旋门",
          description: "地铁6号线，Bir-Hakeim→Charles de Gaulle-Étoile",
          transit: [
            { line: "M6（往Charles de Gaulle – Étoile方向）", boarding: "Bir-Hakeim", alighting: "Charles de Gaulle – Étoile", stops: "4站（Passy、Trocadéro、Boissière、Kléber）" }
          ],
          location: {
            name: "Bir-Hakeim地铁站",
            address: "Bir-Hakeim, Paris",
            coordinates: { lat: 48.8550, lng: 2.2930 }
          },
          destination: {
            name: "Charles de Gaulle-Étoile地铁站",
            address: "Charles de Gaulle-Étoile, Paris",
            coordinates: { lat: 48.8738, lng: 2.2950 }
          },
          category: "交通",
          cost: "约€2.50（周卡或单次；90 分钟内换乘以当年规则为准）",
          route: {
            distance: "4公里",
            time: "30分钟",
            steps: ["地铁6号线"],
            notes: "前往凯旋门"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day9-arc-de-triomphe",
          time: "11:30",
          duration: 60,
          icon: "🏛️",
          title: "凯旋门登顶",
          description: "电梯+台阶，284级台阶，香街全景",
          location: {
            name: "凯旋门",
            address: "Place Charles de Gaulle, 75008 Paris",
            coordinates: { lat: 48.8738, lng: 2.2950 }
          },
          category: "景点",
          cost: "€13",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-lunch-champs",
          time: "12:30",
          duration: 70,
          icon: "🍽️",
          title: "香街午餐",
          description: "Ladurée马卡龙，Angelina热巧克力",
          location: {
            name: "香榭丽舍大街",
            address: "Avenue des Champs-Élysées, 75008 Paris",
            coordinates: { lat: 48.8698, lng: 2.3079 }
          },
          category: "餐饮",
          cost: "€25-35",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-to-orsay",
          time: "13:40",
          duration: 40,
          icon: "🚇",
          title: "香街/凯旋门→奥赛博物馆",
          description: "M1→M12：Étoile→Concorde→Solférino；为 15:00 入馆留足安检与步行",
          transit: [
            { line: "M1（往Château de Vincennes方向）", boarding: "Charles de Gaulle – Étoile", alighting: "Concorde", stops: "3站（George V、Franklin D. Roosevelt、Champs-Élysées – Clemenceau）" },
            { line: "M12（往Mairie d'Issy方向）", boarding: "Concorde", alighting: "Solférino", stops: "1站（Assemblée nationale）" }
          ],
          location: {
            name: "香榭丽舍大街",
            address: "Avenue des Champs-Élysées, 75008 Paris",
            coordinates: { lat: 48.8698, lng: 2.3079 }
          },
          destination: {
            name: "奥赛博物馆",
            address: "1 Rue de la Légion d'Honneur, 75007 Paris",
            coordinates: { lat: 48.8600, lng: 2.3266 }
          },
          category: "交通",
          cost: "约€2.50（周卡或单次）",
          route: {
            distance: "3公里",
            time: "40分钟",
            steps: ["地铁1号线", "换乘", "地铁12号线"],
            notes: "前往奥赛博物馆，预留安检时间"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day9-orsay-queue",
          time: "14:20",
          duration: 40,
          icon: "⏳",
          title: "奥赛馆外排队+安检",
          description: "已购 15:00 门票（已改签），建议提前 40 分钟到馆外",
          location: {
            name: "奥赛博物馆入口",
            address: "1 Rue de la Légion d'Honneur, 75007 Paris",
            coordinates: { lat: 48.8600, lng: 2.3266 }
          },
          category: "准备",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-orsay",
          time: "15:00",
          duration: 150,
          icon: "🖼️",
          title: "奥赛博物馆",
          description: "印象派大师：莫奈、雷诺阿、梵高",
          location: {
            name: "奥赛博物馆",
            address: "1 Rue de la Légion d'Honneur, 75007 Paris",
            coordinates: { lat: 48.8600, lng: 2.3266 }
          },
          category: "博物馆",
          cost: "€16",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-notre-dame",
          time: "17:30",
          duration: 40,
          icon: "⛪",
          title: "巴黎圣母院（西岱，外观）",
          description: "出奥赛后经左岸/桥步行至西岱岛，黄昏拍立面与河岸（不入内为主）",
          location: {
            name: "Cathédrale Notre-Dame de Paris",
            address: "6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris",
            coordinates: { lat: 48.852968, lng: 2.349902 }
          },
          category: "景点",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-shakespeare",
          time: "18:10",
          duration: 50,
          icon: "📚",
          title: "Shakespeare and Company",
          description: "左岸文艺书店；热门时段常排队，店内勿大声，顺路可逛周边小巷",
          location: {
            name: "Shakespeare and Company",
            address: "37 Rue de la Bûcherie, 75005 Paris",
            coordinates: { lat: 48.8526, lng: 2.3471 }
          },
          category: "文化",
          cost: "免费/自购书",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-dinner-saint-germain",
          time: "19:00",
          duration: 75,
          icon: "🍽️",
          title: "圣日耳曼晚餐",
          description: "左岸经典法餐，咖啡文化浓厚",
          location: {
            name: "圣日耳曼区",
            address: "Saint-Germain-des-Prés, 75006 Paris",
            coordinates: { lat: 48.8530, lng: 2.3333 }
          },
          category: "餐饮",
          cost: "€40-60",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-trocadero-night",
          time: "20:15",
          duration: 90,
          icon: "🌃",
          title: "圣日耳曼/左岸→特罗卡德罗（夜景，可选）",
          description: "轨交、无长距离步行；观铁塔夜景与水面倒影",
          transit: [
            { line: "M4（往Mairie de Montrouge方向）", boarding: "Saint-Germain-des-Prés", alighting: "Montparnasse – Bienvenüe", stops: "约4站（Saint-Sulpice、Saint-Placide、Vavin等，以当日为准）" },
            { line: "M6（往Charles de Gaulle – Étoile方向）", boarding: "Montparnasse – Bienvenüe", alighting: "Trocadéro", stops: "约6–7次（Pasteur、Cambronne、La Motte-Picquet – Grenelle、Dupleix、Bir-Hakeim、Passy 等，以当日为准）" }
          ],
          location: {
            name: "特罗卡德罗广场",
            address: "Place du Trocadéro, 75016 Paris",
            coordinates: { lat: 48.8620, lng: 2.2877 }
          },
          category: "摄影",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day9-return-hotel",
          time: "21:45",
          duration: 30,
          icon: "🚇",
          title: "特罗卡德罗→酒店（Pyramides）",
          description: "M6 → M1 → M7 至 Pyramides；站名以攻略为准",
          transit: [
            { line: "M6（往Charles de Gaulle – Étoile方向）", boarding: "Trocadéro", alighting: "Charles de Gaulle – Étoile", stops: "1站（Kléber）" },
            { line: "M1（往La Défense方向）", boarding: "Charles de Gaulle – Étoile", alighting: "Palais Royal – Musée du Louvre", stops: "约5站（George V、Franklin D. Roosevelt、Champs-Élysées – Clemenceau、Concorde、Tuileries）" },
            { line: "M7（往La Courneuve – 8 Mai 1945方向）", boarding: "Palais Royal – Musée du Louvre", alighting: "Pyramides", stops: "0 次（两站相邻）" }
          ],
          location: {
            name: "Trocadéro地铁站",
            address: "Trocadéro, Paris",
            coordinates: { lat: 48.8620, lng: 2.2877 }
          },
          destination: {
            name: "Pyramides",
            address: "Pyramides, Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "交通",
          cost: "约€2.50（周卡或单次）",
          route: {
            distance: "4公里",
            time: "30分钟",
            steps: ["M6", "M1", "M7 至 Pyramides"],
            notes: "返回酒店区"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        }
      ],
      route: {
        totalDistance: "12–15公里",
        totalTime: "全天游览",
        steps: [
          {
            from: "歌剧院区",
            to: "埃菲尔铁塔",
            transport: "M8→M6",
            distance: "3km",
            time: "30m",
            route: "Opéra→Bir-Hakeim",
            details: "约€2.50"
          },
          {
            from: "埃菲尔铁塔",
            to: "凯旋门",
            transport: "M6",
            distance: "4km",
            time: "30m",
            route: "Bir-Hakeim→Étoile",
            details: "约€2.50"
          },
          {
            from: "凯旋门",
            to: "奥赛博物馆",
            transport: "M1→M12",
            distance: "6km",
            time: "40m",
            route: "香街/Étoile→Solférino",
            details: "约€2.50"
          },
          {
            from: "奥赛博物馆",
            to: "西岱/圣母院+莎士比亚",
            transport: "步行",
            distance: "约2–3km",
            time: "50–60m",
            route: "左岸/桥至西岱与拉丁区",
            details: "免费"
          },
          {
            from: "圣日耳曼/左岸",
            to: "特罗卡德罗",
            transport: "M4→M6",
            distance: "3km",
            time: "25m",
            route: "夜景（可选）",
            details: "约€2.50"
          }
        ]
      }
    },
    // 第10天 - 5月3日（周六）卢浮宫+巴黎文化漫游（同步 巴黎12日攻略-最新版.md）
    {
      day: 10,
      date: "2026-05-03",
      title: "卢浮宫+巴黎文化漫游",
      city: "巴黎",
      color: "#ff9500",
      locationContext: "巴黎 1/4/5/6 区（卢浮宫、杜乐丽、西岱岛、拉丁区、卢森堡公园）",
      summary: "🏛️ 卢浮宫 | 🌳 杜乐丽+协和 | 🌉 左岸漫步 | 🦴 地下墓穴",
      tags: ["卢浮宫", "杜乐丽", "左岸", "地下墓穴", "博物馆", "巴黎"],
      overview: {
        scheduleHint: "卢浮宫 09:00 开门，建议 08:45 前到金字塔入口排队；地下墓穴已预约 16:30 入场；晚间 20:00–20:30 自 Denfert-Rochereau 乘地铁回 Pyramides。",
        hikingRoute: "酒店 → Louvre → Tuileries → Pont des Arts 至左岸 → Saint-Germain → Luxembourg → Denfert-Rochereau（巴黎地下墓穴）→ 地铁回 Pyramides。约 9–11 km。",
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6302.471.188",
          bookingPin: "6645",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "步行+地铁",
          details: "Latin → Denfert M4；返程 M4 + M14；Navigo/单次以当日为准",
          cost: "见票种"
        },
        climate: {
          temp: "日间约16-20°C，夜间约9-13°C",
          weather: "5月短时阵雨常见",
          clothing: "防水舒适鞋；折叠伞；薄长袖"
        },
        importantNotes: [
          "卢浮宫需提前购票；地下墓穴 16:30 已预约，参观约 45–75 分钟（含安检/排队可至约 1.5 小时）",
          "必看三宝：蒙娜丽莎（德农翼1层）、断臂维纳斯（叙利翼底层）、胜利女神（德农翼1层）",
          "中文语音导览€5，强烈推荐；参观路线：德农翼→叙利翼→黎塞留翼",
          "蒙娜丽莎前人多，建议早上到或下午稍晚；Café Marly 为宫内金字塔景观餐"
        ]
      },
      timeline: [
        {
          id: "day10-breakfast",
          time: "08:00",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐",
          description: "简单早餐，为博物馆游做准备",
          location: {
            name: "Studio opéra paris附近",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "餐饮",
          cost: "€8-10",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-to-louvre",
          time: "08:30",
          duration: 10,
          icon: "🚶",
          title: "酒店→卢浮宫",
          description: "步行约8分钟，住宿地点优势",
          location: {
            name: "Studio opéra paris",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          destination: {
            name: "卢浮宫入口",
            address: "Pyramid du Louvre, 75001 Paris",
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          category: "交通",
          cost: "免费",
          route: {
            distance: "约0.6公里",
            time: "8分钟",
            steps: ["步行"],
            notes: "前往卢浮宫"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day10-louvre-queue",
          time: "08:40",
          duration: 20,
          icon: "⏳",
          title: "卢浮宫排队入场",
          description: "09:00 开门，建议提早到达",
          location: {
            name: "卢浮宫金字塔入口",
            address: "Pyramid du Louvre, 75001 Paris",
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          category: "准备",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-louvre-tour",
          time: "09:00",
          duration: 210,
          icon: "🏛️",
          title: "卢浮宫深度游览",
          description: "蒙娜丽莎+维纳斯+胜利女神，€17；中文语音导览€5 强烈推荐",
          location: {
            name: "卢浮宫博物馆",
            address: "Rue de Rivoli, 75001 Paris",
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          category: "博物馆",
          cost: "€17",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-lunch-louvre",
          time: "12:30",
          duration: 60,
          icon: "🍽️",
          title: "卢浮宫内午餐",
          description: "Café Marly，金字塔景观餐厅",
          location: {
            name: "Café Marly",
            address: "93 Rue de Rivoli, 75001 Paris",
            coordinates: { lat: 48.8610, lng: 2.3365 }
          },
          category: "餐饮",
          cost: "€20-30",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-tuileries",
          time: "13:30",
          duration: 60,
          icon: "🌳",
          title: "杜乐丽花园+协和广场",
          description: "法式园林、方尖碑、塞纳河畔漫步",
          location: {
            name: "杜乐丽花园 / 协和广场",
            address: "Place de la Concorde, 75001 Paris",
            coordinates: { lat: 48.8636, lng: 2.3272 }
          },
          category: "公园",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-cite-walk",
          time: "14:30",
          duration: 60,
          icon: "🚶",
          title: "左岸散步",
          description: "新桥、河岸建筑、经典巴黎街景",
          location: {
            name: "新桥一带",
            address: "Pont Neuf, 75001 Paris",
            coordinates: { lat: 48.8566, lng: 2.3414 }
          },
          category: "休闲",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-luxembourg-coffee",
          time: "15:10",
          duration: 40,
          icon: "☕",
          title: "卢森堡公园/拉丁区咖啡",
          description: "机动休息，为地下墓穴前留时间",
          location: {
            name: "卢森堡公园 / 拉丁区",
            address: "75005–75006 Paris",
            coordinates: { lat: 48.8462, lng: 2.3372 }
          },
          category: "休闲",
          cost: "€5-10",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-metro-denfert",
          time: "15:50",
          duration: 30,
          icon: "🚇",
          title: "拉丁区→Denfert-Rochereau",
          description: "M4 往 Bagneux 方向，约4站，地下墓穴前到场",
          transit: [
            {
              line: "M4",
              boarding: "Saint-Michel – Notre-Dame",
              alighting: "Denfert-Rochereau",
              stops: "约4次",
              payment: "Navigo/单次 约€2.50"
            }
          ],
          location: {
            name: "Saint-Michel – Notre-Dame",
            address: "Paris",
            coordinates: { lat: 48.8489, lng: 2.3469 }
          },
          category: "交通",
          cost: "见票种",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-catacombes",
          time: "16:30",
          duration: 80,
          icon: "🦴",
          title: "巴黎地下墓穴 Catacombes",
          description: "已预约 16:30；参观约 45–75 分钟，含安检/排队可至 1.5 小时",
          location: {
            name: "Catacombes de Paris",
            address: "1 Av. du Colonel Henri Rol-Tanguy, 75014 Paris",
            coordinates: { lat: 48.8339, lng: 2.3324 }
          },
          category: "景点",
          cost: "已预约/见官网",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-dinner-montparnasse",
          time: "18:00",
          duration: 110,
          icon: "🍽️",
          title: "Denfert/蒙帕纳斯一带晚餐",
          description: "传统法餐，约 €45-65",
          location: {
            name: "Denfert-Rochereau 周边",
            address: "75014 Paris",
            coordinates: { lat: 48.8335, lng: 2.3325 }
          },
          category: "餐饮",
          cost: "€45-65",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day10-return-hotel",
          time: "19:50",
          duration: 30,
          icon: "🚇",
          title: "返回酒店（地铁）",
          description: "M4 至 Châtelet 换乘 M14 至 Pyramides",
          transit: [
            {
              line: "M4（往 Porte de Clignancourt）",
              boarding: "Denfert-Rochereau",
              alighting: "Châtelet",
              stops: "约4次"
            },
            {
              line: "M14（往 Saint-Denis Pleyel）",
              boarding: "Châtelet",
              alighting: "Pyramides",
              stops: "0 次"
            }
          ],
          location: {
            name: "Denfert-Rochereau",
            address: "75014 Paris",
            coordinates: { lat: 48.8335, lng: 2.3325 }
          },
          destination: {
            name: "Pyramides",
            address: "75001 Paris",
            coordinates: { lat: 48.8656, lng: 2.3344 }
          },
          category: "交通",
          cost: "Navigo/单次 约€2.50",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        }
      ],
      route: {
        totalDistance: "9–11公里",
        totalTime: "步行+地铁路线",
        steps: [
          {
            from: "歌剧院区",
            to: "卢浮宫",
            transport: "步行",
            distance: "0.6km",
            time: "8m",
            route: "步行",
            details: "免费"
          },
          {
            from: "卢浮宫",
            to: "杜乐丽/协和",
            transport: "步行",
            distance: "约1km",
            time: "15m",
            route: "杜乐丽花园",
            details: "免费"
          },
          {
            from: "协和/杜乐丽",
            to: "左岸",
            transport: "步行",
            distance: "约1.5km",
            time: "20m",
            route: "Pont des Arts 等",
            details: "免费"
          },
          {
            from: "左岸",
            to: "卢森堡/拉丁区",
            transport: "步行",
            distance: "约1km",
            time: "15m",
            route: "街区漫步",
            details: "免费"
          },
          {
            from: "Saint-Michel",
            to: "Denfert",
            transport: "地铁M4",
            distance: "—",
            time: "约20m",
            route: "地下墓穴",
            details: "Navigo/单次"
          },
          {
            from: "Denfert 一带",
            to: "Pyramides/酒店",
            transport: "地铁M4+M14",
            distance: "—",
            time: "约30m",
            route: "经 Châtelet",
            details: "Navigo/单次"
          }
        ]
      }
    },
    // 第11天：迪士尼乐园
    {
      day: 11,
      date: "2026-05-04",
      title: "迪士尼乐园",
      city: "巴黎",
      color: "#af52de",
      locationContext: "马恩河谷 Marne-la-Vallée – Chessy（巴黎迪士尼乐园）",
      summary: "🏰 迪士尼乐园 | 🎢 游乐设施 | 🎆 烟花秀",
      tags: ["主题公园", "游乐设施", "烟花", "迪士尼"],
      overview: {
        scheduleHint: "08:00–08:10 到 Pyramides 发 M14；08:20–08:30 到 Châtelet – Les Halles 乘 RER A，终点站 Marne-la-Vallée – Chessy，09:00 前到站可衔接 09:30 开园。返程烟花后 18:35–18:45 上 RER A，19:30 前可回 Pyramides。",
        hikingRoute: "园内建议固定单向环线，避免穿园折返，例如 Discoveryland → Fantasyland → Adventureland → Frontierland（顺/逆时针二选一，全日不换向）。",
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6302.471.188",
          bookingPin: "6645",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "M14 + RER A",
          details: "Pyramides → Châtelet；RER A 至 Marne-la-Vallée – Chessy；Navigo 1–5 区有效周内常含本段，以票规为准",
          duration: "约40-50分钟",
          cost: "见 Navigo/单次"
        },
        climate: {
          temp: "日间约16-20°C，夜间约9-13°C",
          weather: "与巴黎市区相近，园区户外全天",
          clothing: "薄外套（排队/夜间）；舒适鞋；清晨/烟花后体感偏凉"
        },
        importantNotes: [
          "门票 €56×2 已备（攻略口径），FastPass/预约以园区当日规则为准",
          "RER A 多分支，务必乘终点站为 Marne-la-Vallée – Chessy 的列车",
          "花车 14:30 / 17:00；烟花约 19:00，以现场为准"
        ]
      },
      timeline: [
        {
          id: "day11-breakfast-prep",
          time: "07:30",
          duration: 30,
          icon: "🍽️",
          title: "酒店早餐+准备",
          description: "简单早餐，带好充电宝、零食、雨具",
          location: {
            name: "Studio opéra paris",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "准备",
          cost: "€8-10",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day11-to-disney",
          time: "08:00",
          duration: 90,
          icon: "🚇",
          title: "前往迪士尼",
          description: "M14 至 Châtelet，换 RER A 至 Marne-la-Vallée – Chessy",
          transit: [
            { line: "M14（往 Olympiades / Aéroport d'Orly 方向，以屏幕为准）", boarding: "Pyramides", alighting: "Châtelet", stops: "0 次" },
            { line: "RER A（往 Marne-la-Vallée – Chessy）", boarding: "Châtelet – Les Halles", alighting: "Marne-la-Vallée – Chessy", stops: "约 10–12 次" }
          ],
          location: {
            name: "Pyramides 站",
            address: "Pyramides, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          destination: {
            name: "Marne-la-Vallée/Chessy站",
            address: "Disneyland Paris, 77700 Chessy",
            coordinates: { lat: 48.8722, lng: 2.7758 }
          },
          category: "交通",
          cost: "€7.5",
          route: {
            distance: "32公里",
            time: "40分钟",
            steps: ["RER A线"],
            notes: "直达迪士尼乐园"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        },
        {
          id: "day11-disney-park",
          time: "09:30",
          duration: 540,
          icon: "🏰",
          title: "迪士尼乐园游玩",
          description: "利用FastPass优先游玩热门项目：加勒比海盗、星球大战、恐怖塔",
          location: {
            name: "巴黎迪士尼乐园",
            address: "Disneyland Paris, 77700 Chessy",
            coordinates: { lat: 48.8722, lng: 2.7758 }
          },
          category: "主题公园",
          cost: "€56（已含门票）",
          important: true,
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day11-dinner-disney",
          time: "18:30",
          duration: 60,
          icon: "🍽️",
          title: "迪士尼小镇晚餐",
          description: "迪士尼小镇餐厅，选择多样",
          location: {
            name: "迪士尼小镇",
            address: "Disney Village, 77700 Chessy",
            coordinates: { lat: 48.8720, lng: 2.7770 }
          },
          category: "餐饮",
          cost: "€25-35",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day11-fireworks",
          time: "19:30",
          duration: 120,
          icon: "🎆",
          title: "迪士尼烟花秀",
          description: "迪士尼城堡灯光烟花秀，最佳观景点提前占位",
          location: {
            name: "睡美人城堡前",
            address: "Sleeping Beauty Castle, Disneyland Paris",
            coordinates: { lat: 48.8725, lng: 2.7765 }
          },
          category: "娱乐",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day11-return-paris",
          time: "21:30",
          duration: 60,
          icon: "🚇",
          title: "返回巴黎",
          description: "RER A线返回市区",
          transit: [
            { line: "RER A（往Paris方向）", boarding: "Marne-la-Vallée – Chessy", alighting: "Châtelet – Les Halles", stops: "约10-12站" },
            { line: "M14", boarding: "Châtelet", alighting: "Pyramides", stops: "直达（0站）" }
          ],
          location: {
            name: "Marne-la-Vallée/Chessy站",
            address: "Disneyland Paris, 77700 Chessy",
            coordinates: { lat: 48.8722, lng: 2.7758 }
          },
          destination: {
            name: "Auber车站",
            address: "Auber, 75009 Paris",
            coordinates: { lat: 48.8725, lng: 2.3296 }
          },
          category: "交通",
          cost: "€7.5",
          route: {
            distance: "32公里",
            time: "40分钟",
            steps: ["RER A线"],
            notes: "返回巴黎市区"
          },
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" },
            { type: "navigation", label: "导航" }
          ]
        }
      ],
      route: {
        totalDistance: "64公里",
        totalTime: "全天游览",
        steps: [
          {
            from: "Pyramides",
            to: "马恩河谷迪士尼",
            transport: "M14+RER A",
            distance: "32km",
            time: "约40-50m",
            route: "Châtelet – Les Halles → Marne-la-Vallée – Chessy",
            details: "Navigo/单次以票规为准"
          },
          {
            from: "马恩河谷迪士尼",
            to: "Pyramides",
            transport: "RER A + M14",
            distance: "32km",
            time: "约40-50m",
            route: "Marne-la-Vallée – Chessy → Châtelet",
            details: "晚间返程同线"
          }
        ]
      }
    },
    // 第12天：返程日
    {
      day: 12,
      date: "2026-05-05",
      title: "返程日",
      city: "巴黎",
      color: "#ff3b30",
      locationContext: "巴黎 戴高乐 T1 → 法兰克福 → 上海浦东",
      summary: "🚇 戴高乐离境 | ✈️ LH1029+LH728 返沪",
      tags: ["机场", "返程", "转机", "巴黎"],
      overview: {
        scheduleHint: "06:00 自 Pyramides 发 M14；06:20–06:25 Châtelet – Les Halles 乘 RER B 往 CDG；目标 07:20 前到机场办票（航班 LH1029 10:35 起飞）。5/5 属新自然周，上周 Navigo 常不适用，RER B 机场段须单独购票。",
        accommodation: {
          name: "Studio opéra paris",
          address: "22 Avenue de l'Opéra, 75001 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          bookingRef: "6302.471.188",
          bookingPin: "6645",
          coordinates: { lat: 48.8667, lng: 2.3333 }
        },
        transport: {
          type: "M14 + RER B + 航班",
          details: "市区→CDG 戴高乐；LH1029 巴黎→法兰克福；LH728 法兰克福→上海",
          duration: "RER 约 50 分钟 + 候机/转机",
          cost: "RER 机场段约 €11–13/人；机票已出票"
        },
        climate: {
          temp: "凌晨约9-13°C（偏区间下限）",
          weather: "风冷感明显，机舱恒温",
          clothing: "去机场备薄羽绒/厚外套；航段以机舱恒温为主，可备保湿与颈枕"
        },
        importantNotes: [
          "国际航班建议提前 3 小时到柜台；T1 出发可经 CDGVAL 衔接",
          "退税：海关盖章 → 退税柜台，预留时间",
          "5/5 周卡多已失效，勿假设上一周 Navigo 仍有效"
        ]
      },
      timeline: [
        {
          id: "day12-checkout",
          time: "05:30",
          duration: 30,
          icon: "🧳",
          title: "酒店退房",
          description: "提前一晚结账，行李打包完毕",
          location: {
            name: "Studio opéra paris",
            address: "22 Avenue de l'Opéra, 75001 Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          category: "准备",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day12-to-chatelet",
          time: "06:00",
          duration: 15,
          icon: "🚇",
          title: "酒店→Châtelet（地铁）",
          description: "M14直达，衔接RER B去机场",
          transit: [
            { line: "M14（往Olympiades/Aéroport d'Orly方向）", boarding: "Pyramides", alighting: "Châtelet", stops: "直达（0站）" }
          ],
          location: {
            name: "Pyramides地铁站",
            address: "Pyramides, Paris",
            coordinates: { lat: 48.8667, lng: 2.3333 }
          },
          destination: {
            name: "Châtelet地铁站",
            address: "Châtelet, Paris",
            coordinates: { lat: 48.8583, lng: 2.3472 }
          },
          category: "交通",
          cost: "€2.50",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day12-to-cdg",
          time: "06:15",
          duration: 65,
          icon: "🚇",
          title: "Châtelet→戴高乐机场（RER B）",
          description: "RER B往机场方向，约50分钟到CDG",
          transit: [
            { line: "RER B（往Aéroport Charles de Gaulle方向）", boarding: "Châtelet – Les Halles", alighting: "Aéroport Charles de Gaulle 1 – Roissy", stops: "约7-9站（经Gare du Nord、Parc des Expositions等）" }
          ],
          location: {
            name: "Châtelet – Les Halles站",
            address: "Châtelet – Les Halles, Paris",
            coordinates: { lat: 48.8583, lng: 2.3472 }
          },
          destination: {
            name: "戴高乐机场T1",
            address: "Aéroport Charles de Gaulle, Terminal 1",
            coordinates: { lat: 49.0097, lng: 2.5479 }
          },
          category: "交通",
          cost: "€11.45",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        },
        {
          id: "day12-airport-checkin",
          time: "07:20",
          duration: 70,
          icon: "🏢",
          title: "机场值机+安检",
          description: "汉莎航空柜台，国际航班提前3小时，安检+退税+候机",
          location: {
            name: "戴高乐机场T1",
            address: "Paris Charles de Gaulle Airport, Terminal 1",
            coordinates: { lat: 49.0097, lng: 2.5479 }
          },
          category: "机场",
          cost: "免费",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day12-flight-cdg-fra",
          time: "10:35",
          duration: 75,
          icon: "✈️",
          title: "CDG→法兰克福（LH1029）",
          description: "汉莎航空，飞行1小时15分",
          location: {
            name: "戴高乐机场登机口",
            address: "Paris Charles de Gaulle Airport, Terminal 1",
            coordinates: { lat: 49.0097, lng: 2.5479 }
          },
          category: "航班",
          cost: "已购机票",
          important: true,
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day12-transfer-fra",
          time: "11:50",
          duration: 230,
          icon: "🔄",
          title: "法兰克福转机",
          description: "T1转机3小时50分钟，免税购物+午餐",
          location: {
            name: "法兰克福机场T1",
            address: "Frankfurt Airport, Terminal 1",
            coordinates: { lat: 50.0379, lng: 8.5622 }
          },
          category: "转机",
          cost: "€20-30（午餐）",
          actions: [
            { type: "details", label: "详情" }
          ]
        },
        {
          id: "day12-flight-fra-pvg",
          time: "15:40",
          duration: 635,
          icon: "✈️",
          title: "法兰克福→上海（LH728）",
          description: "汉莎航空A380，飞行10.5小时",
          location: {
            name: "法兰克福机场登机口",
            address: "Frankfurt Airport, Terminal 1",
            coordinates: { lat: 50.0379, lng: 8.5622 }
          },
          category: "航班",
          cost: "已购机票",
          important: true,
          actions: [
            { type: "details", label: "详情" }
          ]
        }
      ],
      route: {
        totalDistance: "约30公里",
        totalTime: "全天行程",
        steps: [
          {
            from: "Pyramides",
            to: "Châtelet",
            transport: "地铁M14",
            distance: "1km",
            time: "5m",
            route: "Pyramides→Châtelet",
            details: "€2.50"
          },
          {
            from: "Châtelet – Les Halles",
            to: "戴高乐机场T1",
            transport: "RER B",
            distance: "25km",
            time: "50m",
            route: "Châtelet→Aéroport CDG 1",
            details: "€11.45"
          },
          {
            from: "戴高乐机场T1",
            to: "法兰克福T1",
            transport: "LH1029",
            distance: "480km",
            time: "1h15m",
            route: "汉莎航空",
            details: "已购机票"
          },
          {
            from: "法兰克福T1",
            to: "上海浦东T2",
            transport: "LH728",
            distance: "8,900km",
            time: "10h30m",
            route: "汉莎航空A380",
            details: "已购机票，09:15+1抵达"
          }
        ]
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
   * 本地「今天」的 YYYY-MM-DD
   * @param {Date} d
   * @returns {string}
   */
  _localYmd(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  /**
   * 根据本机当前日期，返回当前行程中「今天」对应的那一天数据（用于高亮、今天按钮、日序条）
   * 早于行程首日 → 第 1 天；晚于末日后一天 → 最后一天
   */
  getCurrentDay() {
    const days = this.getAllDays();
    if (!days || days.length === 0) {
      return { day: 1, date: '', title: '', city: '', summary: '', tags: [], timeline: [] };
    }
    const today = this._localYmd(new Date());
    const start = tripData.dates && tripData.dates.start;
    const end = tripData.dates && tripData.dates.end;

    if (start && today < start) {
      return this.getDay(1);
    }
    if (end && today > end) {
      const last = days[days.length - 1];
      return this.getDay(last.day);
    }

    const exact = days.find((d) => d.date === today);
    if (exact) {
      return this.getDay(exact.day);
    }

    for (let i = 0; i < days.length; i++) {
      if (days[i].date > today) {
        return i > 0 ? this.getDay(days[i - 1].day) : this.getDay(1);
      }
    }
    return this.getDay(days[days.length - 1].day);
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