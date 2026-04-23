import EmployeurWizard from "../../../../components/EmployeurWizard";

export const metadata = {
  title: "Post a hiring need | LEXPAT Connect",
  description: "Submit your international recruitment need in a few simple steps.",
  robots: { index: false },
};

// ── Point 9 : micro-copy reassurance before the wizard
export default function RejoindreEmployeurPageEn() {
  return (
    <>
      <div className="border-b border-[#e5edf5] bg-[linear-gradient(180deg,#f8fbff_0%,#f0f7ff_100%)]">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              { icon: "⏱", text: "~3 minutes" },
              { icon: "🔒", text: "Confidential" },
              { icon: "✓", text: "No commitment" },
              { icon: "€", text: "Free" },
            ].map(({ icon, text }) => (
              <span key={text} className="flex items-center gap-1.5 text-sm font-semibold text-[#4a6b99]">
                <span className="text-[#57b7af]">{icon}</span>
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      <EmployeurWizard />
    </>
  );
}
