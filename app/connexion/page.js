import AuthForm from '../../components/AuthForm';
import { Section } from '../../components/Sections';

export const metadata = {
  title: 'Connexion | LEXPAT Connect',
  description: 'Connectez-vous à votre espace travailleur ou employeur sur LEXPAT Connect.'
};

export default function ConnexionPage() {
  return (
    <Section
      title="Connexion"
      intro="Accédez à votre espace pour retrouver votre profil, vos offres et vos informations enregistrées."
      kicker="Compte"
    >
      <AuthForm mode="login" />
    </Section>
  );
}
