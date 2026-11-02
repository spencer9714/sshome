import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { pageUpdates } from '@/data/page-updates';
import { stays, type Faq } from '@/data/stays';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { breadcrumbSchema, faqSchema } from '@/lib/schema';
import { absoluteUrl, parkFacts } from '@/lib/site';

const path = '/zh-tw/sequoia-winter-guide';
const title = '冬天去紅杉國家公園｜雪鏈、道路與玩雪指南（從 Visalia 出發）';
const description = '冬天從 Visalia 去 Sequoia 與 Kings Canyon：四驅車也要帶雪鏈、哪些路會封閉、哪裡能玩雪、該帶什麼。內容依美國國家公園管理局資料整理。';
const image = '/park/sequoia-winter-snow.jpg';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path, languages: languageAlternates('/sequoia-winter-guide', path) },
  openGraph: { title, description, url: path, type: 'article', locale: 'zh_TW', images: [{ url: image }] },
};

const [desert, family] = stays;

const npsPages = {
  activities: 'https://www.nps.gov/seki/planyourvisit/winteractivities.htm',
  snowplay: 'https://www.nps.gov/seki/planyourvisit/snowplay.htm',
  holidays: 'https://www.nps.gov/seki/planyourvisit/winter-holidays-in-the-parks.htm',
  skiing: 'https://www.nps.gov/seki/planyourvisit/skiing.htm',
};

const checklist = [
  { title: '雪鏈：四驅或全輪驅動也要帶', body: '美國國家公園管理局（NPS）表示，冬季隨時可能要求使用雪鏈，也請四驅與全輪驅動車輛同樣攜帶。公園入口附近可以購買或租用。如果開租來的車，請先確認租車條款對雪鏈的規定。' },
  { title: '加滿油或充飽電', body: '公園內沒有加油站，也沒有 EV 充電站，出發前請在 Visalia 準備好。' },
  { title: '保暖衣物、飲水與食物', body: '巨杉林下雪時，山腳可能正在下雨，衣物要兩種天氣都能應付。也請帶上應急的飲水和食物，並預期進入入口站後不久就會收不到手機訊號。' },
  { title: '當天路況', body: '出發前請先查詢，風雪可能讓道路臨時封閉。公園內路況電話 24 小時提供：(559) 565-3341，先按 1，再按 1。' },
];

const access = [
  { place: 'Giant Forest 與 General Sherman Tree', route: 'Highway 198', status: '冬季主要目的地，但風雪時可能封閉。NPS 曾列出 Sherman Tree 主停車場冬季關閉，無障礙停車場的車位非常有限。' },
  { place: 'Grant Grove 與 General Grant Tree', route: 'Highway 180', status: 'Kings Canyon 的冬季目的地，有玩雪區和標示的冬季步道。NPS 提醒，風雪可能影響哪個入口比較合適。' },
  { place: '兩座公園之間的 Generals Highway', route: 'Quail Flat 至 Wuksachi Lodge', status: '下雪時可能封閉。開放時，兩個入口站之間請預留至少 2 到 3 小時。' },
  { place: 'Moro Rock 與 Crescent Meadow', route: 'Moro Rock/Crescent Meadow Road', status: 'NPS 在冬季資訊中列為關閉。' },
  { place: 'Cedar Grove', route: 'Highway 180（過 Hume Lake 路口）', status: '冬季關閉。這段路通常在 5 月到 11 月上中旬開放。' },
  { place: 'Mineral King', route: 'Mineral King Road', status: '冬季關閉。通常在陣亡將士紀念日前的星期三重新開放。' },
];

const snowAreas = [
  { name: 'Wolverton（Sequoia 國家公園）', body: '位於 Wolverton Road 底端，在 General Sherman Tree 以北約 2 英里，海拔 7,250 英尺。風雪過後，由於鏟雪車要先清主要道路，這條路可能要數小時才會開放。' },
  { name: 'Big Stump（Kings Canyon 國家公園）', body: '靠近 Highway 180 的 Big Stump 入口站，位於海拔約 6,600 英尺的 Grant Grove 地區。' },
  { name: 'Columbine（Kings Canyon 國家公園）', body: '在 Grant Grove 通往 General Grant Tree 步道的路上。Grant Grove Market 通常有賣玩雪用品。' },
];

const faqs: Faq[] = [
  { question: 'Sequoia 國家公園冬天有開嗎？', answer: '有，公園仍然開放，但能否進入會隨天氣變化，部分區域也會季節性關閉。請在出發當天查詢路況。' },
  { question: '冬天什麼時候人最多？', answer: 'NPS 指出，感恩節週和聖誕節週是最忙的時段之一，入口可能要等 2 到 3 小時。平日人比較少，上午 9 點前或下午 3 點後抵達有助避開排隊。熱門停車場最早上午 10 點就可能停滿。' },
  { question: 'Giant Forest 冬天有接駁車嗎？', answer: 'NPS 在感恩節和冬季假期會提供 Giant Forest 免費接駁車。日期每年不同，請查看公園網站。接駁車不到 Kings Canyon。' },
  { question: '冬天可以帶狗進公園嗎？', answer: '所有公園步道都不能帶寵物，包含冬季步道。在開發區域必須繫牽繩，如果帶狗同行，請事先安排。' },
];

