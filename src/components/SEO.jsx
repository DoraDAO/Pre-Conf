import { useEffect } from 'react';
import { seoConfig } from '../config/seo.config';

/**
 * SEO Component - Dynamically updates meta tags
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.image - OG/Twitter image URL
 * @param {string} props.url - Canonical URL
 * @param {string} props.type - OG type (website, article, etc.)
 */
export default function SEO({ 
  title, 
  description, 
  image, 
  url,
  type = seoConfig.ogType 
}) {
  const pageTitle = title || seoConfig.title;
  const pageDescription = description || seoConfig.description;
  const pageImage = image || seoConfig.ogImage;
  const pageUrl = url || seoConfig.canonicalUrl;
  
  // Construct full image URL
  const fullImageUrl = pageImage.startsWith('http') 
    ? pageImage 
    : `${seoConfig.siteUrl}${pageImage}`;
  
  // Construct full page URL
  const fullPageUrl = pageUrl.startsWith('http')
    ? pageUrl
    : `${seoConfig.siteUrl}${pageUrl}`;

  useEffect(() => {
    // Update document title
    document.title = pageTitle;
    
    // Update or create meta tags
    updateMetaTag('description', pageDescription);
    updateMetaTag('keywords', seoConfig.keywords);
    updateMetaTag('author', seoConfig.author);
    updateMetaTag('theme-color', seoConfig.themeColor);
    
    // Open Graph tags
    updateMetaTag('og:title', pageTitle, 'property');
    updateMetaTag('og:description', pageDescription, 'property');
    updateMetaTag('og:image', fullImageUrl, 'property');
    updateMetaTag('og:url', fullPageUrl, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', seoConfig.siteName, 'property');
    
    // Twitter Card tags
    updateMetaTag('twitter:card', seoConfig.twitterCardType);
    updateMetaTag('twitter:site', seoConfig.twitterSite);
    updateMetaTag('twitter:creator', seoConfig.twitterHandle);
    updateMetaTag('twitter:title', pageTitle);
    updateMetaTag('twitter:description', pageDescription);
    updateMetaTag('twitter:image', fullImageUrl);
    
    // Canonical URL
    updateCanonicalLink(fullPageUrl);
  }, [pageTitle, pageDescription, fullImageUrl, fullPageUrl, type]);

  return null; // This component doesn't render anything
}

/**
 * Helper function to update or create meta tags
 */
function updateMetaTag(name, content, attribute = 'name') {
  if (!content) return;
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

/**
 * Helper function to update canonical link
 */
function updateCanonicalLink(url) {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (link) {
    link.setAttribute('href', url);
  } else {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', url);
    document.head.appendChild(link);
  }
}
