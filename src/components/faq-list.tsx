import type { Faq } from '@/data/stays';

// Answers stay in the server-rendered HTML, so crawlers can read them while collapsed.
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((faq) => (
        <details key={faq.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-medium [&::-webkit-details-marker]:hidden">
            <h3 className="font-sans text-base font-medium tracking-normal">{faq.question}</h3>
            <span aria-hidden className="text-xl leading-none text-ember transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