export default function ChineseWinterGuidePage() {
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
      <JsonLd data={breadcrumbSchema([{ name: '中文首頁', path: '/zh-tw' }, { name: '冬季指南', path }])} />

      <article className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-sm font-medium text-ember">冬季指南</p>
        <h1 className="mt-3 text-4xl leading-tight sm:text-5xl">冬天從 Visalia 去紅杉國家公園</h1>
        <p className="mt-6 text-xl leading-relaxed">
          雪中的巨杉很值得一看，但冬天要多做一點準備：帶好雪鏈、當天早上查路況，行程保留彈性。Visalia 位於谷地，比下雪的巨杉林低很多，天氣好就上山，遇到風雪就留在住宿放鬆。
        </p>

        <figure className="mt-10">
          <div className="relative aspect-[3/2] overflow-hidden rounded-lg">
            <Image src={image} alt="Sequoia 與 Kings Canyon 國家公園內，木圍欄旁一棵巨杉的根部堆滿新雪" fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-xs leading-relaxed text-stone">
            照片（經裁切）：<a href={npsPages.holidays} className="underline">NPS / Alison Taggart Barone</a>。No protection is claimed in original U.S. Government works.
          </figcaption>
        </figure>

        <section className="mt-14">
          <h2 className="text-3xl">從 Visalia 出發前</h2>
          <div className="mt-6 space-y-6">
            {checklist.map((item) => (
              <div key={item.title}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{item.title}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">冬天到得了哪裡？</h2>
          <p className="mt-4 leading-relaxed text-stone">以下是一般情況，不是當天路況。實際封閉情形會隨每場風雪改變。</p>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {access.map((item) => (
              <div key={item.place} className="py-4">
                <h3 className="font-sans text-base font-semibold tracking-normal">{item.place}</h3>
                <p className="mt-0.5 text-sm text-stone">{item.route}</p>
                <p className="mt-1.5 leading-relaxed text-stone">{item.status}</p>
              </div>
            ))}
          </div>
          <a href={parkFacts.conditionsUrl} className="mt-4 inline-block py-1 text-sm underline hover:text-ember">到 NPS 網站查看最新路況</a>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">孩子可以在哪裡滑雪橇？</h2>
          <p className="mt-4 leading-relaxed text-stone">雪橇和雪盆只能在指定區域使用，Sherman Tree Road 和 Grant Tree 步道周邊都不可以。</p>
          <div className="mt-6 space-y-5">
            {snowAreas.map((area) => (
              <div key={area.name}>
                <h3 className="font-sans text-base font-semibold tracking-normal">{area.name}</h3>
                <p className="mt-1.5 leading-relaxed text-stone">{area.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-relaxed text-stone">
            NPS 的安全建議：腳朝前滑、可以考慮戴安全帽、避開岩石和樹木，也不要往道路或停車場方向滑。雪況不好或視線不清時就不要滑。也請留意孩子是否弄濕或著涼。
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">雪鞋與冬季步道</h2>
          <p className="mt-4 leading-relaxed text-stone">Giant Forest 和 Grant Grove 都有冬季步道，但可能結冰，建議使用鞋底防滑器。雪鞋可以在 Grant Grove Market 租用，也可以自備。</p>
          <p className="mt-4 leading-relaxed text-stone">雪量足夠時，NPS 曾在 1 月中旬左右開始提供免費的巡山員雪鞋導覽。過去需要預約、穿防水鞋，且須年滿 10 歲，請致電公園確認當季安排。</p>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">從 Visalia 出發的冬季一日行程</h2>
          <ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-stone marker:text-ember">
            <li><strong className="font-medium text-ink">早上：</strong>查好路況，走 Highway 198 到 Ash Mountain 入口。NPS 表示，從 Foothills Visitor Center 到 Giant Forest 約需 1 小時。</li>
            <li><strong className="font-medium text-ink">中午：</strong>看 General Sherman Tree；如果帶了雪橇，就再到 Wolverton。</li>
            <li><strong className="font-medium text-ink">如果上段道路封閉：</strong>留在較低海拔，到 Hospital Rock 的野餐區和展示區走走。</li>
            <li><strong className="font-medium text-ink">下午：</strong>趁天還亮就下山，冬季山路開起來比較慢。</li>
          </ol>
          <p className="mt-5 leading-relaxed text-stone">
            入口車程與車長限制，請看<Link href="/zh-tw/sequoia-guide" className="text-ink underline hover:text-ember">繁中自駕指南</Link>。
          </p>
        </section>

        <section className="mt-14 rounded-lg bg-sand p-6 sm:p-8">
          <h2 className="text-2xl">冬天住 Visalia</h2>
          <div className="mt-4 space-y-3 leading-relaxed text-stone">
            <p><Link href={zhStayPath(family.slug)} className="font-medium text-ink underline hover:text-ember">{family.name}</Link> 很適合風雪天，有撞球桌，閣樓也有桌遊。</p>
            <p><Link href={zhStayPath(desert.slug)} className="font-medium text-ink underline hover:text-ember">{desert.name}</Link> 有火坑和體感遊戲。泳池沒有加熱，冬天不適合游泳。</p>
            <p>想在冷天泡熱水池嗎？請在訂房前先詢問房東，因為冬季保養後重新加熱需要較久。</p>
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-3xl">冬季旅遊常見問題</h2>
          <div className="mt-6"><FaqList faqs={faqs} /></div>
        </section>

        <p className="mt-10 text-xs leading-relaxed text-stone">
          依美國國家公園管理局的<a href={npsPages.activities} className="underline">冬季活動</a>、<a href={npsPages.snowplay} className="underline">玩雪</a>、<a href={npsPages.holidays} className="underline">冬季假期</a>及<a href={npsPages.skiing} className="underline">滑雪與雪鞋</a>頁面整理。部分頁面最後更新於先前的季節，請向公園確認細節。查核日期：{pageUpdates[path]}。
        </p>
      </article>
    </>
  );
}
