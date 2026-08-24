import { StrapiBlogPost, StrapiAPIResponse, BlogPost } from '@/types/strapi-blog';
export const STRAPI_PUBLIC_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || "https://kevasiya.com/cms-blog";

// WordPress API URL - mounted at /blog/ on the server
const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://kevasiya.com/cms-blog/wp-json/wp/v2';

/**
 * Fetch all blog posts from WordPress with pagination
 */
export async function fetchStrapiBlogPosts(page: number = 1, pageSize: number = 9): Promise<{
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
}> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?page=${page}&per_page=${pageSize}&_embed`,
      {
        next: { revalidate: 30 }, // Revalidate every 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    const posts: WordPressPost[] = await response.json();

    const transformedPosts: BlogPost[] = posts.map(transformWordPressPost);

    return {
      posts: transformedPosts,
      totalPages,
      totalPosts,
    };
  } catch (error) {
    console.error('Error fetching WordPress blog posts:', error);
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    };
  }
}

/**
 * Fetch a single blog post by slug from WordPress
 */
export async function fetchStrapiBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();

    if (posts.length === 0) {
      return null;
    }

    return transformWordPressPost(posts[0]);
  } catch (error) {
    console.error('Error fetching WordPress blog post:', error);
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
    // Get category ID from category name
    const categoryResponse = await fetch(
      `${WORDPRESS_API_URL.replace('/wp/v2/posts', '')}/wp/v2/categories?search=${encodeURIComponent(category)}`
    );

    if (!categoryResponse.ok) {
      return [];
    }

    const categories: WordPressCategory[] = await categoryResponse.json();
    if (categories.length === 0) {
      return [];
    }

    const categoryId = categories[0].id;

    // Get posts by category excluding current post
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?categories=${categoryId}&per_page=${limit + 1}&_embed`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts
      .filter(post => post.slug !== excludeSlug)
      .slice(0, limit)
      .map(transformWordPressPost);
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
      `${WORDPRESS_API_URL}/posts?per_page=100&fields=slug`,
      {
        next: { revalidate: 30 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch blog slugs: ${response.status}`);
    }

    const posts: { slug: string }[] = await response.json();
    return posts.map(post => post.slug);
  } catch (error) {
    console.error('Error fetching blog slugs:', error);
    return [];
  }
}

// WordPress API response types
interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  _embedded?: {
    author?: Array<{ name: string }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
}

/**
 * Transform WordPress post to normalized BlogPost format
 */
function transformWordPressPost(wpPost: WordPressPost): BlogPost {
  // Calculate reading time from content
  const readingTime = calculateReadingTime(wpPost.content.rendered);

  // Get featured image from embedded data
  const featuredImage = wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const featuredImageAlt = wpPost._embedded?.['wp:featuredmedia']?.[0]?.alt_text || wpPost.title.rendered;

  // Get author name from embedded data
  const author = wpPost._embedded?.author?.[0]?.name || 'Kevasiya Team';

  // WordPress excerpts are HTML, strip tags
  const excerpt = stripHtml(wpPost.excerpt.rendered);

  // WordPress content is HTML
  const content = wpPost.content.rendered;

  // Extract plain text title
  const title = stripHtml(wpPost.title.rendered);

  return {
    id: wpPost.id,
    documentId: String(wpPost.id),
    title,
    slug: wpPost.slug,
    excerpt,
    content,
    date: wpPost.date,
    modified: wpPost.modified,
    published: wpPost.date.split('T')[0],
    featuredImage,
    featuredImageAlt,
    author,
    readingTime,
    category: 'General', // WordPress categories need to be fetched separately
    tags: [], // WordPress tags need to be fetched separately
    metaTitle: title,
    metaDescription: excerpt.substring(0, 160),
    canonicalUrl: `/blog/${wpPost.slug}`,
    ogTitle: title,
    ogDescription: excerpt.substring(0, 160),
    ogImage: featuredImage,
  };
}

/**
 * Strip HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
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
