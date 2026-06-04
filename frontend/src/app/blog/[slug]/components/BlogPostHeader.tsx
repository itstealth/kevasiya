import Image from 'next/image';
import { BlogPost } from '@/types/strapi-blog';
import { formatDate } from '@/lib/strapi';
import Breadcrumb from '@/components/ui/Breadcrumb';

interface BlogPostHeaderProps {
  post: BlogPost;
}

export function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="relative bg-gradient-to-b from-[#3a5a40] via-[#3a5a40]/60 to-[#3a5a40]/0  pt-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb variant="dark" items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 shadow-xl">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              priority
            />
          </div>
        )}

        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>By {post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Category and Tags */}
        <div className="mb-6 flex flex-wrap justify-between items-center gap-3">
          {/* Category Label */}
          <div className="flex items-center">
            <span className="font-semibold text-gray-700 mr-2">Category:</span>
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#3a5a40]/10 text-[#3a5a40]">
                {post.category}
              </span>
            )}
          </div>

          {/* Tags Label */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-semibold text-gray-700 mr-1">Tags:</span>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-[#3a5a40]/10 hover:text-[#3a5a40] transition-colors duration-200"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-[#3a5a40]/20 to-[#4d5d4a]/20 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-[#b99e85]/20 to-[#3a5a40]/20 rounded-full opacity-20"></div>
    </header>
  );
}
