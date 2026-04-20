import WorkerSpace from '../../../components/WorkerSpace';

export const metadata = {
  title: 'Espace travailleur | LEXPAT Connect',
  description: 'Un espace candidat inspiré des usages de plateforme, pour structurer le profil et le CV des travailleurs internationaux.',
  robots: { index: false, follow: false },
};

export default function EspaceTravailleurPage() {
  return <WorkerSpace locale="fr" />;
}
