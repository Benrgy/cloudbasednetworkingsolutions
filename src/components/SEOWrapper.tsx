import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { seoConfigs, getDefaultSEO } from "@/utils/seoConfig";
import { useEffect } from "react";

export const SEOWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Handle hash-based navigation for single page app sections
  const currentPath = location.hash ? location.hash.replace('#', '/') : '/';
  const seoConfig = seoConfigs[currentPath] || getDefaultSEO();

  // Update document title immediately for better UX
  useEffect(() => {
    document.title = seoConfig.title;
  }, [seoConfig.title]);

  return (
    <>
      <Helmet>
        <title>{seoConfig.title}</title>
        <meta name="description" content={seoConfig.description} />
        <meta name="keywords" content={seoConfig.keywords} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://cloudbasednetworkingsolutions.com${location.pathname}`} />
        
        <meta property="og:title" content={seoConfig.ogTitle} />
        <meta property="og:description" content={seoConfig.ogDescription} />
        <meta property="og:url" content={`https://cloudbasednetworkingsolutions.com${location.pathname}`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://cloudbasednetworkingsolutions.com/og-image.png" />
        <meta property="og:site_name" content="Cloud Based Network Calculator" />
        
        <meta name="twitter:title" content={seoConfig.twitterTitle} />
        <meta name="twitter:description" content={seoConfig.twitterDescription} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://cloudbasednetworkingsolutions.com/og-image.png" />
        
        {/* Additional SEO meta tags */}
        <meta name="author" content="Cloud Based Networking Solutions" />
        <meta name="theme-color" content="#0077ff" />
        <meta name="application-name" content="Cloud Based Network Calculator" />
        
        {/* Structured data for better SEO */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Cloud Based Network Calculator",
            "description": "Professional cloud-based networking calculator for subnet planning, IP allocation, and multi-cloud cost estimation",
            "url": "https://cloudbasednetworkingsolutions.com/",
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
          })}
        </script>
      </Helmet>
      {children}
    </>
  );
};