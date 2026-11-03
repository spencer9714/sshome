import type { Metadata } from 'next';
import { pageUpdates } from '@/data/page-updates';
import { languageAlternates } from '@/lib/locales';
import { site } from '@/lib/site';

const path = '/zh-tw/privacy';
const title = '隱私權政策';
const description = 'SSHOME 網站如何使用 Cookie、Google Analytics 與 OpenAI Ads Pixel，哪些資料會傳給 Airbnb，以及你的選擇和加州隱私權利。';

export const metadata: Metadata = {
  title: { absolute: `${title} | ${site.name}` },
  description,
  alternates: { canonical: path, languages: languageAlternates('/privacy', path) },
  openGraph: { title, description, url: path, locale: 'zh_TW', images: [{ url: site.ogImage }] },
};

const providers = [
  {
    name: 'Google Analytics',
    purpose: '讓我們了解訪客如何找到和使用網站，包括瀏覽的頁面、帶來流量的網站或活動、點擊前往 Airbnb 的情形、大略位置和裝置類型。',
    storage: '使用名為 _ga 和 _ga_FR9GRK5P0E 的 Cookie，最長保存約 400 天。',
    policy: 'https://policies.google.com/technologies/partner-sites',
    policyLabel: 'Google 如何使用採用其服務的網站資料',
  },
  {
    name: 'OpenAI Ads Pixel',
    purpose: '協助我們衡量 OpenAI 服務上的廣告是否帶來造訪和前往 Airbnb 的點擊。它會收到頁面網址、事件時間和前往 Airbnb 的點擊。',
    storage: '使用名為 __obref 的瀏覽器識別 Cookie，最長保存 365 天；如果你是從廣告進站，還會使用名為 __oppref 的廣告識別 Cookie，最長保存 30 天；另有一筆工作階段儲存資料，會在瀏覽器工作階段結束時清除。OpenAI 也可能在自己的網域設定短期安全 Cookie。',
    policy: 'https://openai.com/policies/privacy-policy/',
    policyLabel: 'OpenAI 隱私權政策',
  },
  {
    name: 'Vercel',
    purpose: '提供網站主機服務。和多數網站主機一樣，它會處理 IP 位址、瀏覽器資訊等技術請求資料，用來提供和保護網站。',
    storage: '我們沒有透過 Vercel 在本網站設定分析 Cookie。',
    policy: 'https://vercel.com/legal/privacy-notice',
    policyLabel: 'Vercel 隱私權聲明',
  },
];

const linkClass = 'text-ink underline hover:text-ember';

