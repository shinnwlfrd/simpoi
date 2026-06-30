export function normalizeWhatsappPhone(phone) {
  const digits = phone.replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  if (digits.startsWith("0")) {
    return `62${digits.slice(1)}`;
  }

  if (digits.startsWith("62")) {
    return digits;
  }

  return digits;
}

export function createWhatsappUrl(phone, message) {
  const normalized = normalizeWhatsappPhone(phone);

  if (!normalized) {
    return "";
  }

  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
