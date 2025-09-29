import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({ 
  title, 
  description, 
  keywords = "영상제작, 비디오제작, 기업홍보영상, 광고영상, 제품소개영상, 스토리텔링, 영상편집, 촬영",
  image = "/imgs/VideoCrewLogo.webp",
  url = "https://videocrew.kr",
  type = "website"
}: SEOProps) => {
  const fullTitle = `${title} | 비디오크루`;
  const fullUrl = `${url}${window.location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update meta tags
    updateMetaTag('title', fullTitle);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updatePropertyTag('og:type', type);
    updatePropertyTag('og:url', fullUrl);
    updatePropertyTag('og:title', fullTitle);
    updatePropertyTag('og:description', description);
    updatePropertyTag('og:image', image);
    updatePropertyTag('og:site_name', '비디오크루');
    updatePropertyTag('og:locale', 'ko_KR');
    
    // Update Twitter tags
    updatePropertyTag('twitter:card', 'summary_large_image');
    updatePropertyTag('twitter:url', fullUrl);
    updatePropertyTag('twitter:title', fullTitle);
    updatePropertyTag('twitter:description', description);
    updatePropertyTag('twitter:image', image);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = fullUrl;
  }, [title, description, keywords, image, url, type, fullTitle, fullUrl]);

  return null; // This component doesn't render anything
};

export default SEO;
