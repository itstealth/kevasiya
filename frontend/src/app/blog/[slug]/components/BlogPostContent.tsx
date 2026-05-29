import { BlogPost } from '@/types/strapi-blog';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';

interface BlogPostContentProps {
  post: BlogPost;
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  return (
    <div className="prose prose-lg prose-gray max-w-none">
      {/* Blog Content with React Markdown */}
      <div className="
        prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12 prose-h1:leading-tight
        prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-10 prose-h2:leading-tight prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-3
        prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:leading-snug prose-h3:text-[#3a5a40]
        prose-h4:text-xl prose-h4:mb-3 prose-h4:mt-6 prose-h4:font-semibold
        prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
        prose-a:text-[#3a5a40] prose-a:no-underline prose-a:font-medium hover:prose-a:underline hover:prose-a:text-[#4d5d4a] prose-a:transition-colors
        prose-strong:text-gray-900 prose-strong:font-semibold
        prose-em:text-gray-700 prose-em:italic
        prose-ul:text-gray-700 prose-ul:mb-6 prose-ul:space-y-2
        prose-ol:text-gray-700 prose-ol:mb-6 prose-ol:space-y-2
        prose-li:text-gray-700 prose-li:leading-relaxed prose-li:text-lg prose-li:marker:text-[#3a5a40]
        prose-blockquote:border-l-4 prose-blockquote:border-[#3a5a40] prose-blockquote:bg-[#FBE0C2]/20 
        prose-blockquote:pl-6 prose-blockquote:pr-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg 
        prose-blockquote:text-gray-700 prose-blockquote:italic prose-blockquote:my-8
        prose-code:text-[#3a5a40] prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-6 prose-pre:my-6 prose-pre:overflow-x-auto
        prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8 prose-img:w-full
        prose-hr:border-gray-300 prose-hr:my-8
        prose-table:border-collapse prose-table:w-full prose-table:my-6
        prose-th:bg-[#3a5a40] prose-th:text-white prose-th:font-semibold prose-th:p-3 prose-th:text-left
        prose-td:border prose-td:border-gray-300 prose-td:p-3 prose-td:text-gray-700
      ">
        <ReactMarkdown
          components={{
            // Custom image component using Next.js Image for optimization
            img: ({ ...props }) => {
              const src = typeof props.src === 'string' ? props.src : '';
              const alt = typeof props.alt === 'string' ? props.alt : '';
              
              // Handle Strapi images
              const imageSrc = src.startsWith('http') ? src : `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${src}`;
              
              return (
                <span className="block my-8">
                  <Image
                    src={imageSrc}
                    alt={alt}
                    width={1200}
                    height={675}
                    className="rounded-xl shadow-2xl w-full h-auto"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </span>
              );
            },
            // Enhanced heading components
            h1: ({ ...props }) => (
              <h1 className="scroll-mt-20" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="scroll-mt-20" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="scroll-mt-20" {...props} />
            ),
            // Enhanced link component
            a: ({ ...props }) => (
              <a {...props} target={props.href?.startsWith('http') ? '_blank' : undefined} rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined} />
            ),
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Author Bio */}
      {/* <div className="mt-16 p-8 bg-gradient-to-r from-[#FBE0C2] to-[#f5e9d5] rounded-2xl border border-[#3a5a40]/10">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#3a5a40] to-[#4d5d4a] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {post.author.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">About {post.author}</h3>
            <p className="text-gray-600 leading-relaxed">
              Expert in luxury gifting with years of experience in curating premium hampers for weddings, 
              corporate events, and special occasions. Passionate about helping you find the perfect gift 
              for every celebration.
            </p>
          </div>
        </div>
      </div> */}

      {/* Social Share Buttons - Moved to end */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Share this article:</span>
          <div className="flex items-center space-x-3">
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </button>
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </button>
            <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
