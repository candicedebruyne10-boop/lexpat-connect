import Image from "next/image";
import { CardGrid, CtaBanner, Section, Steps } from "../../../components/Sections";

export const metadata = {
  title: "The founder's story | LEXPAT Connect",
  description:
    "Discover the story of Maître Candice Debruyne, lawyer in economic immigration and founder of LEXPAT Connect: the field reality, the turning point and the long-term vision behind the platform."
};

const fieldObservations = [
  {
    kicker: "Employers",
    title: "Urgent needs, but fragmented recruitment paths",
    text: "On the ground, many Belgian employers know they need to recruit, but do not know where to find credible international profiles or how to secure the process later from a right-to-work perspective."
  },
  {
    kicker: "Workers",
    title: "Qualified profiles, but still too invisible",
    text: "Competent, mobile and motivated workers do exist. Yet without a local network, structured visibility and a clear understanding of Belgian rules, they often remain invisible to companies."
  },
  {
    kicker: "System",
    title: "A bridge was missing between recruitment, compliance and immigration",
    text: "The market was not lacking either need or worker. What it lacked was a simple, readable and credible framework to bring the two together without mixing commercial, administrative and legal issues too early."
  }
];

const whyPlatform = [
  {
    title: "Bring clarity back into international hiring",
    text: "The platform was designed to make the essentials visible again: the role, the region, the shortage occupation, the experience level and the real feasibility of the project."
  },
  {
    title: "Clearly separate matching from legal work",
    text: "LEXPAT Connect is designed first to structure introductions. The LEXPAT law firm steps in only when a genuine legal need appears, especially around single permits or economic immigration."
  },
  {
    title: "Build a tool that makes sense for Belgium",
    text: "The goal was never to launch yet another marketplace, but a useful, rigorous platform adapted to Belgian reality: three regions, precise rules and a constant need for clarity."
  }
];

const visionSteps = [
  {
    title: "Make shortage occupations easier to understand",
    text: "Help employers quickly understand which region is competent, which occupations are truly strategic and how to move forward without wasting time."
  },
  {
    title: "Give international worker real visibility",
    text: "Bring forward profiles that are still too often invisible despite their qualifications, mobility and willingness to work in Belgium."
  },
  {
    title: "Build a Belgian reference in international recruitment",
    text: "Gradually establish a platform that is both human and legally serious, able to create real trust between companies and international worker."
  }
];

