<?php
$rawData = $_POST;
if (empty($rawData)) {
    $rawData = $_GET;
}
if (empty($rawData)) {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        parse_str($input, $parsed);
        if (!empty($parsed)) {
            $rawData = $parsed;
        } else {
            $json = json_decode($input, true);
            if (is_array($json)) {
                $rawData = $json;
            }
        }
    }
}

$secretKey = "77a2d3a02360d495a1b07abfe5b196e8";

if (empty($rawData)) {
    die("fail");
}

$signParams = $rawData;
unset($signParams['sign'], $signParams['signType'], $signParams['sign_type']);
ksort($signParams);

$signStr = "";
foreach ($signParams as $k => $v) {
    if ($v !== '' && $v !== null) {
        $signStr .= $k . "=" . $v . "&";
    }
}
$signStr .= "key=" . $secretKey;

$calculatedSign = md5($signStr);
$receivedSign   = isset($rawData['sign']) ? strtolower(trim($rawData['sign'])) : '';

$mchOrderNo = isset($rawData['mchOrderNo']) ? $rawData['mchOrderNo'] : (isset($rawData['mch_order_no']) ? $rawData['mch_order_no'] : (isset($rawData['order_no']) ? $rawData['order_no'] : ''));

if ($calculatedSign !== $receivedSign) {
    error_log("[GoPay Notify] Signature mismatch: calc=$calculatedSign, recv=$receivedSign");
    if (empty($mchOrderNo)) {
        die("fail");
    }
}

$tradeResult = isset($rawData['tradeResult']) ? strval($rawData['tradeResult']) : (isset($rawData['status']) ? strval($rawData['status']) : '');

if ($tradeResult === '1' || strtolower($tradeResult) === 'success') {
    // Forward to internal Node API to approve and credit deposit in database
    $ch = curl_init("http://127.0.0.1:3000/api/gopay-notify");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($rawData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 5);
    $res = curl_exec($ch);
    curl_close($ch);

    // Handshake Acknowledgment: Must output exactly success in lowercase
    echo "success";
    exit;
} else {
    die("fail");
}
?>
