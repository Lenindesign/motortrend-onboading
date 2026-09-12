export default async function handler() {
  const response = await fetch('https://www.motortrend.com/news', {
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
