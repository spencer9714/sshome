import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoTour } from '@/components/photo-tour';
import { BookingForm } from '@/components/booking-form';
import { MobileStayBooking, StayOverview } from '@/components/stay-overview';
import { FaqList } from '@/components/faq-list';
import { JsonLd } from '@/components/json-ld';
import { ReviewCardZh } from '@/components/review-card-zh';
import { airbnbUrl, factsCheckedOn, getHeroPhoto, getStay, stays } from '@/data/stays';
import { ratingLabelsZh, sharedNotesZh, staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { breadcrumbSchema, faqSchema, rentalPageSchema, stayPath, staySchema } from '@/lib/schema';
import { absoluteUrl } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => stays.map((stay) => ({ slug: stay.slug }));
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay || !staysZh[slug]) return {};
  const text = staysZh[slug];
  return { title: { absolute: text.title }, description: text.description,
    alternates: { canonical: zhStayPath(slug), languages: languageAlternates(stayPath(stay), zhStayPath(slug)) },
    openGraph: { title: text.title, description: text.description, url: zhStayPath(slug), locale: 'zh_TW', images: [{ url: getHeroPhoto(stay).src, alt: text.name }] },
  };
}

export default async function ChineseStay({ params }: Props) {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay || !staysZh[slug]) notFound();
  const text = staysZh[slug];
  return <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
    <JsonLd data={rentalPageSchema(stay, 'zh-Hant', text.title)} />
    <JsonLd data={{ ...staySchema(stay), '@id': `${absoluteUrl(zhStayPath(slug))}#rental`, name: text.name, description: text.description, url: absoluteUrl(zhStayPath(slug)) }} />
    <JsonLd data={faqSchema(text.faqs)} />
    <JsonLd data={breadcrumbSchema([{ name: '中文首頁', path: '/zh-tw' }, { name: text.name, path: zhStayPath(slug) }])} />
    <Link href="/zh-tw#homes" className="text-sm underline">比較兩間住宿</Link><h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{text.name}</h1><p className="mt-4 text-stone">Visalia 整棟住宿・最多 {stay.guests} 人・{stay.bedrooms} 房・{stay.baths} 間衛浴{stay.rating && <>・★ {stay.rating.value}（{stay.rating.count} 則 Airbnb 評論）</>}</p>
    <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-lg"><Image src={getHeroPhoto(stay).src} alt={text.name} fill priority sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" /></div>
    <StayOverview stay={stay} language="zh-Hant" />
    <MobileStayBooking stay={stay} language="zh-Hant" />
    <div className="mt-10 grid gap-10 lg:grid-cols-3"><div className="lg:col-span-2"><section id="sleeping" className="scroll-mt-24"><h2 className="text-3xl">14人怎麼分配床位？</h2><p className="mt-4 text-lg leading-relaxed">{stay.summaryZh}</p></section><section id="amenities" className="mt-10 scroll-mt-24"><h2 className="text-3xl">住宿設施與特色</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">{text.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section><section id="before-booking" className="mt-10 scroll-mt-24"><h2 className="text-3xl">訂房前先確認</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-stone">{sharedNotesZh.map((note) => <li key={note}>{note}</li>)}{text.notes.map((note) => <li key={note}>{note}</li>)}</ul><a href={airbnbUrl(stay)} data-booking-placement="zh-stay-details" data-airbnb-intent="amenities" className="mt-4 inline-block underline">到 Airbnb 查看完整規則與即時資訊</a></section><section id="location" className="mt-10 scroll-mt-24"><h2 className="text-3xl">國家公園與住宿設施都排進行程</h2><p className="mt-4 leading-relaxed">房源位於 Visalia 市區、公園外。兩天一夜可先享受住宿、隔天看巨杉；三天兩夜留一整天探索 Sequoia，再回住宿吃飯放鬆。參考入口車程時，請另外預留進入公園後的山路、停車與步行時間。</p><Link href="/zh-tw/sequoia-guide" className="mt-4 inline-block underline">查看繁中行程與 Visalia／Three Rivers 比較</Link><Link href="/zh-tw/sequoia-group-lodging#sleeping-plans" className="mt-3 block py-1 underline">看 8 到 14 人怎麼分配床位</Link></section></div><aside className="hidden lg:block"><div id="book-desktop" className="scroll-mt-24 rounded-lg border border-line bg-white p-6 lg:sticky lg:top-24"><h2 className="mb-5 text-2xl">選日期與人數</h2><BookingForm stay={stay} language="zh-Hant" /></div></aside></div>
    <section id="house-rules" className="mt-12 scroll-mt-24 rounded-lg bg-sand p-6"><h2 className="text-3xl">入住時間與房屋規則</h2><p className="mt-4">入住：{stay.rules.checkInTime} 起；退房：{stay.rules.checkOutTime} 前（住宿當地時間）。</p><ul className="mt-4 list-disc space-y-2 pl-5">{text.houseRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></section>
    {stay.rating?.categories && <section className="mt-12 rounded-lg bg-sand p-6"><h2 className="text-3xl">Airbnb 評分 {stay.rating.value}（{stay.rating.count} 則評論）</h2><dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">{stay.rating.categories.map((category) => <div key={category.label} className="flex items-baseline justify-between border-b border-line pb-2"><dt className="text-sm text-stone">{ratingLabelsZh[category.label] ?? category.label}</dt><dd className="font-medium">{category.score.toFixed(1)}</dd></div>)}</dl><p className="mt-3 text-xs text-stone">依 Airbnb 顯示，查核日期：{factsCheckedOn}。</p></section>}
    {stay.reviews.length > 0 && <section className="mt-12"><h2 className="text-3xl">房客怎麼說</h2><div className="mt-6 grid items-start gap-4 md:grid-cols-2">{stay.reviews.map((review, index) => <ReviewCardZh key={review.text} review={review} translation={text.reviewTranslations[index]} />)}</div><p className="mt-4 text-xs text-stone">精選自 Airbnb 英文評論，由 SSHOME 翻譯，可展開查看原文；姓名已縮寫以保護隱私。<a href={airbnbUrl(stay)} data-airbnb-intent="reviews" data-booking-placement="zh-stay-reviews" className="underline hover:text-ember">到 Airbnb 看所有評論</a></p></section>}
    <PhotoTour photos={stay.photos} language="zh-Hant" />
    <section className="mt-12 max-w-4xl"><h2 className="text-3xl">常見問題</h2><div className="mt-6"><FaqList faqs={text.faqs} /></div></section>
    <p className="mt-10 text-xs text-stone">資料更新：{factsCheckedOn}。訂房與付款均透過 Airbnb。</p>
  </article>;
}
