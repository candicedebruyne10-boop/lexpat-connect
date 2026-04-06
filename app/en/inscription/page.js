import AuthForm from '../../../components/AuthForm';
import { Section } from '../../../components/Sections';

export const metadata = {
  title: 'Create an account | LEXPAT Connect',
  description: 'Create a worker or employer account on LEXPAT Connect.'
};

export default function InscriptionPageEn() {
  return (
    <Section
      title="Create an account"
      intro="Create your access to start structuring your candidate profile or your employer space."
      kicker="Account"
    >
      <AuthForm mode="signup" locale="en" />
    </Section>
  );
}
