import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { pageUpdates } from '@/data/page-updates';
import { airbnbUrl, factsCheckedOn, stays, type Faq } from '@/data/stays';
import { staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

const path = '/zh-tw/visalia-crew-housing';
const title = 'Visalia 工程團隊與承包商住宿｜整棟住宿最長29天';
const description = '在 Visalia 施工或出差？SSHOME 兩間整棟住宿可讓 5～6 人每人一張床，有完整廚房、洗衣間，車庫和車道可停 3～6 台車，透過 Airbnb 訂房，最長可住29天。';
const image = '/stays/desert-retreat/kitchen-1.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates('/visalia-crew-housing', path) },
  openGraph: { title, description, url: path, type: 'article', locale: 'zh_TW', images: [{ url: image }] },
};

const [desert, family] = stays;

const homes = [
  { stay: desert, rooms: '四間獨立臥室，另有一間兩張單人床的臥室', work: 'Bedroom 2 有書桌、椅子、螢幕和檯燈，方便處理文書和開會。' },
  { stay: family, rooms: '三間獨立臥室，另有一間兩張單人床的臥室', work: '有 Wi-Fi，但沒有專用工作區。' },
];

const tips = [
  { title: '工程車與停車', body: '每間的車庫、車道和路邊車位都列在上方。請避免擋到鄰居車道，並遵守現場告示。' },
  { title: '工作靴與工具', body: '工作靴和工具請保持乾淨，並放在車庫，不要帶進屋內。抵達前請先傳訊息給房東，安排車庫使用方式。' },
  { title: '清晨出門', body: '安靜時段是晚上 9:00 到早上 8:00。清晨出門上工時，請放低音量，也避免讓車輛長時間怠速。' },
  { title: '入住與退房', body: '下午 4:00 入住，早上 10:00 退房。如果需要調整，可以詢問房東，提早入住或延後退房可能可以安排，需另外付費。' },
];

const faqs: Faq[] = [
  { question: '工程團隊最長可以住多久？', answer: '最長 29 天。最短天數、可用折扣和總價，請看 Airbnb 上你選的日期。' },
  { question: '公司可以直接訂房，用發票付款嗎？', answer: '不行。所有訂房和付款都透過 Airbnb 進行，收據也可以在 Airbnb 取得。' },
  { question: '訂房的人沒有要入住，可以幫團隊訂嗎？', answer: '請在訂房前透過 Airbnb 傳訊息給房東，說明人數、日期和實際入住的人，先確認安排。' },
  { question: '團隊超過 6 人怎麼辦？', answer: `每間最多 14 位過夜旅客，但 ${desert.name} 超過 ${desert.beds} 人、${family.name} 超過 ${family.beds} 人時，多出來的人要睡沙發床、沙發或氣墊床。如果兩間都有空房，一起訂共有 ${desert.beds + family.beds} 張臥室床位。兩間位在 Visalia 不同地點，不是隔壁鄰居。` },
  { question: '可以帶拖車或大型工程車嗎？', answer: '路邊可停車輛：Desert Retreat 四到五台，Luxury Family Home 一台。如果要帶拖車或超大型車輛，請在訂房前先傳訊息給房東。' },
  { question: '住宿離工地多近？', answer: 'Airbnb 在訂房前會顯示大略區域，訂房後才提供完整地址。如果距離很重要，可以把工地位置傳給房東詢問。' },
];

export default function ChineseCrewHousingPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          inLanguage: 'zh-Hant',
          url: absoluteUrl(path),
          image: absoluteUrl(image),
          dateModified: pageUpdates[path],
          author: { '@type': 'Organization', name: 'SSHOME' },
          publisher: { '@type': 'Organization', name: 'SSHOME' },
        }}
      />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd data={breadcrumbSchema([{ name: '中文首頁', path: '/zh-tw' }, { name: '工程團隊住宿', path }])} />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">工作住宿</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">Visalia 工程團隊與承包商住宿</h1>
        <p className="mt-6 text-xl leading-relaxed">
          團隊要到 Visalia、Tulare 或中央谷地其他地方施工？SSHOME 有兩間整棟住宿，可讓 5～6 人每人一張床，附完整廚房、洗衣機與烘衣機、Wi-Fi，車庫和車道可停 3～6 台車。最長可住 29 天，透過 Airbnb 訂房。
        </p>

        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-lg">
          <Image src={image} alt="Desert Retreat 的廚房，有瓦斯爐、大冰箱和吧台" fill priority sizes="(min-width: 896px) 848px, 100vw" className="object-cover" />
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">哪一間適合你的團隊？</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {homes.map(({ stay, rooms, work }) => (
              <div key={stay.slug} className="rounded-lg border border-line bg-white p-6">
                <h3 className="text-2xl">
                  <Link href={zhStayPath(stay.slug)} className="hover:text-ember">{stay.name}</Link>
                </h3>
                <p className="mt-2 text-sm font-medium">{stay.beds} 人每人一張床・{stay.baths} 間衛浴</p>
                <p className="mt-3 leading-relaxed text-stone">{rooms}。{work}</p>
                <p className="mt-3 text-sm leading-relaxed"><span className="font-medium">停車：</span>{staysZh[stay.slug].compare.parking}</p>
                <a href={airbnbUrl(stay)} data-airbnb-intent="booking" data-booking-placement="zh-crew-page" className="mt-4 inline-block py-1 text-sm font-medium underline hover:text-ember">到 Airbnb 查日期</a>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">團隊抵達前要知道的事</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{tip.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">工程團隊住宿常見問題</h2>
          <div className="mt-6"><FaqList faqs={faqs} /></div>
        </section>

        <p className="mt-10 text-xs text-stone">房源資料查核日期：{factsCheckedOn}。最新規則、空房與價格以 Airbnb 為準。</p>
      </article>
    </>
  );
}
