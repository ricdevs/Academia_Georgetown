const crypto = require('crypto');

const TABLE = process.env.AZURE_LEADS_TABLE || 'ContactLeads';
const SKIP = new Set(['website', 'recaptchaToken']);

function parseStorageConnection(value) {
  const parts = {};
  String(value || '')
    .split(';')
    .forEach((part) => {
      const index = part.indexOf('=');
      if (index > 0) parts[part.slice(0, index)] = part.slice(index + 1);
    });
  return {
    accountName: parts.AccountName || '',
    accountKey: parts.AccountKey || '',
    protocol: parts.DefaultEndpointsProtocol || 'https',
    suffix: parts.EndpointSuffix || 'core.windows.net',
  };
}

function storageConfig() {
  const connection =
    process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage || '';
  const parsed = parseStorageConnection(connection);
  if (!parsed.accountName || !parsed.accountKey) return null;
  return parsed;
}

function tableAuth(accountName, accountKey, date, resourcePath) {
  const stringToSign = `${date}\n/${accountName}/${resourcePath}`;
  const signature = crypto
    .createHmac('sha256', Buffer.from(accountKey, 'base64'))
    .update(stringToSign, 'utf8')
    .digest('base64');
  return `SharedKeyLite ${accountName}:${signature}`;
}

function tableHeaders(config, resourcePath, extra) {
  const date = new Date().toUTCString();
  return {
    Authorization: tableAuth(config.accountName, config.accountKey, date, resourcePath),
    'x-ms-date': date,
    'x-ms-version': '2020-10-02',
    Accept: 'application/json;odata=nometadata',
    DataServiceVersion: '3.0',
    MaxDataServiceVersion: '3.0;NetFx',
    ...extra,
  };
}

function tableUrl(config, resourcePath) {
  return `${config.protocol}://${config.accountName}.table.${config.suffix}/${resourcePath}`;
}

function sanitizeSource(value) {
  return String(value || 'contact').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64) || 'contact';
}

function leadPayload(data) {
  const payload = {};
  Object.entries(data || {}).forEach(([key, value]) => {
    if (!SKIP.has(key)) payload[key] = value;
  });
  return payload;
}

async function persistLead(data) {
  const config = storageConfig();
  if (!config) return { ok: false, skipped: true };

  const partitionKey = sanitizeSource(data && data.source);
  const rowKey = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}`;
  const entity = {
    PartitionKey: partitionKey,
    RowKey: rowKey,
    Name: String((data && data.name) || ''),
    Email: String((data && data.email) || ''),
    Phone: String((data && data.phone) || ''),
    Payload: JSON.stringify(leadPayload(data)),
    MailStatus: 'pending',
    CreatedAt: new Date().toISOString(),
  };

  const res = await fetch(tableUrl(config, TABLE), {
    method: 'POST',
    headers: tableHeaders(config, TABLE, {
      'Content-Type': 'application/json',
      Prefer: 'return-no-content',
    }),
    body: JSON.stringify(entity),
  });

  if (res.status !== 201 && res.status !== 204) {
    const detail = await res.text().catch(() => '');
    return { ok: false, error: `table-${res.status}`, detail: detail.slice(0, 300) };
  }

  return { ok: true, partitionKey, rowKey };
}

async function updateMailStatus(ref, status) {
  const config = storageConfig();
  if (!config || !ref || !ref.partitionKey || !ref.rowKey) return { ok: false, skipped: true };

  const resourcePath = `${TABLE}(PartitionKey='${String(ref.partitionKey).replace(/'/g, "''")}',RowKey='${String(ref.rowKey).replace(/'/g, "''")}')`;
  const res = await fetch(tableUrl(config, resourcePath), {
    method: 'MERGE',
    headers: tableHeaders(config, resourcePath, {
      'Content-Type': 'application/json',
      'If-Match': '*',
    }),
    body: JSON.stringify({ MailStatus: String(status || 'unknown') }),
  });

  if (res.status !== 204 && res.status !== 200) {
    return { ok: false, error: `table-merge-${res.status}` };
  }
  return { ok: true };
}

module.exports = {
  persistLead,
  updateMailStatus,
};
