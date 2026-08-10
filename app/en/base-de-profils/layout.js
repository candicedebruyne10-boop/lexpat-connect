import { alternatesFor } from "../../../lib/seo-alternates";

export const metadata = {
  title:
    "Available international worker profiles in Belgium | LEXPAT Connect",
  description:
    "Browse qualified international worker profiles available for shortage occupations in Belgium. Sector, region and experience are openly visible \u2014 contact details stay protected until introduction.",
  alternates: alternatesFor("/en/base-de-profils"),
};

export default function BaseDeProfilsLayoutEn({ children }) {
  return children;
}
