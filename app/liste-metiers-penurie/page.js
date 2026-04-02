import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Redirection | LEXPAT Connect",
  robots: {
    index: false,
    follow: false
  }
};

export default function ListeMetiersPenurieRedirectPage() {
  permanentRedirect("/metiers-en-penurie");
}
