import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { pageUpdates } from '@/data/page-updates';
import { airbnbUrl, factsCheckedOn, stays, type Faq } from '@/data/stays';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

const path = '/zh-tw/sequoia-group-lodging';
const title = '紅杉國家公園團體住宿｜Visalia 10～14人整棟包棟';
const description = '兩個家庭或10～14人去紅杉國家公園住哪裡？比較 SSHOME 在 Visalia 的兩間整棟住宿，看8到14人的床位分配範例，再到 Airbnb 訂房。';
const image = '/stays/desert-retreat/dining.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates('/sequoia-group-lodging', path) },
  openGraph: { title, description, url: path, type: 'article', locale: 'zh_TW', images: [{ url: image }] },
};

const [desert, family] = stays;

const sleepingPlans = [
  { guests: 8, desert: '一張 King 與三張 Queen 的臥室', family: '全部四間臥室：一張 King、兩張 Queen、兩張單人床' },
  { guests: 10, desert: '全部五間臥室：一張 King、三張 Queen、兩張單人床', family: '全部四間臥室，加上閣樓沙發床' },
  { guests: 12, desert: '全部五間臥室，加上 Queen 氣墊床', family: '全部四間臥室、沙發床與氣墊床' },
  { guests: 14, desert: '全部五間臥室，加上 Queen 氣墊床與兩張單人氣墊床', family: '全部四間臥室、沙發床、沙發與三張氣墊床' },
];

const tips = [
  { title: '停車', body: 'Desert Retreat 車道可停三台，Luxury Family Home 車道可停兩台，附近另有路邊停車。Luxury Family Home 車庫另可停一台，部分車庫已改成遊戲室。額外車輛請先向房東確認安排，並避免擋到鄰居車道。' },
  { title: '長輩與樓梯', body: '兩間都有樓梯。不方便爬樓梯的家人，可以安排在一樓臥室：Desert Retreat 的第二間臥室，或 Luxury Family Home 的第三間臥室；後者一樓也有衛浴。' },
  { title: '吃飯與採買', body: '下午 4:00 才能入住，可以先派一台車到 Visalia 採買。玩了一整天，回住宿一起煮飯，常常是餵飽一大群人最輕鬆的方式。' },
  { title: '洗衣', body: '每間都有自己的二樓洗衣間，附洗衣機與烘衣機，住得久或走完步道後都很方便。' },
];

const faqs: Faq[] = [
  { question: '一間可以住超過14人嗎？', answer: '不行。每間最多14位過夜旅客。' },
  { question: '人更多的話，可以兩間一起訂嗎？', answer: '如果兩間都有空房，可以分別在 Airbnb 預訂。兩間位在 Visalia 不同地點，不是隔壁鄰居，來往需要開車。' },
  { question: '可以辦家族聚會或派對嗎？', answer: '兩間都禁止派對或活動。全家一起住沒問題，但如果要邀請沒有過夜的親友，請先透過 Airbnb 詢問房東。' },
  { question: '14個人每人都有正式的床嗎？', answer: '不會。兩間都要用到額外睡眠空間才能住滿14人，如上方的分配範例。14人同行時，請預期部分旅客會睡氣墊床。' },
];

