import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { airbnbUrl, factsCheckedOn, stays } from '@/data/stays';
import { staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { site } from '@/lib/site';

const title = 'Visalia 紅杉國家公園住宿｜14人家庭包棟・泳池度假屋｜SSHOME';
const description = '規劃 Sequoia 紅杉與 Kings Canyon 國家公園自駕旅行？比較 SSHOME 在 Visalia 的兩間14人整棟住宿：五房泳池屋、四房家庭遊戲屋。查看床位、設施與繁中行程，透過 Airbnb 訂房。';
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: '/zh-tw', languages: languageAlternates('/', '/zh-tw') },
  openGraph: { title, description, url: '/zh-tw', locale: 'zh_TW', alternateLocale: ['en_US'], images: [{ url: site.ogImage }] },
};

export default function ChineseHome() {
  return <>
    <section className="relative isolate flex min-h-[70svh] items-end overflow-hidden bg-dusk text-white">
      <Image src={stays[0].photos[0].src} alt="Visalia Desert Retreat 私人泳池與度假屋" fill priority sizes="100vw" className="-z-20 object-cover" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><p>加州 Visalia・SSHOME</p><h1 className="mt-4 max-w-4xl text-4xl leading-tight sm:text-6xl">紅杉國家公園之旅，<br />也有屬於全家的度假時光</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed">兩間最多14人的整棟住宿，適合家庭與朋友自駕出遊。選五房泳池屋，或四房附撞球桌的家庭度假屋；白天探索 Sequoia 與 Kings Canyon，晚上一起煮飯、放鬆。</p><Link href="#homes" className="mt-6 inline-block rounded-md bg-ember px-5 py-3 font-medium">比較兩間住宿</Link></div>
    </section>
    <section id="homes" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"><h2 className="text-3xl">Visalia 包棟住宿怎麼選？</h2><div className="mt-8 grid gap-8 lg:grid-cols-2">{stays.map((stay) => <article key={stay.slug} className="overflow-hidden rounded-lg border border-line bg-white"><Link href={zhStayPath(stay.slug)} className="relative block aspect-[3/2]"><Image src={stay.photos[0].src} alt={staysZh[stay.slug].name} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></Link><div className="p-6"><h3 className="text-2xl"><Link href={zhStayPath(stay.slug)}>{staysZh[stay.slug].name}</Link></h3><p className="mt-4 leading-relaxed text-stone">{staysZh[stay.slug].intro}</p><div className="mt-5 flex flex-wrap items-center gap-4"><Link href={zhStayPath(stay.slug)} className="underline">看床位、照片與設施</Link><a href={airbnbUrl(stay)} data-booking-placement="zh-home-card" data-airbnb-intent="availability" className="rounded-md bg-ember px-4 py-3 text-white">Airbnb 查日期與價格</a></div></div></article>)}</div></section>
    <section className="bg-sand"><div className="mx-auto max-w-4xl px-4 py-14 sm:px-6"><h2 className="text-3xl">住 Visalia，先補給再出發</h2><p className="mt-4 leading-relaxed">Visalia 有兩間 Costco，適合採買整趟旅程的食材；依屋主估計，Family Home 開車到 Target 不到五分鐘，實際依交通而異。兩間房源都在公園外，入口車程不等於前往巨杉景點的時間。</p><Link href="/zh-tw/sequoia-guide" className="mt-5 inline-block underline">閱讀繁中自駕指南與住宿設施行程</Link></div></section>
    <section id="about" className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><h2 className="text-3xl">認識 SSHOME</h2><p className="mt-4 leading-relaxed">我們是屋主 Spencer 與 Sylvia，管理團隊包括 Janson 和 Miyu。想確認床位、熱水池、充電或費用，請從對應的 Airbnb 房源聯絡我們。</p><p className="mt-4 text-sm text-stone">熱水池不保證第一晚可用；烤肉瓦斯與 EV 充電另計費。訂房、付款、即時價格及取消條款以 Airbnb 為準。資料更新：{factsCheckedOn}。</p></section>
  </>;
}
