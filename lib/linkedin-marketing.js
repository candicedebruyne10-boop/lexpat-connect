const LINKEDIN_OAUTH_BASE_URL = "https://www.linkedin.com/oauth/v2";
const LINKEDIN_API_BASE_URL = "https://api.linkedin.com";

export const LINKEDIN_SCOPES = [
  "w_member_social",
];
export const LINKEDIN_API_VERSION = process.env.LINKEDIN_API_VERSION || "202504";

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function getLinkedInRedirectUri() {
  const explicit = process.env.LINKEDIN_REDIRECT_URI;
  if (explicit) return explicit;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!baseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SITE_URL");
  }

  return `${baseUrl.replace(/\/$/, "")}/api/admin/linkedin/callback`;
}

export function buildLinkedInAuthorizationUrl(state) {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const redirectUri = getLinkedInRedirectUri();

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
    scope: LINKEDIN_SCOPES.join(" "),
  });

  return `${LINKEDIN_OAUTH_BASE_URL}/authorization?${params.toString()}`;
}

export async function exchangeLinkedInCodeForToken(code) {
  const clientId = requireEnv("LINKEDIN_CLIENT_ID");
  const clientSecret = requireEnv("LINKEDIN_CLIENT_SECRET");
  const redirectUri = getLinkedInRedirectUri();

  const response = await fetch(`${LINKEDIN_OAUTH_BASE_URL}/accessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error_description || data.error || "LinkedIn token exchange failed.");
  }

  return data;
}

function getLinkedInHeaders(accessToken) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Linkedin-Version": LINKEDIN_API_VERSION,
    "X-Restli-Protocol-Version": "2.0.0",
  };
}

async function fetchLinkedInJson(path, accessToken) {
  const response = await fetch(`${LINKEDIN_API_BASE_URL}${path}`, {
    headers: getLinkedInHeaders(accessToken),
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || data.serviceErrorCode || "LinkedIn API request failed.";
    throw new Error(typeof message === "string" ? message : "LinkedIn API request failed.");
  }

  return data;
}

async function sendLinkedInJson(path, accessToken, body, { method = "POST", extraHeaders = {} } = {}) {
  const response = await fetch(`${LINKEDIN_API_BASE_URL}${path}`, {
    method,
    headers: {
      ...getLinkedInHeaders(accessToken),
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || data.serviceErrorCode || "LinkedIn API write failed.";
    throw new Error(typeof message === "string" ? message : "LinkedIn API write failed.");
  }

  return {
    data,
    restliId: response.headers.get("x-restli-id"),
  };
}

export async function fetchAccessibleAdAccounts(accessToken) {
  const users = await fetchLinkedInJson("/rest/adAccountUsers?q=authenticatedUser", accessToken);
  const elements = Array.isArray(users.elements) ? users.elements : [];

  const enriched = await Promise.all(
    elements.map(async (entry) => {
      const accountUrn = entry.account || null;
      const accountId = accountUrn?.split(":").pop() || null;
      let accountName = null;
      let accountStatus = null;
      let accountType = null;
      let currency = null;

      if (accountId) {
        try {
          const account = await fetchLinkedInJson(`/rest/adAccounts/${accountId}`, accessToken);
          accountName = account.name || null;
          accountStatus = account.status || null;
          accountType = account.type || null;
          currency = account.currency || account.currencyCode || null;
        } catch {
          // Keep the connection usable even if account enrichment is blocked.
        }
      }

      return {
        accountUrn,
        accountId,
        role: entry.role || null,
        accountName,
        accountStatus,
        accountType,
        currency,
      };
    })
  );

  return enriched;
}

export async function fetchCurrentLinkedInMember(accessToken) {
  const profile = await fetchLinkedInJson("/v2/me", accessToken);
  const personId = profile.id;

  return {
    id: personId,
    urn: personId ? `urn:li:person:${personId}` : null,
    firstName: profile.localizedFirstName || null,
    lastName: profile.localizedLastName || null,
    fullName: [profile.localizedFirstName, profile.localizedLastName].filter(Boolean).join(" ") || null,
  };
}

export async function fetchLinkedInOrganizations(accessToken) {
  const aclData = await fetchLinkedInJson("/rest/organizationAcls?q=roleAssignee&state=APPROVED", accessToken);
  const aclElements = Array.isArray(aclData.elements) ? aclData.elements : [];
  const orgIds = [...new Set(
    aclElements
      .map((entry) => entry.organization || null)
      .filter(Boolean)
      .map((urn) => urn.split(":").pop())
      .filter(Boolean)
  )];

  const organizations = await Promise.all(
    orgIds.map(async (orgId) => {
      let details = null;
      try {
        details = await fetchLinkedInJson(`/rest/organizations/${orgId}`, accessToken);
      } catch {
        details = null;
      }

      const matchingRoles = aclElements
        .filter((entry) => entry.organization === `urn:li:organization:${orgId}`)
        .map((entry) => entry.role)
        .filter(Boolean);

      return {
        id: orgId,
        urn: `urn:li:organization:${orgId}`,
        name: details?.localizedName || details?.name?.localized?.en_US || details?.vanityName || `Organization ${orgId}`,
        vanityName: details?.vanityName || null,
        roles: matchingRoles,
      };
    })
  );

  return organizations;
}

export function buildLinkedInTargetingCriteria({
  locationUrns = [],
  interfaceLocaleUrns = [],
  companyUrns = [],
}) {
  const and = [];

  if (locationUrns.length > 0) {
    and.push({
      or: {
        "urn:li:adTargetingFacet:locations": locationUrns,
      },
    });
  }

  if (interfaceLocaleUrns.length > 0) {
    and.push({
      or: {
        "urn:li:adTargetingFacet:interfaceLocales": interfaceLocaleUrns,
      },
    });
  }

  if (companyUrns.length > 0) {
    and.push({
      or: {
        "urn:li:adTargetingFacet:companies": companyUrns,
      },
    });
  }

  if (and.length === 0) {
    throw new Error("At least one LinkedIn targeting facet is required.");
  }

  return { include: { and } };
}

export async function createLinkedInCampaignGroup(accessToken, payload) {
  const { accountId, ...body } = payload;
  return sendLinkedInJson(`/rest/adAccounts/${accountId}/adCampaignGroups`, accessToken, body);
}

export async function createLinkedInCampaign(accessToken, payload) {
  const { accountId, ...body } = payload;
  return sendLinkedInJson(`/rest/adAccounts/${accountId}/adCampaigns`, accessToken, body);
}

export async function createLinkedInPost(accessToken, payload) {
  return sendLinkedInJson("/rest/posts", accessToken, payload);
}
