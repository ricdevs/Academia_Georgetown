const crypto = require('crypto');

function parseRecipients(value) {
  return String(value || '')
    .split(/[,;]/)
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ address }));
}

function parseConnectionString(value) {
  const parts = {};
  String(value || '')
    .split(';')
    .forEach((part) => {
      const index = part.indexOf('=');
      if (index > 0) parts[part.slice(0, index).toLowerCase()] = part.slice(index + 1);
    });
  return {
    endpoint: String(parts.endpoint || '').replace(/\/$/, ''),
    accessKey: parts.accesskey || '',
  };
}

function acsHeaders(method, url, body, accessKey) {
  const date = new Date().toUTCString();
  const parsed = new URL(url);
  const pathAndQuery = `${parsed.pathname}${parsed.search}`;
  const payload = body || '';
  const contentHash = crypto.createHash('sha256').update(payload).digest('base64');
  const stringToSign = `${method}\n${pathAndQuery}\n${date};${parsed.host};${contentHash}`;
  const signature = crypto
    .createHmac('sha256', Buffer.from(accessKey, 'base64'))
    .update(stringToSign, 'utf8')
    .digest('base64');
  return {
    'x-ms-date': date,
    'x-ms-content-sha256': contentHash,
    Authorization: `HMAC-SHA256 SignedHeaders=x-ms-date;host;x-ms-content-sha256&Signature=${signature}`,
    'Content-Type': 'application/json',
  };
}

async function sendEmail(connection, message) {
  const { endpoint, accessKey } = parseConnectionString(connection);
  if (!endpoint || !accessKey) throw new Error('bad-connection');
  const url = `${endpoint}/emails:send?api-version=2023-03-31`;
  const body = JSON.stringify(message);
  const res = await fetch(url, {
    method: 'POST',
    headers: acsHeaders('POST', url, body, accessKey),
    body,
  });
  if (res.status !== 202 && res.status !== 200) {
    throw new Error(`acs-${res.status}`);
  }
  const operation = res.headers.get('operation-location');
  if (!operation) return;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const poll = await fetch(operation, {
      headers: acsHeaders('GET', operation, '', accessKey),
    });
    const status = await poll.json().catch(() => ({}));
    if (status.status === 'Succeeded') return;
    if (status.status === 'Failed') throw new Error('acs-failed');
  }
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
  const recipients = parseRecipients(to);
  if (!recipients.length) {
    context.res = { status: 502, body: { ok: false, error: 'email-recipients' } };
    return;
  }

  const connection = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  if (connection) {
    try {
      await sendEmail(connection, {
        senderAddress: process.env.MAIL_FROM || 'DoNotReply@academiageorgetown.com',
        content: { subject, plainText: body },
        recipients: { to: recipients },
      });
    } catch (error) {
      const message = String((error && error.message) || error);
      context.log('email send failed', message.slice(0, 200));
      context.res = { status: 502, body: { ok: false, error: 'email-send' } };
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
