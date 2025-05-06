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
} from '@react-email/components';
import Image from 'next/image';

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
            @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
              margin: 0;
              padding: 0;
              width: 100% !important;
              -webkit-font-smoothing: antialiased;
            }
            .previewText {
              display: none !important;
              max-height: 0;
              overflow: hidden;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .footer {
              margin-top: 32px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              text-align: center;
              font-size: 12px;
              color: #718096;
            }
            .footer a {
              color: #718096;
              text-decoration: underline;
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
          {/* Simple header with pixel-inspired border */}
          <div style={styles.pixelBorder}></div>
          
          <Section style={styles.header}>
            <Text style={styles.brandName}>mantlz</Text>
          </Section>
          
          {/* Main Content */}
          <Section style={styles.content}>
            {/* Content */}
            {children}
          </Section>
          
          {/* Footer */}
          <Section style={styles.footer}>
            <Hr style={styles.divider} />
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Mantlz • All rights reserved
            </Text>
            <Text style={styles.footerText}>
              <Link href={clickTrackingUrl ? `${clickTrackingUrl}&url=mailto:contact@mantlz.app` : "mailto:contact@mantlz.app"} style={styles.link}>contact@mantlz.app</Link>
            </Text>
            <Text style={styles.footerText}>
              {unsubscribeUrl && (
                <>
                  <br />
                  <Link href={unsubscribeUrl} style={styles.link}>Unsubscribe</Link>
                </>
              )}
            </Text>
          </Section>
          
          {/* Simple footer pixel border */}
          <div style={styles.pixelBorder}></div>
          
          {/* Tracking Pixel */}
          {trackingPixelUrl && (
            <Image
              src={trackingPixelUrl} 
              width="1" 
              height="1" 
              style={{ display: 'none' }} 
              alt=""
            />
          )}
          
          {/* Click Tracking Pixel */}
          {clickTrackingUrl && (
            <Image
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

// Simple Modern Styles with Subtle Retro Elements
const styles = {
  body: {
    backgroundColor: '#f2f2f2',
    fontFamily: 'Inter, Helvetica, Arial, sans-serif',
    padding: '40px 10px',
    margin: 0,
  },
  container: {
    maxWidth: '550px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  pixelBorder: {
    height: '4px',
    width: '100%',
    backgroundImage: 'linear-gradient(to right, #000 25%, transparent 25%), linear-gradient(to right, #000 25%, transparent 25%)',
    backgroundPosition: '0 0, 4px 0',
    backgroundSize: '8px 4px',
    backgroundRepeat: 'repeat-x',
  },
  header: {
    padding: '30px 0',
    textAlign: 'center' as const,
    backgroundColor: '#ffffff',
  },
  brandName: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'lowercase' as const,
    color: '#000000',
    margin: '0',
  },
  content: {
    padding: '10px 30px 40px',
    position: 'relative' as const,
    backgroundColor: '#ffffff',
  },
  watermark: {
    position: 'absolute' as const,
    bottom: '5px',
    right: '10px',
    fontSize: '12px',
    fontFamily: '"IBM Plex Mono", monospace',
    color: '#e0e0e0',
    textTransform: 'lowercase' as const,
    letterSpacing: '1px',
  },
  divider: {
    borderTop: '1px solid #eaeaea',
    margin: '0 0 15px 0',
  },
  footer: {
    padding: '0 30px 30px',
  },
  footerText: {
    fontFamily: '"IBM Plex Mono", monospace',
    fontSize: '12px',
    color: '#666666',
    margin: '5px 0',
    textAlign: 'center' as const,
  },
  link: {
    color: '#000000',
    textDecoration: 'none',
    borderBottom: '1px solid #dddddd',
  },
}; 