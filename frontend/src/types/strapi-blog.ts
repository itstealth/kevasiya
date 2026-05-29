// Strapi API Response Types
export interface StrapiImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
}

export interface StrapiImage {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface StrapiBlogPostAttributes {
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  json_ld_schema: string | null;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  published: string;
  category: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  og_image: StrapiImage | null;
}

export interface StrapiBlogPost {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  json_ld_schema: string | null;
  title: string;
  excerpt: string;
  slug: string;
  content: string;
  published: string;
  category: string;
  tags: string;
  og_image: StrapiImage | null;
}

export interface StrapiAPIResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Normalized Blog Post Type (for use in components)
export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  modified: string;
  published: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author: string;
  readingTime: string;
  category: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  jsonLdSchema?: string | null;
}

export interface BlogPageProps {
  posts: BlogPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
}

export interface SinglePostProps {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

