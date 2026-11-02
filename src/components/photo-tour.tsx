'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Photo } from '@/data/stays';

export function PhotoTour({ photos: sourcePhotos }: { photos: Photo[] }) {
  const spaces = Array.from(new Set(sourcePhotos.map((photo) => photo.space)));
  const photos = spaces.flatMap((space) => sourcePhotos.filter((photo) => photo.space === space));
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const active = selected === null ? null : photos[selected];

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
      <h2 className="text-3xl">Photo tour</h2>
      <p className="mt-3 text-stone">Explore each space. Select a room below, then tap any photo for a closer look.</p>
      <nav aria-label="Photo tour rooms" className="mt-6 flex gap-3 overflow-x-auto pb-4">
        {spaces.map((space, index) => {
          const cover = photos.find((photo) => photo.space === space)!;
          return <a key={space} href={`#photo-space-${index}`} className="w-32 shrink-0 rounded-lg focus-visible:outline-offset-4 sm:w-40">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg"><Image src={cover.src} alt="" fill sizes="160px" className="object-cover transition-transform hover:scale-105" /></div>
            <span className="mt-2 block text-sm font-medium">{space}</span>
            <span className="text-xs text-stone">{photos.filter((photo) => photo.space === space).length} photos</span>
          </a>;
        })}
      </nav>
      <div className="mt-8 space-y-12">
        {spaces.map((space, index) => <section key={space} id={`photo-space-${index}`} aria-labelledby={`photo-heading-${index}`}>
          <div className="flex items-baseline justify-between gap-4"><h3 id={`photo-heading-${index}`} className="text-2xl">{space}</h3><a href="#photo-tour" className="text-xs underline hover:text-ember">All spaces</a></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, photoIndex) => photo.space !== space ? null : <figure key={photo.src}>
              <button type="button" onClick={() => setSelected(photoIndex)} aria-label={`Enlarge: ${photo.alt}`} className="group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-lg">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
              </button>
              <figcaption className="mt-2 text-sm text-stone">{photo.alt}</figcaption>
            </figure>)}
          </div>
        </section>)}
      </div>
      <dialog ref={dialog} onClose={() => setSelected(null)} onKeyDown={(event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      }} aria-labelledby="photo-viewer-title" className="fixed inset-0 m-auto max-h-[95svh] w-[min(96vw,80rem)] max-w-none rounded-xl bg-bone p-4 text-ink shadow-xl backdrop:bg-black/85 sm:p-6">
        {active && <>
          <div className="mb-4 flex items-center justify-between gap-4"><h2 id="photo-viewer-title" className="text-xl">{active.space} <span className="font-sans text-sm text-stone">{selected! + 1} / {photos.length}</span></h2><button type="button" autoFocus onClick={close} className="rounded-md border border-line px-4 py-2 text-sm">Close</button></div>
          <div className="relative h-[60svh]"><Image src={active.src} alt={active.alt} fill sizes="96vw" className="object-contain" /></div>
          <p className="mt-3 text-sm">{active.alt}</p>
          <div className="mt-4 flex justify-between gap-4"><button type="button" onClick={() => move(-1)} className="rounded-md border border-line px-4 py-2">Previous</button><button type="button" onClick={() => move(1)} className="rounded-md border border-line px-4 py-2">Next</button></div>
        </>}
      </dialog>
    </section>
  );
}
