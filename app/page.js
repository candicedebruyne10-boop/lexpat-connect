import {
  HeroPremium,
  DualEntry,
  ShortageJobsQuickLink,
  HowItWorksPremium,
  PresentationVideoSection,
  JobSectors,
  LexpatStrip,
  TestimonialsStrip,
  CtaBannerDark,
  MatchingPreview
} from "../components/Sections";

export const metadata = {
  title: "LEXPAT Connect — Mise en relation ciblée employeurs belges & travailleurs internationaux",
  description:
    "La plateforme de mise en relation ciblée entre employeurs belges et travailleurs internationaux qualifiés dans les métiers en pénurie. Recrutement sécurisé, accompagnement juridique si nécessaire."
};

export default function HomePage() {
  return (
    <>
      <HeroPremium
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />

      <div className="bg-[linear-gradient(180deg,#f0f6ff_0%,#eaf7f5_100%)] border-y border-[#dce8f5]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-[#b8d8f5] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#57b7af]">≡ Sur cette page — navigation</p>
              <h2 className="mt-2 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
                Les sujets traités<br className="hidden sm:block" />
                <span className="text-[#57b7af]"> sur cette page</span>
              </h2>
            </div>
            <span className="rounded-full border border-[#d4e6f7] bg-white px-4 py-1.5 text-xs font-semibold text-[#4a6b99]">
              ⏱ Lecture : ~3 min
            </span>
          </div>
          <nav className="grid gap-3 sm:grid-cols-2">
            {[
              { n: "01", href: "#acces", title: "Employeurs & travailleurs", desc: "Deux portails distincts selon votre profil et votre besoin." },
              { n: "02", href: "#metiers-en-penurie", title: "Métiers en pénurie", desc: "Accès rapide aux listes régionales par secteur d'activité." },
              { n: "03", href: "#comment-ca-marche", title: "Comment ça marche", desc: "Le fonctionnement de la plateforme en quelques étapes claires." },
              { n: "04", href: "#mise-en-relation", title: "La mise en relation", desc: "Comment employeurs et travailleurs entrent en contact." },
              { n: "05", href: "#secteurs", title: "Les secteurs couverts", desc: "Les domaines d'activité présents sur LEXPAT Connect." },
              { n: "06", href: "#lexpat", title: "Le cabinet LEXPAT", desc: "Le relais juridique disponible si le dossier le nécessite." },
              { n: "07", href: "#permis-unique", title: "Le permis unique", desc: "Droits et obligations des employeurs et des travailleurs étrangers en Belgique." },
              { n: "08", href: "#equivalence-diplome", title: "Équivalence de diplôme", desc: "Quand est-elle obligatoire et comment en faire la demande ?" },
            ].map(({ n, href, title, desc }) => (
              <a key={href} href={href} className="group flex items-start gap-4 rounded-2xl border border-[#d8e9f7] bg-white px-5 py-4 shadow-sm transition hover:border-[#57b7af] hover:shadow-md">
                <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-xs font-bold text-[#1d3b8b] transition group-hover:bg-[#57b7af] group-hover:text-white">{n}</span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-[#1d3b8b] transition group-hover:text-[#2f9f97]">{title}</div>
                  <div className="mt-0.5 text-xs leading-relaxed text-[#6b85a0]">{desc}</div>
                </div>
                <span className="ml-auto mt-1 flex-shrink-0 text-[#c5d8ec] transition group-hover:translate-x-1 group-hover:text-[#57b7af]">→</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div id="acces">
        <DualEntry />
      </div>

      <div id="metiers-en-penurie">
        <ShortageJobsQuickLink />
      </div>

      <div id="comment-ca-marche">
        <HowItWorksPremium />
      </div>

      <div id="mise-en-relation">
        <MatchingPreview />
      </div>

      <PresentationVideoSection />

      <div id="secteurs">
        <JobSectors />
      </div>

      <div id="lexpat">
        <LexpatStrip />
      </div>

      {/* ── Section équivalence de diplôme ──────────────────────────── */}
      <div id="equivalence-diplome" className="bg-[#f7f9fb] border-t border-[#e3edf8]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#cde2df] bg-[#eaf7f5] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#2f9f97]">🎓 Diplômes & reconnaissances</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Équivalence de diplôme :<br className="hidden sm:block" />
            <span className="text-[#57b7af]"> ce que vous devez savoir avant de postuler</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            La nécessité d'une équivalence de diplôme dépend de l'emploi visé et de votre pays d'origine. Si vous avez étudié à l'étranger, vous devez en principe en faire la demande. La procédure est facilitée lorsque le diplôme a été obtenu dans un pays de l'Espace économique européen.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Secteur public / professions réglementées */}
            <div className="rounded-2xl border border-[#c5d4f3] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d3b8b] text-white text-base">🏛</span>
                <h3 className="text-[15px] font-bold text-[#1d3b8b]">Secteur public & professions réglementées</h3>
              </div>
              <p className="text-[13.5px] leading-6 text-[#4a6b99] mb-3">
                L'équivalence de diplôme est <strong className="text-[#1d3b8b]">obligatoire</strong> si vous souhaitez travailler dans la fonction publique ou exercer une profession réglementée.
              </p>
              <div className="rounded-xl bg-[#f0f4fd] p-3 mb-3">
                <p className="text-[12px] font-semibold text-[#1d3b8b] mb-1">Professions concernées (exemples)</p>
                <p className="text-[12px] leading-5 text-[#4a6b99]">Infirmier·ère, pharmacien·ne, architecte, enseignant·e, mécanicien·ne…</p>
              </div>
              <p className="text-[12px] leading-5 text-[#607086]">
                L'équivalence vous permet également d'être rémunéré selon les <strong>barèmes légaux</strong> applicables à votre niveau d'études.
              </p>
            </div>

            {/* Secteur privé */}
            <div className="rounded-2xl border border-[#cde2df] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#57b7af] text-white text-base">🏢</span>
                <h3 className="text-[15px] font-bold text-[#2f9f97]">Secteur privé et professions non réglementées</h3>
              </div>
              <p className="text-[13.5px] leading-6 text-[#4a6b99] mb-3">
                L'équivalence n'est <strong className="text-[#2f9f97]">pas obligatoire</strong>. Votre employeur peut vous engager sur la base de votre diplôme étranger, sans certificat d'équivalence.
              </p>
              <div className="rounded-xl border border-[#cde2df] bg-[#f0faf9] p-3">
                <p className="text-[12px] font-semibold text-[#2f9f97] mb-1">Travailleur non-européen & permis unique</p>
                <p className="text-[12px] leading-5 text-[#4a6b99]">
                  Un travailleur hors UE sans séjour légal en Belgique doit obtenir un permis unique. Pour cette demande, il n'est <strong>pas nécessaire</strong> de présenter un certificat d'équivalence de diplôme.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/accompagnement-juridique" className="inline-flex items-center gap-2 rounded-full bg-[#57b7af] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3fa099]">
              Obtenir un accompagnement →
            </a>
            <a href="/permis-unique" className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#1d3b8b]">
              En savoir plus sur le permis unique
            </a>
          </div>
        </div>
      </div>

      <TestimonialsStrip />

      {/* ── Section permis unique ───────────────────────────────────── */}
      <div id="permis-unique" className="bg-white border-t border-[#e3edf8]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* En-tête */}
          <p className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-[#eef1fb] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[#1E3A78]">⚖ Cadre juridique</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#1d3b8b]">
            Permis unique :<br className="hidden sm:block" />
            <span className="text-[#57b7af]"> droits et obligations des employeurs et des travailleurs</span>
          </h2>
          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            Un employeur qui souhaite engager un travailleur étranger ressortissant hors UE doit, en principe, demander un permis unique préalablement à l'occupation. Si le candidat habite et travaille déjà en Belgique, l'employeur doit d'abord vérifier s'il est exempté de permis unique — auquel cas l'embauche peut avoir lieu immédiatement.
          </p>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-[#4a6b99]">
            Lorsqu'un permis unique est nécessaire, la demande se déroule en deux étapes : d'abord auprès de la région compétente (lieu d'occupation), ensuite auprès du service des Étrangers du SPF Intérieur. Une fois le permis délivré — et après obtention d'un visa D pour les candidats résidant hors Belgique — l'embauche peut avoir lieu.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Obligations employeur */}
            <div className="rounded-2xl border border-[#c5d4f3] bg-[#f5f7fd] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d3b8b] text-white">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </span>
                <h3 className="text-[15px] font-bold text-[#1d3b8b]">Obligations de l'employeur</h3>
              </div>
              <ul className="space-y-3 text-[13.5px] leading-6 text-[#4a6b99]">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Demander une <strong className="text-[#1d3b8b]">nouvelle autorisation de travail</strong> si le lieu de travail est modifié.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Veiller à ce que le salaire corresponde aux <strong className="text-[#1d3b8b]">barèmes sectoriels</strong> applicables à la fonction et à la catégorie pour laquelle le permis a été demandé.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1d3b8b]" /><span>Informer l'autorité compétente en cas de <strong className="text-[#1d3b8b]">rupture du contrat</strong> ou de modification significative des conditions de travail affectant la validité de l'autorisation.</span></li>
              </ul>
              <p className="mt-4 rounded-xl border border-[#dce6f9] bg-white p-3 text-[12px] leading-5 text-[#607086]">
                <strong>À noter :</strong> si l'employeur n'informe pas la région de la rupture du contrat, l'autorisation de travail n'est pas retirée. L'ancien travailleur conserve son permis unique jusqu'à son expiration. Après notification, le travailleur dispose en principe de trois mois pour trouver un nouvel employeur et peut, sous conditions, bénéficier d'allocations de chômage.
              </p>
            </div>

            {/* Droits travailleur */}
            <div className="rounded-2xl border border-[#cde2df] bg-[#f0faf9] p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#57b7af] text-white">
                  <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M5 10l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <h3 className="text-[15px] font-bold text-[#2f9f97]">Droits du travailleur</h3>
              </div>
              <ul className="space-y-3 text-[13.5px] leading-6 text-[#4a6b99]">
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>Le travailleur peut travailler <strong className="text-[#2f9f97]">uniquement pour l'employeur</strong> qui a demandé le permis unique en son nom.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>Après plusieurs années, il peut demander un <strong className="text-[#2f9f97]">permis unique à durée illimitée</strong> (carte A — « marché du travail : illimité »), lui permettant de changer librement d'employeur sans nouvelle demande.</span></li>
                <li className="flex gap-2"><span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#57b7af]" /><span>En cas de déménagement, le travailleur doit signaler sa nouvelle adresse à la commune. En cas de départ définitif de Belgique, il doit se <strong className="text-[#2f9f97]">désinscrire</strong> de la commune.</span></li>
              </ul>
              <p className="mt-4 rounded-xl border border-[#cde2df] bg-white p-3 text-[12px] leading-5 text-[#607086]">
                <strong>À noter :</strong> le permis unique à durée illimitée est pratique pour l'employeur qui souhaite recruter un détenteur, mais peut fragiliser la rétention du travailleur. Les conditions d'obtention varient par région.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/permis-unique" className="inline-flex items-center gap-2 rounded-full bg-[#1d3b8b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16307a]">
              En savoir plus sur le permis unique →
            </a>
            <a href="/accompagnement-juridique" className="inline-flex items-center gap-2 rounded-full border border-[#c5d4f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#1d3b8b] transition hover:border-[#1d3b8b]">
              Accompagnement juridique LEXPAT
            </a>
          </div>
        </div>
      </div>

      <CtaBannerDark
        primaryHref="/employeurs"
        secondaryHref="/travailleurs"
      />
    </>
  );
}
