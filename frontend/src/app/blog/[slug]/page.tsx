import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchStrapiBlogPost, fetchRelatedBlogPosts } from '@/lib/strapi';
import { BlogPostContent } from './components/BlogPostContent';
import { BlogPostHeader } from './components/BlogPostHeader';
import { RelatedPosts } from './components/RelatedPosts';
import { BlogPostNavigation } from './components/BlogPostNavigation';
import Script from 'next/script';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchStrapiBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Kevasiya Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  // Use Strapi meta description
  const metaDescription = post.metaDescription || post.excerpt.substring(0, 160);
  
  // Use canonical URL from Strapi or fallback
  const canonicalUrl = post.canonicalUrl || `https://kevasiya.com/blog/${post.slug}`;

  // Use OG image from Strapi or fallback
  const ogImageUrl = post.ogImage || post.featuredImage || '/hero.webp';

  return {
    title: post.metaTitle || `${post.title} | Kevasiya Blog`,
    description: metaDescription,
    keywords: post.tags.join(', ') || 'luxury gifting, corporate gifts, wedding hampers, baby shower gifts, gift tips, kevasiya',
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.ogTitle || post.title,
      description: post.ogDescription || metaDescription,
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
      title: post.ogTitle || post.title,
      description: post.ogDescription || metaDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await fetchStrapiBlogPost(slug);
  
  if (!post) {
    notFound();
  }

  // Fetch related posts by category
  const relatedPosts = await fetchRelatedBlogPosts(post.category, post.slug, 3);

  return (
    <>
      {/* JSON-LD Structured Data */}
      {post.jsonLdSchema && (
        <Script
          id="blog-post-schema"
          type="application/ld+json"
          children={JSON.stringify(post.jsonLdSchema)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        {/* Blog Post Header */}
        <BlogPostHeader post={post} />

        {/* Blog Post Content */}
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
