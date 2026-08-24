import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchWordPressPost, fetchRelatedPosts } from '@/lib/wordpress';
import { BlogPostContent } from './components/BlogPostContent';
import { BlogPostHeader } from './components/BlogPostHeader';
import { RelatedPosts } from './components/RelatedPosts';
import { BlogPostNavigation } from './components/BlogPostNavigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = 'https://kevasiya.com';

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchWordPressPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found | Kevasiya Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  // Build metadata from WordPress post fields (with sensible fallbacks)
  const metaDescription = post.metaDescription || post.excerpt.replace(/<[^>]*>/g, '').substring(0, 160);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const ogImageUrl = post.featuredImage || '/hero.webp';
  const tagsString = post.tags.join(', ');

  return {
    title: `${post.title} | Kevasiya Blog`,
    description: metaDescription,
    keywords: tagsString || 'luxury gifting, corporate gifts, wedding hampers, baby shower gifts, gift tips, kevasiya',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: metaDescription,
      url: canonicalUrl,
      siteName: 'Kevasiya',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchWordPressPost(slug);

  if (!post) {
    notFound();
  }

  // Fetch related posts by category (exclude the current post)
  const relatedPosts = await fetchRelatedPosts(post.categoryIds, post.id, 3);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Blog Post Header */}
        <BlogPostHeader post={post} />

        {/* Blog Post Content — content is rendered as HTML via dangerouslySetInnerHTML */}
        <article className="py-2 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BlogPostContent post={post} />
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <RelatedPosts posts={relatedPosts} />
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <BlogPostNavigation />
          </div>
        </section>
      </div>
    </>
  );
}