import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Redirect | LEXPAT Connect",
  robots: {
    index: false,
    follow: false
  }
};

export default function ReturningToBelgiumAliasFr() {
  permanentRedirect("/revenir-en-belgique-apres-un-retour");
}
