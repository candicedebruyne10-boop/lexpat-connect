import AuthForm from '../../../components/AuthForm';
import { Section } from '../../../components/Sections';

export const metadata = {
  title: 'Sign in | LEXPAT Connect',
  description: 'Sign in to your worker or employer space on LEXPAT Connect.',
  robots: { index: false, follow: false },
};

export default function ConnexionPageEn() {
  return (
    <Section
      title="Sign in"
      intro="Access your space to find your profile, your job offers and your saved information."
      kicker="Account"
    >
      <AuthForm mode="login" locale="en" />
    </Section>
  );
}
