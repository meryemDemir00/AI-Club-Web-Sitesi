<?php
declare(strict_types=1);
require __DIR__ . '/functions.php';

if (isAdmin()) {
    redirect('admin.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verifyCsrf($_POST['csrf_token'] ?? null)) {
        flash('error', 'Güvenlik doğrulaması başarısız oldu.');
        redirect('login.php');
    }

    $username = text($_POST['username'] ?? '');
    $password = (string) ($_POST['password'] ?? '');

    if ($username === ADMIN_USERNAME && hash_equals(ADMIN_PASSWORD, $password)) {
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = ADMIN_USERNAME;
        flash('success', 'Admin paneline hoş geldiniz.');
        redirect('admin.php');
    }

    flash('error', 'Kullanıcı adı veya şifre hatalı.');
    redirect('login.php');
}

$pageTitle = pageTitle('Admin Giriş');
$activePage = 'admin';
require __DIR__ . '/partials/header.php';
?>
<section class="hero">
    <div class="eyebrow">Güvenli Giriş</div>
    <h1>Merkezi yönetim paneline erişin.</h1>
    <p>Varsayılan yönetici bilgileriyle giriş yaparak ekip, etkinlik ve başvuruları tek yerden yönetin.</p>
</section>

<section class="panel" style="max-width:520px;margin-top:24px;">
    <form method="post" action="login.php" style="display:grid;gap:16px;">
        <input type="hidden" name="csrf_token" value="<?php echo e(csrfToken()); ?>">
        <div class="field">
            <label for="username">Kullanıcı Adı</label>
            <input type="text" id="username" name="username" placeholder="admin" required>
        </div>
        <div class="field">
            <label for="password">Şifre</label>
            <input type="password" id="password" name="password" placeholder="admin123" required>
        </div>
        <button type="submit">Giriş Yap</button>
        <div class="helper">Varsayılan bilgiler: admin / admin123</div>
    </form>
</section>
<?php require __DIR__ . '/partials/footer.php'; ?>
