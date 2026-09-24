<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false]);
  exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
  $data = $_POST;
}

if (!empty($data['website'])) {
  echo json_encode(['ok' => true]);
  exit;
}

$name = trim((string) ($data['name'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$phone = trim((string) ($data['phone'] ?? ''));
if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'fields']);
  exit;
}

$to = getenv('CONTACT_TO') ?: 'info@academiageorgetown.es';
$parts = array_values(array_unique(array_filter(array_map('trim', preg_split('/[,;]/', $to)))));
$extras = ['jloria7310@gmail.com', 'richard.geo21@gmail.com'];
$toParts = array_values(array_filter($parts, function ($address) use ($extras) {
  return !in_array(strtolower($address), array_map('strtolower', $extras), true);
}));
if (!$toParts) {
  $toParts = ['info@academiageorgetown.es'];
}
$to = implode(', ', $toParts);
$bcc = implode(', ', $extras);
$secret = getenv('RECAPTCHA_SECRET') ?: '';
$token = $data['recaptchaToken'] ?? '';

if ($secret) {
  if (!$token) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'captcha']);
    exit;
  }
  $verify = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret=' . urlencode($secret) . '&response=' . urlencode($token));
  $result = json_decode($verify, true);
  if (empty($result['success'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'captcha']);
    exit;
  }
}

$skip = ['website' => 1, 'recaptchaToken' => 1];
$lines = [];
foreach ($data as $key => $value) {
  if (isset($skip[$key])) continue;
  $lines[] = $key . ': ' . (is_scalar($value) ? $value : json_encode($value));
}
$subject = 'Formulario de contacto Academia Georgetown';
$body = implode("\n", $lines);
$headers = 'From: noreply@academiageorgetown.com' . "\r\n"
  . 'Bcc: ' . $bcc . "\r\n"
  . 'Reply-To: ' . $email . "\r\n"
  . 'Content-Type: text/plain; charset=UTF-8';

$persisted = persist_lead($data);
$sent = @mail($to, $subject, $body, $headers);
if (!$sent) {
  $failBody = "Este formulario se envió en la web, pero el correo principal no se entregó.\n"
    . "Revisad los datos, contactad al interesado y tratad esta solicitud como un lead válido.\n\n"
    . "Datos del formulario:\n"
    . $body;
  $sent = @mail($to, 'FALLO DE ENTREGA — ' . $subject, $failBody, $headers);
}
if (!$sent && empty($persisted['ok'])) {
  http_response_code(502);
  echo json_encode(['ok' => false, 'error' => 'email-send']);
  exit;
}

$clientify = getenv('CLIENTIFY_WEBHOOK_URL') ?: '';
if ($clientify) {
  $ch = curl_init($clientify);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
  ]);
  curl_exec($ch);
  curl_close($ch);
}

echo json_encode(['ok' => true]);

function persist_lead(array $data): array {
  $connection = getenv('AZURE_STORAGE_CONNECTION_STRING') ?: (getenv('AzureWebJobsStorage') ?: '');
  if ($connection === '') {
    return ['ok' => false, 'skipped' => true];
  }
  $parts = [];
  foreach (explode(';', $connection) as $part) {
    $index = strpos($part, '=');
    if ($index === false) continue;
    $parts[substr($part, 0, $index)] = substr($part, $index + 1);
  }
  $account = $parts['AccountName'] ?? '';
  $key = $parts['AccountKey'] ?? '';
  $protocol = $parts['DefaultEndpointsProtocol'] ?? 'https';
  $suffix = $parts['EndpointSuffix'] ?? 'core.windows.net';
  if ($account === '' || $key === '') {
    return ['ok' => false, 'skipped' => true];
  }

  $table = getenv('AZURE_LEADS_TABLE') ?: 'ContactLeads';
  $source = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) ($data['source'] ?? 'contact'));
  if ($source === '') $source = 'contact';
  $rowKey = (string) (int) round(microtime(true) * 1000) . '-' . bin2hex(random_bytes(6));
  $payload = $data;
  unset($payload['website'], $payload['recaptchaToken']);
  $entity = [
    'PartitionKey' => $source,
    'RowKey' => $rowKey,
    'Name' => (string) ($data['name'] ?? ''),
    'Email' => (string) ($data['email'] ?? ''),
    'Phone' => (string) ($data['phone'] ?? ''),
    'Payload' => json_encode($payload, JSON_UNESCAPED_UNICODE),
    'MailStatus' => 'pending',
    'CreatedAt' => gmdate('c'),
  ];
  $date = gmdate('D, d M Y H:i:s') . ' GMT';
  $stringToSign = $date . "\n/" . $account . '/' . $table;
  $signature = base64_encode(hash_hmac('sha256', $stringToSign, base64_decode($key), true));
  $url = $protocol . '://' . $account . '.table.' . $suffix . '/' . $table;
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($entity, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER => [
      'Authorization: SharedKeyLite ' . $account . ':' . $signature,
      'x-ms-date: ' . $date,
      'x-ms-version: 2020-10-02',
      'Content-Type: application/json',
      'Accept: application/json;odata=nometadata',
      'Prefer: return-no-content',
      'DataServiceVersion: 3.0',
      'MaxDataServiceVersion: 3.0;NetFx',
    ],
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 8,
  ]);
  curl_exec($ch);
  $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  if ($status !== 201 && $status !== 204) {
    return ['ok' => false, 'error' => 'table-' . $status];
  }
  return ['ok' => true];
}
