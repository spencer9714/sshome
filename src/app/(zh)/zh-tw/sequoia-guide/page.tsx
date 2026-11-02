import type { Metadata } from 'next';
import Link from 'next/link';
import { airbnbUrl, factsCheckedOn, stays } from '@/data/stays';
import { parkFacts, site } from '@/lib/site';

export const metadata: Metadata = {
  title: '紅杉國家公園自駕住宿指南｜Visalia 家庭與團體住宿',
  description: '比較 Visalia 與 Three Rivers 住宿，規劃 Sequoia、Kings Canyon 兩天一夜及三天兩夜行程，了解 SSHOME 兩間房源的床位、泳池與訂房方式。',
  alternates: { canonical: '/zh-tw/sequoia-guide', languages: { en: '/sequoia-kings-canyon-guide', 'zh-Hant': '/zh-tw/sequoia-guide', 'x-default': '/sequoia-kings-canyon-guide' } },
  openGraph: { title: '紅杉國家公園自駕住宿指南', url: '/zh-tw/sequoia-guide', locale: 'zh_TW', type: 'article', images: [{ url: site.ogImage }] },
};

export default function ChineseGuide() {
  return <article lang="zh-Hant" className="mx-auto max-w-3xl px-4 py-16 leading-relaxed sm:px-6">
    <p className="text-sm text-ember">SSHOME 自駕旅遊指南</p><h1 className="mt-3 text-4xl">去紅杉國家公園，住哪裡、怎麼安排？</h1>
    <p className="mt-6 text-xl">如果同行有兩個家庭，除了離公園多遠，也要比較臥室分配、額外床位、採買與回到住宿後的活動空間。</p>
    <section className="mt-10 rounded-lg bg-sand p-6"><h2 className="text-3xl">屋主分享：住 Visalia 的採買優勢</h2><p className="mt-4">我們是 SSHOME 屋主 Spencer 與 Sylvia，管理團隊包括 Janson 和 Miyu。對我們而言，Visalia 相較 Three Rivers 的優勢是市區餐飲與日常採買更方便，適合先補給、再開車進國家公園。</p><p className="mt-4">Visalia 有兩間 Costco：<a href="https://www.costco.com/warehouse-locations/warehouse-1017.html" className="underline">Visalia 店</a>及<a href="https://www.costco.com/warehouse-locations/warehouse-1741.html" className="underline">North Visalia 店</a>。依屋主的在地車程估計，Family Home 開車到 Target 不到五分鐘；實際時間依交通狀況而異。</p><p className="mt-4">兩間房源都有 Wi-Fi；只有 Desert Retreat 有專用工作區，位於第二間臥室，附書桌、椅子、螢幕與桌燈。Family Home 沒有專用工作區。</p></section>
    <section className="mt-10"><h2 className="text-3xl">Visalia 還是 Three Rivers？</h2><p className="mt-4">Visalia 適合想住市區、安排餐飲採買，再開車進公園的旅客。Three Rivers 位於 Highway 198 進入 Sequoia 的路線上；若優先考量靠近 Ash Mountain 入口，可比較該地區住宿。每間住宿的車程、空間與設施都應個別確認；靠近入口不代表已到巨杉景點。</p></section>
    <section className="mt-10"><h2 className="text-3xl">入口車程，不是景點車程</h2><p className="mt-4">依美國國家公園管理局資料，從 Visalia Municipal Airport 到 Sequoia 的 Ash Mountain 入口約 1 小時，到 Kings Canyon 入口約 1.5 小時。這不是從房源實測的車程。進入公園後仍有山路，前往 Giant Forest、General Sherman Tree 要另外預留行車、停車與步行時間。</p><a href={parkFacts.sourceUrl} className="mt-3 inline-block underline">查看 NPS 官方交通資訊</a></section>
    <section className="mt-10"><h2 className="text-3xl">兩天一夜：以 Sequoia 為主</h2><p className="mt-4">第一天抵達 Visalia、採買，依入住時間安排行程，在住宿煮飯休息。第二天提早出發，依道路開放狀況安排 Giant Forest 與 General Sherman Tree，再返程。不要把兩座國家公園的所有景點塞進同一天。</p></section>
    <section className="mt-10"><h2 className="text-3xl">三天兩夜：留一整天看巨杉</h2><p className="mt-4">第一天抵達、採買與入住；第二天留給 Sequoia；第三天若返程方向、體力及路況允許，再經 Highway 180 安排 Kings Canyon 的 Grant Grove，或悠閒退房返程。Cedar Grove 是另一段深入峽谷的行程，不能視為入口附近的順路停靠點。</p></section>
    <section className="mt-10"><h2 className="text-3xl">兩間 SSHOME 怎麼選？</h2><div className="mt-5 space-y-5">{stays.map((stay) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl">{stay.name}</h3><p className="mt-3">{stay.summaryZh}</p><p className="mt-3">最多 14 人包含額外床位，並不是 14 張固定床。請先確認每位旅客的睡眠安排。</p><a href={airbnbUrl(stay)} data-booking-placement="chinese-guide" data-airbnb-intent="listing" className="mt-4 inline-block rounded-md bg-ember px-4 py-3 text-white">到 Airbnb 查日期、價格及聯絡房東</a></div>)}</div></section>
    <section className="mt-10"><h2 className="text-3xl">訂房與出發前確認</h2><p className="mt-4">兩間熱水池皆不保證第一晚可用；如需使用請先詢問房東。EV 充電與烤肉瓦斯另計費，價格、房屋規則與取消條款以 Airbnb 為準。冬季出發前請查看雪鏈要求與道路狀況。</p><a href={parkFacts.conditionsUrl} className="mt-3 inline-block underline">查看 NPS 最新路況</a></section>
    <p className="mt-10 text-xs text-stone">資料更新：{factsCheckedOn}。行程為規劃建議，請依季節、路況及實際入住／退房時間調整。</p><Link href="/sequoia-kings-canyon-guide" className="mt-5 inline-block underline">English park guide</Link>
  </article>;
}
