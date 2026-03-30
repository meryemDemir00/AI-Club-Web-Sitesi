<?php
declare(strict_types=1);

require __DIR__ . '/db_baglan.php';

if (adminGirisliMi()) {
    yonlendir('admin.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrfDogrula($_POST['csrf_token'] ?? null)) {
        flash('error', 'Oturum doğrulaması başarısız oldu. Lütfen tekrar deneyin.');
        yonlendir('login.php');
    }

    $kullaniciAdi = temizMetin($_POST['kullanici_adi'] ?? '');
    $sifre = (string) ($_POST['sifre'] ?? '');

    if ($kullaniciAdi === ADMIN_USERNAME && hash_equals(ADMIN_PASSWORD, $sifre)) {
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = ADMIN_USERNAME;
        flash('success', 'Yönetim paneline hoş geldiniz.');
        yonlendir('admin.php');
    }

    flash('error', 'Kullanıcı adı veya şifre hatalı.');
    yonlendir('login.php');
}

$flash = flashAl();
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Giriş</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #05070a;
            --card: #0d1117;
            --line: rgba(255, 255, 255, 0.08);
            --text: #eef2ff;
            --muted: #94a3b8;
            --accent: #007bff;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            padding: 24px;
            font-family: "Outfit", sans-serif;
            background:
                radial-gradient(circle at top, rgba(0, 123, 255, 0.18), transparent 26%),
                linear-gradient(180deg, #06080d 0%, var(--bg) 100%);
            color: var(--text);
        }
        .card {
            width: min(460px, 100%);
            background: rgba(13, 17, 23, 0.96);
            border: 1px solid var(--line);
            border-radius: 28px;
            padding: 30px;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
        }
        .eyebrow {
            color: #7dd3fc;
            text-transform: uppercase;
            letter-spacing: 0.18em;
            font-size: 12px;
            margin-bottom: 14px;
        }
        h1 {
            margin: 0 0 8px;
            font-size: 34px;
        }
        p {
            margin: 0 0 22px;
            color: var(--muted);
            line-height: 1.7;
        }
        .alert {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 16px;
            font-size: 14px;
        }
        .alert.error {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.24);
            color: #fecaca;
        }
        .alert.success {
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.24);
            color: #bbf7d0;
        }
        form {
            display: grid;
            gap: 16px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
        }
        input {
            width: 100%;
            background: #111927;
            color: var(--text);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 15px 16px;
            font: inherit;
            outline: none;
        }
        input:focus {
            border-color: rgba(0, 123, 255, 0.7);
            box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
        }
        button {
            border: 0;
            border-radius: 16px;
            padding: 15px 18px;
            color: white;
            background: linear-gradient(135deg, #0ea5e9 0%, var(--accent) 100%);
            font: inherit;
            font-weight: 700;
            cursor: pointer;
        }
        .helper {
            margin-top: 12px;
            font-size: 13px;
            color: var(--muted);
        }
    </style>
</head>
<body>
    <section class="card">
        <div class="eyebrow">Yönetim Paneli</div>
        <h1>Admin Giriş</h1>
        <p>Ekibimiz sayfasını yönetmek için kullanıcı adı ve şifrenizle giriş yapın.</p>
        <?php if ($flash !== null): ?>
            <div class="alert <?php echo e($flash['tip']); ?>"><?php echo e($flash['mesaj']); ?></div>
        <?php endif; ?>
        <form method="post" action="login.php">
            <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
            <div>
                <label for="kullanici_adi">Kullanıcı Adı</label>
                <input type="text" id="kullanici_adi" name="kullanici_adi" placeholder="admin" required>
            </div>
            <div>
                <label for="sifre">Şifre</label>
                <input type="password" id="sifre" name="sifre" placeholder="••••••••" required>
            </div>
            <button type="submit">Giriş Yap</button>
        </form>
        <div class="helper">Varsayılan bilgiler: `admin` / `admin123`</div>
    </section>
</body>
</html>
