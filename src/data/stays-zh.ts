import type { Faq } from '@/data/stays';

export type StayZh = {
  title: string;
  description: string;
  name: string;
  intro: string;
  features: string[];
  houseRules: string[];
  notes: string[];
  compare: { bestFor: string; outdoor: string; indoor: string; work: string; parking: string };
  faqs: Faq[];
  // Same order as `reviews` in stays.ts. Translations of the Airbnb originals, which stay available on the page.
  reviewTranslations: string[];
};

export const staysZh: Record<string, StayZh> = {
  'desert-retreat-pool-hot-tub-visalia': {
    title: 'Visalia 五房14人泳池住宿｜Desert Retreat 紅杉國家公園自駕基地',
    description: 'Desert Retreat 位於 Visalia，五房可住14人，附私人不加熱泳池、熱水池、火坑、完整廚房、Wi-Fi 與工作區。查看床位分配與設施，再到 Airbnb 查日期與價格。',
    name: 'Desert Retreat｜五房私人泳池度假屋',
    intro: '適合想多一間臥室、享受私人泳池與戶外空間的家庭或朋友。五房最多14人，附熱水池與火坑；泳池不加熱。',
    features: ['私人泳池附獨立圍欄與淺水躺椅區；泳池不加熱', '獨立熱水池、火坑、戶外座位與 cornhole 投沙包', '98 吋電視、各臥室 Smart TV 與 Nex Playground 體感遊戲', '完整廚房；二樓洗衣間附洗衣機與烘衣機', 'Wi-Fi；第二間臥室有書桌、椅子、螢幕與桌燈', '每間衛浴都有 Toto 免治馬桶；空調與暖氣', '智慧鎖自助入住', '車道可停三台，附近另有路邊停車；Tesla Level 2 充電器另計費，請先確認車輛相容性'],
    houseRules: ['最多14位過夜旅客；禁止派對或活動', '禁止吸菸，包含電子菸', '安靜時段為晚上9點至隔天早上8點', '最多可攜帶3隻寵物，費用請在 Airbnb 確認；協助動物依 Airbnb 政策處理', '禁止商業攝影或錄影', '親子提醒：泳池有獨立圍欄，兩道門會自動關閉並上鎖，門閂裝在幼童搆不到的高度。熱水池在泳池圍欄外，蓋子很重但不能上鎖；後院可從滑門進出，且沒有完全圍起，孩童需全程由大人看顧。'],
    notes: ['戶外攝影機位於車庫上方、院子（火坑、泳池與草坪）及前門；屋內沒有攝影機。', '房源位於發展中的社區，附近施工可能產生日間噪音。', '請自備 K-Cup 咖啡膠囊。'],
    compare: {
      bestFor: '想要泳池與後院空間的團體',
      outdoor: '附圍欄的私人泳池、熱水池、火坑、烤肉架、有頂露台、草坪遊戲',
      indoor: '98 吋電視、Nex Playground 體感遊戲',
      work: '第二間臥室有書桌、椅子、螢幕與桌燈',
      parking: '車道3台，附近另有路邊停車；EV 充電另計費',
    },
    faqs: [
      { question: 'Desert Retreat 可以住幾個人？', answer: '最多14人：五間臥室可睡10人，氣墊床可再睡4人。' },
      { question: 'Desert Retreat 的泳池多大？有加熱嗎？', answer: '私人泳池約 15 × 33 英尺，沒有加熱。獨立的熱水池可以加熱。' },
      { question: 'Desert Retreat 可以幫電動車充電嗎？', answer: '可以，有 Tesla Level 2 充電器，需另外付費。請提前聯絡房東確認費用與安排。' },
      { question: '可以在 Desert Retreat 遠端工作嗎？', answer: '可以。第二間臥室有書桌、椅子、螢幕與桌燈，房子也有 Wi-Fi。' },
    ],
    reviewTranslations: [
      '這趟到 Sequoia 和 Kings Canyon 國家公園的團體旅行，住宿安排好得不能再好。地點很棒：開車到兩座公園的入口都很順，房子也真的有精品度假的質感。一切都是全新的，而且很用心挑選；每間浴室都有免治馬桶，讓一大群人的早晨順暢許多，廚房也應有盡有，連香料都有。後院太夢幻了：探索巨杉一整天後，我們傍晚烤肉、在戶外用餐，還在超大的泳池邊放鬆。房東非常出色，品味一流。這是我們住過最漂亮的房子之一！',
      '我們非常喜歡這次住宿！地點很適合去 Sequoia 國家公園，我們進公園前在這裡住了一晚。房子全新又漂亮，感覺像五星級度假村！將近 30 英尺長的泳池很驚艷，晚上開燈時尤其美。池內躺椅和熱水池讓體驗更棒。和朋友泡在水裡喝幾瓶啤酒，真的很享受！後院還有 cornhole、火坑和瓦斯烤爐，很適合一起度過愉快的夜晚。室內的現代設計很好看，孩子也很喜歡體感遊戲和電視遊戲。老實說，我們沒人想離開，連大人也一樣！這間房子有輕鬆又難忘的假期所需的一切。我們很想再回來，也非常推薦！',
    ],
  },
  'luxury-family-home-hot-tub-game-room-visalia': {
    title: 'Visalia 四房14人家庭住宿｜Family Home 熱水池與撞球桌',
    description: 'Luxury Family Home 位於 Visalia，四房最多14人，附熱水池、撞球桌、閣樓桌遊、完整廚房與 Wi-Fi，沒有泳池或專用工作區。查看床位配置並到 Airbnb 訂房。',
    name: 'Luxury Family Home｜四房家庭度假屋',
    intro: '適合喜歡一起玩遊戲、煮飯與放鬆的家庭。四房最多14人，附撞球桌、閣樓與熱水池；沒有泳池。',
    features: ['私人六人熱水池與戶外座位；沒有泳池', '遊戲室撞球桌、75 吋電視與閣樓桌遊', '完整廚房與兒童餐具；二樓洗衣間附洗衣機與烘衣機', 'Wi-Fi；沒有專用工作區', '每間衛浴都有 Toto 免治馬桶；中央空調與暖氣', '智慧鎖自助入住', '車庫可停一台、車道兩台、路邊一台；部分車庫改為遊戲室，Level 2 充電器僅限 Tesla，另計費', '依屋主估計，開車到 Target 不到五分鐘，實際依交通而異'],
    houseRules: ['最多14位過夜旅客；禁止派對或活動', '禁止吸菸，包含電子菸', '安靜時段為晚上9點至隔天早上8點', '最多可攜帶3隻寵物，每隻每次住宿75美元；未經核准攜帶可能產生至少150美元費用，請在 Airbnb 確認最新條款。協助動物依 Airbnb 政策處理'],
    notes: ['戶外攝影機位於車庫上方、院子（包含熱水池）及前門。', '熱水池不使用時，請把蓋子蓋好。', '鄰近住戶有養狗，偶爾可能聽到狗叫聲。'],
    compare: {
      bestFor: '想要雨天活動空間與大量好評的家庭和團體',
      outdoor: '六人熱水池、烤肉架、掛燈串的圍籬後院、仙人掌花園',
      indoor: '撞球桌、75 吋電視、閣樓桌遊',
      work: '有 Wi-Fi；沒有專用工作區',
      parking: '車庫1台、車道2台、路邊1台；EV 充電另計費',
    },
    faqs: [
      { question: 'Luxury Family Home 的床位怎麼安排？', answer: '最多14位過夜旅客，會使用臥室的床、沙發床、沙發與氣墊床。' },
      { question: 'Luxury Family Home 附近有餐廳和超市嗎？', answer: '房客表示附近有超市和簡餐選擇，開車約 5 分鐘也有加油站，以及 Raising Cane’s、In-N-Out 等營業到較晚的餐廳。' },
      { question: 'Luxury Family Home 可以幫電動車充電嗎？', answer: '可以，車庫有僅限 Tesla 的 Level 2 充電器，需另外付費。請提前告知房東，以便開通。' },
    ],
    reviewTranslations: [
      '對我們這群要前往 Sequoia 和 Kings Canyon 國家公園的人來說，這裡的安排和地點好得不能再好！房東溝通順暢，需要時也很幫忙。',
      '原本的計畫臨時取消後，我們才訂了這裡。從訂房開始，房東回覆就很快。我們住得非常開心。房子佈置得很漂亮，也相當寬敞。雖然我們到得晚，途中還先在一個較大的城市停留，但意外發現開車 5 分鐘就有加油站和營業到很晚的餐廳，例如 Raising Cane’s 和 In-N-Out。早知道多做點功課，我們就直接開過來了。這裡離市區機能很近，又位於郊區，不會被噪音包圍。整體來說，我們住得很愉快，如果之後還要住這一帶，一定會再訂。',
      '很棒的房子，超級乾淨，百分之百推薦。是我在 Visalia 最喜歡的房子之一。',
      '房子非常乾淨舒適。地點方便，附近有很多超市和簡餐選擇。唯一有點搞不懂的是中央空調怎麼操作，房子也花了一段時間才降溫。除此之外，房東很棒，回覆很快也很好配合。我會推薦給要去附近國家公園的人。',
    ],
  },
};

