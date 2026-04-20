import AuthForm from '../../components/AuthForm';
import { Section } from '../../components/Sections';

export const metadata = {
  title: 'Inscription | LEXPAT Connect',
  description: 'Créez un compte travailleur ou employeur sur LEXPAT Connect.',
  robots: { index: false, follow: false },
};

export default function InscriptionPage() {
  return (
    <Section
      title="Inscription"
      intro="Créez votre accès pour commencer à structurer votre profil candidat ou votre espace employeur."
      kicker="Compte"
    >
      <AuthForm mode="signup" />
    </Section>
  );
}
