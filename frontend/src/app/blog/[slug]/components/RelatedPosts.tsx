import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/lib/wordpress';

const primaryCategory = (post: BlogPost): string | undefined =>
  post.categories && post.categories.length > 0 ? post.categories[0] : undefined;

interface RelatedPostsProps {
  posts: BlogPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Related Articles
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover more insights and tips about luxury gifting
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.id} className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#3a5a40]/20">
            {/* Featured Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              {post.featuredImage ? (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#FBE0C2] to-[#f5e9d5] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-[#3a5a40] to-[#4d5d4a] rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
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
                    <p className="text-xs text-[#3a5a40] font-medium">Kevasiya Blog</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Meta Info */}
              <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                <span>{formatDate(post.date)}</span>
                <span>•</span>
                <span>{post.readingTime}</span>
              </div>

              {/* Category Badge */}
              {primaryCategory(post) && (
                <div className="mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#3a5a40]/10 text-[#3a5a40]">
                    {primaryCategory(post)}
                  </span>
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#3a5a40] transition-colors duration-200">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* View All Posts CTA */}
      <div className="text-center mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#3a5a40] to-[#4d5d4a] text-white font-medium rounded-lg hover:from-[#4d5d4a] hover:to-[#3a5a40] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          View All Articles
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
