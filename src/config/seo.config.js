// SEO Configuration for GirlsWhoYap Conference
// Update these values for future conference editions

export const seoConfig = {
  // Basic Info
  siteName: "GirlsWhoYap Conference",
  title: "GirlsWhoYap Conference",
  description: "Where women don't just attend conferences, they shape conversations.",
  
  // URLs
  siteUrl: "https://preconf.vercel.app/", 
  canonicalUrl: "https://preconf.vercel.app/",
  
  // Social Media Images
  ogImage: "/logo.png", // Update with actual OG image path (1200x630px)
  twitterImage: "/logo.png", // Update with actual Twitter card image (1200x600px)
  
  // Social Media Handles
  twitterHandle: "@connectdoradao",
  twitterSite: "@connectdoradao",
  
  // Additional Meta
  keywords: "women in tech, tech conference, girls who yap, women empowerment, tech community",
  author: "GirlsWhoYap",
  themeColor: "#000000", 
  
  // Conference Specific
  conferenceDate: "2026",
  conferenceLocation: "India", 
  
  // Open Graph Type
  ogType: "website",
  
  // Twitter Card Type
  twitterCardType: "summary_large_image", 
};

// Page-specific SEO overrides
export const pageSEO = {
  home: {
    title: "GirlsWhoYap Conference - Where Women Shape Conversations",
    description: "Join us at GirlsWhoYap Conference where women don't just attend conferences, they shape conversations. Connect, learn, and grow with the tech community.",
    path: "/",
  },
  events: {
    title: "Events - GirlsWhoYap Conference",
    description: "Explore all the exciting events, workshops, and sessions at GirlsWhoYap Conference.",
    path: "/events",
  },
};
