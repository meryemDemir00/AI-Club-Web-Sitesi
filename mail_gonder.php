<?php
declare(strict_types=1);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: iletisim.php');
    exit;
}

function geriYonlendir(string $durum, string $mesaj = ''): void
{
    $hedef = 'iletisim.php?durum=' . urlencode($durum);

    if ($mesaj !== '') {
        $hedef .= '&mesaj=' . urlencode($mesaj);
    }

    header('Location: ' . $hedef);
    exit;
}

function temizMetin(string $alan): string
{
    $alan = trim($alan);
    $alan = strip_tags($alan);
    return htmlspecialchars($alan, ENT_QUOTES, 'UTF-8');
}

$adSoyad = temizMetin($_POST['ad_soyad'] ?? '');
$epostaRaw = trim($_POST['eposta'] ?? '');
$konu = temizMetin($_POST['konu'] ?? '');
$mesaj = temizMetin($_POST['mesaj'] ?? '');

if ($adSoyad === '' || $epostaRaw === '' || $konu === '' || $mesaj === '') {
    geriYonlendir('hata', 'Lütfen tüm alanları eksiksiz doldurun.');
}

$eposta = filter_var($epostaRaw, FILTER_SANITIZE_EMAIL);
if ($eposta === false || !filter_var($eposta, FILTER_VALIDATE_EMAIL)) {
    geriYonlendir('hata', 'Lütfen geçerli bir e-posta adresi girin.');
}

// PHPMailer Composer ile kurulduktan sonra autoload dosyası bu yoldan gelecektir.
$autoload = __DIR__ . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
if (!file_exists($autoload)) {
    geriYonlendir('hata', 'PHPMailer kurulu değil. Kurulum talimatlarını uygulayıp tekrar deneyin.');
}

require $autoload;

use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\PHPMailer;

// Bu alanları kendi SMTP bilgilerinizle doldurun.
const SMTP_HOST = 'smtp.ornek.com';
const SMTP_USER = 'kullanici@ornek.com';
const SMTP_PASS = 'smtp_sifreniz';
const SMTP_PORT = 587;
const SMTP_SECURE = PHPMailer::ENCRYPTION_STARTTLS;
const GONDEREN_ADI = 'Koyu Yapay Zeka İletişim Formu';
const HEDEF_EPOSTA = 'info@koyuyapayzeka.com';

$icerik = "
    <h2>Yeni İletişim Formu Mesajı</h2>
    <p><strong>Ad Soyad:</strong> {$adSoyad}</p>
    <p><strong>E-posta:</strong> {$eposta}</p>
    <p><strong>Konu:</strong> {$konu}</p>
    <p><strong>Mesaj:</strong><br>" . nl2br($mesaj) . "</p>
";

$duzMetin = "Yeni İletişim Formu Mesajı\n"
    . "Ad Soyad: {$adSoyad}\n"
    . "E-posta: {$eposta}\n"
    . "Konu: {$konu}\n"
    . "Mesaj:\n{$mesaj}\n";

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = SMTP_USER;
    $mail->Password = SMTP_PASS;
    $mail->Port = SMTP_PORT;
    $mail->SMTPSecure = SMTP_SECURE;
    $mail->CharSet = 'UTF-8';

    $mail->setFrom(SMTP_USER, GONDEREN_ADI);
    $mail->addAddress(HEDEF_EPOSTA, 'Koyu Yapay Zeka');
    $mail->addReplyTo($eposta, $adSoyad);

    $mail->isHTML(true);
    $mail->Subject = 'İletişim Formu: ' . $konu;
    $mail->Body = $icerik;
    $mail->AltBody = $duzMetin;

    $mail->send();
    geriYonlendir('basarili');
} catch (Exception $hata) {
    geriYonlendir('hata', 'SMTP gönderimi başarısız oldu: ' . $hata->getMessage());
}
