import type { GuestReview } from '@/data/stays';

export function ReviewCard({ review, stayName }: { review: GuestReview; stayName?: string }) {
  return (
    <figure className="flex flex-col rounded-lg border border-line bg-white p-6">
      <p className="text-ember" role="img" aria-label={`Rated ${review.rating} out of 5`}>
        {'★'.repeat(review.rating)}
      </p>
      <blockquote className="mt-3 flex-1 leading-relaxed">{review.text}</blockquote>
      <figcaption className="mt-5 text-sm text-stone">
        <span className="font-medium text-ink">{review.initial}</span> · {review.dateLabel} · {stayName ?? review.context}
      </figcaption>
    </figure>
  );
}
