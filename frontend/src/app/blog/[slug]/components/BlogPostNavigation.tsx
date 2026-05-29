import Link from 'next/link';

export function BlogPostNavigation() {
  return (
    <nav className="flex items-center justify-between py-8 border-t border-gray-200">
      {/* Back to Blog */}
      <Link
        href="/blog"
        className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
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

      {/* Home */}
      <Link
        href="/"
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
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        Home
      </Link>
    </nav>
  );
}
