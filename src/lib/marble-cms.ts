import {
  MarblePostsResponse,
  MarblePostResponse,
  MarbleAuthorsResponse,
  MarbleCategoriesResponse,
  MarbleTagsResponse
} from '@/types/marble-cms';

const url = process.env.MARBLE_API_URL;
const key = process.env.MARBLE_WORKSPACE_KEY;

if (!url || !key) {
  throw new Error('MARBLE_API_URL and MARBLE_WORKSPACE_KEY must be set in environment variables');
}

export async function getPosts(): Promise<MarblePostsResponse> {
  try {
    const raw = await fetch(`${url}/${key}/posts`, {
    cache: 'no-store' // Always fetch fresh data
  });
    
    if (!raw.ok) {
      throw new Error(`Failed to fetch posts: ${raw.status} ${raw.statusText}`);
    }
    
    const data: MarblePostsResponse = await raw.json();
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getSinglePost(slug: string): Promise<MarblePostResponse> {
  try {
    const raw = await fetch(`${url}/${key}/posts/${slug}`, {
      cache: 'no-store' // Always fetch fresh data
    });
    
    if (raw.status === 404) {
      throw new Error('POST_NOT_FOUND');
    }
    
    if (!raw.ok) {
      throw new Error(`Failed to fetch post: ${raw.status} ${raw.statusText}`);
    }
    
    const data: MarblePostResponse = await raw.json();
    return data;
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    throw error;
  }
}

export async function getTags(): Promise<MarbleTagsResponse> {
  try {
    const raw = await fetch(`${url}/${key}/tags`, {
    cache: 'no-store' // Always fetch fresh data
  });
    
    if (!raw.ok) {
      throw new Error(`Failed to fetch tags: ${raw.status} ${raw.statusText}`);
    }
    
    const data: MarbleTagsResponse = await raw.json();
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw error;
  }
}

export async function getCategories(): Promise<MarbleCategoriesResponse> {
  try {
    const raw = await fetch(`${url}/${key}/categories`, {
    cache: 'no-store' // Always fetch fresh data
  });
    
    if (!raw.ok) {
      throw new Error(`Failed to fetch categories: ${raw.status} ${raw.statusText}`);
    }
    
    const data: MarbleCategoriesResponse = await raw.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getAuthors(): Promise<MarbleAuthorsResponse> {
  try {
    const raw = await fetch(`${url}/${key}/authors`, {
    cache: 'no-store' // Always fetch fresh data
  });
    
    if (!raw.ok) {
      throw new Error(`Failed to fetch authors: ${raw.status} ${raw.statusText}`);
    }
    
    const data: MarbleAuthorsResponse = await raw.json();
    return data;
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw error;
  }
}