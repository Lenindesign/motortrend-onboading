export default async function handler(request: Request) {
  const requestUrl = new URL(request.url);
  const articleUrl = requestUrl.searchParams.get('url');
  const targetUrl = articleUrl && /^https:\/\/www\.motortrend\.com\/(news|reviews|features)\//.test(articleUrl)
    ? articleUrl
    : 'https://www.motortrend.com/news';

  const response = await fetch(targetUrl, {
    headers: {
      Accept: 'text/html',
      'User-Agent': 'MotorTrend prototype news feed',
    },
  });

  if (!response.ok) {
    return new Response(`MotorTrend news returned ${response.status}`, {
      status: response.status,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new Response(await response.text(), {
    headers: {
      'Cache-Control': 'public, max-age=300',
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
