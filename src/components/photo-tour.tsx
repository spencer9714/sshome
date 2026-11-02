'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/data/stays';
import { photoSpaceLabel } from '@/lib/photo-labels';

export function PhotoTour({ photos: sourcePhotos, language = 'en' }: { photos: Photo[]; language?: 'en' | 'zh-Hant' }) {
  const zh = language === 'zh-Hant';
  const label = (space: string) => photoSpaceLabel(space, language);
  const spaces = Array.from(new Set(sourcePhotos.map((photo) => photo.space)));
  const photos = spaces.flatMap((space) => sourcePhotos.filter((photo) => photo.space === space));
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const active = selected === null ? null : photos[selected];
  const [activeSpace, setActiveSpace] = useState(0);
  const roomNav = useRef<HTMLElement>(null);
  const nextSpace = (activeSpace + 1) % spaces.length;

  function showSpace(index: number) {
    setActiveSpace(index);
    roomNav.current?.children[index]?.scrollIntoView({ block: 'nearest', inline: 'center' });
  }

  useEffect(() => {
    const element = dialog.current;
    if (selected === null || !element) return;
    if (!element.open) element.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [selected]);

  function close() {
    dialog.current?.close();
    setSelected(null);
  }

  function move(direction: number) {
    setSelected((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }

  return (
    <section id="photo-tour" className="mt-16">
      <h2 className="text-3xl">{zh ? '依空間看照片' : 'Photo tour'}</h2>
      <p className="mt-3 text-stone">{zh ? '選擇空間，再點照片放大瀏覽。照片詳細說明保留英文原文。' : 'Choose a room, then tap any photo for a closer look.'}</p>
      <nav ref={roomNav} aria-label={zh ? '相簿空間分類' : 'Photo tour rooms'} className="-mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-4 pt-1">
        {spaces.map((space, index) => {
          const cover = photos.find((photo) => photo.space === space)!;
          return <a key={space} href={`#photo-space-${index}`} aria-current={index === activeSpace ? 'true' : undefined} onClick={(event) => {
            // Phones swap rooms in place. Larger screens show every room, so the link scrolls there.
            if (window.matchMedia('(min-width: 768px)').matches) return;
            event.preventDefault();
            showSpace(index);
          }} className="group w-24 shrink-0 rounded-lg focus-visible:outline-offset-4 md:w-40">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-lg ${index === activeSpace ? 'ring-2 ring-ember ring-offset-2 ring-offset-bone md:ring-0' : ''}`}><Image src={cover.src} alt="" fill sizes="(min-width: 768px) 160px, 96px" className="object-cover transition-transform hover:scale-105" /></div>
            <span className={`mt-2 block text-sm ${index === activeSpace ? 'font-semibold text-ember md:font-medium md:text-ink' : 'font-medium'}`}>{label(space)}</span>
            <span className="text-xs text-stone">{(() => { const count = photos.filter((photo) => photo.space === space).length; return zh ? `${count} 張照片` : `${count} ${count === 1 ? 'photo' : 'photos'}`; })()}</span>
          </a>;
        })}
      </nav>
      <div className="mt-4 md:mt-8 md:space-y-12">
        {spaces.map((space, index) => <section key={space} id={`photo-space-${index}`} aria-labelledby={`photo-heading-${index}`} className={index === activeSpace ? '' : 'hidden md:block'}>
          <div className="flex items-baseline justify-between gap-4"><h3 id={`photo-heading-${index}`} className="text-2xl">{label(space)}</h3><a href="#photo-tour" className="hidden text-xs underline hover:text-ember md:inline">{zh ? '所有空間' : 'All spaces'}</a></div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
            {photos.filter((photo) => photo.space === space).map((photo, roomIndex) => <figure key={photo.src} className={roomIndex === 0 ? 'col-span-2 md:col-span-1' : ''}>
              <button type="button" onClick={() => setSelected(photos.indexOf(photo))} aria-label={zh ? `放大${label(space)}照片 ${roomIndex + 1}` : `Enlarge: ${photo.alt}`} className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-lg">
                <Image src={photo.src} alt={photo.alt} fill sizes={roomIndex === 0 ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, 50vw'} className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </button>
              <figcaption lang="en" className="mt-2 hidden text-sm text-stone md:block">{photo.alt}</figcaption>
            </figure>)}
          </div>
        </section>)}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4 md:hidden">
        <button type="button" onClick={() => setSelected(0)} className="py-2 text-sm underline">{zh ? `瀏覽全部 ${photos.length} 張照片` : `View all ${photos.length} photos`}</button>
        <button type="button" onClick={() => showSpace(nextSpace)} className="rounded-md border border-ink px-4 py-2 text-sm font-medium">{zh ? '下一區：' : 'Next: '}{label(spaces[nextSpace])}</button>
      </div>
      <dialog ref={dialog} onClose={() => setSelected(null)} onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      }} aria-labelledby="photo-viewer-title" className="fixed inset-0 m-auto max-h-[95svh] w-[min(96vw,80rem)] max-w-none rounded-xl bg-bone p-4 text-ink shadow-xl backdrop:bg-black/85 sm:p-6">
        {active && <>
          <div className="mb-4 flex items-center justify-between gap-4"><h2 id="photo-viewer-title" className="text-xl">{label(active.space)} <span className="font-sans text-sm text-stone">{selected! + 1} / {photos.length}</span></h2><button type="button" autoFocus onClick={close} className="rounded-md border border-line px-4 py-2 text-sm">{zh ? '關閉' : 'Close'}</button></div>
          <div className="relative h-[60svh]"><Image src={active.src} alt={active.alt} fill sizes="96vw" className="object-contain" /></div>
          <p lang="en" className="mt-3 text-sm">{active.alt}</p>
          <div className="mt-4 flex justify-between gap-4"><button type="button" onClick={() => move(-1)} className="rounded-md border border-line px-4 py-2">{zh ? '上一張' : 'Previous'}</button><button type="button" onClick={() => move(1)} className="rounded-md border border-line px-4 py-2">{zh ? '下一張' : 'Next'}</button></div>
        </>}
      </dialog>
    </section>
  );
}
