import Script from 'next/script';

export function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Mantlz Documentation',
    description: 'Complete documentation for Mantlz - The ultimate form solution platform for building customizable feedback, contact, and waitlist forms.',
    url: 'https://doc.mantlz.com/',
    publisher: {
      '@type': 'Organization',
      name: 'Mantlz',
      url: 'https://mantlz.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://doc.mantlz.com/logo.png'
      }
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://doc.mantlz.com//search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: 'Mantlz',
      applicationCategory: 'DeveloperApplication',
      description: 'The ultimate form solution platform for building customizable feedback, contact, and waitlist forms with powerful styling options and seamless integrations.',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      author: {
        '@type': 'Organization',
        name: 'Mantlz Team'
      }
    }
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}

export function DocumentationStructuredData({ title, description, url }: {
  title: string;
  description: string;
  url: string;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: title,
    description: description,
    url: url,
    author: {
      '@type': 'Organization',
      name: 'Mantlz Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Mantlz',
      logo: {
        '@type': 'ImageObject',
        url: 'https://doc.mantlz.com/logo.png'
      }
    },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return (
    <Script
      id={`structured-data-${title.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}