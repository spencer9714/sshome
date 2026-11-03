import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-32 text-center">
      <h1 className="text-4xl sm:text-5xl">This page has wandered off.</h1>
      <Link href="/#homes" className="mt-8 inline-block rounded-md bg-ember px-6 py-3 font-medium text-white hover:bg-ember-dark">
        Find your next stay
      </Link>
    </div>
  );
}
