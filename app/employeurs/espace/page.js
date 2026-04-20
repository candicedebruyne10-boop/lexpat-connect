import EmployerSpace from '../../../components/EmployerSpace';

export const metadata = {
  title: 'Espace employeur | LEXPAT Connect',
  description: 'Un espace employeur inspiré des usages de plateforme, pour structurer les besoins de recrutement et le suivi des offres.',
  robots: { index: false, follow: false },
};

export default function EspaceEmployeurPage() {
  return <EmployerSpace locale="fr" />;
}
