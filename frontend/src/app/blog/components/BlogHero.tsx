interface BlogHeroProps {
  totalPosts: number;
}

export function BlogHero({ totalPosts }: BlogHeroProps) {
  return (
    <section className="relative bg-gradient-to-r from-[#FBE0C2] via-[#f5e9d5] to-[#FBE0C2] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-[#3a5a40]/20 mb-6">
          <span className="text-sm font-medium text-[#3a5a40]">
            {totalPosts} Articles Published
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3a5a40] mb-6">
          Luxury Gifting
          <span className="block bg-gradient-to-r from-[#3a5a40] to-[#4d5d4a] bg-clip-text text-transparent">
            Insights & Tips
          </span>
        </h1>

        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          Discover expert advice on luxury gifting, corporate presents, wedding hampers, 
          and baby shower gifts. Elevate your gifting game with our curated insights.
        </p>

        <div className="flex flex-wrap justify-center gap-4 text-sm text-[#4d5d4a]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#3a5a40] rounded-full"></div>
            <span>Corporate Gifts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#4d5d4a] rounded-full"></div>
            <span>Wedding Hampers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#b99e85] rounded-full"></div>
            <span>Baby Shower Gifts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#3a5a40] rounded-full"></div>
            <span>Festival Hampers</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-[#3a5a40]/20 to-[#4d5d4a]/20 rounded-full opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-[#b99e85]/20 to-[#3a5a40]/20 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-[#4d5d4a]/20 to-[#b99e85]/20 rounded-full opacity-30"></div>
    </section>
  );
}
