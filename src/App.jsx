import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Car, Info, Utensils, Snowflake, Clock, 
  ChevronRight, Navigation, ShieldCheck, ExternalLink, 
  ThermometerSnowflake, LayoutDashboard, Wind, Home, Phone, 
  Map, BookOpen, Loader2, X, Cloud, CloudSnow, 
  CloudRain, Sun, Fuel, MapPinned, CameraIcon, Fish, Flame, 
  Waves, ChevronDown, Video, Star, ShoppingBag, Shirt, Mountain, Landmark, UtensilsCrossed
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDay, setActiveDay] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- Weather ---
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // --- Food Accordion ---
  const [openFoodSection, setOpenFoodSection] = useState('sushi'); 
  const [expandedChains, setExpandedChains] = useState({});

  // --- Attraction Filter ---
  const [activeRegion, setActiveRegion] = useState('all');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleChain = (name) => {
    setExpandedChains(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // --- Data & Helpers ---
  const locationCoords = {
    "旭川": { lat: 43.7706, lon: 142.3648 }, "美瑛 / 富良野": { lat: 43.5912, lon: 142.4410 },
    "洞爺湖": { lat: 42.5500, lon: 140.8167 }, "登別 / 札幌": { lat: 43.0618, lon: 141.3545 },
    "小樽 / 札幌": { lat: 43.1907, lon: 140.9946 }, "北廣島 / 札幌": { lat: 42.9723, lon: 141.5647 },
    "札幌": { lat: 43.0618, lon: 141.3545 }, "新千歲": { lat: 42.7884, lon: 141.6738 }
  };

  const fetchWeather = async (locName) => {
    const coords = locationCoords[locName] || locationCoords["札幌"];
    setWeatherLoading(true);
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`);
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) { console.error(error); } finally { setWeatherLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'itinerary') {
      const currentLoc = itinerary.find(d => d.day === activeDay)?.location;
      if (currentLoc) fetchWeather(currentLoc);
    }
  }, [activeDay, activeTab]);

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="text-orange-500" size={24} />;
    if (code >= 1 && code <= 3) return <Cloud className="text-slate-500" size={24} />;
    if (code >= 71 && code <= 77) return <CloudSnow className="text-cyan-600" size={24} />;
    return <Snowflake className="text-blue-500" size={24} />;
  };

  const mapLinks = {
    chitose: "https://www.google.com/maps/search/?api=1&query=新千歲機場+一幻拉麵", 
    jnet: "https://www.google.com/maps/search/?api=1&query=J-Net+Rent+A+Car+Sapporo",
    wbf: "https://www.google.com/maps/search/?api=1&query=Hotel+WBF+Grande+Asahikawa", 
    aeon: "https://www.google.com/maps/search/?api=1&query=AEON+Mall+Asahikawa+Ekimae",
    christmasTree: "https://www.google.com/maps/search/?api=1&query=Christmas+Tree+Biei", 
    bluePond: "https://www.google.com/maps/search/?api=1&query=Shirogane+Blue+Pond",
    ningle: "https://www.google.com/maps/search/?api=1&query=Ningle+Terrace", 
    asahiyamaZoo: "https://www.google.com/maps/search/?api=1&query=Asahiyama+Zoo",
    clarkHorse: "https://www.google.com/maps/search/?api=1&query=Clark+Horse+Garden", 
    mtUsu: "https://www.google.com/maps/search/?api=1&query=Usuzan+Ropeway",
    toyaKanko: "https://www.google.com/maps/search/?api=1&query=Toya+Kanko+Hotel", 
    jigokudani: "https://www.google.com/maps/search/?api=1&query=Noboribetsu+Jigokudani",
    lakeHillFarm: "https://www.google.com/maps/search/?api=1&query=Lake+Hill+Farm",
    sunnyHome: "https://www.google.com/maps/search/?api=1&query=Sapporo+Sunny+Home", // 泛指，因 Airbnb 無精確地標，建議出發前確認地址
    mtMoiwa: "https://www.google.com/maps/search/?api=1&query=Mt.+Moiwa+Ropeway",
    beerMuseum: "https://www.google.com/maps/search/?api=1&query=Sapporo+Beer+Museum", 
    okurayama: "https://www.google.com/maps/search/?api=1&query=Okurayama+Ski+Jump+Stadium",
    hitsujigaoka: "https://www.google.com/maps/search/?api=1&query=Sapporo+Hitsujigaoka+Observation+Hill", 
    otaruCanal: "https://www.google.com/maps/search/?api=1&query=Otaru+Canal",
    mitsuiOutlet: "https://www.google.com/maps/search/?api=1&query=Mitsui+Outlet+Park+Sapporo+Kitahiroshima", 
    hokkaidoJingu: "https://www.google.com/maps/search/?api=1&query=Hokkaido+Jingu",
    shiroiKoibito: "https://www.google.com/maps/search/?api=1&query=Shiroi+Koibito+Park", 
    odoriPark: "https://www.google.com/maps/search/?api=1&query=Odori+Park",
    tanukikoji: "https://www.google.com/maps/search/?api=1&query=Tanukikoji+Shopping+Arcade", 
    sunagawaSA: "https://www.google.com/maps/search/?api=1&query=Sunagawa+Service+Area",
    wattsuSA: "https://www.google.com/maps/search/?api=1&query=Wattsu+Service+Area", 
    uzusanSA: "https://www.google.com/maps/search/?api=1&query=Usuzan+Service+Area",
    hokkaidoUniv: "https://www.google.com/maps/search/?api=1&query=Hokkaido+University+Gingko+Avenue"
  };

  const itinerary = [
    { day: 1, date: "01/01 (四)", title: "雪國登陸：旭川第一夜", location: "旭川", transport: "自駕 3hr", 
      activities: [
        { time: "11:00", text: "新千歲機場 / 一幻拉麵", url: mapLinks.chitose },
        { time: "12:30", text: "Jネット 領車 / HEP", url: mapLinks.jnet },
        { time: "14:00", text: "道央道北上 / 砂川SA", url: mapLinks.sunagawaSA },
        { time: "16:00", text: "Hotel WBF Grande 入住", url: mapLinks.wbf },
        { time: "17:00", text: "AEON Mall 採買裝備", url: mapLinks.aeon },
        { time: "19:00", text: "晚餐：自由軒 / 拉麵", url: "https://maps.app.goo.gl/Jiyuuken" }
      ], 
      food: {
        lunch: ["機場拉麵道場 (一幻/空)", "豚丼名人 (機場3F)"],
        dinner: ["自由軒 (炸豬排/西餐)", "旭川拉麵村 (多間可選)"]
      },
      tips: "16:30 天黑，注意雪地駕駛。" 
    },
    { day: 2, date: "01/02 (五)", title: "美瑛樹木與精靈露台", location: "美瑛", transport: "自駕", 
      activities: [
        { time: "09:00", text: "美瑛景觀之路攝影", url: mapLinks.christmasTree },
        { time: "10:30", text: "美瑛神社 (限定御守)", url: "https://maps.app.goo.gl/BieiShrine" },
        { time: "12:00", text: "午餐：純平炸蝦飯", url: "https://maps.app.goo.gl/Junpei" },
        { time: "14:00", text: "白金青池 / 白鬚瀑布", url: mapLinks.bluePond },
        { time: "16:00", text: "富良野精靈露台點燈", url: mapLinks.ningle },
        { time: "18:30", text: "晚餐：山頭火拉麵", url: "https://maps.app.goo.gl/Santouka" }
      ], 
      food: {
        lunch: ["洋食與Cafe 純平 (炸蝦飯)", "大丸 (咖哩烏龍麵)"],
        dinner: ["山頭火 本店 (拉麵)", "蜂屋 (焦香豬油拉麵)"]
      },
      tips: "美瑛雪厚，請勿進入田地。" 
    },
    { day: 3, date: "01/03 (六)", title: "動物園 ➔ 雪中騎馬", location: "旭川", transport: "自駕", 
      activities: [
        { time: "09:15", text: "旭山動物園 (企鵝散步)", url: mapLinks.asahiyamaZoo },
        { time: "14:00", text: "克拉克馬場雪中騎馬", url: mapLinks.clarkHorse },
        { time: "16:00", text: "男山酒造 / 設計中心", url: "https://maps.app.goo.gl/Otokoyama" },
        { time: "18:30", text: "晚餐：梅光軒拉麵", url: "https://maps.app.goo.gl/Baikoken" }
      ], 
      food: {
        lunch: ["旭山動物園中央食堂", "ESPRESSO EYE (湯咖哩)"],
        dinner: ["梅光軒 本店 (醬油拉麵)", "居酒屋 天金 (老字號)"]
      },
      tips: "騎馬請穿厚襪。" 
    },
    { day: 4, date: "01/04 (日)", title: "南下洞爺：湖景溫泉", location: "洞爺湖", transport: "自駕 210km", 
      activities: [
        { time: "07:30", text: "啟程長途自駕", url: mapLinks.wbf },
        { time: "09:00", text: "砂川 SA (北菓樓泡芙)", url: mapLinks.sunagawaSA },
        { time: "12:00", text: "昭和新山熊牧場", url: "https://maps.app.goo.gl/BearPark" },
        { time: "13:30", text: "有珠山纜車 / 展望台", url: mapLinks.mtUsu },
        { time: "16:00", text: "入住洞爺觀光飯店", url: mapLinks.toyaKanko }
      ], 
      restStops: [
        {name:"岩見澤 SA", dist:"40km | 休息/加油"}, 
        {name:"輪厚 SA", dist:"130km | 大型/餐廳"}, 
        {name:"樽前 SA", dist:"160km | 景觀/廁所"},
        {name:"有珠山 SA", dist:"200km | 景觀/餐廳"}
      ], 
      food: {
        lunch: ["輪厚SA (豚丼/蕎麥麵)", "伊達 翁 (米其林蕎麥麵)"],
        dinner: ["飯店自助餐/會席 (住宿含)", "飯店自助餐/會席 (住宿含)"]
      },
      tips: "建議在 輪厚SA 吃午餐。" 
    },
    { day: 5, date: "01/05 (一)", title: "洞爺慢活：海鷗與披薩", location: "洞爺湖", transport: "自駕", 
      activities: [
        { time: "09:30", text: "洞爺湖遊覽船", url: mapLinks.toyaKanko },
        { time: "11:00", text: "雕刻公園 / 岡田屋", url: "https://maps.app.goo.gl/SculpturePark" },
        { time: "12:30", text: "Lake Hill Farm 披薩", url: mapLinks.lakeHillFarm },
        { time: "14:30", text: "金毘羅火口散策", url: "https://maps.app.goo.gl/VolcanoSite" },
        { time: "16:00", text: "藥師如來足湯", url: mapLinks.toyaKanko }
      ], 
      food: {
        lunch: ["Lake Hill Farm (披薩)", "Hydune (漢堡)"],
        dinner: ["飯店自助餐/會席 (住宿含)", "飯店自助餐/會席 (住宿含)"]
      },
      tips: "Lake Hill 可拍羊蹄山。" 
    },
    { day: 6, date: "01/06 (二)", title: "登別地獄 ➔ 札幌夜景", location: "札幌", transport: "自駕", 
      activities: [
        { time: "09:00", text: "前往登別地獄谷", url: mapLinks.jigokudani },
        { time: "10:30", text: "大湯沼天然足湯", url: mapLinks.jigokudani },
        { time: "12:00", text: "午餐：閻魔拉麵", url: "https://maps.app.goo.gl/EnmaDo" },
        { time: "15:00", text: "札幌 Airbnb 入住", url: mapLinks.sunnyHome },
        { time: "16:30", text: "藻岩山纜車夜景", url: mapLinks.mtMoiwa },
        { time: "19:00", text: "晚餐：湯咖哩 / 螃蟹", url: "https://maps.app.goo.gl/Garaku" }
      ], 
      food: {
        lunch: ["味之大王 (地獄拉麵)", "溫泉市場 (海鮮丼)"],
        dinner: ["Garaku (湯咖哩)", "冰雪之門 (螃蟹料理)"]
      },
      tips: "山頂極寒備暖暖包。" 
    },
    { day: 7, date: "01/07 (三)", title: "浪漫小樽：運河與天狗山", location: "小樽", transport: "自駕", 
      activities: [
        { time: "10:00", text: "三角市場海鮮丼", url: "https://maps.app.goo.gl/Sankaku" },
        { time: "11:30", text: "小樽運河 / 倉庫群", url: mapLinks.otaruCanal },
        { time: "13:00", text: "堺町通 (六花亭/LeTAO)", url: "https://maps.app.goo.gl/Sakaimachi" },
        { time: "16:00", text: "天狗山纜車夜景", url: "https://maps.app.goo.gl/Tengu" },
        { time: "18:30", text: "晚餐：政壽司或燒鳥", url: mapLinks.otaruCanal }
      ], 
      food: {
        lunch: ["三角市場 滝波食堂", "若雞時代 Naruto (炸雞)"],
        dinner: ["小樽政壽司 (本店)", "伊勢壽司 (米其林)"]
      },
      tips: "建議停運河旁停車場。" 
    },
    { day: 8, date: "01/08 (四)", title: "Outlet 與啤酒博物館", location: "札幌", transport: "自駕(終)", 
      activities: [
        { time: "10:00", text: "三井 Outlet 北廣島", url: mapLinks.mitsuiOutlet },
        { time: "13:00", text: "午餐：Outlet 美食", url: mapLinks.mitsuiOutlet },
        { time: "15:00", text: "札幌啤酒博物館", url: mapLinks.beerMuseum },
        { time: "17:00", text: "札幌 Factory", url: "https://maps.app.goo.gl/SapporoFactory" },
        { time: "19:00", text: "JR Tower T38 夜景", url: "https://maps.app.goo.gl/T38" }
      ], 
      food: {
        lunch: ["Outlet 美食街 (豚丼)", "弟子屈拉麵 (Outlet店)"],
        dinner: ["難陀 NANDA (螃蟹吃到飽)", "札幌啤酒園 (亦有非羊肉)"]
      },
      tips: "今日自駕最後一天。" 
    },
    { day: 9, date: "01/09 (五)", title: "神宮與大通公園", location: "札幌", transport: "地鐵", 
      activities: [
        { time: "09:00", text: "北海道神宮參拜", url: mapLinks.hokkaidoJingu },
        { time: "10:30", text: "圓山公園 / 六花亭", url: mapLinks.hokkaidoJingu },
        { time: "12:00", text: "午餐：湯咖哩 Suage+", url: "https://maps.app.goo.gl/MaruyamaFood" },
        { time: "14:00", text: "白色戀人公園", url: mapLinks.shiroiKoibito },
        { time: "16:30", text: "大通公園 / 電視塔", url: mapLinks.odoriPark },
        { time: "18:30", text: "狸小路 / 驚安殿堂", url: mapLinks.tanukikoji }
      ], 
      food: {
        lunch: ["Suage+ 圓山店", "迴轉壽司 Toriton"],
        dinner: ["螃蟹本家 (站前店)", "居酒屋 魚吉 (海鮮)"]
      },
      tips: "使用地鐵一日券。" 
    },
    { day: 10, date: "01/10 (六)", title: "大倉山與北大校園", location: "札幌", transport: "地鐵", 
      activities: [
        { time: "09:30", text: "大倉山跳台競技場", url: mapLinks.okurayama },
        { time: "11:30", text: "羊之丘展望台", url: mapLinks.hitsujigaoka },
        { time: "14:00", text: "北海道大學並木", url: mapLinks.hokkaidoUniv },
        { time: "16:00", text: "回 Airbnb 整理行李", url: mapLinks.sunnyHome },
        { time: "18:30", text: "晚餐：蟹本家饗宴", url: "https://maps.app.goo.gl/KaniHonke" }
      ], 
      food: {
        lunch: ["SAMA 湯咖哩", "拉麵 信玄 (味噌)"],
        dinner: ["螃蟹本家 (預約)", "一幻拉麵 (總本店)"]
      },
      tips: "預演還車動線。" 
    },
    { day: 11, date: "01/11 (日)", title: "機場最後衝刺", location: "新千歲", transport: "自駕", 
      activities: [
        { time: "08:15", text: "退房 / 機場加油", url: "https://maps.app.goo.gl/AirportGas" },
        { time: "09:15", text: "Jネット 還車", url: mapLinks.jnet },
        { time: "10:00", text: "機場報到 / 最後採買", url: mapLinks.chitose },
        { time: "11:55", text: "IT235 搭機回台", url: mapLinks.chitose }
      ], 
      food: {
        lunch: ["機場拉麵道場", "十勝豚丼 (機場)"],
        dinner: ["機上餐點", "溫暖的家"]
      },
      tips: "還車提早 40 分鐘。" 
    }
  ];

  const attractionsData = {
    "all": [], 
    "asahikawa": [
      { name: "旭山動物園", type: "動物", desc: "冬天必看企鵝散步，北極熊餵食秀。", url: mapLinks.asahiyamaZoo },
      { name: "白金青池", type: "自然", desc: "冬季結冰點燈，夢幻藍色。", url: mapLinks.bluePond },
      { name: "白鬚瀑布", type: "自然", desc: "不凍瀑布，藍色河水。", url: mapLinks.bluePond },
      { name: "聖誕樹之木", type: "攝影", desc: "雪原中的孤獨一棵樹。", url: mapLinks.christmasTree },
      { name: "精靈露台", type: "購物", desc: "森林中的木屋聚落，夜晚點燈極美。", url: mapLinks.ningle },
      { name: "克拉克馬場", type: "體驗", desc: "雪地騎馬體驗。", url: mapLinks.clarkHorse },
    ],
    "sapporo": [
      { name: "大通公園", type: "地標", desc: "札幌市中心，雪祭會場。", url: mapLinks.odoriPark },
      { name: "北海道神宮", type: "文化", desc: "北海道總鎮守，雪中參拜。", url: mapLinks.hokkaidoJingu },
      { name: "白色戀人公園", type: "觀光", desc: "歐風建築，參觀工廠。", url: mapLinks.shiroiKoibito },
      { name: "藻岩山", type: "夜景", desc: "日本新三大夜景。", url: mapLinks.mtMoiwa },
      { name: "狸小路", type: "購物", desc: "長型商店街，藥妝土產。", url: mapLinks.tanukikoji },
      { name: "北海道大學", type: "自然", desc: "白楊木林蔭道。", url: mapLinks.hokkaidoUniv },
    ],
    "otaru": [
      { name: "小樽運河", type: "地標", desc: "倉庫群倒影，必拍景點。", url: mapLinks.otaruCanal },
      { name: "堺町通商店街", type: "購物", desc: "六花亭、北菓樓、LeTAO總店。", url: "https://maps.app.goo.gl/Sakaimachi" },
      { name: "天狗山", type: "夜景", desc: "小樽全景，電影情書場景。", url: "https://maps.app.goo.gl/Tengu" },
      { name: "三角市場", type: "美食", desc: "車站旁，新鮮海鮮丼。", url: "https://maps.app.goo.gl/Sankaku" },
      { name: "音樂盒堂", type: "文化", desc: "蒸氣時鐘，各式音樂盒。", url: "https://maps.app.goo.gl/Orgel" },
    ],
    "toya": [
      { name: "昭和新山熊牧場", type: "動物", desc: "餵食棕熊，可愛有趣。", url: "https://maps.app.goo.gl/BearPark" },
      { name: "有珠山纜車", type: "自然", desc: "俯瞰洞爺湖與昭和新山。", url: mapLinks.mtUsu },
      { name: "登別地獄谷", type: "自然", desc: "火山地形，煙霧繚繞。", url: mapLinks.jigokudani },
      { name: "Lake Hill Farm", type: "美食", desc: "牧場冰淇淋與披薩。", url: mapLinks.lakeHillFarm },
      { name: "洞爺湖遊覽船", type: "觀光", desc: "中島巡遊，餵食海鷗。", url: mapLinks.toyaKanko },
    ]
  };

  const foodData = {
    sushi: { title: "壽司雙雄", icon: <Star size={24}/>, color: "indigo", items: [
      { name: "根室花丸 (Nemuro Hanamaru)", type: "壽司", isChain: true, desc: "首推 JR Tower 店，務必預約。", branches: [
        { name: "JR Tower (6F)", desc: "札幌站 | 極熱門", url: "https://maps.app.goo.gl/NemuroHanamaru" }, 
        { name: "Miredo (B1)", desc: "札幌站 | 環境新", url: "https://maps.app.goo.gl/MiredoHanamaru" },
        { name: "西大廳店 (立食)", desc: "札幌站 | 站著吃", url: "https://maps.app.goo.gl/HanamaruStanding" },
        { name: "COCONO SUSUKINO", desc: "薄野 | 2023開幕", url: "https://maps.app.goo.gl/CoconoHanamaru" },
        { name: "Le Trois (8F)", desc: "大通 | 點餐式", url: "https://maps.app.goo.gl/LeTroisHanamaru" },
        { name: "南25條店", desc: "自駕 | 有停車場", url: "https://maps.app.goo.gl/Minami25Hanamaru" },
        { name: "藻岩山店", desc: "夜景 | 好停車", url: "https://maps.app.goo.gl/HanamaruMoiwa" },
        { name: "西野店", desc: "西區 | 住宅區", url: "https://maps.app.goo.gl/NishinoHanamaru" },
        { name: "白石南鄉店", desc: "白石 | 地鐵旁", url: "https://maps.app.goo.gl/NangoHanamaru" },
        { name: "北口店", desc: "札幌北 | 住宅區", url: "https://maps.app.goo.gl/KitaguchiHanamaru" },
        { name: "手稻前田店", desc: "手稻 | 當地人", url: "https://maps.app.goo.gl/TeineHanamaru" },
        { name: "新千歲機場 (3F)", desc: "機場 | 登機前", url: "https://maps.app.goo.gl/ChitoseHanamaru" },
        { name: "函館店", desc: "函館 | 閃亮之星", url: "https://maps.app.goo.gl/HakodateHanamaru" },
        { name: "根室本店", desc: "道東 | 發源地", url: "https://maps.app.goo.gl/NemuroHonten" },
        { name: "中標津店", desc: "道東 | 當地人", url: "https://maps.app.goo.gl/NakashibetsuHanamaru" }
      ]},
      { name: "Toriton (トリトン)", type: "壽司", isChain: true, desc: "在地人最愛，魚料大。", branches: [
        { name: "豐平店", desc: "36號線 | 好停車", url: "https://maps.app.goo.gl/ToritonToyohira" }, 
        { name: "圓山店", desc: "神宮旁 | 極熱門", url: "https://maps.app.goo.gl/ToritonMaruyama" },
        { name: "伏見店", desc: "藻岩山 | 自駕推", url: "https://maps.app.goo.gl/ToritonFushimi" }, 
        { name: "北8條店", desc: "啤酒館 | 方便", url: "https://maps.app.goo.gl/ToritonKita8" },
        { name: "平岸店", desc: "平岸 | 住宅區", url: "https://maps.app.goo.gl/ToritonHiragishi" },
        { name: "清田店", desc: "Outlet | 順路", url: "https://maps.app.goo.gl/ToritonKiyota" },
        { name: "厚別店", desc: "厚別 | 寬敞", url: "https://maps.app.goo.gl/ToritonAtsubetsu" },
        { name: "榮町店", desc: "丘珠 | 機場旁", url: "https://maps.app.goo.gl/ToritonSakaemachi" },
        { name: "江別店", desc: "IC旁 | 往旭川", url: "https://maps.app.goo.gl/ToritonEbetsu" },
        { name: "旭川豊岡店", desc: "旭川 | 動物園", url: "https://maps.app.goo.gl/ToritonAsahikawa" }
      ]}
    ]},
    seafood: { title: "極上海鮮", icon: <Fish size={24}/>, color: "sky", items: [
      { name: "札幌螃蟹本家", type: "螃蟹", desc: "傳統會席料理，氣派豪華。", url: "https://maps.app.goo.gl/KaniHonke" },
      { name: "冰雪之門", type: "螃蟹", desc: "老字號螃蟹專賣，帝王蟹全餐。", url: "https://maps.app.goo.gl/Hyousetsu" },
      { name: "難陀 NANDA", type: "吃到飽", desc: "三大蟹吃到飽，需提前預約。", url: "https://maps.app.goo.gl/Nanda" },
      { name: "函館海膽 村上", type: "海膽", desc: "札幌店，無添加明礬的甜美海膽。", url: "https://maps.app.goo.gl/UniMurakami" },
      { name: "二條市場 大磯", type: "海鮮丼", desc: "觀光客友善，烤魚與海鮮丼。", url: "https://maps.app.goo.gl/Ohiso" },
      { name: "海鮮処 魚屋的台所", type: "海鮮丼", desc: "二條市場，CP值高的海鮮丼。", url: "https://maps.app.goo.gl/Uoya" },
      { name: "三角市場 滝波食堂", type: "海鮮丼", desc: "小樽必吃，自選配料海鮮丼。", url: "https://maps.app.goo.gl/Takinami" },
      { name: "溫泉市場", type: "海鮮", desc: "登別地獄谷旁，閻魔炒麵與海鮮。", url: "https://maps.app.goo.gl/OnsenIchiba" },
      { name: "居酒屋 天金", type: "海鮮", desc: "旭川老店，海膽火鍋與生魚片。", url: "https://maps.app.goo.gl/Tenkin" }
    ]},
    sapporo: { title: "札幌 / 小樽", icon: <UtensilsCrossed size={24}/>, color: "pink", items: [
      { name: "Suage+ 湯咖哩", type: "咖哩", desc: "串燒食材，墨魚湯頭。", url: "https://maps.app.goo.gl/SuagePlus" },
      { name: "GARAKU 湯咖哩", type: "咖哩", desc: "排隊名店，湯頭濃郁。", url: "https://maps.app.goo.gl/Garaku" },
      { name: "奧芝商店", type: "咖哩", desc: "鮮蝦湯頭始祖。", url: "https://maps.app.goo.gl/Okushiba" },
      { name: "燒肉 多牛", type: "燒肉", desc: "CP值高，非羊肉選擇。", url: "https://maps.app.goo.gl/Tagyu" },
      { name: "佐藤聖代", type: "甜點", desc: "深夜聖代名店。", url: "https://maps.app.goo.gl/SatoParfait" },
      { name: "信玄拉麵", type: "拉麵", desc: "味噌拉麵與炒飯。", url: "https://maps.app.goo.gl/Shingen" },
      { name: "欅 (Keyaki)", type: "拉麵", desc: "薄野味噌拉麵代表。", url: "https://maps.app.goo.gl/Keyaki" },
      { name: "六花亭 札幌本店", type: "甜點", desc: "二樓可內用限定甜點。", url: "https://maps.app.goo.gl/RokkateiSapporo" }
    ]},
    asahikawa: { title: "旭川 / 美瑛", icon: <Flame size={24}/>, color: "blue", items: [
      { name: "自由軒", type: "西餐", desc: "孤獨美食家炸豬排。", url: "https://maps.app.goo.gl/Jiyuuken" },
      { name: "梅光軒 本店", type: "拉麵", desc: "米其林推薦醬油拉麵。", url: "https://maps.app.goo.gl/Baikoken" },
      { name: "旭川拉麵 青葉", type: "拉麵", desc: "昭和風味老店。", url: "https://maps.app.goo.gl/Aoba" },
      { name: "拉麵屋 蜂屋", type: "拉麵", desc: "獨特焦香豬油。", url: "https://maps.app.goo.gl/Hachiya" },
      { name: "純平 (Junpei)", type: "炸物", desc: "美瑛超人氣炸蝦飯。", url: "https://maps.app.goo.gl/Junpei" },
      { name: "福吉咖啡", type: "輕食", desc: "旭橋造型鯛魚燒。", url: "https://maps.app.goo.gl/Fukuyoshi" },
      { name: "三四郎", type: "居酒屋", desc: "孤獨美食家推薦。", url: "https://maps.app.goo.gl/Sanshiro" },
      { name: "The Sun 藏人", type: "甜點", desc: "石造倉庫甜點店。", url: "https://maps.app.goo.gl/SunKurando" },
      { name: "富良野 唯我獨尊", type: "咖哩", desc: "黑咖哩與香腸。", url: "https://maps.app.goo.gl/YuigaDoxon" }
    ]},
    toyako: { title: "洞爺 / 登別", icon: <Waves size={24}/>, color: "cyan", items: [
      { name: "望羊蹄", type: "西餐", desc: "懷舊漢堡排。", url: "https://maps.app.goo.gl/Boyotei" },
      { name: "Lake Hill Farm", type: "輕食", desc: "披薩與冰淇淋。", url: "https://maps.app.goo.gl/LakeHillFarm" },
      { name: "岡田屋", type: "甜點", desc: "甜湯與大福。", url: "https://maps.app.goo.gl/Okadaya" },
      { name: "一本亭", type: "拉麵", desc: "清爽系拉麵。", url: "https://maps.app.goo.gl/Ippontei" },
      { name: "仙堂庵", type: "海鮮", desc: "Wakasaimo樓上。", url: "https://maps.app.goo.gl/Sendoan" },
      { name: "Hydune", type: "漢堡", desc: "湖畔美式漢堡。", url: "https://maps.app.goo.gl/Hydune" },
      { name: "牛助", type: "燒肉", desc: "洞爺湖和牛燒肉。", url: "https://maps.app.goo.gl/Gyusuke" },
      { name: "閻魔拉麵", type: "拉麵", desc: "登別地獄辣味。", url: "https://maps.app.goo.gl/EnmaDo" },
      { name: "福庵", type: "蕎麥", desc: "登別手工蕎麥麵。", url: "https://maps.app.goo.gl/Fukuan" }
    ]}
  };

  const bgImageUrl = "https://i1.wp.com/marktrip.tw/wp-content/uploads/2025/07/20250722140025_0_ec4c65.webp?quality=90&ssl=1";

  return (
    <div 
      className="min-h-screen font-sans text-slate-800 pb-24 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      <div className="min-h-screen w-full bg-white/40 backdrop-blur-[2px]">
        {/* Top Bar */}
        <nav className={`fixed top-0 w-full z-50 transition-all ${isScrolled ? "bg-white/80 backdrop-blur shadow-lg border-b border-indigo-500/10" : "bg-transparent"} py-4 px-5 flex justify-between items-center`}>
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/30"><Snowflake size={20} className="text-white"/></div>
            <span className={`font-black text-xl tracking-tighter text-indigo-900 drop-shadow-sm`}>HOKKAIDO <span className="text-indigo-600">26</span></span>
          </div>
        </nav>

        <div className="pt-24 px-4 max-w-md mx-auto">
          {activeTab === 'itinerary' && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-500">
              {/* Day Selector Strip */}
              <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4">
                {itinerary.map(item => (
                  <button key={item.day} onClick={() => setActiveDay(item.day)} className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all ${activeDay === item.day ? "bg-indigo-600 border-indigo-400 shadow-xl shadow-indigo-600/40 scale-105 text-white" : "bg-white/70 border-slate-200 text-slate-500"}`}>
                    <span className={`text-[11px] font-bold ${activeDay === item.day ? "opacity-90" : "opacity-70"}`}>D{item.day}</span>
                    <span className="text-xl font-black">{item.date.split('/')[1].split(' ')[0]}</span>
                  </button>
                ))}
              </div>

              {itinerary.filter(d => d.day === activeDay).map(day => (
                <div key={day.day}>
                  {/* Info Card */}
                  <div className="mb-8 mt-2">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-black text-indigo-950 leading-tight flex-1 drop-shadow-sm">{day.title}</h2>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-600 bg-white/70 p-4 rounded-2xl border border-white/50 backdrop-blur-sm shadow-sm">
                      <div className="flex items-center gap-2">
                        {weatherLoading ? <Loader2 size={20} className="animate-spin text-indigo-600"/> : weather ? getWeatherIcon(weather.weathercode) : <Cloud size={20}/>}
                        <span className="text-lg text-slate-800">{weather ? `${weather.temperature}°C` : "--"}</span>
                      </div>
                      <span className="w-px h-4 bg-slate-300"></span>
                      <div className="flex items-center gap-1.5"><MapPin size={16} className="text-indigo-600"/> {day.location}</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="relative pl-6 border-l-2 border-indigo-500/20 space-y-10 mb-10">
                    {day.activities.map((act, i) => (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute -left-[31px] top-1 w-5 h-5 rounded-full border-4 border-white/80 ${act.time.includes('11:00') ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.6)]" : "bg-indigo-500"}`}></div>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-bold text-indigo-600 mb-1 tracking-wide">{act.time}</div>
                            <div className="text-lg font-bold text-slate-800 leading-snug drop-shadow-sm">{act.text}</div>
                          </div>
                          {act.url && <a href={act.url} target="_blank" className="text-slate-400 hover:text-indigo-600 p-2 bg-white/70 rounded-xl ml-2 shadow-sm border border-white/50"><Map size={20}/></a>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rest Stops (Only Day 4) */}
                  {day.restStops && (
                    <div className="mb-8">
                       <h3 className="font-black text-lg mb-3 flex items-center gap-2 text-indigo-900"><Car size={20}/> 沿途休息站 (SA/PA)</h3>
                       <div className="space-y-3">
                         {day.restStops.map((stop, idx) => (
                           <div key={idx} className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-white/50">
                             <div className="font-bold text-slate-800">{stop.name}</div>
                             <div className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{stop.dist}</div>
                           </div>
                         ))}
                       </div>
                    </div>
                  )}

                  {/* Info Chips */}
                  <div className="grid grid-cols-1 gap-4 mb-24">
                    {/* Food Recommendation Card */}
                    <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-100 flex flex-col gap-3 shadow-sm backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Utensils className="text-amber-500" size={20} />
                        <span className="text-sm text-amber-600 font-black uppercase tracking-wider">每日美食推薦</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-white/60 p-3 rounded-2xl border border-amber-100/50">
                          <div className="text-xs font-bold text-amber-500 mb-1">LUNCH (午餐)</div>
                          <ul className="list-disc pl-4 text-sm font-bold text-slate-700 space-y-1">
                            {day.food.lunch.map((item, idx) => <li key={idx}>{item}</li>)}
                          </ul>
                        </div>
                        <div className="bg-white/60 p-3 rounded-2xl border border-amber-100/50">
                          <div className="text-xs font-bold text-amber-500 mb-1">DINNER (晚餐)</div>
                          <ul className="list-disc pl-4 text-sm font-bold text-slate-700 space-y-1">
                            {day.food.dinner.map((item, idx) => <li key={idx}>{item}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-cyan-50/70 p-4 rounded-2xl border border-cyan-100 flex items-start gap-3 shadow-sm backdrop-blur-sm">
                      <Info className="text-cyan-600 shrink-0 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-cyan-600 font-black uppercase mb-1 tracking-wider">行程筆記</div>
                        <div className="text-base font-bold text-slate-800">{day.tips}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attractions' && (
             <div className="space-y-6 pb-24 animate-in fade-in">
               {/* Region Filter */}
               <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                 {[
                   {id: 'all', label: '全部'},
                   {id: 'asahikawa', label: '旭川/美瑛'},
                   {id: 'sapporo', label: '札幌'},
                   {id: 'otaru', label: '小樽'},
                   {id: 'toya', label: '洞爺/登別'},
                 ].map(r => (
                   <button 
                     key={r.id} 
                     onClick={() => setActiveRegion(r.id)}
                     className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeRegion === r.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" : "bg-white/70 text-slate-600 border border-white/50"}`}
                   >
                     {r.label}
                   </button>
                 ))}
               </div>

               {/* Attraction List */}
               <div className="grid gap-4">
                 {Object.entries(attractionsData).map(([region, items]) => {
                   if (activeRegion !== 'all' && activeRegion !== region) return null;
                   return items.map((item, idx) => (
                     <div key={`${region}-${idx}`} className="bg-white/70 p-4 rounded-2xl border border-white/50 shadow-sm flex justify-between items-start backdrop-blur-sm">
                       <div>
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-md uppercase tracking-wider">{item.type}</span>
                            <span className="font-bold text-slate-800 text-lg">{item.name}</span>
                         </div>
                         <div className="text-sm text-slate-600">{item.desc}</div>
                       </div>
                       <a href={item.url} target="_blank" className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm border border-slate-100 hover:scale-105 transition-transform"><Map size={20}/></a>
                     </div>
                   ));
                 })}
               </div>
             </div>
          )}

          {activeTab === 'food' && (
            <div className="space-y-5 pb-24 animate-in fade-in">
              {Object.entries(foodData).map(([key, section]) => (
                <div key={key} className="bg-white/70 rounded-3xl border border-white/50 overflow-hidden shadow-lg backdrop-blur-sm">
                  <button onClick={() => setOpenFoodSection(openFoodSection === key ? null : key)} className="w-full p-5 flex items-center justify-between active:bg-white/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-2xl bg-${section.color}-50 text-${section.color}-600 border border-${section.color}-100`}>{section.icon}</div>
                      <span className="font-black text-xl text-slate-800 tracking-tight">{section.title}</span>
                    </div>
                    <ChevronDown size={24} className={`text-slate-400 transition-transform ${openFoodSection === key ? "rotate-180 text-indigo-600" : ""}`}/>
                  </button>
                  {openFoodSection === key && (
                    <div className="border-t border-slate-100 bg-white/50">
                      {section.items.map((item, i) => (
                        <div key={i} className="p-5 border-b border-slate-100 last:border-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="font-bold text-lg text-slate-800">{item.name}</span>
                              {item.isChain && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-black shadow-md shadow-indigo-600/20">連鎖</span>}
                            </div>
                            {!item.isChain && <a href={item.url} target="_blank" className="text-slate-400 hover:text-indigo-600 bg-white/60 p-2 rounded-xl shadow-sm border border-slate-100"><Map size={20}/></a>}
                          </div>
                          <div className="text-sm text-slate-600 mb-3 leading-relaxed font-medium">{item.desc}</div>
                          
                          {item.isChain && (
                            <div className="mt-3 bg-white/60 rounded-xl border border-slate-100 overflow-hidden shadow-sm">
                              <button onClick={() => toggleChain(item.name)} className="w-full p-3 text-xs font-bold text-indigo-600 flex items-center justify-between bg-white/40 hover:bg-white/60 transition-colors">
                                <span>{expandedChains[item.name] ? "收合分店清單" : "查看推薦分店"}</span>
                                <ChevronDown size={14} className={`transition-transform ${expandedChains[item.name] ? "rotate-180" : ""}`}/>
                              </button>
                              {expandedChains[item.name] && (
                                <div className="p-2 grid gap-2">
                                  {item.branches.map((b, bi) => (
                                    <a key={bi} href={b.url} target="_blank" className="flex justify-between items-center p-3 bg-white/80 rounded-lg active:bg-indigo-50/50 transition-colors border border-slate-100 hover:border-indigo-200">
                                      <div>
                                        <div className="text-sm font-bold text-slate-800">{b.name}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{b.desc}</div>
                                      </div>
                                      <ExternalLink size={16} className="text-indigo-400"/>
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'prep' && (
            <div className="space-y-6 pb-24 animate-in fade-in">
              {/* 住宿清單 */}
              <div className="bg-white/70 p-6 rounded-3xl border border-white/50 shadow-lg backdrop-blur-sm">
                <h3 className="font-black text-xl mb-6 flex items-center gap-3 text-slate-800"><Home size={24} className="text-indigo-500"/> 住宿清單</h3>
                <div className="space-y-6 relative pl-2">
                  <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-200"></div>
                  
                  {/* WBF */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-blue-600 font-bold mb-1">01/01 - 04 (3泊)</div>
                        <div className="font-bold text-lg text-slate-800">Hotel WBF Grande</div>
                        <div className="text-sm text-slate-500 mt-1">旭川市 宮下通10-3-3</div>
                      </div>
                      <a href={mapLinks.wbf} target="_blank" className="bg-white/80 p-2 rounded-xl text-slate-500 border border-slate-200 hover:text-indigo-600 transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"><Map size={16}/> MAP</a>
                    </div>
                  </div>

                  {/* 洞爺觀光 */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-cyan-600 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-cyan-600 font-bold mb-1">01/04 - 06 (2泊)</div>
                        <div className="font-bold text-lg text-slate-800">洞爺觀光飯店</div>
                        <div className="text-sm text-slate-500 mt-1">洞爺湖温泉144</div>
                      </div>
                      <a href={mapLinks.toyaKanko} target="_blank" className="bg-white/80 p-2 rounded-xl text-slate-500 border border-slate-200 hover:text-indigo-600 transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"><Map size={16}/> MAP</a>
                    </div>
                  </div>

                  {/* Sunny Home */}
                  <div className="relative pl-6">
                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 bg-pink-600 rounded-full border-4 border-white shadow-sm"></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-pink-600 font-bold mb-1">01/06 - 11 (5泊)</div>
                        <div className="font-bold text-lg text-slate-800">Sunny Home</div>
                        <div className="text-sm text-slate-500 mt-1">札幌市中央区南13条</div>
                      </div>
                      <a href={mapLinks.sunnyHome} target="_blank" className="bg-white/80 p-2 rounded-xl text-slate-500 border border-slate-200 hover:text-indigo-600 transition-colors font-bold text-xs flex items-center gap-1 shadow-sm"><Map size={16}/> MAP</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* 路況中心 */}
              <div className="bg-white/70 p-6 rounded-3xl border border-white/50 shadow-lg backdrop-blur-sm">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-slate-800"><Car size={24} className="text-emerald-500"/> 路況中心</h3>
                <div className="grid grid-cols-1 gap-3">
                  <a href="https://www.drivetraffic.jp/map?area=01" target="_blank" className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-100 active:scale-95 transition-transform hover:bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><MapPinned size={20}/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">DraTra 高速道路</div>
                        <div className="text-xs text-slate-500">查詢封路與管制</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-400"/>
                  </a>
                  <a href="https://www.road-info-pr.mlit.go.jp/roadinfo/index.html" target="_blank" className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-100 active:scale-95 transition-transform hover:bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Map size={20}/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">北海道開發局</div>
                        <div className="text-xs text-slate-500">一般國道積雪情報</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-400"/>
                  </a>
                  <a href="https://www.jartic.or.jp/" target="_blank" className="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-slate-100 active:scale-95 transition-transform hover:bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Video size={20}/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">JARTIC 路況</div>
                        <div className="text-xs text-slate-500">即時路況影像</div>
                      </div>
                    </div>
                    <ExternalLink size={16} className="text-slate-400"/>
                  </a>
                </div>
              </div>

              {/* 裝備採買指南 (New) */}
              <div className="bg-white/70 p-6 rounded-3xl border border-white/50 shadow-lg backdrop-blur-sm">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-slate-800"><ShoppingBag size={24} className="text-pink-500"/> 裝備採買指南</h3>
                <div className="bg-white/60 p-4 rounded-2xl border border-slate-100 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-pink-500"/>
                    <span className="font-bold text-slate-700">旭川站前 AEON Mall (距住宿 3 分鐘)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-1.5 rounded-lg"><Shirt size={16} className="text-slate-500"/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Montbell (2F)</div>
                        <div className="text-xs text-slate-500">戶外機能衣、雪靴、冰爪</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-1.5 rounded-lg"><ShoppingBag size={16} className="text-slate-500"/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Sports Authority (3F)</div>
                        <div className="text-xs text-slate-500">滑雪手套、保暖厚襪</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-1.5 rounded-lg"><Shirt size={16} className="text-slate-500"/></div>
                      <div>
                        <div className="font-bold text-slate-800 text-sm">Uniqlo / GU (1F/2F)</div>
                        <div className="text-xs text-slate-500">發熱衣褲 (Heattech)</div>
                      </div>
                    </div>
                  </div>
                </div>
                <a href={mapLinks.aeon} target="_blank" className="w-full flex items-center justify-center gap-2 p-2.5 bg-pink-50 text-pink-600 rounded-xl font-bold text-sm border border-pink-100 hover:bg-pink-100 transition-colors mt-2">
                  <Map size={16}/> 導航至 AEON Mall
                </a>
              </div>

              {/* 租車資訊 (Moved to Bottom) */}
              <div className="bg-white/80 p-6 rounded-3xl border border-indigo-100 shadow-xl backdrop-blur-md">
                <h3 className="font-black text-xl mb-4 flex items-center gap-3 text-indigo-900"><Car size={24} className="text-indigo-600"/> 租車資訊</h3>
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Reservation No.</span>
                    <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CONFIRMED</span>
                  </div>
                  <div className="text-2xl font-black text-indigo-900 tracking-tight font-mono">RC12461016850372704</div>
                </div>
                <a href="https://booking.cars.travel.rakuten.co.jp/cars/rcf080a.do?ycd=RC12461016850372704" target="_blank" className="w-full flex items-center justify-center gap-2 p-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-transform hover:bg-indigo-700">
                  <ExternalLink size={18}/>
                  查看預約詳情 (樂天旅遊)
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Nav */}
        <div className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-100 pb-safe pt-2 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center h-20">
            <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'itinerary' ? "text-indigo-600 -translate-y-1" : "text-slate-400"}`}>
              <LayoutDashboard size={24} className={activeTab === 'itinerary' ? "drop-shadow-[0_0_10px_rgba(79,70,229,0.2)]" : ""}/><span className="text-[10px] font-bold">行程</span>
            </button>
            <button onClick={() => setActiveTab('attractions')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'attractions' ? "text-indigo-600 -translate-y-1" : "text-slate-400"}`}>
              <Landmark size={24} className={activeTab === 'attractions' ? "drop-shadow-[0_0_10px_rgba(79,70,229,0.2)]" : ""}/><span className="text-[10px] font-bold">景點</span>
            </button>
            <button onClick={() => setActiveTab('food')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'food' ? "text-indigo-600 -translate-y-1" : "text-slate-400"}`}>
              <Utensils size={24} className={activeTab === 'food' ? "drop-shadow-[0_0_10px_rgba(79,70,229,0.2)]" : ""}/><span className="text-[10px] font-bold">美食</span>
            </button>
            <button onClick={() => setActiveTab('prep')} className={`flex flex-col items-center gap-1.5 w-16 transition-all ${activeTab === 'prep' ? "text-indigo-600 -translate-y-1" : "text-slate-400"}`}>
              <Car size={24} className={activeTab === 'prep' ? "drop-shadow-[0_0_10px_rgba(79,70,229,0.2)]" : ""}/><span className="text-[10px] font-bold">準備</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;