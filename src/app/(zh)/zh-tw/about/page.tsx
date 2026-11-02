import type { Metadata } from 'next';
import Link from 'next/link';
import { airbnbUrl, stays } from '@/data/stays';
import { staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { site } from '@/lib/site';

const title = '關於 SSHOME 與聯絡方式';
const description = '認識 SSHOME：加州 Visalia 兩間為家庭與團體設計的度假住宿。比較兩間房源，並透過 Airbnb 聯絡房東。';

export const metadata: Metadata = {
  title: { absolute: `${title} | ${site.name}` },
  description,
  alternates: { canonical: '/zh-tw/about', languages: languageAlternates('/about', '/zh-tw/about') },
  openGraph: { title, description, url: '/zh-tw/about', locale: 'zh_TW', images: [{ url: site.ogImage }] },
};

export default function ChineseAboutPage() {
  return <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
    <p className="text-sm font-medium text-ember">關於 SSHOME</p>
    <h1 className="mt-3 text-4xl sm:text-5xl">一起旅行，也有足夠的空間</h1>
    <p className="mt-6 text-xl leading-relaxed">SSHOME 在加州 Visalia 有兩間用心佈置的度假住宿。我們想提供的很簡單：讓家庭和團體在探險之間，有空間一起煮飯、放鬆、相處。</p>
    <section className="mt-10 rounded-lg bg-sand p-6 sm:p-8">
      <h2 className="text-3xl">SSHOME 背後的人</h2>
      <p className="mt-4 leading-relaxed">我們是 SSHOME 的屋主 Spencer 與 Sylvia，管理團隊包括 Janson 和 Miyu，一起照顧這兩間 Visalia 度假住宿。</p>
    </section>
    <p className="mt-5 leading-relaxed text-stone">可以選附私人泳池和火坑的五房住宿，或有撞球桌和閣樓的四房家庭住宿。兩間都有完整廚房和熱水池，使用所列的床位最多可住 14 人。</p>
    <section className="mt-12"><h2 className="text-3xl">訂房前有問題？</h2><p className="mt-4 leading-relaxed text-stone">請在 Airbnb 打開想住的房源，選擇「聯絡房東」或「傳訊息給房東」，詢問床位、熱水池狀況、EV 充電或目前的費用。訂房前也請在 Airbnb 查看空房、房屋規則和取消條款。</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{stays.map((stay) => <div key={stay.slug} className="rounded-lg border border-line bg-white p-6"><h3 className="text-2xl">{stay.name}</h3><p className="mt-2 text-sm text-stone">{staysZh[stay.slug].compare.bestFor}</p><Link href={zhStayPath(stay.slug)} className="mt-4 block py-1 text-sm underline">看床位、照片與設施</Link><a href={airbnbUrl(stay)} data-booking-placement="zh-about-contact" data-airbnb-intent="contact" className="mt-4 inline-block rounded-md bg-ember px-4 py-3 text-sm font-medium text-white">到 Airbnb 查看並聯絡房東</a></div>)}</div>
    </section>
    <section className="mt-12"><h2 className="text-3xl">規劃公園行程</h2><p className="mt-4 text-stone">兩間房子都在 Visalia，位於公園外。到入口的車程，和到巨杉景點的時間並不相同。</p><Link href="/zh-tw/sequoia-guide" className="mt-4 inline-block py-1 underline">閱讀繁中自駕指南</Link></section>
  </article>;
}
