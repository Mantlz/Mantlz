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
              background-color: #ffffff;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #1f2937;
              font-weight: 600;
              line-height: 1.3;
              margin: 0 0 16px 0;
            }
            h1 { font-size: 28px; }
            h2 { font-size: 24px; }
            h3 { font-size: 20px; }
            p {
              color: #374151;
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 16px 0;
            }
            a {
              color: #1f2937;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #1f2937;
              color: #ffffff !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 500;
              font-size: 16px;
              margin: 16px 0;
            }
            .button:hover {
              background-color: #374151;
              text-decoration: none;
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px !important;
              }
              h1 { font-size: 24px; }
              h2 { font-size: 20px; }
              h3 { font-size: 18px; }
              p { font-size: 15px; }
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
            <Hr style={styles.divider} />
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
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '40px 20px',
    margin: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  header: {
    padding: '32px 40px 24px',
    textAlign: 'center' as const,
    borderBottom: '1px solid #f1f3f4',
    backgroundColor: '#ffffff',
  },
  logo: {
    display: 'block',
    margin: '0 auto 12px auto',
  },
  brandName: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    margin: '0',
    letterSpacing: '-0.5px',
  },
  content: {
    padding: '32px 40px',
    lineHeight: '1.6',
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  divider: {
    borderTop: '1px solid #e5e7eb',
    margin: '32px 0 24px 0',
  },
  footer: {
    textAlign: 'center' as const,
    padding: '24px 40px 32px',
    backgroundColor: '#ffffff',
  },
  footerText: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '6px 0',
    lineHeight: '1.5',
  },
  link: {
    color: '#374151',
    textDecoration: 'none',
  },
};