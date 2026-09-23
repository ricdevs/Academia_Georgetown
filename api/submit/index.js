function parseRecipients(value) {
  return String(value || '')
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ address }));
}

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
    try {
      const { EmailClient } = require('@azure/communication-email');
      const recipients = parseRecipients(to);
      if (!recipients.length) {
        throw new Error('no-recipients');
      }
      const client = new EmailClient(connection);
      const poller = await client.beginSend({
        senderAddress: process.env.MAIL_FROM || 'DoNotReply@academiageorgetown.com',
        content: { subject, plainText: body },
        recipients: { to: recipients },
      });
      const result = await poller.pollUntilDone();
      if (result.status && result.status !== 'Succeeded') {
        context.log('email status', result.status);
        context.res = { status: 502, body: { ok: false, error: 'email-status' } };
        return;
      }
    } catch (error) {
      const message = String((error && error.message) || error);
      context.log('email send failed', message.slice(0, 200));
      const kind = /Cannot find module/.test(message)
        ? 'email-module'
        : /no-recipients/.test(message)
          ? 'email-recipients'
          : 'email-send';
      context.res = {
        status: 502,
        body: {
          ok: false,
          error: kind,
          detail: `${error && error.name ? error.name : 'Error'}: ${message.replace(/[A-Za-z0-9+/=]{20,}/g, '[redacted]').slice(0, 160)}`,
        },
      };
      return;
    }
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
