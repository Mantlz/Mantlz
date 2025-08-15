// MarbleCMS API Response Types

export interface MarblePost {
  id: string;
  title: string;
  slug: string;
  content: string;
  description?: string;
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  attribution?: string;
  authors?: MarbleAuthor[];
  category?: MarbleCategory;
  tags?: MarbleTag[];
  reading_time?: number;
}

export interface MarbleAuthor {
  id: string;
  name: string;
  image?: string;
}

export interface MarbleCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MarbleTag {
  id: string;
  name: string;
  slug: string;
}

// API Response Wrappers
export interface MarblePostsResponse {
  posts: MarblePost[];
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface MarblePostResponse {
  post: MarblePost;
}

export interface MarbleAuthorsResponse {
  authors: MarbleAuthor[];
}

export interface MarbleCategoriesResponse {
  categories: MarbleCategory[];
}

export interface MarbleTagsResponse {
  tags: MarbleTag[];
}

// Error Response Type
export interface MarbleErrorResponse {
  error: {
    message: string;
    code?: string;
    status?: number;
  };
}