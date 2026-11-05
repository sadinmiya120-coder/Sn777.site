<?php
// GoPay Integration Configuration
$gatewayUrl = "https://mch.go-pay.cyou/pay.php";
$secretKey  = "77a2d3a02360d495a1b07abfe5b196e8";

// Transaction Data
$postData = [
    'app_id'         => 'GP_47479521',
    'mch_order_no'   => 'ORD_' . time(),
    'trade_amount'   => $_GET['amount'] ?? '200', // Dynamic amount from app
    'pay_type'       => $_GET['method'] === 'bkash' ? '2202' : '2201', 
    'goods_name'     => $_GET['method'] === 'bkash' ? 'BKASH' : 'NAGAD',
    'notify_url'     => 'https://sn777.site/gopay_notify.php',
    'page_url'       => 'https://sn777.site/return',
    'mch_return_msg' => 'User_' . ($_GET['uid'] ?? 'guest'),
    'order_date'     => date('Y-m-d H:i:s')
];

// Signing process
ksort($postData);
$signStr = "";
foreach ($postData as $k => $v) {
    if ($v !== '' && $v !== null) {
        $signStr .= $k . "=" . $v . "&";
    }
}
$signStr .= "key=" . $secretKey;
$postData['sign'] = md5($signStr);
$postData['sign_type'] = 'MD5';

// Execution
$ch = curl_init($gatewayUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
$response = curl_exec($ch);
curl_close($ch);

$res = json_decode($response, true);
if ($res && isset($res['respCode']) && $res['respCode'] === 'SUCCESS') {
    header("Location: " . $res['payUrl']);
    exit;
} else {
    echo "Gateway Error: " . (isset($res['tradeMsg']) ? $res['tradeMsg'] : 'Connection Failed');
}
?>
