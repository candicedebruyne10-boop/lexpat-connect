import { NextResponse } from "next/server";
import { getUserFromRequest, getServiceClient } from "../../../../../lib/supabase/server";
import {
  buildLinkedInTargetingCriteria,
  createLinkedInCampaign,
  createLinkedInCampaignGroup,
} from "../../../../../lib/linkedin-marketing";

const ADMIN_EMAILS = [
  process.env.CONTACT_EMAIL,
  "contact@lexpat-connect.be",
  "lexpat@lexpat.be",
].filter(Boolean).map((email) => email.toLowerCase());

async function assertAdmin(supabase, user) {
  if (ADMIN_EMAILS.includes((user.email || "").toLowerCase())) return true;
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  if (data?.role === "admin") return true;
  throw new Error("Accès administrateur requis.");
}

function parseUrnList(value) {
  if (!value) return [];
  return String(value)
    .split(/[\n,;]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function toBudget(amount, currencyCode) {
  if (!amount) return null;
  const normalized = Number(amount);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    throw new Error("Le budget doit etre un nombre positif.");
  }
  return {
    amount: normalized.toFixed(2),
    currencyCode,
  };
}

function toTimestamp(value, fieldLabel) {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Date invalide pour ${fieldLabel}.`);
  }
  return timestamp;
}

export async function POST(request) {
  try {
    const { user } = await getUserFromRequest(request);
    const supabase = getServiceClient();
    await assertAdmin(supabase, user);

    const body = await request.json().catch(() => ({}));
    const {
      accountId,
      accountCurrency = "EUR",
      campaignGroupName,
      campaignName,
      campaignType = "SPONSORED_UPDATES",
      objectiveType = "WEBSITE_VISITS",
      costType = "CPC",
      dailyBudget,
      totalBudget,
      localeCountry = "BE",
      localeLanguage = "fr",
      locationUrns,
      interfaceLocaleUrns,
      companyUrns,
      associatedEntity,
      status = "DRAFT",
      campaignGroupStatus = "DRAFT",
      startAt,
      endAt,
    } = body;

    if (!accountId) throw new Error("Compte publicitaire LinkedIn manquant.");
    if (!campaignGroupName) throw new Error("Nom du groupe de campagne requis.");
    if (!campaignName) throw new Error("Nom de campagne requis.");

    const { data: connection, error: connectionError } = await supabase
      .from("linkedin_admin_connections")
      .select("access_token, expires_at")
      .eq("created_by", user.id)
      .maybeSingle();

    if (connectionError) throw connectionError;
    if (!connection?.access_token) throw new Error("Aucune connexion LinkedIn active pour cet admin.");

    const parsedStart = toTimestamp(startAt, "la date de debut");
    const parsedEnd = toTimestamp(endAt, "la date de fin");

    if (!parsedStart) throw new Error("Date de debut requise.");
    if (parsedEnd && parsedEnd <= parsedStart) {
      throw new Error("La date de fin doit etre posterieure a la date de debut.");
    }

    const targetingCriteria = buildLinkedInTargetingCriteria({
      locationUrns: parseUrnList(locationUrns),
      interfaceLocaleUrns: parseUrnList(interfaceLocaleUrns),
      companyUrns: parseUrnList(companyUrns),
    });

    const groupBudget = toBudget(totalBudget, accountCurrency);
    const campaignDailyBudget = toBudget(dailyBudget, accountCurrency);

    if (!groupBudget && !campaignDailyBudget) {
      throw new Error("Renseignez au moins un budget: budget total du groupe ou budget quotidien de campagne.");
    }

    const campaignGroupPayload = {
      account: `urn:li:sponsoredAccount:${accountId}`,
      name: campaignGroupName,
      runSchedule: {
        start: parsedStart,
        ...(parsedEnd ? { end: parsedEnd } : {}),
      },
      status: campaignGroupStatus,
      ...(groupBudget ? { totalBudget: groupBudget } : {}),
    };

    const createdGroup = await createLinkedInCampaignGroup(connection.access_token, {
      accountId,
      ...campaignGroupPayload,
    });

    const campaignGroupId = createdGroup.restliId || createdGroup.data.id;
    if (!campaignGroupId) {
      throw new Error("LinkedIn n'a pas retourne l'identifiant du groupe de campagne.");
    }

    const campaignPayload = {
      account: `urn:li:sponsoredAccount:${accountId}`,
      campaignGroup: `urn:li:sponsoredCampaignGroup:${campaignGroupId}`,
      name: campaignName,
      type: campaignType,
      objectiveType,
      costType,
      status,
      locale: {
        country: localeCountry,
        language: localeLanguage,
      },
      runSchedule: {
        start: parsedStart,
        ...(parsedEnd ? { end: parsedEnd } : {}),
      },
      targetingCriteria,
      ...(campaignDailyBudget ? { dailyBudget: campaignDailyBudget } : {}),
      ...(associatedEntity ? { associatedEntity } : {}),
    };

    const createdCampaign = await createLinkedInCampaign(connection.access_token, {
      accountId,
      ...campaignPayload,
    });

    return NextResponse.json({
      ok: true,
      campaignGroupId: String(campaignGroupId),
      campaignId: String(createdCampaign.restliId || createdCampaign.data.id || ""),
      campaignGroup: createdGroup.data,
      campaign: createdCampaign.data,
    });
  } catch (err) {
    const status = err.message?.includes("administrateur") ? 403 : 500;
    return NextResponse.json({ error: err.message }, { status });
  }
}
