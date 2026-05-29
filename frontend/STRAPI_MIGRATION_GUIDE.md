# Strapi Blog Migration Guide

## Overview

This document outlines the migration from WordPress to Strapi CMS for the blog functionality on the Kevasiya website.

## What Changed

### 1. **New Data Source**
- **Old**: WordPress API (`https://kevasiya.in/wp-json/wp/v2`)
- **New**: Strapi API (`http://57.128.189.225:1337`)

### 2. **File Structure**

#### New Files Created:
- `src/types/strapi-blog.ts` - TypeScript types for Strapi data structure
- `src/lib/strapi.ts` - Strapi API client with fetch functions
- `STRAPI_MIGRATION_GUIDE.md` - This documentation file

#### Modified Files:
- `src/app/blog/page.tsx` - Updated to use Strapi data
- `src/app/blog/[slug]/page.tsx` - Updated with Strapi data and enhanced SEO
- `src/app/blog/components/BlogCard.tsx` - Updated for Strapi data structure
- `src/app/blog/[slug]/components/BlogPostContent.tsx` - Now uses react-markdown with improved styling
- `src/app/blog/[slug]/components/BlogPostHeader.tsx` - Updated imports
- `src/app/blog/[slug]/components/RelatedPosts.tsx` - Updated for Strapi data
- `next.config.ts` - Added Strapi image domain configuration

## Key Features

### 1. **Enhanced SEO**
All SEO metadata from Strapi is now properly utilized:
- `meta_title` - Custom meta title for search engines
- `meta_description` - SEO-optimized description
- `canonical_url` - Proper canonical URL handling
- `og_title` & `og_description` - Open Graph tags for social sharing
- `og_image` - Custom social sharing images
- `json_ld_schema` - Structured data support (if provided)

### 2. **Improved Styling**
The blog content now features:
- Clean, modern typography with excellent readability
- Ample whitespace and proper spacing
- Beautiful code blocks with syntax highlighting styles
- Enhanced blockquotes with brand colors
- Optimized images with Next.js Image component
- Responsive tables with styled headers
- Brand-consistent color scheme (#3a5a40 primary color)

### 3. **Markdown Support**
- Content is rendered using `react-markdown` library
- Custom components for images (Next.js optimized)
- Automatic external link handling (opens in new tab)
- Smooth scroll for anchor links

### 4. **Better Performance**
- ISR (Incremental Static Regeneration) with 1-hour revalidation
- Optimized image loading with Next.js Image
- Efficient data fetching with proper error handling

## API Structure

### Strapi Blog Post Data Structure

```typescript
{
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Markdown format
  published: string; // Publication date
  category: string;
  tags: string; // Comma-separated
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: {
    url: string;
    alternativeText: string;
    formats: { large, medium, small, thumbnail }
  };
  json_ld_schema: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
```

### API Endpoints Used

1. **Get All Posts** (with pagination):
   ```
   GET /api/blogs?populate=*&pagination[page]=1&pagination[pageSize]=9&sort[0]=publishedAt:desc
   ```

2. **Get Single Post** (by slug):
   ```
   GET /api/blogs?filters[slug][$eq]={slug}&populate=*
   ```

3. **Get Related Posts** (by category):
   ```
   GET /api/blogs?filters[category][$eq]={category}&filters[slug][$ne]={excludeSlug}&populate=*&pagination[limit]=3
   ```

## Environment Variables

Add to your `.env.local` file:

```env
NEXT_PUBLIC_STRAPI_API_URL=http://57.128.189.225:1337
```

## Component Updates

### BlogCard Component
- Now displays category badges
- Uses plain text excerpts (no HTML)
- Links to `/blog/[slug]` instead of `/[slug]`
- Shows reading time calculated from content

### BlogPostContent Component
- Renders markdown content with `react-markdown`
- Custom image component with Next.js optimization
- Enhanced prose styling with Tailwind Typography
- Improved typography hierarchy
- Brand-consistent color scheme
- Beautiful blockquotes and code blocks

### BlogPostHeader Component
- Updated to use Strapi data types
- Maintains existing visual design
- Proper featured image handling

### RelatedPosts Component
- Shows category badges
- Updated links to `/blog/[slug]`
- Plain text excerpts

## Styling Enhancements

### Typography
- **Headings**: Bold, well-spaced, with proper hierarchy
  - H1: 4xl, large margins
  - H2: 3xl, with bottom border
  - H3: 2xl, brand color accent
  - H4: xl, semibold
- **Paragraphs**: Large (text-lg), relaxed line-height
- **Lists**: Proper spacing, brand-colored markers
- **Links**: Brand color with hover effects

### Visual Elements
- **Blockquotes**: Left border with brand color, subtle background
- **Code blocks**: Dark theme with proper padding
- **Images**: Rounded corners, shadow effects
- **Tables**: Styled headers with brand color
- **Category badges**: Subtle background with brand color

## Migration Checklist

- [x] Create Strapi type definitions
- [x] Create Strapi API client library
- [x] Update blog listing page
- [x] Update individual blog post page
- [x] Add comprehensive SEO metadata
- [x] Implement react-markdown for content rendering
- [x] Update all blog components
- [x] Add Strapi domain to Next.js image config
- [x] Apply modern, readable styling
- [x] Test pagination
- [x] Test related posts
- [x] Verify SEO metadata
- [x] Check image optimization

## Testing Recommendations

1. **Test Blog Listing**:
   - Navigate to `/blog`
   - Verify posts are loading
   - Test pagination

2. **Test Individual Posts**:
   - Click on a blog post
   - Verify content renders correctly
   - Check images load properly
   - Verify markdown formatting

3. **Test SEO**:
   - View page source
   - Check meta tags in `<head>`
   - Verify Open Graph tags
   - Test canonical URLs

4. **Test Related Posts**:
   - Verify related posts show up
   - Check category filtering works
   - Verify links work correctly

## Troubleshooting

### Images Not Loading
- Ensure Strapi URL is correctly set in `.env.local`
- Check `next.config.ts` has Strapi domain configured
- Verify image paths in Strapi response

### Markdown Not Rendering
- Ensure `react-markdown` is installed: `pnpm add react-markdown`
- Check content field contains valid markdown

### SEO Tags Missing
- Verify Strapi returns all SEO fields
- Check `generateMetadata` function in `[slug]/page.tsx`

### Related Posts Not Showing
- Ensure posts have categories set in Strapi
- Check category names match exactly
- Verify API endpoint is working

## Future Enhancements

- Add search functionality
- Implement category/tag filtering
- Add author profiles
- Implement comments system
- Add social sharing buttons functionality
- Create RSS feed from Strapi data

## Support

For issues or questions, refer to:
- Strapi Documentation: https://docs.strapi.io
- React Markdown: https://github.com/remarkjs/react-markdown
- Next.js Image: https://nextjs.org/docs/api-reference/next/image

