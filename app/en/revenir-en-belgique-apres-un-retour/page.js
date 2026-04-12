import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Redirect | LEXPAT Connect",
  robots: {
    index: false,
    follow: false
  }
};

export default function ReturnGuaranteesAliasPageEn() {
  permanentRedirect("/en/returning-to-belgium-after-leaving");
}
