<?php
$pageTitle = $pageTitle ?? SITE_NAME;
$activePage = $activePage ?? '';
$flash = $flash ?? getFlash();
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($pageTitle); ?></title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        :root {
            --bg: #05070a;
            --card: #0d1117;
            --card-soft: #111827;
            --line: rgba(255,255,255,0.08);
            --text: #eef2ff;
            --muted: #94a3b8;
            --accent: #1d9bf0;
            --accent-strong: #007bff;
            --success: #22c55e;
            --danger: #ef4444;
            --shadow: 0 24px 72px rgba(0,0,0,0.42);
        }
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
            margin: 0;
            font-family: "Outfit", sans-serif;
            background:
                radial-gradient(circle at top, rgba(29, 155, 240, 0.14), transparent 25%),
                linear-gradient(180deg, #05070b 0%, var(--bg) 100%);
            color: var(--text);
        }
        a { color: inherit; }
        .container {
            width: min(1180px, calc(100% - 32px));
            margin: 0 auto;
        }
        .site-header {
            position: sticky;
            top: 0;
            z-index: 50;
            backdrop-filter: blur(14px);
            background: rgba(5, 7, 10, 0.78);
            border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            padding: 16px 0;
        }
        .brand {
            text-decoration: none;
            font-weight: 800;
            letter-spacing: 0.04em;
            font-size: 20px;
        }
        .nav-links {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .nav-links a {
            text-decoration: none;
            padding: 10px 14px;
            border-radius: 14px;
            border: 1px solid transparent;
            color: var(--muted);
        }
        .nav-links a.active,
        .nav-links a:hover {
            color: var(--text);
            background: rgba(255,255,255,0.04);
            border-color: rgba(255,255,255,0.06);
        }
        .page-shell {
            padding: 28px 0 72px;
        }
        .hero {
            padding: 40px 0 16px;
        }
        .eyebrow {
            color: #7dd3fc;
            text-transform: uppercase;
            letter-spacing: 0.16em;
            font-size: 12px;
            margin-bottom: 14px;
        }
        .hero h1 {
            margin: 0 0 12px;
            font-size: clamp(34px, 6vw, 64px);
            line-height: 0.98;
        }
        .hero p {
            margin: 0;
            max-width: 760px;
            color: var(--muted);
            line-height: 1.8;
            font-size: 16px;
        }
        .panel,
        .card {
            background: rgba(13, 17, 23, 0.96);
            border: 1px solid var(--line);
            border-radius: 26px;
            box-shadow: var(--shadow);
        }
        .panel { padding: 28px; }
        .grid-2 {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 22px;
        }
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 22px;
        }
        .field { display: flex; flex-direction: column; gap: 8px; }
        label {
            font-size: 14px;
            font-weight: 600;
            color: #e2e8f0;
        }
        input, select, textarea {
            width: 100%;
            border: 1px solid rgba(255,255,255,0.08);
            background: var(--card-soft);
            color: var(--text);
            border-radius: 16px;
            padding: 14px 15px;
            font: inherit;
            outline: none;
        }
        textarea { min-height: 160px; resize: vertical; }
        input:focus, select:focus, textarea:focus {
            border-color: rgba(29, 155, 240, 0.72);
            box-shadow: 0 0 0 4px rgba(29, 155, 240, 0.14);
        }
        .button, button {
            border: 0;
            border-radius: 16px;
            padding: 14px 18px;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            color: white;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            background: linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%);
            box-shadow: 0 16px 32px rgba(0, 123, 255, 0.24);
        }
        .button.secondary {
            background: rgba(255,255,255,0.05);
            color: var(--text);
            border: 1px solid var(--line);
            box-shadow: none;
        }
        .alert {
            margin: 20px 0;
            padding: 14px 16px;
            border-radius: 16px;
            border: 1px solid transparent;
            font-size: 14px;
        }
        .alert.success {
            background: rgba(34, 197, 94, 0.12);
            border-color: rgba(34, 197, 94, 0.24);
            color: #bbf7d0;
        }
        .alert.error {
            background: rgba(239, 68, 68, 0.12);
            border-color: rgba(239, 68, 68, 0.24);
            color: #fecaca;
        }
        .helper {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
        }
        .footer {
            padding: 26px 0 42px;
            color: var(--muted);
            font-size: 14px;
        }
        @media (max-width: 900px) {
            .grid-2, .grid-3 { grid-template-columns: 1fr; }
            .nav { align-items: flex-start; flex-direction: column; }
        }
    </style>
</head>
<body>
    <header class="site-header">
        <div class="container nav">
            <a class="brand" href="index.php"><?php echo e(SITE_NAME); ?></a>
            <nav class="nav-links">
                <a class="<?php echo $activePage === 'home' ? 'active' : ''; ?>" href="index.php">Anasayfa</a>
                <a class="<?php echo $activePage === 'uye-ol' ? 'active' : ''; ?>" href="uye-ol.php">Üye Ol</a>
                <a class="<?php echo $activePage === 'iletisim' ? 'active' : ''; ?>" href="iletisim.php">İletişim</a>
                <a class="<?php echo $activePage === 'ekibimiz' ? 'active' : ''; ?>" href="ekibimiz.php">Ekibimiz</a>
                <a class="<?php echo $activePage === 'etkinlikler' ? 'active' : ''; ?>" href="etkinlikler.php">Etkinlikler</a>
                <a class="<?php echo $activePage === 'admin' ? 'active' : ''; ?>" href="login.php">Admin</a>
            </nav>
        </div>
    </header>
    <main class="page-shell">
        <div class="container">
            <?php if ($flash !== null): ?>
                <div class="alert <?php echo e($flash['type']); ?>"><?php echo e($flash['message']); ?></div>
            <?php endif; ?>
