/**
 * LEXPAT Connect — Gestion des désinscriptions email (RGPD)
 *
 * Fonctionnement :
 *  - Chaque email envoyé à un utilisateur contient un lien de désinscription signé (HMAC-SHA256)
 *  - Le clic sur ce lien appelle GET /api/unsubscribe?email=...&token=...
 *  - L'adresse est ajoutée dans la table `email_unsubscribes` en base
 *  - Avant chaque envoi, on vérifie que le destinataire n'est pas dans cette table
 *
 * Table Supabase requise (à créer manuellement une seule fois) :
 *   CREATE TABLE IF NOT EXISTS email_unsubscribes (
 *     email TEXT PRIMARY KEY,
 *     unsubscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
 *   );
 */

import crypto from "crypto";
import { getServiceClient } from "./supabase/server.js";

function getSecret() {
  return process.env.EMAIL_UNSUBSCRIBE_SECRET || process.env.RESEND_API_KEY || "lexpat-email-secret";
}

/**
 * Génère un token HMAC-SHA256 signé pour une adresse email.
 * Ce token est stable pour une même adresse (pas de date d'expiration),
 * ce qui permet au lien de fonctionner indéfiniment.
 */
export function generateUnsubscribeToken(email) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(String(email).toLowerCase().trim())
    .digest("hex");
}

/**
 * Retourne l'URL de désinscription signée pour un email donné.
 */
export function getUnsubscribeUrl(email) {
  if (!email) return null;
  const token = generateUnsubscribeToken(email);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://lexpat-connect.be";
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`;
}

/**
 * Vérifie que le token correspond bien à l'email (protection contre la falsification).
 * Utilise une comparaison à temps constant pour éviter les timing attacks.
 */
export function verifyUnsubscribeToken(email, token) {
  try {
    const expected = generateUnsubscribeToken(email);
    const expectedBuf = Buffer.from(expected, "hex");
    const providedBuf = Buffer.from(token, "hex");
    if (expectedBuf.length !== providedBuf.length) return false;
    return crypto.timingSafeEqual(expectedBuf, providedBuf);
  } catch {
    return false;
  }
}

/**
 * Vérifie si une adresse email est désinscrite.
 * Retourne true si elle est dans la table email_unsubscribes.
 */
export async function isUnsubscribed(email) {
  if (!email) return false;
  try {
    const supabase = getServiceClient();
    const { data } = await supabase
      .from("email_unsubscribes")
      .select("email")
      .eq("email", String(email).toLowerCase().trim())
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}

/**
 * Ajoute une adresse email dans la table des désinscriptions.
 */
export async function addUnsubscribe(email) {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from("email_unsubscribes")
    .upsert(
      { email: String(email).toLowerCase().trim(), unsubscribed_at: new Date().toISOString() },
      { onConflict: "email" }
    );
  if (error) throw error;
}
