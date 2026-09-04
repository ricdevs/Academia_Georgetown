module.exports = async function (context, req) {
  if (req.method === 'OPTIONS') {
    context.res = {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
    return;
  }

  const data = req.body || {};
  if (data.website) {
    context.res = { status: 200, body: { ok: true } };
    return;
  }

  const secret = process.env.RECAPTCHA_SECRET;
  if (secret && data.recaptchaToken) {
    const params = new URLSearchParams({
      secret,
      response: data.recaptchaToken,
    });
    const verify = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params,
    }).then((r) => r.json());
    if (!verify.success) {
      context.res = { status: 400, body: { ok: false, error: 'captcha' } };
      return;
    }
  }

  const to = process.env.CONTACT_TO || 'info@academiageorgetown.es';
  const skip = new Set(['website', 'recaptchaToken']);
  const body = Object.entries(data)
    .filter(([k]) => !skip.has(k))
    .map(([k, v]) => `${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`)
    .join('\n');
  const source = data.source || 'web';
  const subject = `Nueva solicitud web (${source}) - Academia Georgetown`;

  const connection = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  if (connection) {
    const { EmailClient } = require('@azure/communication-email');
    const client = new EmailClient(connection);
    await client.beginSend({
      senderAddress: process.env.MAIL_FROM || 'DoNotReply@academiageorgetown.com',
      content: { subject, plainText: body },
      recipients: { to: [{ address: to }] },
    });
  } else {
    context.log(subject);
    context.log(body);
  }

  if (process.env.CLIENTIFY_WEBHOOK_URL) {
    await fetch(process.env.CLIENTIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
  }

  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: { ok: true },
  };
};
