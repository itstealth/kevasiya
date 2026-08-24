export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: {
    rendered: string;
  };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: unknown[];
  categories: number[];
  tags: number[];
  yoast_head: string;
  yoast_head_json: {
    title: string;
    description: string;
    robots: {
      index: string;
      follow: string;
      "max-snippet": string;
      "max-image-preview": string;
      "max-video-preview": string;
    };
    canonical: string;
    og_locale: string;
    og_type: string;
    og_title: string;
    og_description: string;
    og_url: string;
    og_site_name: string;
    article_published_time: string;
    article_modified_time: string;
    og_image: Array<{
      width: number;
      height: number;
      url: string;
      type: string;
    }>;
    author: string;
    twitter_card: string;
    twitter_misc: {
      "Written by": string;
      "Est. reading time": string;
    };
    schema: {
      "@context": string;
      "@graph": Array<{
        "@type": string;
        "@id": string;
        url?: string;
        name?: string;
        isPartOf?: {
          "@id": string;
        };
        primaryImageOfPage?: {
          "@id": string;
        };
        image?: {
          "@id": string;
        };
        thumbnailUrl?: string;
        datePublished?: string;
        dateModified?: string;
        author?: {
          "@id": string;
        };
        description?: string;
        breadcrumb?: {
          "@id": string;
        };
        inLanguage?: string;
        potentialAction?: Array<{
          "@type": string;
          target: string[];
        }>;
        width?: number;
        height?: number;
        contentUrl?: string;
        caption?: string;
        itemListElement?: Array<{
          "@type": string;
          position: number;
          name: string;
          item: string;
        }>;
        logo?: string;
        contactPoint?: {
          "@type": string;
          telephone: string;
          contactType: string;
        };
        sameAs?: string[];
      }>;
    };
  };
  _links: {
    self: Array<{
      href: string;
      targetHints: {
        allow: string[];
      };
    }>;
    collection: Array<{
      href: string;
    }>;
    about: Array<{
      href: string;
    }>;
    author: Array<{
      embeddable: boolean;
      href: string;
    }>;
    replies: Array<{
      embeddable: boolean;
      href: string;
    }>;
    "version-history": Array<{
      count: number;
      href: string;
    }>;
    "predecessor-version": Array<{
      id: number;
      href: string;
    }>;
    "wp:featuredmedia": Array<{
      embeddable: boolean;
      href: string;
    }>;
    "wp:attachment": Array<{
      href: string;
    }>;
    "wp:term": Array<{
      taxonomy: string;
      embeddable: boolean;
      href: string;
    }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  link: string;
  featuredImage?: string;
  author: string;
  readingTime: string;
  categoryIds: number[];
  categories: string[];
  tags: string[];
  metaDescription?: string;
}

export interface BlogPageProps {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
}

export interface SinglePostProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}
