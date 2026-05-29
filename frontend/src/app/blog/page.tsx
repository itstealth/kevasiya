import { Metadata } from 'next';
import { fetchStrapiBlogPosts } from '@/lib/strapi';
import { BlogCard } from './components/BlogCard';
import { BlogPagination } from './components/BlogPagination';
import { BlogHero } from './components/BlogHero';

interface BlogPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Blog | Kevasiya - Luxury Gifting Tips & Ideas',
    description: 'Discover luxury gifting tips, corporate gift ideas, wedding hampers, and baby shower gifts. Read our expert blog for the latest in premium gifting.',
    keywords: 'luxury gifting blog, corporate gift ideas, wedding hampers, baby shower gifts, gift tips, kevasiya blog',
    alternates: {
      canonical: 'https://kevasiya.com/blog',
    },
    openGraph: {
      title: 'Blog | Kevasiya - Luxury Gifting Tips & Ideas',
      description: 'Discover luxury gifting tips, corporate gift ideas, wedding hampers, and baby shower gifts. Read our expert blog for the latest in premium gifting.',
      url: 'https://kevasiya.com/blog',
      siteName: 'Kevasiya',
      images: [
        {
          url: '/hero.webp',
          width: 1200,
          height: 630,
          alt: 'Kevasiya Blog - Luxury Gifting Tips',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Blog | Kevasiya - Luxury Gifting Tips & Ideas',
      description: 'Discover luxury gifting tips, corporate gift ideas, wedding hampers, and baby shower gifts. Read our expert blog for the latest in premium gifting.',
      images: ['/hero.webp'],
    },
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || '1');
  const { posts, totalPages, totalPosts } = await fetchStrapiBlogPosts(currentPage, 9);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Hero Section */}
      <BlogHero totalPosts={totalPosts} />

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <BlogPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-rose-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No blog posts found
                </h3>
                <p className="text-gray-600">
                  We&apos;re working on creating amazing content for you. Check back soon!
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
