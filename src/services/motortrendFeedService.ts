import type { RiverItem } from '../components/River';

const feedUrl = import.meta.env.VITE_MOTORTREND_RSS_URL || 'https://www.motortrend.com/feed/';
const liveNewsPageUrl = '/api/motortrend-news';
const assetCdnUrl = 'https://d2kde5ohu8qb21.cloudfront.net';

function useHearstAssetCdn(url: string): string {
  return url.replace('https://www.motortrend.com/files/', `${assetCdnUrl}/files/`);
}

function prototypeArticleHref(item: { title: string; imageUrl: string; author?: string; date?: string; category?: string }, sourceUrl: string): string {
  const params = new URLSearchParams({
    live: 'true',
    title: item.title,
    image: item.imageUrl,
    source: sourceUrl,
    ...(item.author ? { author: item.author } : {}),
    ...(item.date ? { date: item.date } : {}),
    ...(item.category ? { category: item.category } : {}),
  });
  return `/article/live?${params.toString()}`;
}

function getText(parent: Element, name: string): string {
  return parent.getElementsByTagName(name)[0]?.textContent?.trim() || '';
}

function getImage(item: Element): string {
  const enclosure = item.getElementsByTagName('enclosure')[0]?.getAttribute('url');
  if (enclosure) return enclosure;

  const mediaContent = Array.from(item.getElementsByTagName('*')).find(element =>
    element.localName === 'content' && element.getAttribute('url')
  );
  return mediaContent?.getAttribute('url') || '';
}

function getPageImage(anchor: Element): string {
  const image = anchor.querySelector('img');
  const srcset = image?.getAttribute('srcset')?.split(',')[0]?.trim().split(' ')[0];
  return image?.getAttribute('src') || image?.getAttribute('data-src') || srcset || '';
}

function parseMotorTrendNewsPage(markup: string, limit: number): RiverItem[] {
  const document = new DOMParser().parseFromString(markup, 'text/html');
  const seen = new Set<string>();
  const items: RiverItem[] = [];

  for (const anchor of Array.from(document.querySelectorAll('a[href]'))) {
    const title = anchor.querySelector('h2, h3, h4')?.textContent?.trim() || anchor.textContent?.trim() || '';
    const href = anchor.getAttribute('href') || '';
    const imageUrl = getPageImage(anchor);
    if (title.length < 24 || !imageUrl || !href || seen.has(href)) continue;
    if (!/\/?(news|reviews|features)\//.test(href)) continue;

    const link = new URL(href, 'https://www.motortrend.com').toString();
    seen.add(href);
    items.push({
      imageUrl: useHearstAssetCdn(new URL(imageUrl, 'https://www.motortrend.com').toString()),
      title,
      category: 'MotorTrend | Latest News',
      onClick: () => window.location.assign(prototypeArticleHref({ title, imageUrl }, link)),
    });
    if (items.length >= limit) break;
  }

  return items;
}

async function getMotorTrendPageItems(limit: number): Promise<RiverItem[]> {
  const response = await fetch(liveNewsPageUrl, { headers: { Accept: 'text/html' } });
  if (!response.ok) throw new Error(`MotorTrend news page returned ${response.status}`);
  return parseMotorTrendNewsPage(await response.text(), limit);
}

export async function getMotorTrendFeedItems(limit = 20): Promise<RiverItem[]> {
  try {
    const pageItems = await getMotorTrendPageItems(limit);
    if (pageItems.length > 0) return pageItems;
  } catch {
    // Fall back to the public RSS feed if the server-side page proxy is unavailable.
  }

  let response: Response;
  try {
    response = await fetch(feedUrl, { headers: { Accept: 'application/rss+xml, application/atom+xml, text/xml' } });
  } catch {
    return [];
  }
  if (!response.ok) return [];

  const document = new DOMParser().parseFromString(await response.text(), 'application/xml');
  const items = Array.from(document.querySelectorAll('item, entry')).slice(0, limit);

  if (items.length === 0) {
    return [];
  }

  return items.map(item => {
    const atomLink = item.querySelector('link[href]')?.getAttribute('href') || '';
    const link = getText(item, 'link') || atomLink;
    const published = getText(item, 'pubDate') || getText(item, 'published') || getText(item, 'updated');
    const parsedDate = published ? new Date(published) : null;

    return {
      imageUrl: useHearstAssetCdn(getImage(item)),
      title: getText(item, 'title'),
      author: getText(item, 'author') || getText(item, 'dc:creator'),
      date: parsedDate && !Number.isNaN(parsedDate.getTime())
        ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        : published,
      category: 'MotorTrend | Latest News',
      onClick: () => window.location.assign(prototypeArticleHref({
        title: getText(item, 'title'),
        imageUrl: useHearstAssetCdn(getImage(item)),
        author: getText(item, 'author') || getText(item, 'dc:creator'),
        date: parsedDate && !Number.isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : published,
        category: 'MotorTrend | Latest News',
      }, link)),
    };
  }).filter(item => item.title && item.onClick);
}

function createFeedResource() {
  let status: 'pending' | 'fulfilled' = 'pending';
  let result: RiverItem[] = [];
  const promise = getMotorTrendFeedItems().then(
    items => {
      result = items;
      status = 'fulfilled';
    },
    () => {
      // An empty result lets the consuming page use its local fallback data.
      status = 'fulfilled';
    },
  );

  return {
    read() {
      if (status === 'pending') throw promise;
      return result;
    },
  };
}

const motorTrendFeedResource = createFeedResource();

export function readMotorTrendFeedItems(): RiverItem[] {
  return motorTrendFeedResource.read();
}
