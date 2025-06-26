# Metadata Implementation Guide

This document outlines the comprehensive metadata implementation for Mantlz, including Twitter Cards, Open Graph, and SEO meta tags.

## Current Implementation

The metadata system is built using Next.js 13+ App Router metadata API with the following structure:

### Core Files
- `src/config/metadata.ts` - Base metadata configurations
- `src/types/seo.ts` - TypeScript types and helper functions
- `src/app/layout.tsx` - Root layout with global metadata
- Individual page layouts with specific metadata

## Meta Tags Generated

### Basic SEO Meta Tags
```html
<title>Mantlz - Professional Form Builder Platform</title>
<meta name="description" content="Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly." />
<meta name="keywords" content="form builder,custom forms,online forms,form creation,business forms,form analytics,form management,form templates,survey builder,data collection" />
<meta name="author" content="Mantlz Team" />
<meta name="creator" content="Mantlz" />
<meta name="publisher" content="Mantlz" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="https://mantlz.app" />
```

### Open Graph Meta Tags
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://mantlz.app" />
<meta property="og:title" content="Mantlz - Professional Form Builder Platform" />
<meta property="og:description" content="Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly." />
<meta property="og:site_name" content="Mantlz" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://mantlz.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Mantlz - Form Builder Platform" />
```

### Twitter Card Meta Tags
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@trymantlz" />
<meta name="twitter:creator" content="@trymantlz" />
<meta name="twitter:title" content="Mantlz - Professional Form Builder Platform" />
<meta name="twitter:description" content="Create powerful, customizable forms with Mantlz. The ultimate form builder platform for businesses and developers. Build, deploy, and analyze forms effortlessly." />
<meta name="twitter:image" content="https://mantlz.app/twitter.png" />
```

### Additional Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta name="google-site-verification" content="lTqIuvXz5sq4jT9YOLyja5LLMfvKAiZF3g5fTEa70fI" />
<link rel="icon" href="/favicon.ico" />
```

## Image Requirements

### Twitter Image (`/public/twitter.png`)
- **Size**: Optimized for Twitter cards
- **Format**: PNG, JPG, WEBP, or GIF supported
- **Max Size**: Less than 5 MB
- **Dimensions**: Recommended 1200x630px for summary_large_image
- **Note**: SVG is not supported by Twitter

### Open Graph Image (`/public/og-image.png`)
- **Size**: 1200x630px (recommended)
- **Format**: PNG, JPG, WEBP
- **Purpose**: Used for link previews on social platforms
- **Fallback**: Twitter uses og:image if twitter:image is not provided

## Page-Specific Metadata

Different pages have customized metadata:

### Landing Page
- Enhanced descriptions for marketing
- Specific keywords for SEO
- Custom titles for better conversion

### Dashboard Pages
- `robots: noindex, nofollow` for private content
- Simplified descriptions
- User-focused titles

### Public Pages (Privacy, Terms, Pricing)
- SEO-optimized for discoverability
- Specific descriptions for each page
- Proper canonical URLs

## Fallback Strategy

1. **Twitter Cards**: Falls back to Open Graph tags if Twitter-specific tags are missing
2. **Open Graph**: Uses base metadata if page-specific OG tags are not defined
3. **Titles**: Uses template system with fallback to default title
4. **Descriptions**: Page-specific descriptions with fallback to base description

## Validation

To validate the implementation:

1. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
2. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Google Rich Results Test**: https://search.google.com/test/rich-results

## Best Practices Implemented

✅ **Twitter Card Requirements Met**:
- `summary_large_image` card type for better visual appeal
- Proper image dimensions and format
- Character limits respected (70 chars for title, 200 for description)
- Creator and site attribution

✅ **Open Graph Standards**:
- All required properties included
- Proper image specifications
- Canonical URL structure
- Locale specification

✅ **SEO Optimization**:
- Structured title templates
- Keyword optimization
- Meta descriptions under 160 characters
- Proper robots directives

✅ **Performance**:
- Images optimized for web
- Proper caching headers
- CDN-ready image URLs

## Configuration

The system is configured through environment variables:
- `NEXT_PUBLIC_APP_URL`: Base URL for the application
- Metadata is automatically generated based on this URL

All metadata configurations support both development and production environments with proper fallbacks.