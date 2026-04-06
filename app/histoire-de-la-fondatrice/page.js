import Image from "next/image";
import Link from "next/link";
import { CardGrid, CtaBanner, Section, Steps } from "../../components/Sections";

export const metadata = {
  title: "L’histoire de la fondatrice | LEXPAT Connect",
  description:
    "Découvrez l’histoire de Maître Candice Debruyne, avocate en immigration économique et fondatrice de LEXPAT Connect : le constat terrain, le déclic et la vision derrière la plateforme."
};

const fieldObservations = [
  {
    kicker: "Côté employeurs",
    title: "Des besoins urgents, mais des parcours trop fragmentés",
    text: "Sur le terrain, beaucoup d’employeurs belges savent qu’ils doivent recruter, mais ne savent ni où trouver des profils internationaux crédibles, ni comment sécuriser ensuite le recrutement sur le plan du droit au travail."
  },
  {
    kicker: "Côté talents",
    title: "Des profils qualifiés, mais trop souvent invisibles",
    text: "Des travailleurs compétents, mobiles et motivés existent. Pourtant, sans réseau local, sans visibilité structurée et sans lecture claire des règles belges, ils restent souvent hors du radar des entreprises."
  },
  {
    kicker: "Côté système",
    title: "Un pont manquait entre recrutement, conformité et immigration",
    text: "Le marché ne manquait ni de besoins ni de talents. Il manquait surtout un cadre simple, lisible et sérieux pour faire se rencontrer les deux, sans mélanger trop tôt le commercial, l’administratif et le juridique."
  }
];

const whyPlatform = [
  {
    title: "Remettre de la clarté dans le recrutement international",
    text: "La plateforme a été pensée pour rendre visible ce qui compte vraiment : le poste, la région, le métier en pénurie, le niveau d’expérience et la faisabilité du projet."
  },
  {
    title: "Séparer nettement le matching et le juridique",
    text: "LEXPAT Connect sert d’abord à structurer la mise en relation. Le cabinet LEXPAT n’intervient ensuite que lorsqu’un vrai besoin juridique apparaît, notamment en matière de permis unique ou d’immigration économique."
  },
  {
    title: "Créer un outil crédible pour la Belgique",
    text: "L’objectif n’était pas de créer une marketplace de plus, mais une plateforme utile, rigoureuse et adaptée à la réalité belge : trois régions, des règles précises et un besoin permanent de lisibilité."
  }
];

const visionSteps = [
  {
    title: "Rendre les métiers en pénurie plus lisibles",
    text: "Permettre aux employeurs de comprendre rapidement quelle région est compétente, quels métiers sont réellement porteurs et comment avancer sans perdre de temps."
  },
  {
    title: "Donner une vraie visibilité aux talents internationaux",
    text: "Faire émerger des profils qui, aujourd’hui encore, restent trop souvent invisibles malgré leur qualification, leur mobilité et leur volonté de travailler en Belgique."
  },
  {
    title: "Installer une référence belge du recrutement international",
    text: "Construire progressivement une plateforme de référence en Belgique, à la fois humaine, juridiquement sérieuse et capable de créer une vraie confiance entre entreprises et talents."
  }
];

