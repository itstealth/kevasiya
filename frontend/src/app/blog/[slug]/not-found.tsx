import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#3a5a40] to-[#4d5d4a] rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.291A7.962 7.962 0 0012 5c-2.34 0-4.29 1.009-5.824 2.709"
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Blog Post Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The blog post you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        
        <div className="space-y-4">
        <Link
          href="/blog"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#3a5a40] to-[#4d5d4a] text-white font-medium rounded-lg hover:from-[#4d5d4a] hover:to-[#3a5a40] transition-all duration-200 shadow-lg hover:shadow-xl"
        >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
          
          <div>
            <Link
              href="/"
              className="text-[#3a5a40] hover:text-[#4d5d4a] font-medium transition-colors duration-200"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
