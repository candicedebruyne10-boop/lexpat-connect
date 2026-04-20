import MessagerieApp from "../../../components/Messagerie";

export const metadata = {
  title: "Messaging — LEXPAT Connect",
  description:
    "Your conversations with your matches. Once mutual interest is confirmed, employers and workers can exchange directly.",
  robots: { index: false, follow: false },
};

export default function MessagingPage() {
  return <MessagerieApp locale="en" />;
}