export default function HistoireFondatricePage() {
  return (
    <>
      <section className="pb-12 pt-8 sm:pb-16 lg:pb-20 lg:pt-12">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[38px] border border-[#dfe8ef] bg-white shadow-[0_20px_70px_rgba(30,52,94,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
                <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(32,78,151,0.16),transparent_62%)]" />
                <div className="relative max-w-2xl">
                  <p className="inline-flex items-center rounded-full border border-[#d9e5f3] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#204E97]">
                    L’histoire de la fondatrice
                  </p>
                  <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#1E3A78] sm:text-5xl lg:text-6xl">
                    Une plateforme née
                    <span className="block text-[#204E97]">du terrain, pas d’une théorie</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#4f6178] sm:text-lg">
                    Derrière LEXPAT Connect, il y a l’expérience quotidienne de Maître Candice Debruyne, avocate en immigration économique, confrontée aux besoins concrets des employeurs belges et à l’invisibilité persistante de nombreux talents internationaux.
                  </p>

                  <blockquote className="mt-8 rounded-[28px] border border-[#e2ebf3] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(24,53,101,0.05)]">
                    <p className="text-xl font-semibold leading-9 tracking-[-0.03em] text-[#1E3A78]">
                      “J’ai voulu créer un pont crédible entre le besoin de recruter, la réalité du terrain et la sécurité juridique.”
                    </p>
                    <footer className="mt-4 text-sm font-semibold text-[#B5121B]">
                      Maître Candice Debruyne
                    </footer>
                  </blockquote>
                </div>
              </div>

              <div className="relative overflow-hidden bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fc_100%)] p-8 sm:p-10 lg:p-12">
                <div className="absolute -right-12 top-6 h-40 w-40 rounded-full bg-[#dfe9f8] blur-3xl" />
                <div className="absolute -left-10 bottom-6 h-36 w-36 rounded-full bg-[#e4f5f2] blur-3xl" />
                <div className="relative mx-auto flex h-full max-w-md flex-col justify-between">
                  <div>
                    <div>
                      <div className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_18px_46px_rgba(20,45,88,0.10)]">
                        <div className="relative mx-auto aspect-[4/5] w-full max-w-[300px] sm:max-w-[320px]">
                          <Image
                            src="/candice-profile.png"
                            alt="Maître Candice Debruyne"
                            fill
                            priority
                            className="object-cover object-[50%_20%]"
                            sizes="(min-width: 1024px) 320px, 70vw"
                          />
                        </div>
                      </div>
                      <div className="mt-5 px-1">
                        <p className="text-[1.7rem] font-semibold leading-tight tracking-[-0.03em] text-[#1E3A78]">
                          Maître Candice Debruyne
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#607086]">
                          Avocate en immigration économique
                          <br />
                          Fondatrice de LEXPAT Connect
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 space-y-4 rounded-[26px] border border-[#dde7f0] bg-white p-5 text-sm leading-7 text-[#4f6178] shadow-[0_14px_32px_rgba(20,45,88,0.06)]">
                    <div className="flex items-center justify-between gap-4 rounded-[20px] border border-[#e6edf5] bg-[#f8fbff] px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#204E97]">
                        Signature
                      </span>
                      <span className="text-xs font-medium text-[#6f8198]">
                        Immigration économique · Belgique
                      </span>
                    </div>
                    <p className="text-[15px] leading-8 text-[#4f6178]">
                      Une approche née du terrain : écouter les employeurs, comprendre les blocages concrets et rendre enfin visibles les talents internationaux capables d’y répondre.
                    </p>
                    <div className="rounded-[20px] border border-[#e3eaf2] bg-[linear-gradient(180deg,#fbfdff_0%,#f4f8fc_100%)] px-4 py-4">
                      <p className="text-[1.05rem] font-semibold tracking-[-0.02em] leading-8 text-[#1E3A78]">
                        Recruter plus juste. Sécuriser au bon moment. Donner une vraie place à la confiance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section
        kicker="Le constat terrain"
        title="Ce que l’expérience d’avocate a rendu impossible à ignorer"
        intro="Au fil des dossiers, un même décalage revenait sans cesse : d’un côté des employeurs belges réellement en tension, de l’autre des talents internationaux qualifiés qui restaient hors de portée."
      >
        <CardGrid items={fieldObservations} columns={3} />
      </Section>

      <Section
        kicker="Le déclic"
        title="Le problème n’était pas seulement juridique"
        intro="Le déclic a été de comprendre qu’avant même la question du permis unique, il manquait surtout un cadre de rencontre plus intelligent, plus lisible et plus humain."
        muted
      >
        <div className="mx-auto max-w-4xl rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-8 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-10">
          <p className="text-lg leading-9 text-[#3c4d63]">
            Pendant longtemps, les employeurs devaient avancer à l’aveugle : recruter, comprendre les listes régionales, vérifier la faisabilité, puis seulement chercher un accompagnement juridique. En parallèle, les talents internationaux de qualité restaient trop souvent invisibles ou mal positionnés. Le déclic a été simple : <strong className="text-[#1E3A78]">créer une plateforme qui structure d’abord la rencontre, puis laisse le juridique intervenir au bon moment</strong>.
          </p>
        </div>
      </Section>

      <Section
        kicker="Pourquoi la plateforme"
        title="Pourquoi LEXPAT Connect a été créée"
        intro="LEXPAT Connect a été pensée comme un outil de confiance : plus fluide pour les entreprises, plus visible pour les talents et plus cohérent avec la réalité belge du recrutement international."
      >
        <CardGrid items={whyPlatform} columns={3} />
      </Section>

      <Section
        kicker="La vision"
        title="La vision derrière LEXPAT Connect"
        intro="À terme, la plateforme vise à devenir une référence belge du recrutement international dans les métiers en pénurie : un point de rencontre crédible entre besoin économique, visibilité des talents et conformité."
        muted
      >
        <Steps items={visionSteps} />
      </Section>

      <Section
        kicker="Une ambition belge"
        title="Construire un projet à la hauteur du terrain belge"
        intro="LEXPAT Connect ne part pas d’une vision abstraite du recrutement. Le projet s’inscrit dans une réalité très concrète : trois régions, des règles propres, des entreprises sous pression et des talents qui doivent pouvoir être mieux repérés."
      >
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-[#e5edf4] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <h3 className="text-xl font-semibold tracking-tight text-[#1E3A78]">Une marque de confiance</h3>
            <p className="mt-4 text-sm leading-8 text-[#607086]">
              La force du projet est d’unir deux dimensions rarement réunies avec clarté : un outil de matching lisible pour accélérer les recrutements, et derrière lui, un cabinet capable de sécuriser juridiquement ce qui doit l’être. C’est cette articulation qui doit faire de LEXPAT Connect une marque durable, crédible et profondément utile.
            </p>
          </article>
          <article className="rounded-[30px] border border-[#ead9dc] bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <p className="inline-flex rounded-full bg-[#fff0f1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5121B]">
              Signature
            </p>
            <p className="mt-4 text-lg font-semibold leading-9 tracking-[-0.02em] text-[#1E3A78]">
              “Créer plus qu’un site : un cadre de confiance pour que les bons profils et les bonnes entreprises puissent enfin se trouver.”
            </p>
          </article>
        </div>
      </Section>

      <Section
        kicker="Remerciements"
        title="Un projet porté à plusieurs"
        intro="Derrière cette plateforme, il y a aussi des soutiens essentiels, des regards exigeants et une énergie partagée sans lesquels cette vision n’aurait pas pu prendre forme."
        muted
      >
        <div className="mx-auto max-w-5xl rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-8 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-10">
          <ul className="space-y-5 text-base leading-8 text-[#4f6178] sm:text-lg">
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#B5121B]" />
              <span>
                Je remercie d’abord <strong className="text-[#1E3A78]">Etienne</strong>, mon mentor et mon amoureux, qui a fait germer ce projet dans mon esprit et grâce à qui j’ai osé y croire pleinement.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#204E97]" />
              <span>
                Je remercie profondément <strong className="text-[#1E3A78]">Maître Zahra Yakoubi Kichaoui</strong>, dont l’aide précieuse a été déterminante, et sans qui cette plateforme n’aurait pas vu le jour.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#57B7AF]" />
              <span>
                Je remercie également <strong className="text-[#1E3A78]">Margaux Leguellec</strong>, qui m’a accompagnée avec rigueur, enthousiasme et détermination vers l’éclosion de ce projet dont je rêvais depuis plus de cinq ans.
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <CtaBanner
        title="Découvrir la plateforme ou parler directement à Maître Candice Debruyne"
        text="Que vous souhaitiez comprendre le fonctionnement de LEXPAT Connect ou échanger sur un besoin concret de recrutement international, vous pouvez poursuivre avec la plateforme ou prendre contact avec le cabinet."
        primaryHref="/"
        primaryLabel="Découvrir la plateforme"
        secondaryHref="/contact"
        secondaryLabel="Parler à Maître Candice Debruyne"
      />
    </>
  );
}
