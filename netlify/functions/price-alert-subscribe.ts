type PriceAlertRequest = {
  subscriberId?: string;
  email?: string;
  vehicleName?: string;
  zip?: string;
  destination?: string;
};

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export default async function handler(request: Request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secretKey = process.env.NOVU_SECRET_KEY;
  const workflowId = process.env.NOVU_PRICE_ALERT_WORKFLOW_ID || 'motortrend-price-alert';
  if (!secretKey) {
    return json({ configured: false, message: 'Price alert notifications are not configured yet.' });
  }

  let body: PriceAlertRequest;
  try {
    body = await request.json() as PriceAlertRequest;
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const subscriberId = typeof body.subscriberId === 'string' ? body.subscriberId.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const vehicleName = typeof body.vehicleName === 'string' ? body.vehicleName.trim() : '';
  const zip = typeof body.zip === 'string' ? body.zip.trim() : '';
  const destination = typeof body.destination === 'string' && body.destination.startsWith('/')
    ? body.destination
    : '/my-account/saved-items';

  if (!subscriberId || !email || !vehicleName) {
    return json({ error: 'subscriberId, email, and vehicleName are required' }, 400);
  }

  const novuResponse = await fetch('https://api.novu.co/v1/events/trigger', {
    method: 'POST',
    headers: {
      Authorization: `ApiKey ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: workflowId,
      to: [{ subscriberId, email }],
      payload: {
        vehicleName,
        zip,
        destination,
        alertType: 'price-alert-subscription',
      },
    }),
  });

  if (!novuResponse.ok) {
    console.error('Novu price alert trigger failed:', novuResponse.status, await novuResponse.text());
    return json({ error: 'Unable to create the price alert notification' }, 502);
  }

  return json({ configured: true });
}
