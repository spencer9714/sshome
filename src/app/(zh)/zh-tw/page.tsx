import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { ReviewCardZh } from '@/components/review-card-zh';
import { airbnbUrl, factsCheckedOn, stays } from '@/data/stays';
import { siteFaqsZh, staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { parkFacts, site } from '@/lib/site';
import { JsonLd } from '@/components/json-ld';
import { collectionSchema, faqSchema } from '@/lib/schema';

const title = 'Visalia 紅杉國家公園住宿｜14人家庭包棟・泳池度假屋｜SSHOME';
const description = '規劃 Sequoia 紅杉與 Kings Canyon 國家公園自駕旅行？比較 SSHOME 在 Visalia 的兩間14人整棟住宿：五房泳池屋、四房家庭遊戲屋。查看床位、設施與繁中行程，透過 Airbnb 訂房。';
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: '/zh-tw', languages: languageAlternates('/', '/zh-tw') },
  openGraph: { title, description, url: '/zh-tw', locale: 'zh_TW', alternateLocale: ['en_US'], images: [{ url: site.ogImage }] },
};

const compareRows = [
  ['適合', 'bestFor'],
  ['戶外', 'outdoor'],
  ['室內娛樂', 'indoor'],
  ['工作區', 'work'],
  ['停車', 'parking'],
] as const;

const driveTimesZh = [
  { place: 'Sequoia 國家公園', entrance: 'Ash Mountain 入口，Highway 198', time: '約 1 小時' },
  { place: 'Kings Canyon 國家公園', entrance: 'Big Stump 入口，Highway 180', time: '約 1.5 小時' },
];

export default function ChineseHome() {
  const featuredReviews = stays.flatMap((stay) => stay.reviews.map((review, index) => ({ review, stay, translation: staysZh[stay.slug].reviewTranslations[index] }))).slice(0, 3);
  return <>
    <JsonLd data={collectionSchema('zh-Hant')} />
    <JsonLd data={faqSchema(siteFaqsZh)} />
    <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-dusk text-white">
      <Image src={stays[0].photos[0].src} alt="Visalia Desert Retreat 私人泳池與度假屋" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p>加州 Visalia・SSHOME</p><h1 className="mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">紅杉國家公園之旅，<br />也有屬於全家的度假時光</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed">兩間最多14人的整棟住宿，適合家庭與朋友自駕出遊。選五房泳池屋，或四房附撞球桌的家庭度假屋；白天探索 Sequoia 與 Kings Canyon，晚上一起煮飯、放鬆。</p><Link href="#homes" className="mt-6 inline-block rounded-md bg-ember px-5 py-3 font-medium">比較兩間住宿</Link></div>
    </section>
    <section id="homes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-3xl">Visalia 包棟住宿怎麼選？</h2><div className="mt-8 grid gap-8 lg:grid-cols-2">{stays.map((stay) => <article key={stay.slug} className="overflow-hidden rounded-lg border border-line bg-white"><Link href={zhStayPath(stay.slug)} className="relative block aspect-[3/2]"><Image src={stay.photos[0].src} alt={staysZh[stay.slug].name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></Link><div className="p-6"><h3 className="text-2xl"><Link href={zhStayPath(stay.slug)}>{staysZh[stay.slug].name}</Link></h3><p className="mt-4 leading-relaxed text-stone">{staysZh[stay.slug].intro}</p><div className="mt-5 flex flex-wrap items-center gap-4"><Link href={zhStayPath(stay.slug)} className="underline">看床位、照片與設施</Link><a href={airbnbUrl(stay)} data-booking-placement="zh-home-card" data-airbnb-intent="availability" className="rounded-md bg-ember px-4 py-3 text-white">Airbnb 查日期與價格</a></div></div></article>)}</div></section>
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><h2 className="text-3xl">房客怎麼說</h2><div className="mt-8 grid items-start gap-4 lg:grid-cols-3">{featuredReviews.map(({ review, stay, translation }) => <ReviewCardZh key={review.text} review={review} translation={translation} stayName={stay.name} />)}</div><p className="mt-4 text-xs text-stone">精選自 Airbnb 英文評論，由 SSHOME 翻譯，可展開查看原文；姓名已縮寫以保護隱私。</p></section>
    <section id="compare" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"><h2 className="text-3xl">兩間怎麼比較？</h2><div className="mt-8 grid gap-4 md:grid-cols-2">{stays.map((stay) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl"><Link href={zhStayPath(stay.slug)} className="hover:text-ember">{stay.name}</Link></h3><p className="mt-2 text-sm font-medium">最多 {stay.guests} 人・{stay.bedrooms} 間臥室・{stay.baths} 間衛浴{stay.rating && <>・★ {stay.rating.value}（{stay.rating.count} 則評論）</>}</p><dl className="mt-4 divide-y divide-line text-sm">{compareRows.map(([label, key]) => <div key={key} className="py-3"><dt className="font-medium">{label}</dt><dd className="mt-1 leading-relaxed text-stone">{staysZh[stay.slug].compare[key]}</dd></div>)}</dl></div>)}</div></section>
    <section className="bg-sand"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><h2 className="text-3xl">住 Visalia，先補給再出發</h2><p className="mt-4 leading-relaxed">Visalia 有兩間 Costco，適合採買整趟旅程的食材；依屋主估計，Family Home 開車到 Target 不到五分鐘，實際依交通而異。兩間房源都在公園外，入口車程不等於前往巨杉景點的時間。</p><dl className="mt-6 divide-y divide-line border-y border-line">{driveTimesZh.map((drive) => <div key={drive.place} className="flex items-baseline justify-between gap-6 py-4"><dt><span className="font-medium">{drive.place}</span><span className="mt-1 block text-sm text-stone">{drive.entrance}</span></dt><dd className="shrink-0 font-medium text-ember">{drive.time}</dd></div>)}</dl><p className="mt-3 text-xs leading-relaxed text-stone">從 Visalia Municipal Airport 到各公園入口的時間，依<a href={parkFacts.sourceUrl} className="underline">美國國家公園管理局</a>資料。公園內山路請另外預留時間。</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/zh-tw/sequoia-guide" className="underline">閱讀繁中自駕指南與住宿設施行程</Link><Link href="/zh-tw/sequoia-group-lodging" className="underline">10～14 人團體住宿</Link><Link href="/zh-tw/sequoia-winter-guide" className="underline">冬天去紅杉國家公園</Link></div></div></section>
    <section id="about" className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><h2 className="text-3xl">認識 SSHOME</h2><p className="mt-4 leading-relaxed">我們是屋主 Spencer 與 Sylvia，管理團隊包括 Janson 和 Miyu。想確認床位、熱水池、充電或費用，請從對應的 Airbnb 房源聯絡我們。</p><p className="mt-4 text-sm text-stone">熱水池不保證第一晚可用；烤肉瓦斯與 EV 充電另計費。訂房、付款、即時價格及取消條款以 Airbnb 為準。資料更新：{factsCheckedOn}。</p><Link href="/zh-tw/about" className="mt-4 inline-block py-1 underline">更多關於 SSHOME 與聯絡方式</Link></section>
    <section id="faq" className="mx-auto max-w-4xl px-4 pb-16 sm:px-6"><h2 className="text-3xl">常見問題</h2><div className="mt-6"><FaqList faqs={siteFaqsZh} /></div></section>
  </>;
}
