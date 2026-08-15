/**
 * Nomor WhatsApp toko, format internasional tanpa "+" atau spasi.
 */
export const WHATSAPP_NUMBER = "6289519692875";

export const BRAND_NAME = "Rasa Rumah Cookies";
export const HAMPERS_HASHTAG = "#KejutanRasaRumah";

export function formatIDR(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
