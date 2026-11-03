import Link from 'next/link';
import { factsCheckedOn, stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';
import { zhStayPath } from '@/lib/locales';

export function SiteFooter({ language = 'en' }: { language?: 'en' | 'zh-Hant' }) {
  if (language === 'zh-Hant') return <footer lang="zh-Hant" className="bg-dusk text-bone"><div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="font-display text-2xl">SSHOME</p><p className="mt-3">加州 Visalia 整棟度假住宿・Sequoia 與 Kings Canyon 自駕基地</p><nav aria-label="頁尾導覽" className="mt-6 flex flex-wrap gap-5 text-sm">{stays.map((stay) => <Link key={stay.slug} href={zhStayPath(stay.slug)} className="underline">{stay.name}</Link>)}<Link href="/zh-tw/sequoia-guide" className="underline">繁中自駕指南</Link><Link href="/zh-tw/sequoia-group-lodging" className="underline">團體住宿</Link><Link href="/zh-tw/sequoia-winter-guide" className="underline">冬季指南</Link><Link href="/zh-tw/visalia-crew-housing" className="underline">工程團隊住宿</Link><Link href="/zh-tw/about" className="underline">關於屋主與聯絡</Link><Link href="/zh-tw/privacy" className="underline">隱私權政策</Link><Link href="/" lang="en" className="underline">English</Link></nav><p className="mt-6 text-xs leading-relaxed text-bone/75">訂房與付款均透過 Airbnb。SSHOME 與 Airbnb 或美國國家公園管理局沒有隸屬關係。資料更新：{factsCheckedOn}；即時資訊以 Airbnb 為準。</p></div></footer>;
  return (
    <footer lang="en" className="bg-dusk text-bone">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-2xl tracking-[0.12em]">SSHOME</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/75">
            Vacation homes in Visalia, California, near Sequoia and Kings Canyon National Parks.
          </p>
        </div>
        <nav aria-label="Homes" className="text-sm">
          <p className="font-medium">Homes</p>
          <ul className="mt-3 space-y-2 text-bone/75">
            {stays.map((stay) => (
              <li key={stay.slug}>
                <Link href={stayPath(stay)} className="hover:text-glow">
                  {stay.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Plan your trip" className="text-sm">
          <p className="font-medium">Plan your trip</p>
          <ul className="mt-3 space-y-2 text-bone/75">
            <li>
              <Link href="/sequoia-kings-canyon-guide" className="hover:text-glow">
                Sequoia and Kings Canyon guide
              </Link>
            </li>
            <li><Link href="/sequoia-group-lodging" className="hover:text-glow">Group lodging near Sequoia</Link></li>
            <li><Link href="/sequoia-winter-guide" className="hover:text-glow">Sequoia in winter</Link></li>
            <li><Link href="/visalia-crew-housing" className="hover:text-glow">Contractor and crew housing</Link></li>
            <li><Link href="/about" className="hover:text-glow">About SSHOME &amp; contact</Link></li>
            <li><Link href="/privacy" className="hover:text-glow">Privacy Policy</Link></li>
            <li><Link href="/zh-tw/sequoia-guide" lang="zh-Hant" className="hover:text-glow">繁體中文旅遊指南</Link></li>
            <li>
              <Link href="/#faq" className="hover:text-glow">
                FAQ
              </Link>
            </li>
            <li>
              <a href="/llms.txt" className="hover:text-glow">
                Summary for AI agents
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-bone/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs leading-relaxed text-bone/65 sm:px-6 lg:px-8">
          Bookings are made on Airbnb. SSHOME is not affiliated with Airbnb or the National Park Service. Listing
          details checked {factsCheckedOn}; Airbnb has the current information.
        </p>
      </div>
    </footer>
  );
}
