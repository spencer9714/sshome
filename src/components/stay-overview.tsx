import type { Stay } from '@/data/stays';
import { BookingForm } from '@/components/booking-form';

export function StayOverview({ stay, language = 'en' }: { stay: Stay; language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  const desert = stay.slug.startsWith('desert-');
  const facts = zh
    ? [`${stay.bedrooms} 間臥室`, `最多 ${stay.guests} 人（含加床）`, desert ? '私人泳池・不加熱' : '撞球桌與閣樓遊戲', '私人熱水池', '完整廚房']
    : [`${stay.bedrooms} bedrooms`, `Up to ${stay.guests} incl. extra sleeping spaces`, desert ? 'Private unheated pool' : 'Pool table & game loft', 'Private hot tub', 'Full kitchen'];
  const links = [
    ['photo-tour', zh ? '照片' : 'Photos'],
    ['sleeping', zh ? '床位' : 'Sleeping'],
    ['amenities', zh ? '設施' : 'Amenities'],
    ['location', zh ? '位置與交通' : 'Location'],
    ['house-rules', zh ? '入住須知' : 'House rules'],
    ['book', zh ? '查日期' : 'Check dates'],
  ];
  return <>
    <ul aria-label={zh ? '住宿重點' : 'At a glance'} className="mt-6 flex flex-wrap gap-2">
      {facts.map(fact => <li key={fact} className="rounded-md bg-sand px-3 py-2 text-sm font-medium">{fact}</li>)}
    </ul>
    <nav aria-label={zh ? '房源段落導覽' : 'On this page'} className="mt-5 flex flex-wrap gap-x-1 gap-y-1 border-y border-line py-2">
      {links.map(([id, label]) => <a key={id} href={`#${id}`} className={`rounded-md px-3 py-3 text-sm font-medium underline-offset-4 hover:bg-sand hover:underline ${id === 'book' ? 'text-ember lg:hidden' : ''}`}>{label}</a>)}
      <a href="#book-desktop" className="hidden rounded-md px-3 py-3 text-sm font-medium text-ember underline-offset-4 hover:bg-sand hover:underline lg:block">{zh ? '查日期' : 'Check dates'}</a>
    </nav>
  </>;
}

export function MobileStayBooking({ stay, language = 'en' }: { stay: Stay; language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  return <section id="book" className="mt-6 scroll-mt-24 rounded-lg border border-line bg-white p-5 sm:p-6 lg:hidden">
    <h2 className="text-2xl">{zh ? '選日期與人數' : 'Check your dates'}</h2>
    <p className="mb-5 mt-2 text-sm text-stone">{zh ? '查看 Airbnb 即時空房與價格。' : 'See current availability and prices on Airbnb.'}</p>
    <BookingForm stay={stay} language={language} />
  </section>;
}
