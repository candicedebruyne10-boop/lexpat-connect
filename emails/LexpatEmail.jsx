/**
 * LexpatEmail — composant de base pour tous les emails LEXPAT Connect
 *
 * Utilisation :
 *   import { LexpatEmail } from './LexpatEmail';
 *
 *   <LexpatEmail title="Sujet" preheader="Texte prévisualisation">
 *     {votre contenu ici}
 *   </LexpatEmail>
 */

import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Img,
  Text,
  Link,
  Hr,
} from '@react-email/components';

const BASE_URL = 'https://lexpat-connect.be';
const CONTACT_EMAIL = 'contact@lexpat-connect.be';

// ─── Styles partagés ───────────────────────────────────────────────────────

const styles = {
  body: {
    margin: 0,
    padding: 0,
    backgroundColor: '#eef2f8',
    fontFamily: "'Open Sans', Arial, Helvetica, sans-serif",
  },
  outer: {
    backgroundColor: '#eef2f8',
    padding: '40px 16px',
  },
  card: {
    maxWidth: '620px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 8px 40px rgba(30,58,120,0.12)',
    margin: '0 auto',
  },

  // Header
  headerCell: {
    background: 'linear-gradient(135deg,#1a3368 0%,#1E3A78 60%,#22508f 100%)',
    padding: '20px 40px',
  },
  logoWrap: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    display: 'inline-block',
    lineHeight: 0,
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
  },
  logoImg: {
    display: 'block',
    borderRadius: '50%',
    width: '72px',
    height: '72px',
    objectFit: 'cover',
  },
  brandName: {
    display: 'block',
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    fontSize: '26px',
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '-0.5px',
    lineHeight: '1.1',
    margin: 0,
  },
  brandSub: {
    display: 'block',
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    fontSize: '13px',
    fontWeight: 700,
    color: '#57B7AF',
    letterSpacing: '4px',
    marginTop: '2px',
  },
  siteUrl: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: '0.5px',
  },

  // Accent bar
  accentBar: {
    background: 'linear-gradient(90deg,#57B7AF,#3da89f)',
    height: '4px',
    fontSize: 0,
    lineHeight: 0,
  },

  // Body
  bodyCell: {
    padding: '40px 48px 32px',
  },

  // Footer
  footerCell: {
    backgroundColor: '#f5f8fc',
    borderTop: '1px solid #e2eaf3',
    padding: '24px 48px 28px',
  },
  footerLogoWrap: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#e8edf5',
    display: 'inline-block',
    lineHeight: 0,
  },
  footerLogoImg: {
    display: 'block',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    objectFit: 'cover',
  },
  footerTeamName: {
    margin: '0 0 2px',
    fontFamily: "'Montserrat', Arial, Helvetica, sans-serif",
    fontSize: '13px',
    fontWeight: 800,
    color: '#1E3A78',
    letterSpacing: '-0.2px',
  },
  footerTagline: {
    margin: 0,
    fontSize: '11px',
    color: '#8a9db8',
    lineHeight: '1.5',
  },
  footerNote: {
    margin: '16px 0 0',
    fontSize: '11px',
    color: '#9aafca',
    lineHeight: '1.8',
  },
};

// ─── Composant de base ─────────────────────────────────────────────────────

