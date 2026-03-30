CREATE DATABASE IF NOT EXISTS topluluk_portali CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE topluluk_portali;

CREATE TABLE IF NOT EXISTS basvurular (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(150) NOT NULL,
    eposta VARCHAR(190) NOT NULL,
    telefon VARCHAR(50) NOT NULL,
    bolum VARCHAR(150) NOT NULL,
    sinif VARCHAR(50) NOT NULL,
    ekipler TEXT NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS ekip_uyeleri (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_soyad VARCHAR(150) NOT NULL,
    gorev VARCHAR(150) NOT NULL,
    fotograf VARCHAR(255) NOT NULL,
    instagram VARCHAR(255) DEFAULT NULL,
    linkedin VARCHAR(255) DEFAULT NULL,
    twitter VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS etkinlikler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    baslik VARCHAR(180) NOT NULL,
    kisa_aciklama VARCHAR(255) NOT NULL,
    detay TEXT NOT NULL,
    etkinlik_tarihi DATETIME NOT NULL,
    konum VARCHAR(255) NOT NULL,
    harita_embed TEXT NOT NULL,
    kapasite INT NOT NULL DEFAULT 50,
    katilimci_sayisi INT NOT NULL DEFAULT 0,
    durum ENUM('aktif', 'pasif') NOT NULL DEFAULT 'aktif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
