import type { Metadata } from 'next';
import { pageUpdates } from '@/data/page-updates';
import { languageAlternates } from '@/lib/locales';
import { site } from '@/lib/site';

const path = '/privacy';
const title = 'Privacy Policy';
const description = 'Learn how this site uses cookies, Google Analytics, and the OpenAI Ads Pixel, what information is sent to Airbnb, and what privacy choices you have.';

export const metadata: Metadata = {
  title: { absolute: `${title} | ${site.name}` },
  description,
  alternates: { canonical: path, languages: languageAlternates(path, '/zh-tw/privacy') },
  openGraph: { title, description, url: path, images: [{ url: site.ogImage }] },
};

const providers = [
  {
    name: 'Google Analytics',
    purpose: 'Helps us understand how visitors find and use the site, including pages viewed, referral sources, clicks to Airbnb, approximate location, and device type.',
    storage: 'Cookies named _ga and _ga_FR9GRK5P0E, kept for up to about 400 days.',
    policy: 'https://policies.google.com/technologies/partner-sites',
    policyLabel: 'How Google uses data from sites that use its services',
  },
  {
    name: 'OpenAI Ads Pixel',
    purpose: 'Helps us measure whether ads on OpenAI’s services lead to visits and clicks through to Airbnb. It receives the page address, event times and clicks through to Airbnb.',
    storage: 'A browser reference cookie named __obref, kept for up to 365 days; an ad reference cookie named __oppref, kept for up to 30 days if you arrive from an ad; and a session storage item that ends with your browser session. OpenAI may also set short-lived security cookies on its own domains.',
    policy: 'https://openai.com/policies/privacy-policy/',
    policyLabel: 'OpenAI Privacy Policy',
  },
  {
    name: 'Vercel',
    purpose: 'Hosts the site. Like most web hosts, it processes technical request information, such as IP address and browser details, to deliver and protect the site.',
    storage: 'We do not use Vercel to set analytics cookies on this site.',
    policy: 'https://vercel.com/legal/privacy-notice',
    policyLabel: 'Vercel Privacy Notice',
  },
];

const linkClass = 'text-ink underline hover:text-ember';

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
      <h1 className="text-4xl sm:text-5xl">Privacy Policy</h1>
      <p className="mt-3 text-sm text-stone">Last updated {pageUpdates[path]}</p>
      <p className="mt-6 text-xl leading-relaxed">
        This policy covers www.sshomedesigns.com. You can browse this site without giving us your name, email address,
        phone number or payment details. We use analytics and advertising measurement tools, which are described below.
      </p>

      <section className="mt-12">
        <h2 className="text-3xl">Tools on this site</h2>
        <div className="mt-6 space-y-4">
          {providers.map((provider) => (
            <div key={provider.name} className="rounded-lg border border-line bg-white p-6">
              <h3 className="text-2xl">{provider.name}</h3>
              <p className="mt-3 leading-relaxed text-stone">{provider.purpose}</p>
              <p className="mt-3 leading-relaxed text-stone">{provider.storage}</p>
              <a href={provider.policy} className="mt-3 inline-block py-1 text-sm underline hover:text-ember">{provider.policyLabel}</a>
            </div>
          ))}
        </div>
        <p className="mt-6 leading-relaxed text-stone">
          These tools run when the page loads, and browser settings or restrictions can shorten how long their cookies
          last. These providers may collect information about your activity over time and across different websites. OpenAI states that it does not currently use data from this pixel for user-level personalization. We
          mark our Airbnb click events to opt out if that changes.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Booking on Airbnb</h2>
        <p className="mt-4 leading-relaxed text-stone">
          Bookings, payments, and host messages are handled on Airbnb. When you select dates on this site,
          the link to Airbnb includes your dates and guest count. Your activity on Airbnb is covered by its{' '}
          <a href="https://www.airbnb.com/help/article/2855" className={linkClass}>Privacy Policy</a>.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">How we use information</h2>
        <p className="mt-4 leading-relaxed text-stone">
          We use this information to understand which pages and marketing campaigns are effective, improve the site, and measure advertising performance. We do not
          sell information for money. Our use of the OpenAI Ads Pixel may count as sharing for advertising under some
          privacy laws, including California’s. Each provider keeps data according to its own settings and policies.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Your choices</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-stone">
          <li>Block or delete cookies in your browser settings. Blocking cookies or tracking scripts limits these tools, and the site still works.</li>
          <li>Install Google’s <a href="https://tools.google.com/dlpage/gaoptout" className={linkClass}>Google Analytics opt-out add-on</a>.</li>
          <li>This site does not currently offer its own cookie controls or respond to browser signals such as Do Not Track or Global Privacy Control.</li>
          <li>Depending on where you live, you may have other privacy rights. We do not keep visitor accounts, so the providers’ policies explain how to request access to the data they hold. You can also send us a request, and we will help where we can.</li>
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">California privacy notice</h2>
        <p className="mt-4 leading-relaxed text-stone">
          This section is for California residents and supplements the rest of this policy. Whether a specific California
          privacy law applies can depend on factors such as a business’s size.
        </p>
        <dl className="mt-6 space-y-4 leading-relaxed">
          <div>
            <dt className="font-medium">What is collected</dt>
            <dd className="mt-1 text-stone">Identifiers such as IP address and cookie IDs; internet activity such as pages viewed, referring sites and clicks; and approximate location based on IP address. We do not ask for sensitive personal information on this site.</dd>
          </div>
          <div>
            <dt className="font-medium">Where it comes from and why</dt>
            <dd className="mt-1 text-stone">It comes from your browser and device. It is used to run and protect the site, analyze how the site is used and measure advertising.</dd>
          </div>
          <div>
            <dt className="font-medium">Who receives it</dt>
            <dd className="mt-1 text-stone">Google, OpenAI and Vercel, as described above. We do not sell information for money, but our use of the OpenAI Ads Pixel may count as sharing for cross-context behavioral advertising.</dd>
          </div>
          <div>
            <dt className="font-medium">How long it is kept</dt>
            <dd className="mt-1 text-stone">Cookies last for the periods listed above. Providers keep the data they receive according to their own settings and policies.</dd>
          </div>
          <div>
            <dt className="font-medium">Your rights</dt>
            <dd className="mt-1 text-stone">Where the California Consumer Privacy Act applies, you may ask to know, delete or correct your personal information, opt out of its sale or sharing, and limit the use of sensitive personal information. You will not be treated differently for exercising these rights. To make a request, use the contact method below; you may use an authorized agent, and we may need details to verify the request.</dd>
          </div>
        </dl>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Children</h2>
        <p className="mt-4 leading-relaxed text-stone">This site is for people planning a trip and is not directed to children under 13.</p>
      </section>

      <section className="mt-12">
        <h2 className="text-3xl">Updates and contact details</h2>
        <p className="mt-4 leading-relaxed text-stone">
          We will update this page and its date when our practices change. For privacy questions or requests, email{' '}
          <a href="mailto:business@sshomedesigns.com" className={linkClass}>business@sshomedesigns.com</a>. This address is
          for privacy matters only. For booking and listing questions, message the host on Airbnb through our{' '}
          <a href="/about" className={linkClass}>About and contact page</a>.
        </p>
      </section>
    </article>
  );
}
