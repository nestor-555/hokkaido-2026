import React, { useState, useEffect } from 'react';
import { 
  Calendar, MapPin, Car, Info, ShoppingBag, 
  Utensils, Snowflake, Clock, AlertTriangle, 
  ChevronRight, Navigation, ShieldCheck, 
  ExternalLink, Plane, CheckSquare, ListChecks,
  ThermometerSnowflake, LayoutDashboard, Camera,
  Wind, CreditCard, Home, Phone, Map, BookOpen,
  Coffee, Waves, TramFront, LassoSelect, Sparkles,
  Loader2, X, Beer, Moon, Mountain, CloudRain, Sun, Cloud, CloudSnow, Store, Fuel, MapPinned, Ticket, CameraIcon,
  ChefHat, Fish, Flame, Star, ChevronDown, Monitor
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDay, setActiveDay] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // --- Weather State ---
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  // --- Gemini API State ---
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [showAiModal, setShowAiModal] = useState(false);

  // --- Food Accordion State ---
  const [openFoodSection, setOpenFoodSection] = useState('sapporo'); 
  const [expandedChains, setExpandedChains] = useState({});

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleChain = (name) => {
    setExpandedChains(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const locationCoords = {
    "旭川": { lat: 43.7706, lon: 142.3648 },
    "美瑛 / 富良野": { lat: 43.5912, lon: 142.4410 },
    "洞爺湖": { lat: 42.5500, lon: 140.8167 },
    "登別 / 札幌": { lat: 43.0618, lon: 141.3545 },
    "小樽 / 札幌": { lat: 43.1907, lon: 140.9946 },
    "北廣島 / 札幌": { lat: 42.9723, lon: 141.5647 },
    "札幌": { lat: 43.0618, lon: 141.3545 },
    "新千歲": { lat: 42.7884, lon: 141.6738 }
  };

  const fetchWeather = async (locName) => {
    const coords = locationCoords[locName] || locationCoords["札幌"];
    setWeatherLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
      );
      const data = await response.json();
      setWeather(data.current_weather);
    } catch (error) {
      console.error("Weather fetch failed", error);
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'itinerary') {
      const currentLoc = itinerary.find(d => d.day === activeDay)?.location;
      if (currentLoc) fetchWeather(currentLoc);
    }
  }, [activeDay, activeTab]);

  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="text-yellow-400" size={24} />;
    if (code >= 1 && code <= 3) return <Cloud className="text-gray-300" size={24} />;
    if (code >= 71 && code <= 77) return <CloudSnow className="text-blue-200" size={24} />;
    if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400" size={24} />;
    return <Snowflake className="text-blue-100" size={24} />;
  };

  // --- Gemini API ---
  const apiKey = ""; 

  const callGemini = async (prompt, systemInstruction = "") => {
    setAiLoading(true);
    setShowAiModal(true);
    setAiResult(null);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] }
    };
    const fetchWithRetry = async (retries = 5, delay = 1000) => {
      try {
        const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error('API request failed');
        return await response.json();
      } catch (error) {
        if (retries <= 0) throw error;
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(retries - 1, delay * 2);
      }
    };
    try {
      const result = await fetchWithRetry();
      setAiResult(result.candidates?.[0]?.content?.parts?.[0]?.text || "無法生成建議。");
    } catch (err) { setAiResult("連線失敗。"); } finally { setAiLoading(false); }
  };

  const generateDayInsight = (dayPlan) => {
    const activityList = dayPlan.activities.map(a => a.text).join(', ');
    callGemini(`請針對以下行程提供 200 字的深度建議、隱藏景點或文化深度故事：日期 ${dayPlan.date}, 地點：${dayPlan.location}, 活動清單：${activityList}`, "你是一位北海道旅遊專家。");
  };

  // 美食清單資料庫 (分店資料已補全)
  const foodData = {
    sapporo: {
      title: "札幌 / 小樽美食",
      enTitle: "Sapporo Area",
      icon: <Fish className="text-white" size={24}/>,
      color: "pink",
      items: [
        { 
          name: "根室花丸 (Nemuro Hanamaru)", 
          type: "壽司", 
          isChain: true,
          desc: "北海道第一迴轉壽司，鮮度極高。請務必使用「EPARK」App 預約。", 
          branches: [
            { name: "[札幌站] JR Tower Stella Place (6F)", desc: "最熱門，需極早排隊", url: "https://maps.app.goo.gl/NemuroHanamaru" },
            { name: "[札幌站] Miredo店 (B1)", desc: "環境較新，座位舒適", url: "https://maps.app.goo.gl/MiredoHanamaru" },
            { name: "[札幌站] 西大廳店 (立食)", desc: "站著吃，翻桌快", url: "https://maps.app.goo.gl/HanamaruStanding" },
            { name: "[薄野] COCONO SUSUKINO (B1)", desc: "2023新開幕，地鐵直結", url: "https://maps.app.goo.gl/CoconoHanamaru" },
            { name: "[大通] Le Trois (8F)", desc: "非迴轉，是「城鎮壽司」型態", url: "https://maps.app.goo.gl/LeTroisHanamaru" },
            { name: "[南25條] 南25條店", desc: "有停車場，自駕推薦", url: "https://maps.app.goo.gl/Minami25Hanamaru" },
            { name: "[西野] 西野店", desc: "住宅區分店，觀光客少", url: "https://maps.app.goo.gl/NishinoHanamaru" },
            { name: "[白石] 白石南鄉店", desc: "地鐵南鄉18丁目站旁", url: "https://maps.app.goo.gl/NangoHanamaru" },
            { name: "[新千歲] 機場店 (3F)", desc: "登機前最後一吃", url: "https://maps.app.goo.gl/ChitoseHanamaru" }
          ]
        },
        { 
          name: "迴轉壽司 Toriton (トリトン)", 
          type: "壽司", 
          isChain: true,
          desc: "在地人最愛，魚料大塊，CP值超越花丸。自駕推薦前往郊區分店。", 
          branches: [
            { name: "[豐平] 豐平店", desc: "國道36號線上，好停車", url: "https://maps.app.goo.gl/ToritonToyohira" },
            { name: "[圓山] 圓山店", desc: "近北海道神宮/動物園", url: "https://maps.app.goo.gl/ToritonMaruyama" },
            { name: "[伏見] 伏見店", desc: "近藻岩山纜車，看完夜景可吃", url: "https://maps.app.goo.gl/ToritonFushimi" },
            { name: "[札幌北] 北8條光星店", desc: "近札幌啤酒博物館", url: "https://maps.app.goo.gl/ToritonKita8" },
            { name: "[清田] 清田店", desc: "往三井Outlet途中", url: "https://maps.app.goo.gl/ToritonKiyota" },
            { name: "[厚別] 厚別店", desc: "近開拓之村", url: "https://maps.app.goo.gl/ToritonAtsubetsu" },
            { name: "[榮町] 榮町店", desc: "丘珠機場附近", url: "https://maps.app.goo.gl/ToritonSakaemachi" },
            { name: "[江別] 江別店", desc: "往旭川的IC附近", url: "https://maps.app.goo.gl/ToritonEbetsu" },
            { name: "[旭川] 旭川豊岡店", desc: "旭川唯一分店，動物園回來可吃", url: "https://maps.app.goo.gl/ToritonAsahikawa" }
          ]
        },
        { name: "湯咖哩 Suage+", type: "咖哩", desc: "札幌湯咖哩代表店，串燒食材與墨魚湯頭是其特色。", url: "https://maps.app.goo.gl/SuagePlus" },
        { name: "湯咖哩 GARAKU", type: "咖哩", desc: "濃郁辛香料與秘製湯頭，是狸小路排隊最長的名店之一。", url: "https://maps.app.goo.gl/Garaku" },
        { name: "成吉思汗 達摩 (Daruma)", type: "燒肉", desc: "薄野最有名的老字號羊肉爐，使用七輪炭火烘烤。", url: "https://maps.app.goo.gl/SusukinoDaruma" },
        { name: "札幌螃蟹本家", type: "海鮮", desc: "老牌螃蟹料理店，提供多種螃蟹會席料理，適合慶功宴。", url: "https://maps.app.goo.gl/KaniHonke" },
        { name: "冰雪之門 (Hyousetsu-no-mon)", type: "海鮮", desc: "創業已久，專營螃蟹料理，雪場蟹與松葉蟹品質頂級。", url: "https://maps.app.goo.gl/Hyousetsu" },
        { name: "奧芝商店", type: "咖哩", desc: "以鮮蝦熬製湯頭著名的湯咖哩，深受遊客喜愛。", url: "https://maps.app.goo.gl/Okushiba" },
        { name: "佐藤聖代 (Parfaiteria Sato)", type: "甜點", desc: "札幌特有的「深夜聖代」文化，喝酒後的完美結尾。", url: "https://maps.app.goo.gl/SatoParfait" },
        { name: "六花亭 札幌本店", type: "甜點", desc: "二樓有內用咖啡廳，可品嚐現做的夾心酥與甜品。", url: "https://maps.app.goo.gl/RokkateiSapporo" },
        { name: "BAKE Cheese Tart", type: "甜點", desc: "總店位於札幌，現烤起司塔香氣逼人。", url: "https://maps.app.goo.gl/BakeCheese" },
        { name: "信玄拉麵 (南6條)", type: "拉麵", desc: "以味噌拉麵聞名的超人氣排隊店，炒飯也是一絕。", url: "https://maps.app.goo.gl/Shingen" }
      ]
    },
    asahikawa: {
      title: "旭川經典美味",
      enTitle: "Asahikawa",
      icon: <Flame className="text-white" size={24}/>,
      color: "blue",
      items: [
        { name: "成吉思汗大黑屋", type: "燒肉", desc: "旭川最著名的烤羊肉名店，肉質極鮮且無腥味。", url: "https://maps.app.goo.gl/Daikokuya" },
        { name: "梅光軒 本店", type: "拉麵", desc: "獲選米其林推薦的醬油拉麵，湯頭層次豐富。", url: "https://maps.app.goo.gl/Baikoken" },
        { name: "旭川拉麵 青葉", type: "拉麵", desc: "傳承三代的傳統風味，充滿古樸氣息。", url: "https://maps.app.goo.gl/Aoba" },
        { name: "拉麵屋 蜂屋", type: "拉麵", desc: "焦香豬油為特色的獨特風味，口感濃郁。", url: "https://maps.app.goo.gl/Hachiya" },
        { name: "自由軒", type: "西餐", desc: "孤獨的美食家造訪地，推薦其招牌炸豬排。", url: "https://maps.app.goo.gl/Jiyuuken" },
        { name: "旭川拉麵村", type: "園區", desc: "集結多家知名拉麵店，一次滿足多種口味。", url: "https://maps.app.goo.gl/RamenVillage" },
        { name: "男山酒造 資料館", type: "清酒", desc: "參觀釀酒過程後可試飲多款大雪山水源釀造的好酒。", url: "https://maps.app.goo.gl/Otokoyama" },
        { name: "居酒屋 獨酌 三四郎", type: "居酒屋", desc: "氛圍極佳的傳統老店，推薦其烤物與烤魚。", url: "https://maps.app.goo.gl/Sanshiro" },
        { name: "The Sun 藏人", type: "甜點", desc: "在地知名點心屋，推薦「生巧克力餅乾」。", url: "https://maps.app.goo.gl/SunKurando" },
        { name: "福吉咖啡", type: "輕食", desc: "以旭川名物「旭橋」為造型的鯛魚燒非常可愛。", url: "https://maps.app.goo.gl/Fukuyoshi" },
        { name: "壽司港 (Sushiminato)", type: "壽司", desc: "在地人推薦的迴轉壽司，鮮度不輸札幌。", url: "https://maps.app.goo.gl/Sushiminato" }
      ]
    },
    toyako: {
      title: "洞爺湖 / 登別",
      enTitle: "Toyako Area",
      icon: <Waves className="text-white" size={24}/>,
      color: "cyan",
      items: [
        { name: "望羊蹄 (Boyotei)", type: "西餐", desc: "1946年創業的懷舊餐廳，推薦其招牌漢堡排。", url: "https://maps.app.goo.gl/Boyotei" },
        { name: "仙堂庵", type: "海鮮", desc: "位於 Wakasaimo 本店二樓，推薦其石狩鍋與帆立貝飯。", url: "https://maps.app.goo.gl/Sendoan" },
        { name: "Lake Hill Farm", type: "輕食", desc: "農場直營，手工披薩與數十種口味的義式冰淇淋必吃。", url: "https://maps.app.goo.gl/LakeHillFarm" },
        { name: "岡田屋 (Okadaya)", type: "甜點", desc: "以洞爺湖名產「大福」與紅豆湯聞名的溫馨老店。", url: "https://maps.app.goo.gl/Okadaya" },
        { name: "Wakasaimo 本店", type: "甜點", desc: "以地瓜造型製作的豆沙和菓子，是洞爺湖最有名的伴手禮。", url: "https://maps.app.goo.gl/Wakasaimo" },
        { name: "Sobakura (蕎麥工房)", type: "蕎麥麵", desc: "手工製作的蕎麥麵，口感Ｑ彈有勁。", url: "https://maps.app.goo.gl/Sobakura" },
        { name: "一本亭 (Ippontei)", type: "拉麵", desc: "洞爺湖知名的拉麵店，湯頭清甜不膩。", url: "https://maps.app.goo.gl/Ippontei" },
        { name: "Restaurant Toya", type: "法餐", desc: "結合在地食材的精緻料理，適合紀念日晚餐。", url: "https://maps.app.goo.gl/RestToya" },
        { name: "Cafe Lake View", type: "輕食", desc: "視野極佳的咖啡廳，適合發呆看湖景。", url: "https://maps.app.goo.gl/LakeView" },
        { name: "Hydune", type: "漢堡", desc: "湖畔旁的特色漢堡店，深受當地人喜愛。", url: "https://maps.app.goo.gl/Hydune" },
        { name: "登別 閻魔拉麵", type: "拉麵", desc: "地獄谷名物，香辣湯頭。", url: "https://maps.app.goo.gl/EnmaDo" }
      ]
    }
  };

  const mapLinks = {
    chitose: "https://maps.app.goo.gl/uX3L5pM57476eE638",
    jnet: "https://booking.cars.travel.rakuten.co.jp/cars/rcf140a.do?jid=30&rcid=3&jcid=7000",
    wbf: "https://maps.app.goo.gl/3547mXp9XN9vD347A",
    aeon: "https://maps.app.goo.gl/N67y9vW8x7vD347A",
    christmasTree: "https://maps.app.goo.gl/qJpPrhJ7F8vD347A",
    bluePond: "https://maps.app.goo.gl/v3x7vD347A",
    ningle: "https://maps.app.goo.gl/T4f9vW1pM",
    asahiyamaZoo: "https://maps.app.goo.gl/11x7vD347A",
    clarkHorse: "https://maps.app.goo.gl/D2L9n6QzXF1u6XyN8",
    mtUsu: "https://maps.app.goo.gl/13x7vD347A",
    toyaKanko: "https://maps.app.goo.gl/16x7vD347A",
    jigokudani: "https://maps.app.goo.gl/18x7vD347A",
    sunnyHome: "https://maps.app.goo.gl/VXohxZ8Vioqds6mw8",
    mtMoiwa: "https://maps.app.goo.gl/Nn3N4N5N6N7N8",
    beerMuseum: "https://maps.app.goo.gl/B1B2B3B4B5",
    okurayama: "https://maps.app.goo.gl/O1O2O3O4O5",
    hitsujigaoka: "https://maps.app.goo.gl/H1H2H3H4H5",
    otaruCanal: "https://maps.app.goo.gl/19x7vD347A",
    mitsuiOutlet: "https://maps.app.goo.gl/20x7vD347A",
    hokkaidoJingu: "https://maps.app.goo.gl/JinguMap123",
    shiroiKoibito: "https://maps.app.goo.gl/ShiroiMap456",
    odoriPark: "https://maps.app.goo.gl/OdoriMap789",
    tanukikoji: "https://maps.app.goo.gl/TanukiMap000",
    sunagawaSA: "https://maps.app.goo.gl/SunagawaSAMap",
    wattsuSA: "https://maps.app.goo.gl/WattsuSAMap",
    uzusanSA: "https://maps.app.goo.gl/UsuzanSAMap"
  };

  const itinerary = [
    {
      day: 1,
      date: "01/01 (四)",
      title: "雪國登陸：旭川第一夜",
      location: "旭川",
      transport: "自駕 (3hr)",
      activities: [
        { text: "11:00 新千歲機場，午餐一幻拉麵", url: mapLinks.chitose },
        { text: "國內線 3F Doraemon Sky Park", url: mapLinks.chitose },
        { text: "Jネットレンタカー 領車 / HEP", url: mapLinks.jnet },
        { text: "道央道北上，中停砂川 SA", url: mapLinks.sunagawaSA },
        { text: "16:00 Hotel WBF Grande 入住", url: mapLinks.wbf },
        { text: "AEON Mall 採買冰爪手套", url: mapLinks.aeon },
        { text: "晚餐：成吉思汗大黑屋", url: "https://maps.app.goo.gl/Daikokuya" },
        { text: "みなぴりかの湯 天然溫泉", url: mapLinks.wbf }
      ],
      food: "晚餐：成吉思汗烤羊肉 或 旭川醬油拉麵",
      tips: "首日取車請熟悉雪駕，16:30 天黑。"
    },
    {
      day: 2,
      date: "01/02 (五)",
      title: "美瑛樹木巡禮",
      location: "美瑛 / 富良野",
      transport: "自駕",
      activities: [
        { text: "09:00 美瑛景觀之路攝影", url: mapLinks.christmasTree },
        { text: "聖誕樹、七星、肯與瑪麗之木", url: mapLinks.christmasTree },
        { text: "美瑛神社購買限定御守", url: "https://maps.app.goo.gl/BieiShrine" },
        { text: "午餐：純平炸蝦飯 (Junpei)", url: "https://maps.app.goo.gl/Junpei" },
        { text: "白金青池與白鬚瀑布", url: mapLinks.bluePond },
        { text: "富良野精靈露台 Ningle Terrace", url: mapLinks.ningle },
        { text: "16:30 點燈攝影 (藍調時間)", url: mapLinks.ningle },
        { text: "返回旭川，晚餐拉麵村", url: mapLinks.wbf }
      ],
      food: "午餐：炸蝦飯；晚餐：富良野咖哩",
      tips: "美瑛雪厚，停車請找除雪路緣。"
    },
    {
      day: 3,
      date: "01/03 (六)",
      title: "動物園 ➔ 雪中騎馬",
      location: "旭川",
      transport: "自駕",
      activities: [
        { text: "09:15 旭山動物園 (09:30 開園)", url: mapLinks.asahiyamaZoo },
        { text: "11:00 必看：企鵝散步", url: mapLinks.asahiyamaZoo },
        { text: "午餐：園內或市區拉麵", url: mapLinks.asahiyamaZoo },
        { text: "14:00 克拉克馬場雪中騎馬", url: mapLinks.clarkHorse },
        { text: "男山酒造資料館試飲", url: "https://maps.app.goo.gl/Otokoyama" },
        { text: "旭川設計中心", url: "https://maps.app.goo.gl/AsahikawaDesign" },
        { text: "AEON 超市補貨", url: mapLinks.aeon },
        { text: "晚餐：梅光軒或居酒屋", url: "https://maps.app.goo.gl/Baikoken" }
      ],
      food: "午餐：動物園；晚餐：男山清酒",
      tips: "騎馬請穿厚襪，馬場供靴。"
    },
    {
      day: 4,
      date: "01/04 (日)",
      title: "南下洞爺：湖景溫泉",
      location: "洞爺湖",
      transport: "自駕 (210km)",
      activities: [
        { text: "07:30 啟程長途自駕", url: mapLinks.wbf },
        { text: "砂川 SA：二訪北菓樓", url: mapLinks.sunagawaSA },
        { text: "輪厚 SA：午餐休息", url: mapLinks.wattsuSA },
        { text: "昭和新山熊牧場", url: "https://maps.app.goo.gl/BearPark" },
        { text: "有珠山纜車俯瞰全景", url: mapLinks.mtUsu },
        { text: "筒倉展望台 Silo 優酪乳", url: mapLinks.toyaKanko },
        { text: "16:00 入住洞爺觀光飯店", url: mapLinks.toyaKanko },
        { text: "溫泉街彩燈隧道散策", url: "https://maps.app.goo.gl/IllumTunnel" },
        { text: "湖景露天風呂", url: mapLinks.toyaKanko }
      ],
      restStops: [
        { name: "砂川 SA", dist: "55km", desc: "北菓樓泡芙", url: mapLinks.sunagawaSA },
        { name: "輪厚 SA", dist: "125km", desc: "大型休息站", url: mapLinks.wattsuSA },
        { name: "有珠山 SA", dist: "200km", desc: "噴火灣海景", url: mapLinks.uzusanSA }
      ],
      food: "晚餐：飯店豪華會席",
      tips: "長途駕駛，建議每小時休息。"
    },
    {
      day: 5,
      date: "01/05 (一)",
      title: "洞爺慢活與披薩",
      location: "洞爺湖",
      transport: "自駕",
      activities: [
        { text: "房內湖景早餐", url: mapLinks.toyaKanko },
        { text: "洞爺湖遊覽船餵海鷗", url: mapLinks.toyaKanko },
        { text: "洞爺湖畔雕刻公園", url: "https://maps.app.goo.gl/SculpturePark" },
        { text: "Lake Hill Farm 披薩午餐", url: mapLinks.lakeHillFarm },
        { text: "必吃手工義式冰淇淋", url: mapLinks.lakeHillFarm },
        { text: "金毘羅火口災害殘構", url: "https://maps.app.goo.gl/VolcanoSite" },
        { text: "岡田屋紅豆湯", url: "https://maps.app.goo.gl/Okadaya" },
        { text: "藥師如來手湯/足湯", url: mapLinks.toyaKanko },
        { text: "傍晚返回飯店晚餐", url: mapLinks.toyaKanko }
      ],
      food: "午餐：披薩；晚餐：飯店料理",
      tips: "Lake Hill 可拍羊蹄山。"
    },
    {
      day: 6,
      date: "01/06 (二)",
      title: "登別地獄 ➔ 札幌夜景",
      location: "登別 / 札幌",
      transport: "自駕",
      activities: [
        { text: "09:00 前往登別", url: mapLinks.jigokudani },
        { text: "登別地獄谷 / 鐵泉池", url: mapLinks.jigokudani },
        { text: "大湯沼天然足湯", url: mapLinks.jigokudani },
        { text: "午餐：閻魔拉麵", url: "https://maps.app.goo.gl/EnmaDo" },
        { text: "15:00 札幌 Airbnb 入住", url: mapLinks.sunnyHome },
        { text: "確認停車位編號", url: mapLinks.sunnyHome },
        { text: "藻岩山纜車：日本新三大夜景", url: mapLinks.mtMoiwa },
        { text: "薄野 Nikka 看板 / 拉麵橫丁", url: "https://maps.app.goo.gl/Susukino" },
        { text: "宵夜：達摩成吉思汗", url: "https://maps.app.goo.gl/Daruma" }
      ],
      food: "午餐：拉麵；晚餐：薄野烤肉",
      tips: "山頂極寒，請備熱水袋。"
    },
    {
      day: 7,
      date: "01/07 (三)",
      title: "小樽運河與天狗山",
      location: "小樽 / 札幌",
      transport: "自駕",
      activities: [
        { text: "10:00 三角市場海鮮丼", url: "https://maps.app.goo.gl/Sankaku" },
        { text: "小樽運河倉庫群攝影", url: mapLinks.otaruCanal },
        { text: "音樂盒堂蒸氣鐘", url: mapLinks.otaruCanal },
        { text: "北一硝子三號館煤氣燈", url: mapLinks.otaruCanal },
        { text: "LeTAO / 北菓樓甜點", url: "https://maps.app.goo.gl/Sakaimachi" },
        { text: "手作玻璃或蠟燭體驗", url: "https://maps.app.goo.gl/Sakaimachi" },
        { text: "天狗山纜車夜景", url: "https://maps.app.goo.gl/Tengu" },
        { text: "晚餐：政壽司或燒鳥", url: mapLinks.otaruCanal },
        { text: "返回札幌", url: mapLinks.otaruCanal }
      ],
      food: "午餐：海鮮；晚餐：壽司",
      tips: "建議停運河旁大停車場。"
    },
    {
      day: 8,
      date: "01/08 (四)",
      title: "Outlet 與啤酒博物館",
      location: "北廣島 / 札幌",
      transport: "自駕 (終)",
      activities: [
        { text: "10:00 三井 Outlet 北廣島", url: mapLinks.mitsuiOutlet },
        { text: "Mont-bell / Adidas 掃貨", url: mapLinks.mitsuiOutlet },
        { text: "午餐：Outlet 美食街", url: mapLinks.mitsuiOutlet },
        { text: "札幌啤酒博物館 / 試飲", url: mapLinks.beerMuseum },
        { text: "札幌 Factory 玻璃溫室", url: "https://maps.app.goo.gl/SapporoFactory" },
        { text: "戰利品放回 Airbnb", url: mapLinks.sunnyHome },
        { text: "JR Tower T38 全景夜景", url: "https://maps.app.goo.gl/T38" },
        { text: "晚餐：啤酒園烤羊肉", url: mapLinks.beerMuseum }
      ],
      food: "晚餐：啤酒園烤羊肉",
      tips: "今日自駕最後一天。"
    },
    {
      day: 9,
      date: "01/09 (五)",
      title: "札幌神宮與大通公園",
      location: "札幌",
      transport: "地鐵",
      activities: [
        { text: "09:00 北海道神宮參拜", url: mapLinks.hokkaidoJingu },
        { text: "圓山公園 / 六花亭", url: mapLinks.hokkaidoJingu },
        { text: "午餐：圓山湯咖哩 Suage+", url: "https://maps.app.goo.gl/MaruyamaFood" },
        { text: "白色戀人公園", url: mapLinks.shiroiKoibito },
        { text: "大通公園電視塔 / 燈節", url: mapLinks.odoriPark },
        { text: "札幌市時計台", url: "https://maps.app.goo.gl/ClockTower" },
        { text: "狸小路商店街採購", url: mapLinks.tanukikoji },
        { text: "Mega Don Quijote 補貨", url: mapLinks.tanukikoji },
        { text: "晚餐：室蘭烤雞串", url: mapLinks.tanukikoji }
      ],
      food: "午餐：湯咖哩；晚餐：居酒屋",
      tips: "使用地鐵一日券。"
    },
    {
      day: 10,
      date: "01/10 (六)",
      title: "大倉山與北大校園",
      location: "札幌",
      transport: "地鐵",
      activities: [
        { text: "09:30 大倉山跳台競技場", url: mapLinks.okurayama },
        { text: "跳台頂端俯視札幌", url: mapLinks.okurayama },
        { text: "羊之丘展望台 / 克拉克像", url: mapLinks.hitsujigaoka },
        { text: "午餐：羊肉料理或拉麵", url: mapLinks.hitsujigaoka },
        { text: "北海道大學白楊木並木", url: mapLinks.hokkaidoUniv },
        { text: "北大綜合博物館", url: mapLinks.hokkaidoUniv },
        { text: "回 Airbnb 整理行李", url: mapLinks.sunnyHome },
        { text: "晚餐：蟹本家螃蟹饗宴", url: "https://maps.app.goo.gl/KaniHonke" },
        { text: "薄野最後散策", url: "https://maps.app.goo.gl/Susukino" }
      ],
      food: "晚餐：螃蟹大餐",
      tips: "整理行李，預演還車動線。"
    },
    {
      day: 11,
      date: "01/11 (日)",
      title: "機場最後衝刺",
      location: "新千歲",
      transport: "自駕 (還車)",
      activities: [
        { text: "08:15 退房前往機場", url: mapLinks.sunnyHome },
        { text: "機場旁加油站加滿", url: "https://maps.app.goo.gl/AirportGas" },
        { text: "09:15 Jネットレンタカー 還車", url: mapLinks.jnet },
        { text: "接駁車至航廈 / 報到", url: mapLinks.chitose },
        { text: "Royce' Chocolate World", url: mapLinks.chitose },
        { text: "Calbee+ 現炸薯條", url: mapLinks.chitose },
        { text: "購買 BAKE 起司塔上機", url: mapLinks.chitose },
        { text: "11:55 IT235 搭機回台", url: mapLinks.chitose }
      ],
      food: "機場美食 / 鐵路便當",
      tips: "還車建議提早 40 分鐘。"
    }
  ];

  const prepItems = [
    { name: "鞋底冰爪", Icon: Wind, desc: "結冰路面行走救星" },
    { name: "防水噴霧", Icon: ThermometerSnowflake, desc: "防止雪融滲入鞋內" },
    { name: "貼式暖暖包", Icon: LayoutDashboard, desc: "腹部或背部長效保溫" },
    { name: "觸控手套", Icon: ShoppingBag, desc: "拍照滑手機手不凍僵" }
  ];

  return (
    <div className="min-h-screen font-sans text-slate-100 pb-20 lg:pb-0">
      
      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-800 border border-blue-500/30 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="text-blue-500" size={20}/>
                <h3 className="text-xl font-black text-white">AI 建議</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="p-6 min-h-[150px] flex flex-col justify-center">
              {aiLoading ? (
                <div className="flex flex-col items-center gap-3 py-6">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-slate-400 text-sm">思考中...</p>
                </div>
              ) : (
                <div className="animate-in slide-in-from-bottom-2 duration-500">
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-base">{aiResult}</p>
                  <button onClick={() => setShowAiModal(false)} className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg">關閉</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 導覽列 */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-slate-900/90 backdrop-blur-md shadow-lg py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg"><Snowflake size={20} className="text-white" /></div>
            <h2 className="font-black tracking-tighter text-xl text-white uppercase">Hokkaido <span className="text-blue-500">26</span></h2>
          </div>
          <div className="hidden md:flex bg-slate-800/80 p-1 rounded-xl border border-slate-700/50">
            {['itinerary', 'food', 'prep'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>
                {tab === 'itinerary' ? '行程' : tab === 'food' ? '美食' : '準備'}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="pt-20 md:pt-24 max-w-4xl mx-auto px-3 md:px-6">
        {activeTab === 'itinerary' && (
          <div className="animate-in fade-in duration-500">
            {/* 日期選擇器 */}
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar mb-2">
              {itinerary.map(item => (
                <button
                  key={item.day}
                  onClick={() => setActiveDay(item.day)}
                  className={`shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-200 ${
                    activeDay === item.day ? "bg-blue-600 border-blue-500 text-white shadow-md scale-105" : "bg-slate-800/50 border-slate-700 text-slate-500"
                  }`}
                >
                  <span className="text-xs font-bold opacity-70">D{item.day}</span>
                  <span className="text-xl font-black">{item.date.split('/')[1].split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {itinerary.filter(d => d.day === activeDay).map(dayPlan => (
              <div key={dayPlan.day} className="bg-slate-800/40 backdrop-blur-sm rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden mb-8">
                {/* 天氣條 */}
                <div className="bg-slate-900/30 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     {weatherLoading ? <Loader2 size={20} className="animate-spin text-blue-400"/> : (weather ? getWeatherIcon(weather.weathercode) : <Cloud size={20} className="text-slate-600"/>)}
                     <span className="text-base font-bold text-slate-200">{weather ? `${weather.temperature}°C` : "N/A"}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-400 font-mono uppercase tracking-wide">
                     <MapPin size={12} /> {dayPlan.location}
                   </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-3 mb-8">
                     <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">{dayPlan.title}</h2>
                     <button onClick={() => generateDayInsight(dayPlan)} className="self-start flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs font-bold text-blue-400 active:scale-95 transition-transform">
                       <Sparkles size={14} /> AI 導覽
                     </button>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-700/50"></div>
                    {dayPlan.activities.map((act, i) => (
                      <div key={i} className="flex gap-5 group relative z-10">
                        <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:border-blue-500 transition-colors">
                           {act.text.includes('11:00') || act.text.includes('14:00') ? <Clock size={12} className="text-slate-300"/> : <div className="w-2 h-2 rounded-full bg-slate-500 group-hover:bg-blue-500"/>}
                        </div>
                        <div className="flex-grow flex justify-between items-start gap-2">
                          <p className="text-base font-bold text-slate-300 group-hover:text-white transition-colors leading-snug">{act.text}</p>
                          {act.url && <a href={act.url} target="_blank" className="p-2 bg-slate-800 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-slate-700 transition-colors"><Map size={18} /></a>}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 休息站 Mini Card */}
                  {dayPlan.restStops && (
                    <div className="mt-10 grid grid-cols-1 gap-3">
                      {dayPlan.restStops.map((stop, i) => (
                        <div key={i} className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-4">
                             <div className="bg-blue-900/30 text-blue-400 text-xs font-black px-2.5 py-1 rounded">SA</div>
                             <div>
                               <div className="text-sm font-bold text-white mb-0.5">{stop.name} <span className="text-[10px] text-slate-500 ml-1">{stop.dist}</span></div>
                               <div className="text-xs text-slate-400">{stop.desc}</div>
                             </div>
                           </div>
                           <a href={stop.url} target="_blank" className="text-slate-500 hover:text-blue-400 p-2"><MapPinned size={18}/></a>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-10 flex flex-col gap-4">
                    <div className="bg-amber-900/20 p-5 rounded-2xl border border-amber-500/20">
                       <h4 className="text-xs font-black text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Utensils size={12}/> 餐飲重點</h4>
                       <p className="text-sm font-bold text-amber-100">{dayPlan.food}</p>
                    </div>
                    <div className="bg-blue-900/20 p-5 rounded-2xl border border-blue-500/20">
                       <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-2"><Info size={12}/> 貼心提醒</h4>
                       <p className="text-sm text-blue-100">{dayPlan.tips}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-5 flex justify-between items-center border-t border-white/5">
                  <button onClick={() => setActiveDay(d => Math.max(1, d-1))} className={`text-sm font-bold flex items-center gap-2 px-4 py-3 rounded-xl ${activeDay === 1 ? "text-slate-700" : "text-blue-400 hover:bg-blue-900/20"}`}><ChevronRight size={18} className="rotate-180"/> 上一天</button>
                  <button onClick={() => setActiveDay(d => Math.min(11, d+1))} className={`text-sm font-bold flex items-center gap-2 px-4 py-3 rounded-xl ${activeDay === 11 ? "text-slate-700" : "text-blue-400 hover:bg-blue-900/20"}`}>下一天 <ChevronRight size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'food' && (
          <div className="animate-in fade-in duration-500 pb-24">
             <div className="flex flex-col gap-4">
                {Object.entries(foodData).map(([key, section]) => (
                  <div key={key} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl overflow-hidden shadow-lg">
                    <button 
                      onClick={() => setOpenFoodSection(openFoodSection === key ? null : key)}
                      className={`w-full p-5 flex items-center justify-between transition-colors ${openFoodSection === key ? "bg-slate-700/40" : "hover:bg-slate-700/20"}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${openFoodSection === key ? `bg-${section.color}-600 text-white` : "bg-slate-700 text-slate-400"}`}>
                          {section.icon}
                        </div>
                        <div className="text-left">
                          <h3 className={`text-lg font-bold ${openFoodSection === key ? "text-white" : "text-slate-400"}`}>{section.title}</h3>
                        </div>
                      </div>
                      <ChevronDown size={20} className={`transition-transform duration-300 text-slate-500 ${openFoodSection === key ? "rotate-180" : ""}`}/>
                    </button>

                    <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openFoodSection === key ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}`}>
                      <div className="p-4 grid grid-cols-1 gap-3">
                        {section.items.map((food, i) => (
                          <div key={i}>
                            {!food.isChain ? (
                              <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 flex justify-between items-start gap-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="text-base font-bold text-white">{food.name}</h4>
                                  </div>
                                  <div className="flex gap-2 mb-2">
                                     <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-white/5 font-bold">{food.type}</span>
                                  </div>
                                  <p className="text-sm text-slate-400 leading-relaxed">{food.desc}</p>
                                </div>
                                <a href={food.url} target="_blank" className="p-3 bg-slate-800 rounded-xl text-slate-500 hover:text-blue-400 border border-white/5 mt-1"><Map size={20}/></a>
                              </div>
                            ) : (
                              <div className="bg-slate-900/80 rounded-2xl border border-blue-500/20 overflow-hidden">
                                <button 
                                  onClick={() => toggleChain(food.name)}
                                  className="w-full p-4 flex items-center justify-between text-left"
                                >
                                  <div>
                                    <div className="flex items-center gap-2 mb-2">
                                      <h4 className="text-base font-black text-blue-100">{food.name}</h4>
                                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold">連鎖名店</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{food.desc}</p>
                                  </div>
                                  <ChevronDown size={20} className={`text-blue-500 transition-transform ${expandedChains[food.name] ? "rotate-180" : ""}`}/>
                                </button>
                                
                                {expandedChains[food.name] && (
                                  <div className="px-3 pb-3 bg-slate-950/30">
                                    <div className="grid grid-cols-1 gap-2 pt-3">
                                      {food.branches.map((branch, b) => (
                                        <a key={b} href={branch.url} target="_blank" className="flex items-center justify-between p-3 bg-slate-800/80 hover:bg-blue-600/20 rounded-xl border border-white/5 group">
                                          <div>
                                            <div className="text-sm font-bold text-slate-200">{branch.name}</div>
                                            <div className="text-[10px] text-slate-500 mt-1">{branch.desc}</div>
                                          </div>
                                          <ExternalLink size={16} className="text-slate-600 group-hover:text-blue-400"/>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'prep' && (
          <div className="animate-in fade-in duration-500 pb-20">
             <div className="flex flex-col gap-6">
                {/* 住宿卡片 */}
                <div className="bg-slate-800/60 rounded-3xl p-6 border border-slate-700/50 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="bg-blue-600 p-2.5 rounded-xl"><Home size={20} className="text-white" /></div>
                    <h3 className="text-xl font-black text-white">住宿清單</h3>
                  </div>
                  <div className="space-y-4 relative z-10">
                    <div className="bg-slate-900/60 p-5 rounded-2xl border-l-4 border-l-blue-500 border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                           <div className="text-xs font-bold text-blue-400 mb-1">01/01 - 01/04 (3泊)</div>
                           <h4 className="text-base font-bold text-white">Hotel WBF Grande Asahikawa</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-green-900/30 text-green-400 px-2 py-0.5 rounded">OK</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">旭川市 宮下通10-3-3</div>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-2xl border-l-4 border-l-cyan-500 border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                           <div className="text-xs font-bold text-cyan-400 mb-1">01/04 - 01/06 (2泊)</div>
                           <h4 className="text-base font-bold text-white">洞爺觀光飯店 (Toya Kanko)</h4>
                        </div>
                        <span className="text-[10px] font-bold bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded">含早晚</span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">洞爺湖町洞爺湖温泉144</div>
                    </div>
                    <div className="bg-slate-900/60 p-5 rounded-2xl border-l-4 border-l-pink-500 border border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                           <div className="text-xs font-bold text-pink-400 mb-1">01/06 - 01/11 (5泊)</div>
                           <h4 className="text-base font-bold text-white">Sapporo Airbnb (Sunny Home)</h4>
                        </div>
                        <a href={mapLinks.sunnyHome} target="_blank" className="bg-pink-600 px-2 py-1 rounded text-[10px] text-white font-bold">MAP</a>
                      </div>
                      <div className="text-xs text-slate-400 font-mono">札幌市中央区南13条西8丁目</div>
                    </div>
                  </div>
                </div>

                {/* AI / Transport */}
                <div className="grid grid-cols-2 gap-4">
                   <div onClick={() => callGemini("請給我 5 個北海道冬日自駕的進階行李建議。")} className="bg-blue-600/20 p-5 rounded-2xl border border-blue-500/20 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform cursor-pointer">
                      <Sparkles className="text-blue-400" size={28}/>
                      <div className="text-sm font-bold text-blue-100">AI 智慧建議</div>
                   </div>
                   <a href="https://www.drivetraffic.jp/map?area=01" target="_blank" className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/50 flex flex-col items-center justify-center text-center gap-3 active:scale-95 transition-transform">
                      <Car className="text-slate-400" size={28}/>
                      <div className="text-sm font-bold text-slate-200">路況查詢</div>
                   </a>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* 手機版底部導覽 (Compact) */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 md:hidden z-50 bg-slate-800/90 backdrop-blur-xl border border-white/10 px-8 py-3 rounded-full flex gap-10 shadow-2xl">
        <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'itinerary' ? "text-blue-500" : "text-slate-500"}`}><LayoutDashboard size={20} /><span className="text-[10px] font-bold">行程</span></button>
        <button onClick={() => setActiveTab('food')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'food' ? "text-blue-500" : "text-slate-500"}`}><Utensils size={20} /><span className="text-[10px] font-bold">美食</span></button>
        <button onClick={() => setActiveTab('prep')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'prep' ? "text-blue-500" : "text-slate-500"}`}><Car size={20} /><span className="text-[10px] font-bold">準備</span></button>
      </div>
    </div>
  );
};

export default App;