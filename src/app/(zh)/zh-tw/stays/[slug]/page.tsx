import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PhotoTour } from '@/components/photo-tour';
import { BookingForm } from '@/components/booking-form';
import { JsonLd } from '@/components/json-ld';
import { airbnbUrl, factsCheckedOn, getHeroPhoto, getStay, stays } from '@/data/stays';
import { sharedNotesZh, staysZh } from '@/data/stays-zh';
import { languageAlternates, zhStayPath } from '@/lib/locales';
import { breadcrumbSchema, stayPath, staySchema } from '@/lib/schema';
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
    <JsonLd data={{ ...staySchema(stay), '@id': `${absoluteUrl(zhStayPath(slug))}#rental`, name: text.name, description: text.description, url: absoluteUrl(zhStayPath(slug)) }} />
    <JsonLd data={breadcrumbSchema([{ name: '中文首頁', path: '/zh-tw' }, { name: text.name, path: zhStayPath(slug) }])} />
    <Link href="/zh-tw#homes" className="text-sm underline">比較兩間住宿</Link><h1 className="mt-4 text-4xl leading-tight sm:text-5xl">{text.name}</h1><p className="mt-4 text-stone">Visalia 整棟住宿・最多 {stay.guests} 人・{stay.bedrooms} 房・{stay.baths} 間衛浴</p>
    <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-lg"><Image src={getHeroPhoto(stay).src} alt={text.name} fill priority sizes="(min-width: 1024px) 1100px, 100vw" className="object-cover" /></div>
    <div className="mt-10 grid gap-10 lg:grid-cols-3"><div className="lg:col-span-2"><section id="sleeping"><h2 className="text-3xl">14人怎麼分配床位？</h2><p className="mt-4 text-lg leading-relaxed">{stay.summaryZh}</p></section><section className="mt-10"><h2 className="text-3xl">住宿設施與特色</h2><ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed">{text.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section><section className="mt-10"><h2 className="text-3xl">訂房前先確認</h2><ul className="mt-4 list-disc space-y-3 pl-5 text-stone">{sharedNotesZh.map((note) => <li key={note}>{note}</li>)}{stay.slug.startsWith('desert-') && <li>房源位於發展中的社區，附近施工可能產生日間噪音。</li>}</ul><a href={airbnbUrl(stay)} data-booking-placement="zh-stay-details" data-airbnb-intent="amenities" className="mt-4 inline-block underline">到 Airbnb 查看完整規則與即時資訊</a></section><section className="mt-10"><h2 className="text-3xl">國家公園與住宿設施都排進行程</h2><p className="mt-4 leading-relaxed">房源位於 Visalia 市區、公園外。兩天一夜可先享受住宿、隔天看巨杉；三天兩夜留一整天探索 Sequoia，再回住宿吃飯放鬆。參考入口車程時，請另外預留進入公園後的山路、停車與步行時間。</p><Link href="/zh-tw/sequoia-guide" className="mt-4 inline-block underline">查看繁中行程與 Visalia／Three Rivers 比較</Link></section></div><aside><div className="rounded-lg border border-line bg-white p-6 lg:sticky lg:top-24"><h2 className="mb-5 text-2xl">選日期與人數</h2><BookingForm stay={stay} language="zh-Hant" /></div></aside></div>
    <section className="mt-12 rounded-lg bg-sand p-6"><h2 className="text-3xl">入住時間與房屋規則</h2><p className="mt-4">入住：{stay.rules.checkInTime} 起；退房：{stay.rules.checkOutTime} 前（住宿當地時間）。</p><ul className="mt-4 list-disc space-y-2 pl-5">{text.houseRules.map((rule) => <li key={rule}>{rule}</li>)}</ul></section>
    <PhotoTour photos={stay.photos} language="zh-Hant" />
    <p className="mt-10 text-xs text-stone">資料更新：{factsCheckedOn}。訂房與付款均透過 Airbnb。</p>
  </article>;
}
