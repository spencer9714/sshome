import Link from 'next/link';
import { stays } from '@/data/stays';
import { stayPath } from '@/lib/schema';

const rows = [
  { label: 'Best for', value: (stay: (typeof stays)[number]) => stay.bestFor },
  { label: 'Sleeps', value: (stay: (typeof stays)[number]) => `Up to ${stay.guests} guests` },
  {
    label: 'Rooms',
    value: (stay: (typeof stays)[number]) => `${stay.bedrooms} bedrooms, ${stay.beds} beds, ${stay.baths} baths`,
  },
  { label: 'Airbnb reviews', value: (stay: (typeof stays)[number]) => stay.reviewNote },
  { label: 'Outdoors', value: (stay: (typeof stays)[number]) => stay.compare.outdoor },
  { label: 'Indoor fun', value: (stay: (typeof stays)[number]) => stay.compare.indoor },
  { label: 'Workspace', value: (stay: (typeof stays)[number]) => stay.compare.work },
  { label: 'Parking', value: (stay: (typeof stays)[number]) => stay.compare.parking },
];

export function CompareTable() {
  return (
    <>
      {/* Two home columns don't fit a phone, so each home gets its own card there. */}
      <div className="space-y-4 md:hidden">
        {stays.map((stay) => (
          <div key={stay.slug} className="rounded-lg border border-line bg-white p-5">
            <h3 className="text-2xl">
              <Link href={stayPath(stay)} className="hover:text-ember">
                {stay.name}
              </Link>
            </h3>
            <dl className="mt-3 divide-y divide-line text-sm">
              {rows.map((row) => (
                <div key={row.label} className="py-3 last:pb-0">
                  <dt className="font-medium">{row.label}</dt>
                  <dd className="mt-1 leading-relaxed text-stone">{row.value(stay)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-line bg-white md:block">
      <table className="w-full min-w-160 border-collapse text-left text-sm">
        <caption className="sr-only">Comparison of SSHOME vacation homes in Visalia, California</caption>
        <thead>
          <tr className="border-b border-line">
            <td className="w-36 p-4" />
            {stays.map((stay) => (
              <th key={stay.slug} scope="col" className="p-4 align-top">
                <Link href={stayPath(stay)} className="font-display text-xl font-normal hover:text-ember">
                  {stay.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-0">
              <th scope="row" className="p-4 align-top font-medium">
                {row.label}
              </th>
              {stays.map((stay) => (
                <td key={stay.slug} className="p-4 align-top leading-relaxed text-stone">
                  {row.value(stay)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
}