export default function FounderStoryPageEn() {
  return (
    <>
      <section className="pb-12 pt-8 sm:pb-16 lg:pb-20 lg:pt-12">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[38px] border border-[#dfe8ef] bg-[linear-gradient(180deg,#ffffff_0%,#f9fbff_100%)] shadow-[0_20px_70px_rgba(30,52,94,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
                <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(32,78,151,0.12),transparent_62%)]" />
                <div className="relative max-w-2xl">
                  <p className="inline-flex items-center rounded-full border border-[#d9e5f3] bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#204E97]">
                    The founder&apos;s story
                  </p>
                  <h1 className="mt-6 font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#1E3A78] sm:text-5xl lg:text-6xl">
                    A platform born
                    <span className="block text-[#204E97]">from field reality, not theory</span>
                  </h1>
                  <p className="mt-6 max-w-xl text-base leading-8 text-[#4f6178] sm:text-lg">
                    Behind LEXPAT Connect lies the day-to-day experience of Maître Candice Debruyne, a lawyer in economic immigration confronted with the concrete needs of Belgian employers and the persistent invisibility of many international workers.
                  </p>

                  <blockquote className="mt-8 rounded-[28px] border border-[#e2ebf3] bg-white px-6 py-6 shadow-[0_12px_30px_rgba(24,53,101,0.05)]">
                    <p className="text-xl font-semibold leading-9 tracking-[-0.03em] text-[#1E3A78]">
                      “I wanted to build a credible bridge between the need to recruit, the reality on the ground and legal certainty.”
                    </p>
                    <footer className="mt-4 text-sm font-semibold text-[#B5121B]">Maître Candice Debruyne</footer>
                  </blockquote>
                </div>
              </div>

              <div className="relative overflow-hidden px-6 py-10 sm:px-8 lg:px-10 lg:py-16">
                <div className="absolute right-[-8%] top-[16%] h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(87,183,175,0.18),rgba(87,183,175,0))]" />
                <div className="absolute left-[12%] top-[8%] h-32 w-32 rounded-full bg-[radial-gradient(circle,rgba(32,78,151,0.12),rgba(32,78,151,0))]" />
                <div className="relative mx-auto max-w-[360px]">
                  <div className="relative mx-auto w-[78%] min-w-[250px] max-w-[300px]">
                    <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-[32px] bg-[linear-gradient(180deg,rgba(32,78,151,0.08),rgba(87,183,175,0.12))]" />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-white shadow-[0_28px_60px_rgba(20,45,88,0.16)]">
                      <Image
                        src="/candice-profile.png"
                        alt="Maître Candice Debruyne"
                        fill
                        priority
                        className="object-cover object-[50%_18%]"
                        sizes="(min-width: 1024px) 300px, 62vw"
                      />
                    </div>
                  </div>

                  <div className="mx-auto mt-8 max-w-[360px] text-center">
                    <p className="text-[1.85rem] font-semibold leading-tight tracking-[-0.03em] text-[#1E3A78]">
                      Maître Candice Debruyne
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[#607086]">
                      Lawyer in economic immigration
                      <br />
                      Founder of LEXPAT Connect
                    </p>
                  </div>

                  <div className="mx-auto mt-8 max-w-[360px] space-y-4 rounded-[24px] border border-[#e6edf5] bg-white/90 p-5 text-sm leading-7 text-[#4f6178] shadow-[0_10px_24px_rgba(20,45,88,0.04)] backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-4 rounded-[18px] bg-[#f7faff] px-4 py-3">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#204E97]">
                        Signature
                      </span>
                      <span className="text-xs font-medium text-[#6f8198]">
                        Economic immigration · Belgium
                      </span>
                    </div>
                    <p className="text-[15px] leading-8 text-[#4f6178]">
                      An approach shaped by field experience: listening to employers, understanding concrete bottlenecks and finally making visible the international workers who can meet those needs.
                    </p>
                    <div className="rounded-[18px] bg-[#f3f7fc] px-4 py-4">
                      <p className="text-[1.05rem] font-semibold leading-8 tracking-[-0.02em] text-[#1E3A78]">
                        Recruit more fairly. Secure things at the right moment. Give trust a real place.
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
        kicker="Field reality"
        title="What legal practice made impossible to ignore"
        intro="Across files and conversations, the same gap kept reappearing: on one side Belgian employers under real pressure, on the other qualified international worker still out of reach."
      >
        <CardGrid items={fieldObservations} columns={3} />
      </Section>

      <Section
        kicker="The turning point"
        title="The problem was not only legal"
        intro="The real turning point was understanding that even before the single permit question, what was missing was a smarter, more readable and more human way for both sides to meet."
        muted
      >
        <div className="mx-auto max-w-4xl rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-8 shadow-[0_14px_36px_rgba(15,23,42,0.04)] sm:p-10">
          <p className="text-lg leading-9 text-[#3c4d63]">
            For too long, employers had to move forward almost blind: recruit, understand regional lists, assess feasibility, and only then look for legal support. At the same time, high-quality international worker remained too often invisible or poorly positioned. The turning point was simple: <strong className="text-[#1E3A78]">create a platform that structures the connection first, and lets legal work step in only at the right moment</strong>.
          </p>
        </div>
      </Section>

      <Section
        kicker="Why the platform"
        title="Why LEXPAT Connect was created"
        intro="LEXPAT Connect was designed as a trust-based tool: smoother for companies, more visible for worker and more consistent with the Belgian reality of international recruitment."
      >
        <CardGrid items={whyPlatform} columns={3} />
      </Section>

      <Section
        kicker="Vision"
        title="The vision behind LEXPAT Connect"
        intro="Over time, the platform aims to become a Belgian reference for international recruitment in shortage occupations: a credible meeting point between economic need, worker visibility and compliance."
        muted
      >
        <Steps items={visionSteps} />
      </Section>

      <Section
        kicker="A Belgian ambition"
        title="Building a project that fits the Belgian field reality"
        intro="LEXPAT Connect does not begin with an abstract theory of recruitment. It is rooted in something very concrete: three regions, distinct rules, companies under pressure and worker that needs to be found more easily."
      >
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[30px] border border-[#e5edf4] bg-white p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <h3 className="text-xl font-semibold tracking-tight text-[#1E3A78]">A trust-based brand</h3>
            <p className="mt-4 text-sm leading-8 text-[#607086]">
              The strength of the project lies in bringing together two dimensions that are rarely combined clearly: a readable matching tool that helps accelerate recruitment, and behind it, a law firm able to secure what needs to be secured. That combination is what can make LEXPAT Connect a durable, credible and genuinely useful brand.
            </p>
          </article>
          <article className="rounded-[30px] border border-[#ead9dc] bg-[linear-gradient(180deg,#ffffff_0%,#fff8f8_100%)] p-7 shadow-[0_14px_36px_rgba(15,23,42,0.05)]">
            <p className="inline-flex rounded-full bg-[#fff0f1] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B5121B]">
              Signature
            </p>
            <p className="mt-4 text-lg font-semibold leading-9 tracking-[-0.02em] text-[#1E3A78]">
              “More than a website: a trusted framework where the right profiles and the right companies can finally find each other.”
            </p>
          </article>
        </div>
      </Section>

      <Section
        kicker="Acknowledgements"
        title="A project carried by more than one person"
        intro="Behind this platform there are also essential supports, demanding perspectives and shared energy without which this vision could never have taken shape."
        muted
      >
        <div className="mx-auto max-w-5xl rounded-[34px] border border-[#e5edf4] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbfd_100%)] p-8 shadow-[0_14px_36px_rgba(15,23,42,0.05)] sm:p-10">
          <ul className="space-y-5 text-base leading-8 text-[#4f6178] sm:text-lg">
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#B5121B]" />
              <span>
                I first want to thank <strong className="text-[#1E3A78]">Etienne</strong>, my mentor and my partner, who planted the seed of this project in my mind and gave me the courage to believe in it fully.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#204E97]" />
              <span>
                I deeply thank <strong className="text-[#1E3A78]">Maître Zahra Yakoubi Kichaoui</strong>, whose precious support was decisive, and without whom this platform would not have come to life.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="mt-2 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#57B7AF]" />
              <span>
                I also want to thank <strong className="text-[#1E3A78]">Margaux Le Guellec</strong>, who supported me with rigor, enthusiasm and determination as this project, which I had been dreaming of for more than five years, finally came to life.
              </span>
            </li>
          </ul>
        </div>
      </Section>

      <CtaBanner
        title="Discover LEXPAT Connect or speak directly with Maître Candice Debruyne"
        text="Whether you want to understand how LEXPAT Connect works or discuss a concrete international recruitment need, you can continue exploring the platform or contact the law firm directly."
        primaryHref="/en"
        primaryLabel="Discover LEXPAT Connect"
        secondaryHref="/en/contact"
        secondaryLabel="Contact Maître Candice Debruyne"
      />
    </>
  );
}
