<?php
declare(strict_types=1);

require __DIR__ . '/db_baglan.php';
adminKontrolEt();

if (isset($_GET['cikis'])) {
    session_unset();
    session_destroy();
    session_start();
    flash('success', 'Güvenli şekilde çıkış yapıldı.');
    yonlendir('login.php');
}

$flash = flashAl();
$uyeler = [];
$duzenlenenUye = null;

try {
    $uyeler = db()->query('SELECT * FROM ekip_uyeleri ORDER BY created_at DESC, id DESC')->fetchAll();
} catch (Throwable $hata) {
    flash('error', 'Üyeler listelenemedi: ' . $hata->getMessage());
    yonlendir('login.php');
}

if (isset($_GET['duzenle'])) {
    $id = filter_input(INPUT_GET, 'duzenle', FILTER_VALIDATE_INT);
    if ($id) {
        $sorgu = db()->prepare('SELECT * FROM ekip_uyeleri WHERE id = :id');
        $sorgu->execute(['id' => $id]);
        $duzenlenenUye = $sorgu->fetch() ?: null;
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Paneli</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <style>
        :root {
            --bg: #05070a;
            --card: #0d1117;
            --soft: #111927;
            --line: rgba(255, 255, 255, 0.08);
            --text: #eef2ff;
            --muted: #94a3b8;
            --accent: #007bff;
        }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: "Outfit", sans-serif;
            background:
                radial-gradient(circle at top, rgba(0, 123, 255, 0.15), transparent 24%),
                linear-gradient(180deg, #05070b 0%, var(--bg) 100%);
            color: var(--text);
        }
        .wrap {
            width: min(1240px, calc(100% - 32px));
            margin: 28px auto 44px;
        }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
        }
        .title h1 {
            margin: 0 0 8px;
            font-size: 40px;
        }
        .title p {
            margin: 0;
            color: var(--muted);
        }
        .actions {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }
        .btn, button {
            border: 0;
            border-radius: 16px;
            padding: 13px 18px;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .btn.primary, button {
            color: white;
            background: linear-gradient(135deg, #0ea5e9 0%, var(--accent) 100%);
        }
        .btn.secondary {
            color: var(--text);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid var(--line);
        }
        .layout {
            display: grid;
            grid-template-columns: 420px 1fr;
            gap: 22px;
        }
        .panel {
            background: rgba(13, 17, 23, 0.96);
            border: 1px solid var(--line);
            border-radius: 26px;
            box-shadow: 0 22px 60px rgba(0, 0, 0, 0.4);
        }
        .panel.form-panel {
            padding: 24px;
            align-self: start;
            position: sticky;
            top: 20px;
        }
        .panel.table-panel {
            overflow: hidden;
        }
        .panel-head {
            padding: 22px 24px 0;
        }
        .panel-head h2 {
            margin: 0 0 8px;
            font-size: 24px;
        }
        .panel-head p {
            margin: 0 0 20px;
            color: var(--muted);
            line-height: 1.7;
        }
        .alert {
            margin-bottom: 18px;
            padding: 14px 16px;
            border-radius: 16px;
            font-size: 14px;
        }
        .alert.success {
            background: rgba(34, 197, 94, 0.12);
            border: 1px solid rgba(34, 197, 94, 0.25);
            color: #bbf7d0;
        }
        .alert.error {
            background: rgba(239, 68, 68, 0.12);
            border: 1px solid rgba(239, 68, 68, 0.25);
            color: #fecaca;
        }
        form {
            display: grid;
            gap: 14px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-size: 14px;
            font-weight: 600;
        }
        input {
            width: 100%;
            background: var(--soft);
            color: var(--text);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 14px 15px;
            font: inherit;
            outline: none;
        }
        input:focus {
            border-color: rgba(0, 123, 255, 0.7);
            box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.15);
        }
        .thumb {
            width: 88px;
            height: 88px;
            border-radius: 18px;
            object-fit: cover;
            border: 1px solid var(--line);
            background: #0b1220;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 16px 18px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            text-align: left;
            vertical-align: middle;
        }
        th {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #7dd3fc;
            background: rgba(255, 255, 255, 0.02);
        }
        td {
            color: #dbe7f3;
        }
        .row-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .link-btn {
            text-decoration: none;
            color: #9ed0ff;
            font-weight: 600;
        }
        .danger-btn {
            background: rgba(239, 68, 68, 0.14);
            color: #fecaca;
            border: 1px solid rgba(239, 68, 68, 0.22);
        }
        .table-wrap {
            overflow-x: auto;
            padding-bottom: 12px;
        }
        .empty {
            padding: 26px 24px 30px;
            color: var(--muted);
        }
        .helper {
            color: var(--muted);
            font-size: 13px;
            line-height: 1.6;
            margin-top: -2px;
        }
        @media (max-width: 980px) {
            .layout { grid-template-columns: 1fr; }
            .panel.form-panel { position: static; }
        }
    </style>
</head>
<body>
    <main class="wrap">
        <section class="topbar">
            <div class="title">
                <h1>Admin Paneli</h1>
                <p>Ekip üyelerini ekleyin, güncelleyin, silin ve ön yüzde gösterilecek içerikleri yönetin.</p>
            </div>
            <div class="actions">
                <a class="btn secondary" href="index.php"><i class="fa-solid fa-arrow-up-right-from-square"></i> Ön Yüzü Gör</a>
                <a class="btn secondary" href="admin.php?cikis=1"><i class="fa-solid fa-right-from-bracket"></i> Çıkış Yap</a>
            </div>
        </section>
        <?php if ($flash !== null): ?>
            <div class="alert <?php echo e($flash['tip']); ?>"><?php echo e($flash['mesaj']); ?></div>
        <?php endif; ?>
        <section class="layout">
            <article class="panel form-panel">
                <div class="panel-head">
                    <h2><?php echo $duzenlenenUye ? 'Üyeyi Güncelle' : 'Yeni Üye Ekle'; ?></h2>
                    <p>Fotoğraf yükleyin, görev bilgisini girin ve sosyal medya adreslerini yönetin.</p>
                </div>
                <form action="ekle_sil_duzenle.php" method="post" enctype="multipart/form-data">
                    <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
                    <input type="hidden" name="islem" value="<?php echo $duzenlenenUye ? 'guncelle' : 'ekle'; ?>">
                    <input type="hidden" name="id" value="<?php echo e((string) ($duzenlenenUye['id'] ?? '')); ?>">
                    <div>
                        <label for="ad_soyad">Ad Soyad</label>
                        <input type="text" id="ad_soyad" name="ad_soyad" value="<?php echo e((string) ($duzenlenenUye['ad_soyad'] ?? '')); ?>" required>
                    </div>
                    <div>
                        <label for="gorev">Görev / Unvan</label>
                        <input type="text" id="gorev" name="gorev" value="<?php echo e((string) ($duzenlenenUye['gorev'] ?? '')); ?>" required>
                    </div>
                    <div>
                        <label for="fotograf">Fotoğraf</label>
                        <input type="file" id="fotograf" name="fotograf" accept=".jpg,.jpeg,.png" <?php echo $duzenlenenUye ? '' : 'required'; ?>>
                        <div class="helper">Sadece `.jpg`, `.jpeg` ve `.png` dosyalarına izin verilir.</div>
                    </div>
                    <?php if ($duzenlenenUye && !empty($duzenlenenUye['fotograf'])): ?>
                        <img class="thumb" src="<?php echo e(UPLOAD_WEB_PATH . $duzenlenenUye['fotograf']); ?>" alt="<?php echo e($duzenlenenUye['ad_soyad']); ?>">
                    <?php endif; ?>
                    <div>
                        <label for="instagram">Instagram</label>
                        <input type="url" id="instagram" name="instagram" value="<?php echo e((string) ($duzenlenenUye['instagram'] ?? '')); ?>" placeholder="https://instagram.com/...">
                    </div>
                    <div>
                        <label for="linkedin">LinkedIn</label>
                        <input type="url" id="linkedin" name="linkedin" value="<?php echo e((string) ($duzenlenenUye['linkedin'] ?? '')); ?>" placeholder="https://linkedin.com/in/...">
                    </div>
                    <div>
                        <label for="twitter">X / Twitter</label>
                        <input type="url" id="twitter" name="twitter" value="<?php echo e((string) ($duzenlenenUye['twitter'] ?? '')); ?>" placeholder="https://x.com/...">
                    </div>
                    <button type="submit"><?php echo $duzenlenenUye ? 'Değişiklikleri Kaydet' : 'Üyeyi Ekle'; ?></button>
                </form>
            </article>
            <article class="panel table-panel">
                <div class="panel-head">
                    <h2>Ekip Üyeleri</h2>
                    <p>Tablodan mevcut üyeleri görüntüleyebilir, düzenleyebilir veya silebilirsiniz.</p>
                </div>
                <?php if (empty($uyeler)): ?>
                    <div class="empty">Henüz kayıtlı ekip üyesi bulunmuyor.</div>
                <?php else: ?>
                    <div class="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Fotoğraf</th>
                                    <th>Ad Soyad</th>
                                    <th>Görev</th>
                                    <th>Sosyal Ağlar</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($uyeler as $uye): ?>
                                    <tr>
                                        <td><img class="thumb" src="<?php echo e(UPLOAD_WEB_PATH . $uye['fotograf']); ?>" alt="<?php echo e($uye['ad_soyad']); ?>"></td>
                                        <td><?php echo e($uye['ad_soyad']); ?></td>
                                        <td><?php echo e($uye['gorev']); ?></td>
                                        <td>
                                            <div class="row-actions">
                                                <?php if (!empty($uye['instagram'])): ?><a class="link-btn" href="<?php echo e($uye['instagram']); ?>" target="_blank" rel="noopener noreferrer">Instagram</a><?php endif; ?>
                                                <?php if (!empty($uye['linkedin'])): ?><a class="link-btn" href="<?php echo e($uye['linkedin']); ?>" target="_blank" rel="noopener noreferrer">LinkedIn</a><?php endif; ?>
                                                <?php if (!empty($uye['twitter'])): ?><a class="link-btn" href="<?php echo e($uye['twitter']); ?>" target="_blank" rel="noopener noreferrer">X</a><?php endif; ?>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="row-actions">
                                                <a class="link-btn" href="admin.php?duzenle=<?php echo e((string) $uye['id']); ?>">Düzenle</a>
                                                <form action="ekle_sil_duzenle.php" method="post" onsubmit="return confirm('Bu üyeyi silmek istediğinize emin misiniz?');">
                                                    <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
                                                    <input type="hidden" name="islem" value="sil">
                                                    <input type="hidden" name="id" value="<?php echo e((string) $uye['id']); ?>">
                                                    <button class="danger-btn" type="submit">Sil</button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php endif; ?>
            </article>
        </section>
    </main>
</body>
</html>
