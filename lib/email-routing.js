export const CONTACT_RECIPIENT =
  process.env.CONTACT_EMAIL || "contact@lexpat-connect.be";

export function getNotificationRecipient() {
  return CONTACT_RECIPIENT;
}

export function getSenderAddress() {
  return process.env.RESEND_FROM_EMAIL || CONTACT_RECIPIENT;
}
