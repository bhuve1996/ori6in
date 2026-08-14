/** Certificate-related shared helpers (issuance is server-side). */

export function formatCertificateCode(raw: string) {
  return raw.trim().toUpperCase();
}
