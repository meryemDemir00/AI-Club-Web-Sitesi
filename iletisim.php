<?php
$durum = $_GET['durum'] ?? '';
$mesaj = $_GET['mesaj'] ?? '';
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İletişim</title>
    <style>
        :root {
            --bg: #05070a;
            --panel: #0d1117;
            --panel-soft: #101722;
            --border: rgba(255, 255, 255, 0.07);
            --text: #f8fafc;
            --muted: #94a3b8;
            --accent: #38bdf8;
            --accent-strong: #0ea5e9;
            --accent-dark: #082f49;
            --success: #22c55e;
            --danger: #ef4444;
            --shadow: 0 28px 80px rgba(0, 0, 0, 0.45);
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            min-height: 100vh;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: var(--text);
            background:
                radial-gradient(circle at top left, rgba(56, 189, 248, 0.14), transparent 26%),
                radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.12), transparent 24%),
                linear-gradient(180deg, #040609 0%, var(--bg) 100%);
            padding: 36px 16px;
        }

        .container {
            max-width: 1120px;
            margin: 0 auto;
        }

        .hero-card,
        .info-card {
            background: rgba(13, 17, 23, 0.94);
            border: 1px solid var(--border);
            border-radius: 28px;
            box-shadow: var(--shadow);
            backdrop-filter: blur(10px);
        }

        .hero-card {
            padding: 34px;
            overflow: hidden;
            position: relative;
        }

        .hero-card::after {
            content: "";
            position: absolute;
            right: -120px;
            top: -60px;
            width: 260px;
            height: 260px;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.2), transparent 68%);
            border-radius: 50%;
        }

        .badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(56, 189, 248, 0.12);
            border: 1px solid rgba(56, 189, 248, 0.22);
            color: #bae6fd;
            font-size: 13px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
        }

        h1 {
            margin: 18px 0 12px;
            font-size: clamp(32px, 5vw, 54px);
            line-height: 1.04;
        }

        .lead {
            margin: 0 0 28px;
            max-width: 720px;
            color: var(--muted);
            line-height: 1.75;
            font-size: 16px;
        }

        .alert {
            margin-bottom: 22px;
            padding: 14px 16px;
            border-radius: 16px;
            font-size: 14px;
            border: 1px solid transparent;
        }

        .alert.success {
            background: rgba(34, 197, 94, 0.12);
            border-color: rgba(34, 197, 94, 0.3);
            color: #bbf7d0;
        }

        .alert.error {
            background: rgba(239, 68, 68, 0.12);
            border-color: rgba(239, 68, 68, 0.26);
            color: #fecaca;
        }

        form {
            display: grid;
            gap: 18px;
            position: relative;
            z-index: 1;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
        }

        .field {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        label {
            font-size: 14px;
            font-weight: 600;
            color: #e2e8f0;
        }

        input,
        textarea {
            width: 100%;
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: var(--panel-soft);
            color: var(--text);
            border-radius: 16px;
            padding: 15px 16px;
            font-size: 15px;
            outline: none;
            transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }

        textarea {
            min-height: 170px;
            resize: vertical;
        }

        input:focus,
        textarea:focus {
            border-color: rgba(56, 189, 248, 0.75);
            box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.14);
        }

        .helper {
            margin: -4px 0 0;
            font-size: 13px;
            color: var(--muted);
            line-height: 1.6;
        }

        .submit-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 16px;
            flex-wrap: wrap;
        }

        .submit-row span {
            color: var(--muted);
            font-size: 13px;
        }

        button {
            border: 0;
            border-radius: 16px;
            padding: 15px 24px;
            font-size: 15px;
            font-weight: 700;
            color: #f8fafc;
            background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
            box-shadow: 0 18px 36px rgba(37, 99, 235, 0.28);
            cursor: pointer;
            transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 20px;
            margin-top: 22px;
        }

        .info-card {
            padding: 26px;
        }

        .info-card h2 {
            margin: 0 0 10px;
            font-size: 22px;
        }

        .info-card p {
            margin: 0 0 18px;
            color: var(--muted);
            line-height: 1.7;
        }

        .socials {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .social-link {
            width: 50px;
            height: 50px;
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: rgba(56, 189, 248, 0.08);
            border: 1px solid rgba(56, 189, 248, 0.18);
            color: #e0f2fe;
            text-decoration: none;
            transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .social-link:hover {
            transform: translateY(-2px);
            background: rgba(56, 189, 248, 0.16);
            border-color: rgba(56, 189, 248, 0.32);
        }

        .mail-box {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            padding: 16px 18px;
            border-radius: 18px;
            background: rgba(56, 189, 248, 0.08);
            border: 1px solid rgba(56, 189, 248, 0.16);
            color: #f8fafc;
            font-weight: 600;
        }

        .icon {
            width: 22px;
            height: 22px;
            fill: currentColor;
        }

        @media (max-width: 860px) {
            .grid,
            .cards {
                grid-template-columns: 1fr;
            }

            .hero-card,
            .info-card {
                padding: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <section class="hero-card">
            <div class="badge">İletişim Formu</div>
            <h1>Bize Mesaj Gönderin</h1>
            <p class="lead">
                Sorularınızı, iş birliklerinizi veya önerilerinizi bize doğrudan iletin.
                Formdan gelen mesajlar güvenli SMTP bağlantısı üzerinden e-posta olarak gönderilir.
            </p>

            <?php if ($durum === 'basarili'): ?>
                <div class="alert success">Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.</div>
            <?php elseif ($durum === 'hata'): ?>
                <div class="alert error"><?php echo htmlspecialchars($mesaj ?: 'Mesaj gönderilirken bir sorun oluştu.', ENT_QUOTES, 'UTF-8'); ?></div>
            <?php endif; ?>

            <form action="mail_gonder.php" method="post">
                <div class="grid">
                    <div class="field">
                        <label for="ad_soyad">Ad Soyad</label>
                        <input type="text" id="ad_soyad" name="ad_soyad" placeholder="Örnek: Ahmet Kaya" required>
                    </div>
                    <div class="field">
                        <label for="eposta">E-posta</label>
                        <input type="email" id="eposta" name="eposta" placeholder="ornek@mail.com" required>
                    </div>
                </div>

                <div class="field">
                    <label for="konu">Konu</label>
                    <input type="text" id="konu" name="konu" placeholder="Mesaj konusunu yazın" required>
                </div>

                <div class="field">
                    <label for="mesaj">Mesaj</label>
                    <textarea id="mesaj" name="mesaj" placeholder="Mesajınızı detaylı şekilde yazabilirsiniz..." required></textarea>
                    <p class="helper">Form verileri temizlenir ve SMTP ile güvenli şekilde gönderilir.</p>
                </div>

                <div class="submit-row">
                    <span>Gönder butonuna tıklayarak bilgilerinizin işlenmesini kabul etmiş olursunuz.</span>
                    <button type="submit">Mesajı Gönder</button>
                </div>
            </form>
        </section>

        <section class="cards">
            <article class="info-card">
                <h2>Sosyal Medya</h2>
                <p>Bizi sosyal medya hesaplarımızdan takip edebilir, güncel paylaşımlarımıza doğrudan ulaşabilirsiniz.</p>
                <div class="socials">
                    <a class="social-link" href="#" aria-label="Instagram">
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm10.5 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                        </svg>
                    </a>
                    <a class="social-link" href="#" aria-label="X">
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2H21l-6.51 7.44L22.5 22h-6.268l-4.91-6.413L5.71 22H2.95l6.96-7.953L1.5 2h6.428l4.438 5.85L18.244 2zm-1.1 18h1.735L6.985 3.895H5.124L17.144 20z"/>
                        </svg>
                    </a>
                    <a class="social-link" href="#" aria-label="LinkedIn">
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3zM20.44 13.03c0-3.27-1.74-4.8-4.07-4.8-1.88 0-2.72 1.03-3.2 1.76V8.5H9.8c.04.99 0 11.5 0 11.5h3.37v-6.42c0-.34.03-.68.13-.92.27-.68.89-1.38 1.92-1.38 1.35 0 1.89 1.03 1.89 2.55V20h3.37v-6.97z"/>
                        </svg>
                    </a>
                    <a class="social-link" href="#" aria-label="YouTube">
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M23.5 6.2a3.01 3.01 0 0 0-2.12-2.13C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.57A3.01 3.01 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3.01 3.01 0 0 0 2.12 2.13c1.88.57 9.38.57 9.38.57s7.5 0 9.38-.57a3.01 3.01 0 0 0 2.12-2.13A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.75 15.98V8.02L16.5 12l-6.75 3.98z"/>
                        </svg>
                    </a>
                </div>
            </article>

            <article class="info-card">
                <h2>E-posta Adresi</h2>
                <p>Doğrudan bizimle iletişime geçmek isterseniz aşağıdaki adres üzerinden bize ulaşabilirsiniz.</p>
                <div class="mail-box">
                    <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2 5.5A2.5 2.5 0 0 1 4.5 3h15A2.5 2.5 0 0 1 22 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5v-13zm2.3-.5L12 10.5 19.7 5H4.3zM20 6.28l-7.42 5.3a1 1 0 0 1-1.16 0L4 6.28V18.5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V6.28z"/>
                    </svg>
                    <span>info@koyuyapayzeka.com</span>
                </div>
            </article>
        </section>
    </div>
</body>
</html>
