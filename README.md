# Rasa Rumah E-Commerce

Buatkan sebuah website e-commerce / landing page untuk brand UMKM bernama "Rasa Rumah Cookies". Website ini harus memiliki desain yang bersih, modern, dan sangat mobile-friendly.

TUGAS UTAMA DAN BATASAN (SANGAT PENTING):

1. DILARANG KERAS menambahkan alamat fisik toko, nomor telepon dummy, email fiktif, atau informasi kontak apa pun yang tidak diberikan dalam prompt ini. Kosongkan atau sembunyikan bagian tersebut.

2. Gunakan gambar logo yang saya lampirkan (`rr-logo.jpg`) sebagai logo utama di header dan tempat relevan lainnya. Desain logo memuat atap rumah, simbol hati merah muda, pengocok adonan, dan teks cokelat. Sesuaikan estetika web dengan logo ini.

3. Hubungkan website ini dengan Supabase untuk fungsionalitas basis data.

PANDUAN VISUAL & TEMA (BRAND ARCHETYPE: THE CAREGIVER)

- Suasana: Hangat, ramah, jujur, dan personal seperti dapur rumah tangga yang bersih.

- Gunakan 'rr-icon.ico' sebagai favicon.

- Palet Warna:

  - Background Utama: Creamy Butter (#F9E8C9)

  - Teks & Garis/Aksen: Warm Chocolate (#4A2E1B)

  - Tombol Call-to-Action (CTA): Warm Terracotta (#D96B43)

- Sudut elemen UI (tombol, kartu produk) harus membulat (rounded) agar tidak terkesan kaku.

HALAMAN DAN KOMPONEN UI YANG DIBUTUHKAN:

1. Header & Navigasi:

   - Logo `rr-logo.jpg` di sebelah kiri.

   - Menu navigasi simpel: Beranda, Katalog, Hampers.

   - Ikon keranjang belanja yang menampilkan jumlah item.

2. Hero Section:

   - Headline utama: "Nikmati Kehangatan 'Rasa Rumah' di Setiap Gigitan"

   - Sub-headline: "Kue kering premium buatan tangan, dipanggang segar tanpa pengawet."

   - Tombol CTA mencolok: "Pesan Fresh Batch" (mengarah ke bagian katalog).

3. Katalog Produk Dinamis (Terhubung Supabase):

   - Tarik (fetch) data produk dari tabel Supabase `products` dan kategori dari tabel `categories`.

   - Tampilkan dalam bentuk Grid Layout.

   - Setiap kartu produk (Product Card) harus menampilkan: Gambar kue, Nama Varian, Harga, dan *Badge* Sisa Stok (diambil dari kolom `batch_stock`).

   - Sediakan tombol "Tambah ke Keranjang".

4. Custom Hampers Builder (#KejutanRasaRumah):

   - Sebuah antarmuka interaktif (bisa berupa Modal atau Drawer).

   - Pengguna dapat memilih 2 hingga 4 jenis kue untuk dimasukkan ke dalam boks hampers.

   - Terdapat kolom input teks (Textarea) agar pengguna dapat menulis pesan kartu ucapan khusus.

5. Keranjang Belanja & Checkout (Supabase + WhatsApp):

   - Tampilkan ringkasan pesanan di keranjang.

   - Form data pembeli (Nama Lengkap, Nomor Telepon).

   - Saat pengguna menekan tombol "Checkout", simpan data pesanan ke Supabase (ke tabel `orders` dan `order_items`).

   - Setelah data tersimpan, arahkan (redirect) pengguna ke WhatsApp dengan format pesan otomatis yang merangkum rincian pesanan mereka.

6. Widget AI Caregiver (Floating Button):

   - Tambahkan tombol melayang di pojok kanan bawah layar.

   - Jika diklik, buka jendela obrolan (chat interface) sederhana sebagai tempat "Mimin Caregiver" menyapa dan siap merekomendasikan produk.

STRUKTUR DATABASE SUPABASE (Sebagai Referensi Integrasi API):

- Tabel `categories`: id, name, slug.

- Tabel `products`: id, category_id, name, price, batch_stock, image_url, is_active.

- Tabel `orders`: id, customer_name, customer_phone, custom_greeting_card, total_amount.

- Tabel `order_items`: id, order_id, product_id, quantity, subtotal, custom_hampers_details.

Silakan bangun struktur frontend dan komponen UI-nya sekarang menggunakan best practice terkini, pastikan koneksi ke Supabase disiapkan dengan baik.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rumah-rasa-kuki.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c35c7eb-3c40-414b-9359-788464fbf216).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
