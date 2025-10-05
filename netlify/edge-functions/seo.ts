import type { Context } from "https://edge.netlify.com";

interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
}

const seoConfigs: Record<string, SEOConfig> = {
  '/': {
    title: 'Cloud Based Network Calculator - Professional IP & Subnet Tools',
    description: 'Professional cloud-based networking calculator for subnet planning, IP allocation, multi-cloud cost estimation, and security optimization. Advanced tools for network engineers and infrastructure professionals.',
    keywords: 'subnet calculator, IP allocation, cloud networking, network planning, CIDR calculator, cloud cost estimation, AWS networking, Azure networking, GCP networking, network security',
    ogTitle: 'Cloud Based Network Calculator - Professional Networking Tools',
    ogDescription: 'Advanced subnet calculator, IP allocation planner, and multi-cloud cost estimation tools for network engineers and cloud architects.',
    twitterTitle: 'Cloud Based Network Calculator - Pro Tools',
    twitterDescription: 'Professional networking tools for subnet calculation, IP planning, and cloud cost estimation. Used by network engineers worldwide.'
  },
  '/calculator': {
    title: 'Network Calculator Tools - Subnet & IP Allocation Calculator',
    description: 'Advanced network calculator with subnet calculation, IP allocation planning, and multi-cloud cost estimation. Professional tools for network engineers.',
    keywords: 'network calculator, subnet calculator, IP calculator, CIDR calculator, VLSM calculator, network planning tools',
    ogTitle: 'Advanced Network Calculator Tools',
    ogDescription: 'Professional subnet calculator and IP allocation tools for network engineers and cloud architects.',
    twitterTitle: 'Network Calculator Tools',
    twitterDescription: 'Advanced subnet and IP allocation calculator tools for professional network planning.'
  },
  '/how-to-use': {
    title: 'How to Use Network Calculator - Tutorial & Guide',
    description: 'Learn how to use our professional network calculator tools for subnet calculation, IP allocation, and cloud cost estimation. Step-by-step tutorials.',
    keywords: 'network calculator tutorial, subnet calculator guide, IP allocation tutorial, cloud networking guide',
    ogTitle: 'Network Calculator Tutorial & Guide',
    ogDescription: 'Complete guide on using professional network calculator tools for subnet planning and IP allocation.',
    twitterTitle: 'Network Calculator Tutorial',
    twitterDescription: 'Learn to use professional network calculation tools with our comprehensive guide.'
  },
  '/faq': {
    title: 'Network Calculator FAQ - Common Questions & Answers',
    description: 'Frequently asked questions about subnet calculation, IP allocation, cloud networking, and professional network planning tools.',
    keywords: 'network calculator FAQ, subnet calculator questions, IP allocation help, cloud networking FAQ',
    ogTitle: 'Network Calculator FAQ & Help',
    ogDescription: 'Get answers to common questions about subnet calculation, IP allocation, and cloud networking tools.',
    twitterTitle: 'Network Calculator FAQ',
    twitterDescription: 'Common questions and answers about professional network calculation tools.'
  }
};

const generateStructuredData = (path: string, seoConfig: SEOConfig) => {
  const baseUrl = 'https://cloudbasednetworkingsolutions.com';
  
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Cloud Based Network Calculator",
    "description": seoConfig.description,
    "url": `${baseUrl}${path}`,
    "applicationCategory": "NetworkingApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };
};

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Get SEO config for the current path, fallback to home
  const seoConfig = seoConfigs[path] || seoConfigs['/'];
  const baseUrl = 'https://cloudbasednetworkingsolutions.com';
  
  // Fetch the original HTML
  const response = await context.next();
  const html = await response.text();
  
  // Generate enhanced meta tags
  const metaTags = `
    <title>${seoConfig.title}</title>
    <meta name="description" content="${seoConfig.description}">
    <meta name="keywords" content="${seoConfig.keywords}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${baseUrl}${path}">
    
    <meta property="og:title" content="${seoConfig.ogTitle}">
    <meta property="og:description" content="${seoConfig.ogDescription}">
    <meta property="og:url" content="${baseUrl}${path}">
    <meta property="og:type" content="website">
    <meta property="og:image" content="${baseUrl}/og-image.png">
    <meta property="og:site_name" content="Cloud Based Network Calculator">
    
    <meta name="twitter:title" content="${seoConfig.twitterTitle}">
    <meta name="twitter:description" content="${seoConfig.twitterDescription}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${baseUrl}/og-image.png">
    
    <meta name="author" content="Cloud Based Networking Solutions">
    <meta name="theme-color" content="#0077ff">
    <meta name="application-name" content="Cloud Based Network Calculator">
    
    <script type="application/ld+json">
      ${JSON.stringify(generateStructuredData(path, seoConfig))}
    </script>
  `;
  
  // Inject meta tags into the HTML head
  const enhancedHtml = html.replace('</head>', `${metaTags}</head>`);
  
  return new Response(enhancedHtml, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};
