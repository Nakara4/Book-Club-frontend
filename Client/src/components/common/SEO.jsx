import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  author 
}) => {
  const defaultTitle = 'Book Club Platform';
  const defaultDescription = 'Connect with fellow book lovers, join reading clubs, and discover your next favorite book.';
  const defaultKeywords = 'books, reading, book club, literature, community, discussions';
  const defaultImage = '/og-image.png'; // Default Open Graph image

  const seoTitle = title ? `${title} | ${defaultTitle}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoImage = image || defaultImage;
  const seoUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      {author && <meta name="author" content={author} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={defaultTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={seoUrl} />
    </Helmet>
  );
};

export default SEO;
