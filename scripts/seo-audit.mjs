import { pathToFileURL } from 'node:url';

export const defaultSite = 'https://www.sshomedesigns.com';
export const paths = [
  '/', '/stays/desert-retreat-pool-hot-tub-visalia',
  '/stays/luxury-family-home-hot-tub-game-room-visalia',
  '/sequoia-kings-canyon-guide', '/sequoia-group-lodging', '/sequoia-winter-guide', '/visalia-crew-housing', '/zh-tw/sequoia-guide', '/about', '/privacy',
  '/zh-tw', '/zh-tw/sequoia-group-lodging', '/zh-tw/sequoia-winter-guide', '/zh-tw/visalia-crew-housing', '/zh-tw/about', '/zh-tw/privacy',
  '/zh-tw/stays/desert-retreat-pool-hot-tub-visalia',
  '/zh-tw/stays/luxury-family-home-hot-tub-game-room-visalia',
];

export async function audit(site = defaultSite) {
  const checks = [];
  for (const path of [...paths, '/sitemap.xml', '/robots.txt']) {
    const agents = path === '/' ? ['Mozilla/5.0', 'Googlebot', 'bingbot', 'OAI-SearchBot'] : ['Mozilla/5.0'];
    for (const agent of agents) {
      try {
        const url = new URL(path, site);
        const response = await fetch(url, { headers: { 'user-agent': agent }, signal: AbortSignal.timeout(15000) });
        const body = await response.text();
        const issues = [];
        if (response.status !== 200) issues.push(`HTTP ${response.status}`);
        if (new URL(response.url).origin !== url.origin) issues.push('redirected to a different origin');
        if (/noindex|none/i.test(response.headers.get('x-robots-tag') || '')) issues.push('X-Robots-Tag prevents indexing');
        if (path === '/robots.txt') {
          if (!/sitemap:\s*https?:\/\//i.test(body)) issues.push('missing sitemap declaration');
          if (/disallow:\s*\/\s*(?:#.*)?$/im.test(body)) issues.push('root Disallow rule requires review');
        } else if (path === '/sitemap.xml') {
          if (!/<urlset[\s>]/i.test(body)) issues.push('not a URL sitemap');
          for (const page of paths) if (!body.includes(new URL(page, site).href.replace(/&/g, '&amp;'))) issues.push(`missing sitemap entry: ${page}`);
        } else {
          if (/<meta\b(?=[^>]*\bname=["'](?:robots|googlebot|bingbot)["'])(?=[^>]*\bcontent=["'][^"']*\b(?:noindex|none)\b)[^>]*>/i.test(body)) issues.push('meta tag prevents indexing');
          if (!/<h1[\s>]/i.test(body)) issues.push('missing H1');
          const canonicalTags = body.match(/<link\b[^>]*>/gi) || [];
          if (!canonicalTags.some((tag) => {
            const href = tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
            if (!/rel=["']canonical["']/i.test(tag) || !href) return false;
            try { return new URL(href, site).href === new URL(path, site).href; } catch { return false; }
          })) issues.push('missing matching canonical');
        }
        checks.push({ path, agent, status: response.status, server: response.headers.get('server'), issues });
      } catch (error) {
        checks.push({ path, agent, issues: [error.message] });
      }
    }
  }
  for (const check of checks) console.log(`${check.issues.length ? 'FAIL' : 'PASS'} ${check.path} [${check.agent}]${check.server ? ` (${check.server})` : ''} ${check.issues.join('; ')}`);
  console.log('User-Agent probes do not verify real crawler IP access, indexing, or account-level reports. Review CDN/WAF logs separately.');
  return checks.every((check) => check.issues.length === 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await audit(process.argv[2] || defaultSite) ? 0 : 1;
}
