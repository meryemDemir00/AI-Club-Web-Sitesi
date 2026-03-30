<?php
declare(strict_types=1);

require __DIR__ . '/db_baglan.php';

$uyeler = [];
$dbHatasi = null;

try {
    $sorgu = db()->query('SELECT * FROM ekip_uyeleri ORDER BY created_at DESC, id DESC');
    $uyeler = $sorgu->fetchAll();
} catch (Throwable $hata) {
    $dbHatasi = $hata->getMessage();
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ekibimiz</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        :root {
            --bg: #05070a;
            --card: #0d1117;
            --text: #edf2f7;
            --muted: #94a3b8;
            --line: rgba(255, 255, 255, 0.07);
            --accent: #007bff;
            --accent-soft: rgba(0, 123, 255, 0.22);
            --shadow: 0 24px 60px rgba(0, 0, 0, 0.42);
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Outfit", sans-serif;
            background:
                radial-gradient(circle at top, rgba(0, 123, 255, 0.14), transparent 24%),
                linear-gradient(180deg, #06080d 0%, var(--bg) 100%);
            color: var(--text);
        }
        .navbar {
            position: sticky;
            top: 0;
            z-index: 30;
            backdrop-filter: blur(14px);
            background: rgba(5, 7, 10, 0.76);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .nav-inner, .container {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
        }
        .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 0;
        }
        .brand {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.04em;
        }
        .nav-links {
            display: flex;
            gap: 12px;
        }
        .nav-links a {
            text-decoration: none;
            color: var(--text);
            padding: 10px 14px;
            border-radius: 14px;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .hero {
            padding: 72px 0 28px;
        }
        .eyebrow {
            color: #7dd3fc;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 13px;
            margin-bottom: 16px;
        }
        h1 {
            margin: 0 0 12px;
            font-size: clamp(38px, 6vw, 74px);
            line-height: 0.98;
            max-width: 720px;
        }
        .lead {
            max-width: 720px;
            color: var(--muted);
            font-size: 17px;
            line-height: 1.8;
            margin: 0;
        }
        .notice {
            margin-top: 28px;
            padding: 16px 18px;
            border-radius: 18px;
            background: rgba(239, 68, 68, 0.12);
            color: #fecaca;
            border: 1px solid rgba(239, 68, 68, 0.22);
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 22px;
            padding: 20px 0 72px;
        }
        .card {
            background: linear-gradient(180deg, rgba(17, 25, 39, 0.96), rgba(13, 17, 23, 0.96));
            border: 1px solid var(--line);
            border-radius: 24px;
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .card:hover {
            transform: translateY(-6px);
            border-color: rgba(0, 123, 255, 0.7);
            box-shadow: 0 26px 70px rgba(0, 123, 255, 0.18);
        }
        .photo {
            aspect-ratio: 4 / 4.4;
            width: 100%;
            object-fit: cover;
            display: block;
            background: #0b1220;
        }
        .content {
            padding: 20px;
        }
        .content h2 {
            margin: 0 0 8px;
            font-size: 24px;
        }
        .role {
            color: #7dd3fc;
            margin-bottom: 18px;
            font-size: 15px;
        }
        .socials {
            display: flex;
            gap: 10px;
        }
        .socials a {
            width: 42px;
            height: 42px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 14px;
            text-decoration: none;
            color: var(--text);
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        .socials a:hover {
            color: #9ed0ff;
            background: var(--accent-soft);
            border-color: rgba(0, 123, 255, 0.32);
        }
        .empty {
            padding: 32px;
            border-radius: 24px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px dashed rgba(255, 255, 255, 0.1);
            color: var(--muted);
            text-align: center;
        }
    </style>
</head>
<body>
    <header class="navbar">
        <div class="nav-inner">
            <div class="brand">Koyu Yapay Zeka</div>
            <nav class="nav-links">
                <a href="index.php">Ekibimiz</a>
                <a href="login.php">Admin Giriş</a>
            </nav>
        </div>
    </header>
    <main class="container">
        <section class="hero">
            <div class="eyebrow">Kurumsal Ekip</div>
            <h1>Birlikte üreten, büyüten ve dönüştüren uzman ekip.</h1>
            <p class="lead">
                Ekibimizi modern kart yapısıyla sergileyin, yönetim panelinden yeni üyeler ekleyin,
                fotoğrafları güncelleyin ve tüm yapıyı tek merkezden yönetin.
            </p>
            <?php if ($dbHatasi !== null): ?>
                <div class="notice">
                    Veritabanı bağlantısı veya tablo erişimi sırasında bir hata oluştu:
                    <?php echo e($dbHatasi); ?>
                </div>
            <?php endif; ?>
        </section>
        <section class="grid">
            <?php if (empty($uyeler) && $dbHatasi === null): ?>
                <div class="empty">Henüz ekip üyesi eklenmemiş. Yönetim panelinden yeni üye ekleyebilirsiniz.</div>
            <?php endif; ?>
            <?php foreach ($uyeler as $uye): ?>
                <article class="card">
                    <img class="photo" src="<?php echo e(UPLOAD_WEB_PATH . $uye['fotograf']); ?>" alt="<?php echo e($uye['ad_soyad']); ?>">
                    <div class="content">
                        <h2><?php echo e($uye['ad_soyad']); ?></h2>
                        <div class="role"><?php echo e($uye['gorev']); ?></div>
                        <div class="socials">
                            <?php if (!empty($uye['instagram'])): ?><a href="<?php echo e($uye['instagram']); ?>" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a><?php endif; ?>
                            <?php if (!empty($uye['linkedin'])): ?><a href="<?php echo e($uye['linkedin']); ?>" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a><?php endif; ?>
                            <?php if (!empty($uye['twitter'])): ?><a href="<?php echo e($uye['twitter']); ?>" target="_blank" rel="noopener noreferrer" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a><?php endif; ?>
                        </div>
                    </div>
                </article>
            <?php endforeach; ?>
        </section>
    </main>
</body>
</html>
