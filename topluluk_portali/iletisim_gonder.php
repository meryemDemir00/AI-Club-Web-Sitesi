<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('iletisim.php');
}

if (!verifyCsrf($_POST['csrf_token'] ?? null)) {
    flash('error', 'Güvenlik doğrulaması başarısız oldu.');
    redirect('iletisim.php');
}

$adSoyad = text($_POST['ad_soyad'] ?? '');
$eposta = filter_var(trim((string) ($_POST['eposta'] ?? '')), FILTER_SANITIZE_EMAIL);
$konu = text($_POST['konu'] ?? '');
$mesaj = text($_POST['mesaj'] ?? '');

if ($adSoyad === '' || $konu === '' || $mesaj === '' || !$eposta || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    flash('error', 'Lütfen iletişim formunu eksiksiz doldurun.');
    redirect('iletisim.php');
}

$autoload = __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
if (!file_exists($autoload)) {
    flash('error', 'PHPMailer kurulu değil. Önce Composer ile kurulum yapın.');
    redirect('iletisim.php');
}

require $autoload;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

$htmlBody = "
    <h2>Yeni İletişim Mesajı</h2>
    <p><strong>Ad Soyad:</strong> {$adSoyad}</p>
    <p><strong>E-posta:</strong> {$eposta}</p>
    <p><strong>Konu:</strong> {$konu}</p>
    <p><strong>Mesaj:</strong><br>" . nl2br($mesaj) . '</p>';

$textBody = "Yeni İletişim Mesajı\nAd Soyad: {$adSoyad}\nE-posta: {$eposta}\nKonu: {$konu}\nMesaj:\n{$mesaj}";

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->Port = SMTP_PORT;
    $mail->SMTPSecure = SMTP_SECURE === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->CharSet = 'UTF-8';
    $mail->setFrom(SMTP_USER, SITE_NAME . ' İletişim');
    $mail->addAddress(CONTACT_TARGET_EMAIL, SITE_NAME);
    $mail->addReplyTo($eposta, $adSoyad);
    $mail->isHTML(true);
    $mail->Subject = 'İletişim Formu: ' . $konu;
    $mail->Body = $htmlBody;
    $mail->AltBody = $textBody;
    $mail->send();

    flash('success', 'Mesajınız başarıyla gönderildi.');
} catch (Exception $hata) {
    flash('error', 'SMTP gönderimi başarısız oldu: ' . $hata->getMessage());
}

redirect('iletisim.php');