export default function ChineseGroupLodgingPage() {
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
      <JsonLd data={breadcrumbSchema([{ name: '中文首頁', path: '/zh-tw' }, { name: '團體住宿', path }])} />

      <article className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">團體住宿</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">紅杉國家公園團體住宿：<span className="whitespace-nowrap">10～14 人</span>怎麼住？</h1>
        <p className="mt-6 text-xl leading-relaxed">
          兩個家庭同行，或一群 10 到 14 人的親友出遊？我們在 Visalia 有兩間整棟住宿，大家可以住在同一個屋簷下，不用分散住好幾間飯店房。先選房子，再用下方範例看看大家怎麼睡。
        </p>

        <div className="relative mt-10 aspect-[3/2] overflow-hidden rounded-lg">
          <Image src={image} alt="Desert Retreat 可供團體用餐的長餐桌" fill priority sizes="(min-width: 896px) 848px, 100vw" className="object-cover" />
        </div>

        <section className="mt-14">
          <h2 className="text-3xl">哪一間適合你們？</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { stay: desert, reason: '想要多一間臥室和私人泳池，晚上還能圍著火坑聊天，就選這間。' },
              { stay: family, reason: '想要遊戲室和閣樓，讓大人小孩各有空間，就選這間。' },
            ].map(({ stay, reason }) => (
              <div key={stay.slug} className="rounded-lg border border-line bg-white p-6">
                <h3 className="text-2xl">
                  <Link href={zhStayPath(stay.slug)} className="hover:text-ember">{stay.name}</Link>
                </h3>
                <p className="mt-2 text-sm font-medium">{stay.bedrooms} 間臥室・{stay.baths} 間衛浴</p>
                <p className="mt-3 leading-relaxed text-stone">{reason}</p>
                <a href={airbnbUrl(stay)} data-airbnb-intent="booking" data-booking-placement="zh-group-page" className="mt-4 inline-block py-1 text-sm font-medium underline hover:text-ember">到 Airbnb 查日期</a>
              </div>
            ))}
          </div>
        </section>

        <section id="sleeping-plans" className="mt-14">
          <h2 className="text-3xl">不同人數怎麼分配床位？</h2>
          <p className="mt-4 leading-relaxed text-stone">以下是範例，假設每張 King、Queen、沙發床和 Queen 氣墊床睡 2 人，每張單人床睡 1 人。</p>

          <div className="mt-6 space-y-4 md:hidden">
            {sleepingPlans.map((plan) => (
              <div key={plan.guests} className="rounded-lg border border-line bg-white p-5">
                <h3 className="text-2xl">{plan.guests} 人</h3>
                <dl className="mt-3 space-y-3 text-sm">
                  <div>
                    <dt className="font-medium">{desert.name}</dt>
                    <dd className="mt-1 leading-relaxed text-stone">{plan.desert}</dd>
                  </div>
                  <div>
                    <dt className="font-medium">{family.name}</dt>
                    <dd className="mt-1 leading-relaxed text-stone">{plan.family}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>

          <div className="mt-6 hidden overflow-hidden rounded-lg border border-line bg-white md:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">兩間住宿依人數的床位分配範例</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="p-4 font-medium">人數</th>
                  <th scope="col" className="p-4 font-medium">{desert.name}</th>
                  <th scope="col" className="p-4 font-medium">{family.name}</th>
                </tr>
              </thead>
              <tbody>
                {sleepingPlans.map((plan) => (
                  <tr key={plan.guests} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 align-top font-display text-xl font-normal">{plan.guests}</th>
                    <td className="p-4 align-top leading-relaxed text-stone">{plan.desert}</td>
                    <td className="p-4 align-top leading-relaxed text-stone">{plan.family}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone">
            {family.name} 的氣墊床尺寸沒有列出，12 人以上請先向房東確認。各房間細節請看各房源頁。
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">大團體入住的實用提醒</h2>
          <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {tips.map((tip) => (
              <div key={tip.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{tip.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{tip.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-relaxed text-stone">
            要開休旅車、RV 或拖車，或正在安排公園行程？
            <Link href="/zh-tw/sequoia-guide" className="text-ink underline hover:text-ember">到繁中自駕指南看車長限制、車程與行程範例。</Link>
            來工作出差？
            <Link href="/zh-tw/visalia-crew-housing" className="text-ink underline hover:text-ember">看工程團隊與承包商住宿。</Link>
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">團體住宿常見問題</h2>
          <div className="mt-6"><FaqList faqs={faqs} /></div>
        </section>

        <p className="mt-10 text-xs text-stone">房源資料查核日期：{factsCheckedOn}。最新規則、空房與價格以 Airbnb 為準。</p>
      </article>
    </>
  );
}
