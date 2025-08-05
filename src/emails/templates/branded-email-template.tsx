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
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100% !important;
                padding: 10px !important;
              }
            }
          `}
        </style>
      </Head>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Text style={styles.brandName}>mantlz</Text>
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
    padding: '20px',
    margin: 0,
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
  },
  header: {
    padding: '40px 0 20px',
    textAlign: 'center' as const,
  },
  brandName: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#000000',
    margin: '0',
  },
  content: {
    padding: '20px 0',
    lineHeight: '1.6',
  },
  divider: {
    borderTop: '1px solid #e5e5e5',
    margin: '30px 0 20px 0',
  },
  footer: {
    textAlign: 'center' as const,
    paddingBottom: '20px',
  },
  footerText: {
    fontSize: '14px',
    color: '#666666',
    margin: '8px 0',
    lineHeight: '1.4',
  },
  link: {
    color: '#000000',
    textDecoration: 'underline',
  },
};