export const sharedNotesZh = [
  '熱水池不保證第一晚可用。換水保養後，冬季重新加熱可能需要約20～30小時；若是行程重點，請先詢問房東。',
  '烤肉瓦斯與 EV 充電另計費，提前入住或延後退房需視供應情況並可能另收費。',
  '屋內有樓梯。',
  '社區有萬聖節傳統，10月31日可能有小朋友來敲門要糖果。',
  '院子會定期日間維護。請以 Airbnb 的即時設施、費用、寵物政策、房屋規則及取消條款為準。',
];

export const ratingLabelsZh: Record<string, string> = {
  'Check-in': '入住流程',
  Communication: '溝通',
  Accuracy: '描述相符',
  Location: '地點',
  Cleanliness: '清潔',
  Value: '性價比',
};

export const reviewContextZh: Record<string, string> = {
  'Group trip': '團體旅行',
  'Stayed with a pet': '帶寵物入住',
  'Stayed one night': '住一晚',
};

export const siteFaqsZh: Faq[] = [
  { question: 'SSHOME 的房子在哪裡？', answer: '都在加州 Tulare 郡的 Visalia。確切地址會在訂房後由 Airbnb 提供。' },
  { question: '如何預訂 SSHOME？', answer: '全部透過 Airbnb 預訂，可在 Airbnb 查看即時空房、價格、房屋規則與取消條款。每間房源頁都有 Airbnb 連結。' },
  { question: '入住與退房時間是幾點？', answer: '兩間都是下午 4:00 入住、上午 10:00 退房。提前入住或延後退房需視情況而定，也可能另收費。' },
  { question: 'EV 充電和烤肉瓦斯有包含嗎？', answer: '兩間都需另外付費。兩間都有 Tesla Level 2 充電器，其中 Luxury Family Home 僅限 Tesla。費用與安排請透過 Airbnb 詢問房東。' },
  { question: '兩間都有 Wi-Fi 和工作區嗎？', answer: '兩間都有 Wi-Fi。只有 Desert Retreat 有專用工作區，位於第二間臥室；Luxury Family Home 沒有專用工作區。' },
];
