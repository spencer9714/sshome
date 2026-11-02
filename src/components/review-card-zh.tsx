import { reviewContextZh } from '@/data/stays-zh';
import type { GuestReview } from '@/data/stays';

export function ReviewCardZh({ review, translation, stayName }: { review: GuestReview; translation: string; stayName?: string }) {
  const [year, month] = review.date.split('-');
  return (
    <figure className="flex flex-col rounded-lg border border-line bg-white p-6">
      <p className="text-ember" role="img" aria-label={`${review.rating} 星（滿分 5 星）`}>
        {'★'.repeat(review.rating)}
      </p>
      <blockquote className="mt-3 flex-1 leading-relaxed">{translation}</blockquote>
      <figcaption className="mt-5 text-sm text-stone">
        <span className="font-medium text-ink">{review.initial}</span> · {year} 年 {Number(month)} 月 · {stayName ?? reviewContextZh[review.context] ?? review.context}
      </figcaption>
      <details className="mt-3 text-sm text-stone">
        <summary className="cursor-pointer py-1 underline">查看 Airbnb 英文原文</summary>
        <p lang="en" className="mt-2 leading-relaxed">{review.text}</p>
      </details>
    </figure>
  );
}
