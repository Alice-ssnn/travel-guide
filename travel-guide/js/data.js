// data.js - Trip data model and loading utilities

/**
 * Complete trip data for Switzerland-France 15-day itinerary
 * Based on the markdown travel guide document
 */
const tripData = {
  id: "switzerland-france-2026",
  title: "瑞士·南法·巴黎15日深度游",
  duration: 15,
  dates: {
    start: "2026-04-24",
    end: "2026-05-08"
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
          details: "奥地利航空OS016 + OS377联程",
          airline: "Austrian Airlines",
          duration: "13小时30分（含转机）"
        },
        importantNotes: [
          "维也纳转机时间1小时55分，注意时间衔接",
          "苏黎世机场到酒店打车约30分钟，费用约CHF 50-60",
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
          description: "转乘OS377前往苏黎世",
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
          id: "day1-arrival",
          time: "20:00",
          duration: 45,
          icon: "🛄",
          title: "抵达苏黎世",
          description: "提取行李，前往酒店",
          location: {
            name: "苏黎世机场",
            address: "Flughafen Zürich, 8058 Zürich",
            coordinates: { lat: 47.4647, lng: 8.5492 }
          },
          category: "抵达",
          cost: "出租车CHF 50-60",
          actions: [
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
          address: "Dorfstrasse 32, 3706 Leissigen",
          checkin: "14:00后",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾租车",
          details: "Europcar苏黎世机场取车",
          company: "Europcar",
          bookingRef: "1159263500",
          cost: "CHF 1066 (5天)"
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
          id: "day2-rental",
          time: "09:00",
          duration: 60,
          icon: "🚗",
          title: "取车自驾",
          description: "苏黎世机场Europcar取车",
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
          id: "day2-drive",
          time: "11:15",
          duration: 135,
          icon: "🛣️",
          title: "自驾前往因特拉肯",
          description: "苏黎世机场→因特拉肯",
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
          id: "day2-checkin",
          time: "14:00",
          duration: 30,
          icon: "🏨",
          title: "酒店入住",
          description: "Hotel Rosengärtli, Leissigen",
          location: {
            name: "Hotel Rosengärtli",
            address: "Dorfstrasse 32, 3706 Leissigen",
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
          id: "day2-lunch",
          time: "14:30",
          duration: 60,
          icon: "🍽️",
          title: "午餐",
          description: "当地餐厅",
          location: {
            name: "Leissigen镇中心",
            address: "Leissigen, Switzerland",
            coordinates: { lat: 46.6475, lng: 7.7681 }
          },
          category: "餐饮",
          cost: "CHF 25-35/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        },
        {
          id: "day2-thun",
          time: "16:00",
          duration: 120,
          icon: "🏞️",
          title: "图恩湖漫步",
          description: "湖畔散步，欣赏湖光山色",
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
          id: "day2-dinner",
          time: "19:00",
          duration: 90,
          icon: "🍽️",
          title: "湖畔晚餐",
          description: "湖景餐厅晚餐",
          location: {
            name: "湖畔餐厅",
            address: "Lake Thun, Leissigen",
            coordinates: { lat: 46.6500, lng: 7.7600 }
          },
          category: "餐饮",
          cost: "CHF 40-60/人",
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
    // 第3天：少女峰（简化）
    {
      day: 3,
      date: "2026-04-26",
      title: "少女峰一日游",
      city: "因特拉肯",
      color: "#ff9500",
      summary: "🚂 少女峰铁路 | 🏔️ 欧洲之巅",
      tags: ["雪山", "铁路", "观光"],
      overview: {
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Dorfstrasse 32, 3706 Leissigen",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "火车",
          details: "格林德瓦→少女峰往返铁路",
          company: "Jungfrau Railways",
          cost: "CHF 210/人"
        },
        importantNotes: [
          "少女峰海拔3454米，注意高原反应",
          "山顶温度低，需准备保暖衣物"
        ]
      },
      timeline: [
        {
          id: "day3-jungfrau",
          time: "10:00",
          duration: 360,
          icon: "🏔️",
          title: "少女峰铁路",
          description: "乘坐火车前往少女峰车站",
          location: {
            name: "格林德瓦火车站",
            address: "Grindelwald, Switzerland",
            coordinates: { lat: 46.6244, lng: 8.0364 }
          },
          category: "景点",
          cost: "CHF 210/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "60公里",
        totalTime: "3小时",
        steps: []
      }
    },
    // 第4天：First山（简化）
    {
      day: 4,
      date: "2026-04-27",
      title: "First山探险",
      city: "因特拉肯",
      color: "#ff9500",
      summary: "🚡 First山缆车 | 🦅 飞鹰",
      tags: ["山地", "缆车", "探险"],
      overview: {
        accommodation: {
          name: "Hotel Rosengärtli",
          address: "Dorfstrasse 32, 3706 Leissigen",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 46.6475, lng: 7.7681 }
        },
        transport: {
          type: "自驾",
          details: "酒店往返格林德瓦",
          cost: "油费约CHF 10"
        },
        importantNotes: ["First山缆车票可提前购买"]
      },
      timeline: [
        {
          id: "day4-first",
          time: "10:30",
          duration: 180,
          icon: "🚡",
          title: "First山缆车与活动",
          description: "乘坐缆车上山，体验飞鹰、悬空步道",
          location: {
            name: "First缆车站",
            address: "Grindelwald, Switzerland",
            coordinates: { lat: 46.6244, lng: 8.0364 }
          },
          category: "景点",
          cost: "CHF 89/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "60公里",
        totalTime: "2小时",
        steps: []
      }
    },
    // 第5天：前往日内瓦（简化）
    {
      day: 5,
      date: "2026-04-28",
      title: "前往日内瓦",
      city: "日内瓦",
      color: "#007aff",
      summary: "🚂 因特拉肯→日内瓦 | 🌉 日内瓦湖",
      tags: ["火车", "转场", "湖泊"],
      overview: {
        accommodation: {
          name: "Hotel N'vY",
          address: "18 Rue de Richemont, 1202 Geneva",
          checkin: "15:00后",
          checkout: "12:00前",
          coordinates: { lat: 46.2084, lng: 6.1426 }
        },
        transport: {
          type: "火车",
          details: "因特拉肯→日内瓦直达列车",
          company: "SBB",
          duration: "2小时45分",
          cost: "CHF 75/人"
        },
        importantNotes: ["火车票建议提前预订"]
      },
      timeline: [
        {
          id: "day5-train",
          time: "10:30",
          duration: 165,
          icon: "🚂",
          title: "火车前往日内瓦",
          description: "因特拉肯东站→日内瓦火车站",
          location: {
            name: "因特拉肯东站",
            address: "Interlaken Ost, Switzerland",
            coordinates: { lat: 46.6863, lng: 7.8632 }
          },
          category: "交通",
          cost: "CHF 75/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        }
      ],
      route: {
        totalDistance: "230公里",
        totalTime: "2小时45分",
        steps: []
      }
    },
    // 第6天：日内瓦市区（简化）
    {
      day: 6,
      date: "2026-04-29",
      title: "日内瓦市区观光",
      city: "日内瓦",
      color: "#007aff",
      summary: "🏛️ 联合国 | ⛲ 大喷泉",
      tags: ["观光", "国际组织", "湖泊"],
      overview: {
        accommodation: {
          name: "Hotel N'vY",
          address: "18 Rue de Richemont, 1202 Geneva",
          checkin: "已入住",
          checkout: "12:00前",
          coordinates: { lat: 46.2084, lng: 6.1426 }
        },
        transport: {
          type: "公共交通",
          details: "日内瓦市内交通票",
          cost: "CHF 10/人/天"
        },
        importantNotes: ["联合国参观需提前预约"]
      },
      timeline: [
        {
          id: "day6-un",
          time: "09:30",
          duration: 120,
          icon: "🏛️",
          title: "联合国欧洲总部",
          description: "参观万国宫",
          location: {
            name: "联合国日内瓦办事处",
            address: "Palais des Nations, 1211 Geneva",
            coordinates: { lat: 46.2260, lng: 6.1404 }
          },
          category: "景点",
          cost: "CHF 15/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "8公里",
        totalTime: "步行游览",
        steps: []
      }
    },
    // 第7天：飞往尼斯（简化）
    {
      day: 7,
      date: "2026-04-30",
      title: "飞往尼斯",
      city: "尼斯",
      color: "#ff2d55",
      summary: "✈️ 日内瓦→尼斯 | 🏖️ 天使湾",
      tags: ["飞行", "海滨", "转场"],
      overview: {
        accommodation: {
          name: "Hotel Suisse",
          address: "15 Quai Rauba Capeu, 06300 Nice",
          checkin: "15:00后",
          checkout: "11:00前",
          coordinates: { lat: 43.6951, lng: 7.2769 }
        },
        transport: {
          type: "飞机",
          details: "日内瓦→尼斯直飞",
          airline: "EasyJet",
          duration: "1小时15分",
          cost: "€ 89/人"
        },
        importantNotes: ["提前到达机场办理登机"]
      },
      timeline: [
        {
          id: "day7-flight",
          time: "12:00",
          duration: 75,
          icon: "✈️",
          title: "飞往尼斯",
          description: "EasyJet航班 U2154",
          location: {
            name: "日内瓦机场",
            address: "Geneva Airport",
            coordinates: { lat: 46.2381, lng: 6.1089 }
          },
          category: "交通",
          cost: "€ 89/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        }
      ],
      route: {
        totalDistance: "450公里",
        totalTime: "1小时15分飞行",
        steps: []
      }
    },
    // 第8天：尼斯市区（简化）
    {
      day: 8,
      date: "2026-05-01",
      title: "尼斯市区探索",
      city: "尼斯",
      color: "#ff2d55",
      summary: "🏖️ 英国人步行道 | 🏰 城堡山",
      tags: ["老城", "博物馆", "海滨"],
      overview: {
        accommodation: {
          name: "Hotel Suisse",
          address: "15 Quai Rauba Capeu, 06300 Nice",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 43.6951, lng: 7.2769 }
        },
        transport: {
          type: "步行/公交",
          details: "尼斯市区交通",
          cost: "€ 5/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day8-castle",
          time: "09:30",
          duration: 120,
          icon: "🏰",
          title: "城堡山公园",
          description: "俯瞰尼斯全景",
          location: {
            name: "城堡山",
            address: "Colline du Château, Nice",
            coordinates: { lat: 43.6955, lng: 7.2775 }
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
        totalDistance: "6公里",
        totalTime: "步行游览",
        steps: []
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
    },
    // 第13天：卢浮宫（简化）
    {
      day: 13,
      date: "2026-05-06",
      title: "巴黎经典一日",
      city: "巴黎",
      color: "#ff3b30",
      summary: "🖼️ 卢浮宫 | ⛪ 巴黎圣母院",
      tags: ["博物馆", "艺术", "历史"],
      overview: {
        accommodation: {
          name: "Hotel Eiffel Turenne",
          address: "20 Avenue de Tourville, 75007 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 48.8550, lng: 2.3050 }
        },
        transport: {
          type: "地铁",
          details: "巴黎地铁日票",
          cost: "€ 8.45/人"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day13-louvre",
          time: "09:30",
          duration: 180,
          icon: "🖼️",
          title: "卢浮宫",
          description: "参观蒙娜丽莎、维纳斯等名作",
          location: {
            name: "卢浮宫",
            address: "Rue de Rivoli, Paris",
            coordinates: { lat: 48.8606, lng: 2.3376 }
          },
          category: "博物馆",
          cost: "€ 17/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "8公里",
        totalTime: "地铁游览",
        steps: []
      }
    },
    // 第14天：凡尔赛宫（简化）
    {
      day: 14,
      date: "2026-05-07",
      title: "凡尔赛宫一日游",
      city: "巴黎",
      color: "#ff3b30",
      summary: "🏰 凡尔赛宫 | 🌳 花园",
      tags: ["宫殿", "花园", "历史"],
      overview: {
        accommodation: {
          name: "Hotel Eiffel Turenne",
          address: "20 Avenue de Tourville, 75007 Paris",
          checkin: "已入住",
          checkout: "11:00前",
          coordinates: { lat: 48.8550, lng: 2.3050 }
        },
        transport: {
          type: "火车+步行",
          details: "巴黎→凡尔赛RER C线",
          cost: "€ 7.10/人往返"
        },
        importantNotes: []
      },
      timeline: [
        {
          id: "day14-palace",
          time: "10:00",
          duration: 180,
          icon: "🏰",
          title: "凡尔赛宫",
          description: "参观宫殿，镜厅，国王寝宫",
          location: {
            name: "凡尔赛宫",
            address: "Place d'Armes, Versailles",
            coordinates: { lat: 48.8049, lng: 2.1204 }
          },
          category: "景点",
          cost: "€ 20/人",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "地图" }
          ]
        }
      ],
      route: {
        totalDistance: "30公里",
        totalTime: "1小时单程",
        steps: []
      }
    },
    // 第15天：返程（简化）
    {
      day: 15,
      date: "2026-05-08",
      title: "巴黎最后时光与返程",
      city: "巴黎",
      color: "#ff3b30",
      summary: "🛍️ 香榭丽舍大街 | ✈️ 巴黎→上海",
      tags: ["购物", "返程", "飞行"],
      overview: {
        accommodation: {
          name: "无",
          address: "",
          checkin: "",
          checkout: "11:00前酒店退房"
        },
        transport: {
          type: "飞机",
          details: "巴黎→上海直飞",
          airline: "Air China",
          duration: "11小时30分"
        },
        importantNotes: ["提前3小时到达戴高乐机场"]
      },
      timeline: [
        {
          id: "day15-flight",
          time: "18:00",
          duration: 690,
          icon: "✈️",
          title: "飞往上海",
          description: "国航CA934直飞上海浦东",
          location: {
            name: "戴高乐机场T1",
            address: "CDG Terminal 1",
            coordinates: { lat: 49.0097, lng: 2.5479 }
          },
          category: "交通",
          cost: "已包含",
          actions: [
            { type: "details", label: "详情" },
            { type: "map", label: "查看路线" }
          ]
        }
      ],
      route: {
        totalDistance: "9500公里",
        totalTime: "11小时30分飞行",
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