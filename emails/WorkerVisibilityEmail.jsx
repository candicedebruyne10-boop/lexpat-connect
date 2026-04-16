/**
 * WorkerVisibilityEmail
 *
 * Email envoyé aux travailleurs dont le profil est masqué
 * pour les encourager à le compléter et le rendre visible.
 *
 * Utilisation avec Resend :
 *   import { render } from '@react-email/render';
 *   import { WorkerVisibilityEmail } from '../../emails/WorkerVisibilityEmail';
 *
 *   await resend.emails.send({
 *     from: 'contact@lexpat-connect.be',
 *     to: email,
 *     subject: 'Rendez votre profil visible avant lundi',
 *     react: <WorkerVisibilityEmail
 *               recipientName="Jean"
 *               profileUrl="https://lexpat-connect.be/travailleurs/espace"
 *               referralUrl="https://lexpat-connect.be/inscription?ref=LP-XXXXXX"
 *               reminder={false}
 *             />,
 *   });
 */

import {
  LexpatEmail,
  EmailTitle,
  EmailParagraph,
  EmailButton,
  EmailDivider,
  EmailLinkBox,
} from './LexpatEmail.jsx';

export function WorkerVisibilityEmail({
  recipientName = '',
  profileUrl = 'https://lexpat-connect.be/travailleurs/espace',
  referralUrl = '',
  recipientEmail = '',
  reminder = false,
}) {
  const greeting = recipientName ? `Bonjour ${recipientName},` : 'Bonjour,';
  const subject = reminder
    ? 'Rappel : rendez votre profil visible avant lundi'
    : 'Rendez votre profil visible avant lundi';

  return (
    <LexpatEmail
      title={subject}
      preheader="Les profils visibles seront mis en avant en priorité auprès des premiers employeurs pilotes."
      unsubscribeUrl={recipientEmail ? `https://lexpat-connect.be/api/unsubscribe?email=${encodeURIComponent(recipientEmail)}` : undefined}
    >
      <EmailTitle>
        {reminder
          ? 'Rappel — une dernière étape pour rendre votre profil visible'
          : 'Rendez votre profil visible avant lundi'}
      </EmailTitle>

      <EmailParagraph>{greeting}</EmailParagraph>

      <EmailParagraph>
        Merci pour votre inscription. Merci aussi pour votre confiance.
      </EmailParagraph>

      <EmailParagraph>
        Vous faites partie des premiers talents de notre communauté sur{' '}
        <strong>LEXPAT Connect</strong>.
      </EmailParagraph>

      <EmailParagraph>
        Votre compte est bien créé, mais votre profil n'est pas encore visible.
      </EmailParagraph>

      <EmailParagraph>
        Pour faire partie de la première sélection, merci de compléter votre profil
        et de le rendre visible <strong>avant lundi</strong>.
      </EmailParagraph>

      <EmailButton href={profileUrl}>
        Compléter et rendre visible mon profil
      </EmailButton>

      <EmailDivider />

      <EmailTitle>Votre lien personnel de référencement</EmailTitle>

      <EmailParagraph>
        Vous pouvez aussi partager votre lien personnel de référencement
        à 3 contacts qualifiés de votre domaine :
      </EmailParagraph>

      {referralUrl && <EmailLinkBox href={referralUrl} />}

      <EmailParagraph>
        Si 3 personnes qualifiées s'inscrivent via votre lien, votre profil
        sera mis en avant en priorité.
      </EmailParagraph>

      <EmailParagraph>
        Merci de faire partie de la communauté LEXPAT Connect.
      </EmailParagraph>
    </LexpatEmail>
  );
}

// Export par défaut pour la prévisualisation react-email
export default function WorkerVisibilityEmailPreview() {
  return (
    <WorkerVisibilityEmail
      recipientName="Marie"
      profileUrl="https://lexpat-connect.be/travailleurs/espace"
      referralUrl="https://lexpat-connect.be/inscription?ref=LP-AB3X7Z"
      recipientEmail="marie@exemple.be"
      reminder={false}
    />
  );
}
