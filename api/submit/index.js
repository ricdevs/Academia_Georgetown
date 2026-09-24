const crypto = require('crypto');
const { persistLead, updateMailStatus } = require('./storage');

const CONTACT_SUBJECT = 'Formulario de contacto Academia Georgetown';
const DEFAULT_TO = 'info@academiageorgetown.es';
const EXTRA_TO = ['jloria7310@gmail.com', 'richard.geo21@gmail.com'];
const FIELD_LABELS = {
  source: 'Origen',
  name: 'Nombre',
  phone: 'Teléfono',
  email: 'Email',
  dob: 'Fecha de nacimiento',
  occupation: 'Ocupación',
  message: 'Mensaje',
  company: 'Empresa',
  dni: 'DNI',
  address: 'Dirección',
  postalCode: 'Código postal',
  city: 'Localidad',
  course: 'Curso',
  discount: 'Código de descuento',
  bookingDate: 'Fecha de reserva',
  bookingTime: 'Hora de reserva',
  bookingLocation: 'Lugar de reserva',
  lastCertificate: 'Último certificado',
  targetCertificate: 'Certificado objetivo',
};

function uniqueAddresses(values) {
  const seen = new Set();
  return values
    .map((address) => String(address || '').trim())
    .filter((address) => {
      const key = address.toLowerCase();
      if (!address || !address.includes('@') || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function splitRecipients(value) {
  const extra = new Set(EXTRA_TO.map((address) => address.toLowerCase()));
  const configured = uniqueAddresses(String(value || '').split(/[,;]/));
  const to = uniqueAddresses(configured.filter((address) => !extra.has(address.toLowerCase())));
  if (!to.length) to.push(DEFAULT_TO);
  return {
    to: to.map((address) => ({ address })),
    bcc: EXTRA_TO.map((address) => ({ address })),
  };
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
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      return `${label}: ${typeof value === 'string' ? value : JSON.stringify(value)}`;
    })
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

function replyTo(data) {
  const email = String(data.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return undefined;
  return [{ address: email }];
}

function missingFields(data) {
  const name = String(data.name || '').trim();
  const email = String(data.email || '').trim();
  const phone = String(data.phone || '').trim();
  if (!name || !phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;
  return false;
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
}

async function sendLead(connection, { subject, body, recipients, replyToAddresses }) {
  let lastError;
  const message = {
    senderAddress: process.env.MAIL_FROM || 'DoNotReply@academiageorgetown.com',
    content: { subject, plainText: body },
    recipients,
  };
  if (replyToAddresses) message.replyTo = replyToAddresses;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      await sendEmail(connection, message);
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

  if (missingFields(data)) {
    context.res = { status: 400, body: { ok: false, error: 'fields' } };
    return;
  }

  const secret = process.env.RECAPTCHA_SECRET;
  if (secret) {
    if (!data.recaptchaToken) {
      context.res = { status: 400, body: { ok: false, error: 'captcha' } };
      return;
    }
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

  const body = leadBody(data);
  const subject = CONTACT_SUBJECT;
  const recipients = splitRecipients(process.env.CONTACT_TO || DEFAULT_TO);
  if (!recipients.to.length) {
    context.res = { status: 502, body: { ok: false, error: 'email-recipients' } };
    return;
  }

  const persisted = await persistLead(data).catch((error) => ({
    ok: false,
    error: String((error && error.message) || error),
  }));
  if (!persisted.ok && !persisted.skipped) {
    context.log('lead persist failed', persisted.error || 'unknown');
  }

  const connection = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
  const replyToAddresses = replyTo(data);
  let mailStatus = 'skipped';
  if (connection) {
    try {
      await sendLead(connection, { subject, body, recipients, replyToAddresses });
      mailStatus = 'sent';
    } catch (error) {
      const reason = String((error && error.message) || error);
      context.log('email send failed', reason);
      context.log(body);
      try {
        await sendLead(connection, {
          subject: `FALLO DE ENTREGA — ${CONTACT_SUBJECT}`,
          body: failureBody(reason, body),
          recipients,
          replyToAddresses,
        });
        context.log('email send recovered via failure notice');
        mailStatus = 'failed-notice';
      } catch (fallbackError) {
        context.log('email fallback failed', String((fallbackError && fallbackError.message) || fallbackError));
        mailStatus = 'failed';
      }
    }
  } else {
    context.log(subject);
    context.log(body);
    mailStatus = 'logged';
  }

  if (persisted.ok) {
    await updateMailStatus(persisted, mailStatus).catch(() => {});
  }

  if (process.env.CLIENTIFY_WEBHOOK_URL) {
    await fetch(process.env.CLIENTIFY_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).catch(() => {});
  }

  if (mailStatus === 'failed' && !persisted.ok) {
    context.res = { status: 502, body: { ok: false, error: 'email-send' } };
    return;
  }

  context.res = {
    headers: { 'Content-Type': 'application/json' },
    body: {
      ok: true,
      stored: Boolean(persisted.ok),
      persist: persisted.ok ? 'ok' : persisted.skipped ? 'skipped' : persisted.error || 'fail',
      hasStorage: Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage),
    },
  };
};
