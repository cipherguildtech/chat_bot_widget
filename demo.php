<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}
header('Content-Type: application/json');

$data = [
    'text_color'=>'#ffffff',
    'button_fg_color' => '#FFFFFF',
    'button_bg_color' => '#0000FF',
    'bg_color' => '#fd01b2',
    'fg_color' => '#0000FF',
    'position' => 'left',
];

echo json_encode([
    'status' => 'success',
    'data' => $data,
]);