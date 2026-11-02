import type { Metadata } from 'next';
import Link from 'next/link';
import { airbnbUrl, factsCheckedOn, stays } from '@/data/stays';
import { parkFacts } from '@/lib/site';

export const metadata: Metadata = {
  title: '紅杉國家公園自駕住宿指南｜Visalia 家庭與團體住宿',
  description: '比較 Visalia 與 Three Rivers 住宿，規劃 Sequoia、Kings Canyon 兩天一夜及三天兩夜行程，了解 SSHOME 兩間房源的床位、泳池與訂房方式。',
  alternates: { canonical: '/zh-tw/sequoia-guide' },
  openGraph: { title: '紅杉國家公園自駕住宿指南', url: '/zh-tw/sequoia-guide', locale: 'zh_TW', type: 'article' },
};

export default function ChineseGuide() {
  return <article lang="zh-Hant" className="mx-auto max-w-3xl px-4 py-16 leading-relaxed sm:px-6">
    <p className="text-sm text-ember">SSHOME 自駕旅遊指南</p><h1 className="mt-3 text-4xl">去紅杉國家公園，住哪裡、怎麼安排？</h1>
    <p className="mt-6 text-xl">如果同行有兩個家庭，除了離公園多遠，也要比較臥室分配、額外床位、採買與回到住宿後的活動空間。</p>
    <section className="mt-10"><h2 className="text-3xl">Visalia 還是 Three Rivers？</h2><p className="mt-4">Visalia 適合想住市區、安排餐飲採買，再開車進公園的旅客。Three Rivers 位於 Highway 198 進入 Sequoia 的路線上；若優先考量靠近 Ash Mountain 入口，可比較該地區住宿。每間住宿的車程、空間與設施都應個別確認；靠近入口不代表已到巨杉景點。</p></section>
    <section className="mt-10"><h2 className="text-3xl">入口車程，不是景點車程</h2><p className="mt-4">依美國國家公園管理局資料，從 Visalia Municipal Airport 到 Sequoia 的 Ash Mountain 入口約 1 小時，到 Kings Canyon 入口約 1.5 小時。這不是從房源實測的車程。進入公園後仍有山路，前往 Giant Forest、General Sherman Tree 要另外預留行車、停車與步行時間。</p><a href={parkFacts.sourceUrl} className="mt-3 inline-block underline">查看 NPS 官方交通資訊</a></section>
    <section className="mt-10"><h2 className="text-3xl">兩天一夜：以 Sequoia 為主</h2><p className="mt-4">第一天抵達 Visalia、採買，依入住時間安排行程，在住宿煮飯休息。第二天提早出發，依道路開放狀況安排 Giant Forest 與 General Sherman Tree，再返程。不要把兩座國家公園的所有景點塞進同一天。</p></section>
    <section className="mt-10"><h2 className="text-3xl">三天兩夜：留一整天看巨杉</h2><p className="mt-4">第一天抵達、採買與入住；第二天留給 Sequoia；第三天若返程方向、體力及路況允許，再經 Highway 180 安排 Kings Canyon 的 Grant Grove，或悠閒退房返程。Cedar Grove 是另一段深入峽谷的行程，不能視為入口附近的順路停靠點。</p></section>
    <section className="mt-10"><h2 className="text-3xl">兩間 SSHOME 怎麼選？</h2><div className="mt-5 space-y-5">{stays.map((stay, index) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl">{stay.name}</h3><p className="mt-3">{index === 0 ? '五房、六張床、三間衛浴，附私人不加熱泳池、熱水池與火坑。另提供兩張單人氣墊床及一張雙人氣墊床。' : '四房、六張床、三間衛浴，附撞球桌、閣樓與熱水池；沒有泳池。臥室有一張 King、兩張 Queen 與兩張 Twin，可睡 8 人；另有一張雙人沙發床與兩張 Queen 氣墊床（每張可睡 2 人），合計 14 個睡位。車道可停兩台車，部分車庫已改為遊戲室。'}</p><p className="mt-3">最多 14 人包含額外床位，並不是 14 張固定床。請先確認每位旅客的睡眠安排。</p><a href={airbnbUrl(stay)} data-booking-placement="chinese-guide" className="mt-4 inline-block rounded-md bg-ember px-4 py-3 text-white">到 Airbnb 查日期、價格及聯絡房東</a></div>)}</div></section>
    <section className="mt-10"><h2 className="text-3xl">訂房與出發前確認</h2><p className="mt-4">兩間熱水池皆不保證第一晚可用；如需使用請先詢問房東。EV 充電與烤肉瓦斯另計費，價格、房屋規則與取消條款以 Airbnb 為準。冬季出發前請查看雪鏈要求與道路狀況。</p><a href={parkFacts.conditionsUrl} className="mt-3 inline-block underline">查看 NPS 最新路況</a></section>
    <p className="mt-10 text-xs text-stone">資料更新：{factsCheckedOn}。行程為規劃建議，請依季節、路況及實際入住／退房時間調整。</p><Link href="/sequoia-kings-canyon-guide" className="mt-5 inline-block underline">English park guide</Link>
  </article>;
}
