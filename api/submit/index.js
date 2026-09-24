const crypto = require('crypto');

const CONTACT_SUBJECT = 'Formulario de contacto Academia Georgetown';
const DEFAULT_TO = 'info@academiageorgetown.es';
const EXTRA_TO = ['jloria7310@gmail.com', 'richard.geo21@gmail.com'];

function parseRecipients(value) {
  const seen = new Set();
  return String(value || '')
    .split(/[,;]/)
    .map((address) => address.trim())
    .concat(EXTRA_TO)
    .filter((address) => {
      const key = address.toLowerCase();
      if (!address || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
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

function leadBody(data) {
  const skip = new Set(['website', 'recaptchaToken']);
  return Object.entries(data)
    .filter(([key]) => !skip.has(key))
    .map(([key, value]) => `${key}: ${typeof value === 'string' ? value : JSON.stringify(value)}`)
    .join('\n');
}

function failureBody(reason, body) {
  return [
    'Este formulario se envió en la web, pero el correo principal no se entregó.',
    'Revisad los datos, contactad al interesado y tratad esta solicitud como un lead válido.',
    `Motivo del fallo: ${reason}`,
    '',
    'Datos del formulario:',
    body,
  ].join('\n');
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

async function sendLead(connection, { subject, body, recipients }) {
  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await sendEmail(connection, {
        senderAddress: process.env.MAIL_FROM || 'DoNotReply@academiageorgetown.com',
        content: { subject, plainText: body },
        recipients: { to: recipients },
      });
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
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

  const to = process.env.CONTACT_TO || DEFAULT_TO;
  const body = leadBody(data);
  const subject = CONTACT_SUBJECT;
  const recipients = parseRecipients(to);
  if (!recipients.length) {
    context.res = { status: 502, body: { ok: false, error: 'email-recipients' } };
    return;
  }

  const connection = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  if (connection) {
    try {
      await sendLead(connection, { subject, body, recipients });
    } catch (error) {
      const reason = String((error && error.message) || error);
      context.log('email send failed', reason);
      context.log(body);
      try {
        await sendLead(connection, {
          subject: `FALLO DE ENTREGA — ${CONTACT_SUBJECT}`,
          body: failureBody(reason, body),
          recipients,
        });
        context.log('email send recovered via failure notice');
      } catch (fallbackError) {
        context.log('email fallback failed', String((fallbackError && fallbackError.message) || fallbackError));
        context.res = { status: 502, body: { ok: false, error: 'email-send' } };
        return;
      }
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