export function LexpatEmail({ title, preheader, children, unsubscribeUrl }) {
  return (
    <Html lang="fr" dir="ltr">
      <Head>
        <title>{title}</title>
      </Head>
      {preheader && <Preview>{preheader}</Preview>}
      <Body style={styles.body}>
        <Section style={styles.outer}>
          <Container style={styles.card}>

            {/* ── HEADER ── */}
            <Section>
              <Row>
                <Column style={styles.headerCell}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        {/* Logo + nom */}
                        <td style={{ verticalAlign: 'middle' }}>
                          <table cellPadding={0} cellSpacing={0}>
                            <tbody>
                              <tr>
                                <td style={{ paddingRight: '16px', verticalAlign: 'middle' }}>
                                  <div style={styles.logoWrap}>
                                    <Img
                                      src={`${BASE_URL}/logo-lexpat-connect.png`}
                                      alt="LEXPAT Connect"
                                      width={72}
                                      height={72}
                                      style={styles.logoImg}
                                    />
                                  </div>
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                  <span style={styles.brandName}>LEXPAT</span>
                                  <span style={styles.brandSub}>CONNECT</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                        {/* URL site */}
                        <td align="right" style={{ verticalAlign: 'bottom' }}>
                          <span style={styles.siteUrl}>www.lexpat-connect.be</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Column>
              </Row>
            </Section>

            {/* ── BARRE ACCENT ── */}
            <Section style={styles.accentBar}>&nbsp;</Section>

            {/* ── CORPS ── */}
            <Section>
              <Row>
                <Column style={styles.bodyCell}>
                  {children}
                </Column>
              </Row>
            </Section>

            {/* ── FOOTER ── */}
            <Section>
              <Row>
                <Column style={styles.footerCell}>
                  <table width="100%" cellPadding={0} cellSpacing={0}>
                    <tbody>
                      <tr>
                        <td style={{ width: '52px', verticalAlign: 'middle', paddingRight: '14px' }}>
                          <div style={styles.footerLogoWrap}>
                            <Img
                              src={`${BASE_URL}/logo-lexpat-connect.png`}
                              alt="LEXPAT Connect"
                              width={48}
                              height={48}
                              style={styles.footerLogoImg}
                            />
                          </div>
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <Text style={styles.footerTeamName}>L'équipe LEXPAT Connect</Text>
                          <Text style={styles.footerTagline}>
                            Plateforme belge de matching, immigration et recrutement
                          </Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <Text style={styles.footerNote}>
                    Cet email a été envoyé automatiquement depuis{' '}
                    <strong style={{ color: '#6d88a8' }}>LEXPAT Connect</strong>.<br />
                    Pour toute question :{' '}
                    <Link href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#57B7AF', textDecoration: 'none' }}>
                      {CONTACT_EMAIL}
                    </Link>{' '}
                    —{' '}
                    <Link href={BASE_URL} style={{ color: '#57B7AF', textDecoration: 'none' }}>
                      lexpat-connect.be
                    </Link>
                  </Text>

                  {unsubscribeUrl && (
                    <Text style={{ margin: '8px 0 0', fontSize: '10px', color: '#b8c8da', lineHeight: '1.6', borderTop: '1px solid #e2eaf3', paddingTop: '12px' }}>
                      🔒 <strong>RGPD</strong> — Vous recevez cet email car vous êtes inscrit sur LEXPAT Connect.{' '}
                      <Link href={unsubscribeUrl} style={{ color: '#9aafca', textDecoration: 'underline' }}>
                        Me désinscrire de ces notifications
                      </Link>.
                    </Text>
                  )}
                </Column>
              </Row>
            </Section>

          </Container>
        </Section>
      </Body>
    </Html>
  );
}

// ─── Composants utilitaires réutilisables ─────────────────────────────────

export function EmailTitle({ children }) {
  return (
    <Text style={{
      margin: '0 0 20px',
      fontSize: '20px',
      fontWeight: 800,
      color: '#1E3A78',
      letterSpacing: '-0.3px',
      lineHeight: '1.3',
    }}>
      {children}
    </Text>
  );
}

export function EmailParagraph({ children, style }) {
  return (
    <Text style={{
      margin: '0 0 16px',
      fontSize: '14px',
      lineHeight: '1.7',
      color: '#3d5066',
      ...style,
    }}>
      {children}
    </Text>
  );
}

export function EmailButton({ href, children }) {
  return (
    <table cellPadding={0} cellSpacing={0} style={{ margin: '24px 0' }}>
      <tbody>
        <tr>
          <td style={{
            background: 'linear-gradient(135deg,#1E3A78 0%,#204E97 100%)',
            borderRadius: '10px',
          }}>
            <Link
              href={href}
              style={{
                display: 'inline-block',
                padding: '14px 28px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
              }}
            >
              {children}
            </Link>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function EmailDivider() {
  return <Hr style={{ border: 'none', borderTop: '1px solid #e4edf4', margin: '24px 0' }} />;
}

export function EmailLinkBox({ href }) {
  return (
    <div style={{
      margin: '0 0 18px',
      padding: '16px 18px',
      border: '1px solid #e4edf4',
      borderRadius: '14px',
      backgroundColor: '#f8fbff',
    }}>
      <Text style={{ margin: 0, fontSize: '13px', lineHeight: '1.8', color: '#1E3A78', wordBreak: 'break-all' }}>
        {href}
      </Text>
    </div>
  );
}
