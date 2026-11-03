import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const config = JSON.parse(await readFile(new URL('../src/data/tracking-config.json', import.meta.url), 'utf8'));

export function campaignLinks({ source, medium, campaign, content = '', debug = false }) {
  for (const [key, value] of Object.entries({ source, medium, campaign })) {
    if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,79}$/.test(value)) throw new Error(`${key}: use 1–80 lowercase letters, numbers, underscores or dashes.`);
  }
  if (content && !/^[a-z0-9][a-z0-9_-]{0,79}$/.test(content)) throw new Error('content: use lowercase letters, numbers, underscores or dashes.');
  return Object.entries(config.listings).flatMap(([key, listing]) => ['en', 'zh-Hant'].map((language) => {
    const url = new URL(`${language === 'en' ? '' : '/zh-tw'}/stays/${listing.slug}`, config.siteUrl);
    for (const [name, value] of Object.entries({ utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content || `${key}_${language === 'en' ? 'en' : 'zh'}` })) url.searchParams.set(name, value);
    if (debug) url.searchParams.set('analytics_debug', '1');
    return { listing: listing.name, language, url: url.href };
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const value = (flag) => { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : undefined; };
  try {
    const links = campaignLinks({ source: value('--source') || 'chatgpt', medium: value('--medium') || 'cpc', campaign: value('--campaign') || 'sshome_launch', content: value('--content'), debug: args.includes('--debug') });
    for (const link of links) console.log(`${link.listing} (${link.language})\n${link.url}\n`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
