/**
 * Nomor WhatsApp toko. Belum diisi karena tidak ada data kontak resmi yang diberikan.
 * Isi dengan format internasional tanpa tanda "+" atau spasi, contoh: "6281234567890".
 */
export const WHATSAPP_NUMBER = "";

export const BRAND_NAME = "Rasa Rumah Cookies";
export const HAMPERS_HASHTAG = "#KejutanRasaRumah";

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
