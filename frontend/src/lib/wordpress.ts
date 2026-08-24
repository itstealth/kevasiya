import { WordPressPost, BlogPost } from '@/types/blog';

const WORDPRESS_API_URL =
  process.env.WORDPRESS_API_URL || 'https://kevasiya.com/cms-blog/wp-json/wp/v2';

export async function fetchWordPressPosts(page: number = 1, perPage: number = 10): Promise<{
  posts: BlogPost[];
  totalPages: number;
  totalPosts: number;
}> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?page=${page}&per_page=${perPage}&_embed=true`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');

    const transformedPosts: BlogPost[] = posts.map(transformWordPressPost);

    return {
      posts: transformedPosts,
      totalPages,
      totalPosts,
    };
  } catch (error) {
    console.error('Error fetching WordPress posts:', error);
    return {
      posts: [],
      totalPages: 0,
      totalPosts: 0,
    };
  }
}

export async function fetchWordPressPost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=true`,
      {
        next: { revalidate: 3600 },
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
    console.error('Error fetching WordPress post:', error);
    return null;
  }
}

export async function fetchRelatedPosts(categoryIds: number[], excludeId: number, limit: number = 3): Promise<BlogPost[]> {
  try {
    const categoryQuery = categoryIds.map(id => `categories=${id}`).join('&');
    const response = await fetch(
      `${WORDPRESS_API_URL}/posts?${categoryQuery}&exclude=${excludeId}&per_page=${limit}&_embed=true`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const posts: WordPressPost[] = await response.json();
    return posts.map(transformWordPressPost);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

function decodeHtmlEntities(text: string): string {
  // Common HTML entities mapping
  const entities: { [key: string]: string } = {
    '&#8217;': "'",
    '&#8216;': "'",
    '&#8220;': '"',
    '&#8221;': '"',
    '&#8211;': '–',
    '&#8212;': '—',
    '&#8230;': '…',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&#?\w+;/g, (entity) => {
    return entities[entity] || entity;
  });
}

function transformWordPressPost(wpPost: WordPressPost): BlogPost {
  // Extract featured image from yoast_head_json
  const featuredImage = wpPost.yoast_head_json?.og_image?.[0]?.url || '';

  // Extract categories and tags from _embedded["wp:term"] (requires _embed=true on the request)
  const embeddedTerms = (wpPost as unknown as { _embedded?: { 'wp:term'?: Array<Array<{ taxonomy: string; name: string }>> } })._embedded?.['wp:term'] || [];
  const categoryIds: number[] = wpPost.categories || [];
  const categories: string[] = [];
  const tags: string[] = [];
  embeddedTerms.forEach((termGroup) => {
    termGroup.forEach((term) => {
      if (term.taxonomy === 'category') categories.push(term.name);
      if (term.taxonomy === 'post_tag') tags.push(term.name);
    });
  });

  // Extract reading time from yoast_head_json
  const readingTime = wpPost.yoast_head_json?.twitter_misc?.['Est. reading time'] || '5 min read';

  // Extract author name
  const author = wpPost.yoast_head_json?.author || 'Kevasiya Team';

  // Extract Yoast SEO meta description (canonical URL will be hardcoded to kevasiya.com)
  const metaDescription = wpPost.yoast_head_json?.description || '';

  return {
    id: wpPost.id,
    title: decodeHtmlEntities(wpPost.title.rendered),
    slug: wpPost.slug,
    excerpt: decodeHtmlEntities(wpPost.excerpt?.rendered || extractExcerptFromContent(wpPost.content.rendered)),
    content: wpPost.content.rendered,
    date: wpPost.date,
    modified: wpPost.modified,
    link: wpPost.link,
    featuredImage,
    author,
    readingTime,
    categoryIds,
    categories,
    tags,
    metaDescription: metaDescription ? decodeHtmlEntities(metaDescription) : undefined,
    // Canonical URL will be hardcoded to kevasiya.com in the page component
  };
}

function extractExcerptFromContent(content: string): string {
  // Remove HTML tags and extract first 150 characters
  const textContent = content.replace(/<[^>]*>/g, '');
  const decodedContent = decodeHtmlEntities(textContent);
  return decodedContent.length > 150 
    ? decodedContent.substring(0, 150) + '...'
    : decodedContent;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
