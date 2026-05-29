import { StrapiBlogPost, StrapiAPIResponse, BlogPost } from '@/types/strapi-blog';

// TODO: Update this to your public Strapi domain
const STRAPI_API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://57.128.189.225:1337';

/**
 * Fetch all blog posts from Strapi with pagination
 */
export async function fetchStrapiBlogPosts(page: number = 1, pageSize: number = 9): Promise<{
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
}> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/blogs?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=publishedAt:desc`,
      {
        next: { revalidate: 30 }, // Revalidate every 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const data: StrapiAPIResponse<StrapiBlogPost[]> = await response.json();

    const transformedPosts: BlogPost[] = data.data.map(transformStrapiBlogPost);

    return {
      posts: transformedPosts,
      totalPages: data.meta.pagination.pageCount,
      totalPosts: data.meta.pagination.total,
    };
  } catch (error) {
    console.error('Error fetching Strapi blog posts:', error);
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    };
  }
}

/**
 * Fetch a single blog post by slug from Strapi
 */
export async function fetchStrapiBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/blogs?filters[slug][$eq]=${slug}&populate=*`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const data: StrapiAPIResponse<StrapiBlogPost[]> = await response.json();
    
    if (data.data.length === 0) {
      return null;
    }

    return transformStrapiBlogPost(data.data[0]);
  } catch (error) {
    console.error('Error fetching Strapi blog post:', error);
    return null;
  }
}

/**
 * Fetch related blog posts by category
 */
export async function fetchRelatedBlogPosts(
  category: string,
  excludeSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/blogs?filters[category][$eq]=${category}&filters[slug][$ne]=${excludeSlug}&populate=*&pagination[limit]=${limit}&sort[0]=publishedAt:desc`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const data: StrapiAPIResponse<StrapiBlogPost[]> = await response.json();
    return data.data.map(transformStrapiBlogPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

/**
 * Generate static paths for all blog posts (for static generation)
 */
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const response = await fetch(
      `${STRAPI_API_URL}/api/blogs?fields[0]=slug&pagination[limit]=1000`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog slugs: ${response.status}`);
    }

    const data: StrapiAPIResponse<StrapiBlogPost[]> = await response.json();
    return data.data.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

/**
 * Transform Strapi blog post to normalized BlogPost format
 */
function transformStrapiBlogPost(strapiPost: StrapiBlogPost): BlogPost {
  // Calculate reading time from content
  const readingTime = calculateReadingTime(strapiPost.content);
  
  // Get the best quality image URL
  const featuredImage = getFeaturedImageUrl(strapiPost.og_image);
  
  // Parse tags from comma-separated string
  const tags = strapiPost.tags
    ? strapiPost.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    : [];

  return {
    id: strapiPost.id,
    documentId: strapiPost.documentId,
    title: strapiPost.title,
    slug: strapiPost.slug,
    excerpt: strapiPost.excerpt,
    content: strapiPost.content,
    date: strapiPost.publishedAt,
    modified: strapiPost.updatedAt,
    published: strapiPost.published,
    featuredImage,
    featuredImageAlt: strapiPost.og_image?.alternativeText || strapiPost.title,
    author: 'Kevasiya Team', // Default author
    readingTime,
    category: strapiPost.category || 'Uncategorized',
    tags,
    metaTitle: strapiPost.meta_title,
    metaDescription: strapiPost.meta_description,
    canonicalUrl: strapiPost.canonical_url,
    ogTitle: strapiPost.og_title,
    ogDescription: strapiPost.og_description,
    ogImage: getFeaturedImageUrl(strapiPost.og_image),
    jsonLdSchema: strapiPost.json_ld_schema,
  };
}

/**
 * Get the best quality featured image URL from Strapi image object
 */
function getFeaturedImageUrl(image: StrapiBlogPost['og_image']): string | undefined {
  if (!image) return undefined;

  // Prefer large format, fallback to medium, small, or original
  if (image.formats?.large?.url) {
    return `${STRAPI_API_URL}${image.formats.large.url}`;
  }
  if (image.formats?.medium?.url) {
    return `${STRAPI_API_URL}${image.formats.medium.url}`;
  }
  if (image.formats?.small?.url) {
    return `${STRAPI_API_URL}${image.formats.small.url}`;
  }
  if (image.url) {
    return `${STRAPI_API_URL}${image.url}`;
  }

  return undefined;
}

/**
 * Calculate estimated reading time based on word count
 */
function calculateReadingTime(content: string): string {
  // Remove markdown/HTML tags for more accurate word count
  const text = content.replace(/<[^>]*>/g, '').replace(/[#*_`~\[\]()]/g, '');
  const words = text.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Format date to readable string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Generate slug from title (utility function)
 */
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

