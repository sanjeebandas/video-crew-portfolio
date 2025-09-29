# SEO Guidelines for Video Crew Portfolio - Team Instructions

## Overview
This document provides clear instructions for your team on how to modify SEO-related content and code in the Video Crew portfolio website. All SEO implementations are documented with exact file locations and simple modification steps.

## Table of Contents
1. [SEO Components](#seo-components)
2. [Page SEO Settings](#page-seo-settings)
3. [Meta Tags Configuration](#meta-tags-configuration)
4. [Image SEO](#image-seo)
5. [Technical SEO Files](#technical-seo-files)
6. [How to Modify SEO](#how-to-modify-seo)
7. [Maintenance Checklist](#maintenance-checklist)

---

## SEO Components

### 1. Main SEO Component
**File:** `client/src/components/common/SEO.tsx`

**Purpose:** Manages all page meta tags (title, description, keywords, social media tags)

**Default Settings:**
- Keywords: "영상제작, 비디오제작, 기업홍보영상, 광고영상, 제품소개영상, 스토리텔링, 영상편집, 촬영"
- Default image: "/imgs/VideoCrewLogo.webp"
- Website URL: "https://videocrew.kr"

**To change defaults:** Edit lines 15-18 in SEO.tsx

### 2. LazyImage Component
**File:** `client/src/components/common/LazyImage.tsx`

**Purpose:** Loads images only when needed (improves page speed)

**Key Settings:**
- Loads images 50px before they appear on screen
- Smooth fade-in effect when loaded
- Works with all animations

---

## Page SEO Settings

### Current Page SEO Configurations

**Home Page** (`client/src/pages/Home.tsx`)
- Title: "홈"
- Description: "비디오크루는 전문적인 영상 제작 서비스를 제공합니다..."
- Keywords: "영상제작, 비디오제작, 기업홍보영상, 광고영상, 제품소개영상, 스토리텔링, 영상편집, 촬영, 비디오크루"

**About Page** (`client/src/pages/About.tsx`)
- Title: "회사 소개"
- Description: "비디오크루의 스토리와 비전을 소개합니다..."
- Keywords: "비디오크루회사소개, 영상제작회사, 브랜드스토리, 핵심가치, 워크컬처, 영상제작팀, 비디오크루소개"

**Process Page** (`client/src/pages/Process.tsx`)
- Title: "제작 프로세스"
- Description: "비디오크루의 전문적인 영상 제작 프로세스를 소개합니다..."
- Keywords: "영상제작프로세스, 비디오제작과정, 상담목표설정, 영상기획, 촬영준비, 현장촬영, 편집후반작업, 최종납품, 비디오크루프로세스"

**Portfolio Page** (`client/src/pages/Portfolio.tsx`)
- Title: "포트폴리오"
- Description: "비디오크루의 다양한 포트폴리오를 확인하세요..."
- Keywords: "비디오크루포트폴리오, 광고영상, 홍보영상, 이러닝영상, 기업행사영상, 영상제작사례, 비디오제작포트폴리오"

**Differentiation Page** (`client/src/pages/Differentiation.tsx`)
- Title: "차별화"
- Description: "비디오크루만의 차별화된 서비스를 확인하세요..."
- Keywords: "비디오크루차별화, 영상제작차별점, A/B테스트, 투명한가격, 맞춤형제작, 영상제작최적화, 비디오크루장점"

**Contact Page** (`client/src/pages/Contact.tsx`)
- Title: "문의하기"
- Description: "비디오크루에 문의하세요. 전문적인 상담과 맞춤형 견적을 제공합니다..."
- Keywords: "비디오크루문의, 영상제작상담, 견적문의, 프로젝트상담, 영상제작견적, 비디오크루연락처"

---

## Meta Tags Configuration

### Base Meta Tags
**File:** `client/index.html`

**Current Settings:**
- Site title: "비디오크루 - 전문 영상 제작 서비스 | 기업 홍보영상, 광고영상 제작"
- Default description: "비디오크루는 전문적인 영상 제작 서비스를 제공합니다..."
- Default keywords: "영상제작, 비디오제작, 기업홍보영상, 광고영상, 제품소개영상, 스토리텔링, 영상편집, 촬영"
- Language: Korean (ko)
- Theme color: #000000 (black)

**Social Media Tags:**
- Open Graph (Facebook): Configured for Korean market
- Twitter Cards: Large image format
- Default image: "/imgs/VideoCrewLogo.webp"

---

## Image SEO

### Alt Text Implementation
**Current Alt Text Examples:**

**Home Page:**
- Service section: "비디오크루 서비스 섹션 구분 디자인 이미지"
- Portfolio section: "비디오크루 포트폴리오 섹션 구분 디자인 이미지"

**About Page:**
- Core Value section: "비디오크루 Core Value 섹션 구분 디자인 이미지"
- Work Culture section: "비디오크루 Work Culture 섹션 구분 디자인 이미지"

**Process Page:**
- Process Banner: "Process Banner"

**Services Grid:**
- Service items: Uses service title as alt text

### Lazy Loading
**How it works:**
- Images load only when needed (improves page speed)
- Smooth fade-in effect when loaded
- Works with all animations
- Applied to decorative images and section separators

---

## Technical SEO Files

### 1. Sitemap
**File:** `client/public/sitemap.xml`

**Current Pages:**
- Home (/)
- About (/about)
- Process (/process)
- Portfolio (/portfolio)
- Differentiation (/differentiation)
- Contact (/contact)

**Settings:**
- Home page: Priority 1.0, Weekly updates
- Portfolio: Priority 0.9, Weekly updates
- Other pages: Priority 0.7-0.8, Monthly updates

### 2. Robots.txt
**File:** `client/public/robots.txt`

**Current Settings:**
- Allows all search engines to crawl the site
- Blocks admin routes (/admin/, /admin/login, etc.)
- Points to sitemap location
- 1 second crawl delay

### 3. PWA Manifest
**File:** `client/public/manifest.json`

**SEO Settings:**
- App name: "비디오크루 - 전문 영상 제작 서비스"
- Language: Korean (ko)
- Categories: business, photography, video
- Theme color: #000000

---

## How to Modify SEO

### 1. Change Page SEO Settings
**To modify any page's SEO:**

1. Open the page file (e.g., `client/src/pages/Home.tsx`)
2. Find the `<SEO>` component
3. Update the title, description, or keywords:

```typescript
<SEO 
  title="새로운 제목"
  description="새로운 설명 (160자 이내로 작성)"
  keywords="새로운, 키워드, 목록"
/>
```

### 2. Add New Page SEO
**When creating a new page:**

1. Create the page component
2. Add the SEO component at the top:

```typescript
import SEO from "../components/common/SEO";

const NewPage = () => {
  return (
    <>
      <SEO 
        title="페이지 제목"
        description="페이지 설명"
        keywords="관련 키워드들"
      />
      {/* Your page content */}
    </>
  );
};
```

3. Add the page to `sitemap.xml`
4. Update `robots.txt` if needed

### 3. Change Default SEO Settings
**To change site-wide defaults:**

1. Open `client/src/components/common/SEO.tsx`
2. Edit lines 15-18:

```typescript
keywords = "새로운 기본 키워드들",
image = "/path/to/new/image.webp",
url = "https://new-domain.com",
```

### 4. Update Sitemap
**When adding new pages:**

1. Open `client/public/sitemap.xml`
2. Add new URL entry:

```xml
<url>
  <loc>https://videocrew.kr/new-page</loc>
  <lastmod>2025-01-15</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

### 5. Add Lazy Loading to Images
**For new images:**

1. Import LazyImage component
2. Replace `<img>` with `<LazyImage>`:

```typescript
<LazyImage
  src="/path/to/image.webp"
  alt="설명적인 alt 텍스트"
  className="your-css-classes"
/>
```

---

## Maintenance Checklist

### Monthly Tasks
- [ ] Update sitemap.xml lastmod dates
- [ ] Check meta descriptions are under 160 characters
- [ ] Verify all images have alt text
- [ ] Test page loading speeds

### When Adding New Content
- [ ] Add SEO component to new pages
- [ ] Update sitemap.xml with new URLs
- [ ] Use LazyImage for new images
- [ ] Add descriptive alt text to images

### Before Deploying
- [ ] Test meta tags in browser
- [ ] Check social media previews
- [ ] Verify sitemap.xml is valid
- [ ] Ensure robots.txt is accessible

---

## File Locations Summary

### Main SEO Files
- `client/src/components/common/SEO.tsx` - SEO component
- `client/src/components/common/LazyImage.tsx` - Image lazy loading
- `client/index.html` - Base meta tags

### Page Files
- `client/src/pages/Home.tsx` - Home page SEO
- `client/src/pages/About.tsx` - About page SEO
- `client/src/pages/Process.tsx` - Process page SEO
- `client/src/pages/Portfolio.tsx` - Portfolio page SEO
- `client/src/pages/Differentiation.tsx` - Differentiation page SEO
- `client/src/pages/Contact.tsx` - Contact page SEO

### Technical Files
- `client/public/sitemap.xml` - Site structure
- `client/public/robots.txt` - Search engine rules
- `client/public/manifest.json` - PWA settings

---

## Quick Reference

**SEO Component Usage:**
```typescript
<SEO 
  title="페이지 제목"
  description="페이지 설명 (160자 이내)"
  keywords="키워드1, 키워드2, 키워드3"
/>
```

**LazyImage Usage:**
```typescript
<LazyImage
  src="/path/to/image.webp"
  alt="설명적인 alt 텍스트"
  className="your-css-classes"
/>
```

