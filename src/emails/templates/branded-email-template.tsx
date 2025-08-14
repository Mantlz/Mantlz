import React from 'react';
import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Text,
  Hr,
  Link,
  Img,
} from '@react-email/components';

export interface BrandedEmailTemplateProps {
  children: React.ReactNode;
  previewText: string;
  trackingPixelUrl?: string;
  clickTrackingUrl?: string;
  unsubscribeUrl?: string;
}

export function BrandedEmailTemplate({
  children,
  previewText,
  trackingPixelUrl,
  clickTrackingUrl,
  unsubscribeUrl
}: BrandedEmailTemplateProps) {
  return (
    <Html>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <title>{previewText}</title>
        <style>
          {`
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              margin: 0;
              padding: 0;
              width: 100% !important;
              -webkit-font-smoothing: antialiased;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            }
            h1, h2, h3, h4, h5, h6 {
              color: #0f172a;
              font-weight: 600;
              line-height: 1.4;
              margin: 0 0 20px 0;
              letter-spacing: -0.025em;
            }
            h1 { font-size: 32px; font-weight: 700; }
            h2 { font-size: 26px; }
            h3 { font-size: 22px; }
            p {
              color: #475569;
              font-size: 16px;
              line-height: 1.7;
              margin: 0 0 18px 0;
            }
            a {
              color: #3b82f6;
              text-decoration: none;
              transition: color 0.2s ease;
            }
            a:hover {
              color: #1d4ed8;
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              padding: 14px 28px;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
              transition: all 0.2s ease;
            }
            .button:hover {
              background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
              box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
              text-decoration: none;
              transform: translateY(-1px);
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 16px !important;
                margin: 16px !important;
              }
              h1 { font-size: 28px; }
              h2 { font-size: 22px; }
              h3 { font-size: 20px; }
              p { font-size: 15px; }
              .button { padding: 12px 24px; font-size: 15px; }
            }
          `}
        </style>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Img
              src="https://ucarecdn.com/041a2a46-c97e-407a-a549-df40a13cac16/-/preview/500x500/"
              alt="Manltz Logo"
              width="48"
              height="48"
              style={styles.logo}
            />
          </Section>
          
          <Section style={styles.content}>
            {children}
          </Section>
          
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Mantlz
            </Text>
            <Text style={styles.footerText}>
              <Link href={clickTrackingUrl ? `${clickTrackingUrl}&url=mailto:contact@mantlz.com` : "mailto:contact@mantlz.com"} style={styles.link}>contact@mantlz.com</Link>
            </Text>
            {unsubscribeUrl && (
              <Text style={styles.footerText}>
                <Link href={unsubscribeUrl} style={styles.link}>Unsubscribe</Link>
              </Text>
            )}
          </Section>
          
          {/* Tracking Pixel */}
          {trackingPixelUrl && (
            <Img
              src={trackingPixelUrl} 
              width="1" 
              height="1" 
              style={{ display: 'none' }} 
              alt=""
            />
          )}
          
          {/* Click Tracking Pixel */}
          {clickTrackingUrl && (
            <Img
              src={clickTrackingUrl}
              width="1"
              height="1"
              style={{ display: "none" }}
              alt=""
            />
          )}
        </Container>
      </Body>
    </Html>
  );
}

// Simple Clean Styles
const styles = {
  body: {
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    margin: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.04)',
    overflow: 'hidden',
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  header: {
    padding: '40px 40px 32px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #e2e8f0',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  },
  logo: {
    display: 'block',
    margin: '0 auto',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  content: {
    padding: '40px 40px',
    lineHeight: '1.7',
    color: '#475569',
    backgroundColor: '#ffffff',
  },
  divider: {
    borderTop: '1px solid #e2e8f0',
    margin: '32px 0 24px 0',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '32px 40px 40px',
    background: '#ffffff',
    borderTop: '1px solid #e2e8f0',
  },
  footerText: {
    fontSize: '14px',
    color: '#64748b',
    margin: '8px 0',
    lineHeight: '1.6',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'none',
  },
};