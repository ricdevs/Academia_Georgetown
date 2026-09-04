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

$to = getenv('CONTACT_TO') ?: 'info@academiageorgetown.es';
$secret = getenv('RECAPTCHA_SECRET') ?: '';
$token = $data['recaptchaToken'] ?? '';

if ($secret && $token) {
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
$source = $data['source'] ?? 'web';
$subject = 'Nueva solicitud web (' . $source . ') - Academia Georgetown';
$body = implode("\n", $lines);
$headers = 'From: noreply@academiageorgetown.com' . "\r\n" . 'Content-Type: text/plain; charset=UTF-8';
@mail($to, $subject, $body, $headers);

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