export default function ChinesePrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-4xl sm:text-5xl">隱私權政策</h1>
      <p className="mt-3 text-sm text-stone">最後更新：{pageUpdates[path]}</p>
      <p className="mt-6 text-xl leading-relaxed">
        本政策適用於 www.sshomedesigns.com。瀏覽本網站不需要提供姓名、電子郵件、電話或付款資料。我們會使用分析和廣告成效衡量工具，內容如下。
      </p>

      <section className="mt-12">
        <h2 className="text-3xl">本網站使用的工具</h2>
        <div className="mt-6 space-y-4">
          {providers.map((provider) => (
            <div key={provider.name} className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-2xl">{provider.name}</h3>
              <p className="mt-3 leading-relaxed text-stone">{provider.purpose}</p>
              <p className="mt-3 leading-relaxed text-stone">{provider.storage}</p>
              <a href={provider.policy} className="mt-3 inline-block py-1 text-sm underline hover:text-ember">{provider.policyLabel}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-stone">
          這些工具會在頁面載入時執行；瀏覽器設定或限制可能縮短 Cookie 的保存時間。這些服務商可能跨時間、跨網站收集你的活動資料。OpenAI 表示目前不會把這個 Pixel 的資料用於個人化；我們也把前往 Airbnb 的點擊事件標記為選擇退出，以防日後有所改變。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">在 Airbnb 訂房</h2>
        <p className="mt-4 leading-relaxed text-stone">
          訂房、付款和與房東的訊息都在 Airbnb 進行，不經過本網站。如果你使用本網站的日期表單，日期和人數會透過開啟的連結傳給 Airbnb。你在 Airbnb 的活動適用其
          <a href="https://www.airbnb.com/help/article/2855" className={linkClass}>隱私權政策</a>。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">我們如何使用資料</h2>
        <p className="mt-4 leading-relaxed text-stone">
          我們用這些資料了解哪些頁面和宣傳有效、改善網站，以及衡量廣告成效。我們不會為了金錢出售資料。不過，依包括加州在內的部分隱私法規，使用 OpenAI Ads Pixel 可能屬於為廣告目的而分享資料。各服務商會依自己的設定和政策保存資料。
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">你的選擇</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-stone">
          <li>在瀏覽器設定中封鎖或刪除 Cookie。封鎖 Cookie 或追蹤腳本會限制這些工具，網站仍可使用。</li>
          <li>安裝 Google 的 <a href="https://tools.google.com/dlpage/gaoptout" className={linkClass}>Google Analytics 停用外掛程式</a>。</li>
          <li>本網站目前沒有提供自己的 Cookie 控制選項，也不會回應 Do Not Track 或 Global Privacy Control 等瀏覽器訊號。</li>
          <li>依你所在地區，你可能還有其他隱私權利。我們沒有訪客帳號，服務商持有的資料請依其政策提出；你也可以向我們提出請求，我們會盡力協助。</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">加州隱私權告知</h2>
        <p className="mt-4 leading-relaxed text-stone">本節適用於加州居民，並補充本政策其他內容。特定加州隱私法規是否適用，可能取決於企業規模等因素。</p>
        <dl className="mt-6 space-y-4 leading-relaxed">
          <div>
            <dt className="font-medium">收集哪些資料</dt>
            <dd className="mt-1 text-stone">IP 位址和 Cookie ID 等識別資料；瀏覽頁面、來源網站和點擊等網路活動；以及依 IP 位址判斷的大略位置。我們不會在本網站要求提供敏感個人資料。</dd>
          </div>
          <div>
            <dt className="font-medium">資料來源與用途</dt>
            <dd className="mt-1 text-stone">資料來自你的瀏覽器和裝置，用於運作和保護網站、分析網站使用情形，以及衡量廣告成效。</dd>
          </div>
          <div>
            <dt className="font-medium">誰會收到資料</dt>
            <dd className="mt-1 text-stone">如上所述的 Google、OpenAI 和 Vercel。我們不會為了金錢出售資料，但使用 OpenAI Ads Pixel 可能屬於為跨情境行為廣告而分享資料。</dd>
          </div>
          <div>
            <dt className="font-medium">保存多久</dt>
            <dd className="mt-1 text-stone">Cookie 的保存時間如上所列。服務商會依自己的設定和政策保存收到的資料。</dd>
          </div>
          <div>
            <dt className="font-medium">你的權利</dt>
            <dd className="mt-1 text-stone">在《加州消費者隱私法》適用的情況下，你可以要求查閱、刪除或更正個人資料，選擇不出售或不分享，並限制敏感個人資料的使用。你不會因為行使這些權利而受到差別待遇。請透過下方的聯絡方式提出請求；你可以委託授權代理人，我們也可能需要相關資料來核實請求。</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">兒童</h2>
        <p className="mt-4 leading-relaxed text-stone">本網站提供給規劃旅行的人使用，並非以 13 歲以下兒童為對象。</p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">政策變更與聯絡方式</h2>
        <p className="mt-4 leading-relaxed text-stone">
          如果我們的做法有所改變，會更新本頁和日期。隱私相關問題，請透過 Airbnb 上任一間房源傳訊息給房東；連結在<a href="/zh-tw/about" className={linkClass}>關於與聯絡頁面</a>。
        </p>
      </section>
    </article>
  );
}
