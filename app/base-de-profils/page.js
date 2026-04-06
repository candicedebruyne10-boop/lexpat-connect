"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";

const SECTOR_ICONS = {
  "Informatique": "💻", "IT": "💻", "Tech": "💻",
  "Santé": "🏥", "Médical": "🏥",
  "Construction": "🏗️", "BTP": "🏗️",
  "Ingénierie": "⚙️", "Industrie": "⚙️",
  "Transport": "🚛", "Logistique": "🚛",
  "Finance": "📊", "Comptabilité": "📊",
  "Éducation": "📚", "Enseignement": "📚",
  "Hôtellerie": "🏨", "Restauration": "🍽️",
  "Agriculture": "🌾",
};

function sectorIcon(sector) {
  for (const [key, icon] of Object.entries(SECTOR_ICONS)) {
    if (sector?.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return "👤";
}

function ProfileCard({ profile }) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-[24px] border border-[#e3eaf1] bg-white p-6 shadow-[0_4px_16px_rgba(15,23,42,0.05)] transition hover:border-[#c5d4f3] hover:shadow-[0_8px_28px_rgba(29,59,139,0.09)]">

      {/* En-tête anonyme */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#eef1fb,#eaf4f3)] text-2xl shadow-inner">
          {sectorIcon(profile.sector)}
        </div>
        <div className="flex-1 min-w-0">
          {/* Nom masqué */}
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-28 rounded-full bg-[#dce7f5] blur-[1px] opacity-60" />
            <span className="flex items-center gap-1 rounded-full bg-[#f0f4f8] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a9bb0]">
              <svg viewBox="0 0 12 12" fill="none" className="h-2.5 w-2.5"><path d="M6 1a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm-4 9c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              Identité protégée
            </span>
          </div>
          <p className="mt-1 text-[13px] font-semibold text-[#1d3b8b]">{profile.sector}</p>
        </div>
      </div>

      {/* Détails */}
      <div className="grid grid-cols-2 gap-3 text-[12px]">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">Région</span>
          <span className="font-medium text-[#374151]">{profile.region}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">Expérience</span>
          <span className="font-medium text-[#374151]">{profile.experience}</span>
        </div>
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-[#a0aec0] font-semibold">Langues</span>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {profile.languages.split(",").map((lang) => (
              <span key={lang} className="rounded-full bg-[#eaf4f3] px-2.5 py-0.5 text-[11px] font-medium text-[#2b8f88]">
                {lang.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* CTA carte */}
      <div className="mt-auto pt-2 border-t border-[#f0f4f8]">
        <Link
          href="/employeurs"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1d3b8b] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#163175]"
        >
          <svg viewBox="0 0 14 14" fill="none" className="h-3.5 w-3.5"><path d="M7 1l1.5 4H13l-3.5 2.5 1.5 4L7 9l-4 2.5 1.5-4L1 5h4.5L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          Être mis en relation
        </Link>
      </div>
    </div>
  );
}

export default function BaseDeProfilsPage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [summary, setSummary] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.push("/connexion?next=/base-de-profils");
      return;
    }
    fetch("/api/member/profiles", {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setProfiles(data.rows || []);
        setSummary(data.summary || {});
      })
      .catch((e) => setError(e.message))
      .finally(() => setFetching(false));
  }, [loading, session, router]);

  if (loading || fetching) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1d3b8b] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container-shell py-12 lg:py-16">

      {/* En-tête */}
      <div className="max-w-2xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#57b7af]">Espace employeur</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#1d3b8b] lg:text-4xl">
          Candidats disponibles
        </h1>
        <p className="mt-4 text-base leading-7 text-[#607086]">
          Ces profils sont <strong>réels et actifs</strong>. Leurs coordonnées restent confidentielles jusqu'à la mise en relation — déposez une offre d'emploi pour entrer en contact avec les candidats correspondant à votre besoin.
        </p>
      </div>

      {/* Compteurs */}
      {summary && (
        <div className="mt-8 flex flex-wrap gap-4">
          {[
            { value: summary.total,   label: "Profils disponibles", color: "bg-[#eef1fb] text-[#1d3b8b] border-[#c5d4f3]" },
            { value: summary.sectors, label: "Secteurs représentés", color: "bg-[#eaf4f3] text-[#2b8f88] border-[#cde2df]" },
            { value: summary.regions, label: "Régions couvertes",    color: "bg-[#fff7e8] text-[#c48014] border-[#f7e2b8]" },
          ].map(({ value, label, color }) => (
            <div key={label} className={`flex items-center gap-3 rounded-2xl border px-5 py-3 ${color}`}>
              <span className="text-2xl font-extrabold">{value ?? "—"}</span>
              <span className="text-[13px] font-medium opacity-80">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bannière CTA */}
      <div className="mt-8 flex flex-col gap-4 rounded-[24px] border border-[#c5d4f3] bg-[linear-gradient(135deg,#eef1fb,#f7fbfb)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-[#1d3b8b]">Prêt à recruter ?</p>
          <p className="mt-1 text-sm leading-6 text-[#607086]">
            Déposez votre besoin de recrutement et nous identifions pour vous les candidats correspondants parmi ces profils.
          </p>
        </div>
        <Link
          href="/employeurs"
          className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-[#1d3b8b] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(29,59,139,0.22)] transition hover:bg-[#163175] hover:-translate-y-0.5"
        >
          Déposer une offre
          <svg viewBox="0 0 14 14" fill="none" className="h-4 w-4"><path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>

      {/* Grille de profils */}
      {error ? (
        <div className="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">{error}</div>
      ) : profiles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[#e3eaf1] bg-white p-12 text-center text-[#8a9bb0]">
          <p className="text-4xl">👤</p>
          <p className="mt-4 text-base font-medium">Aucun profil visible pour le moment.</p>
          <p className="mt-2 text-sm">Les candidats apparaîtront ici dès qu'ils auront activé la visibilité de leur profil.</p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
