import { getSinglePost, getPosts } from '@/lib/query';
import { MarblePost } from '@/types/marble-cms';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { post } = await getSinglePost(params.slug);
    
    return {
      title: post.title,
      description: post.description || 'Read this blog post',
      openGraph: {
        title: post.title,
        description: post.description || '',
        images: post.coverImage ? [post.coverImage] : [],
        type: 'article',
        publishedTime: post.publishedAt,
        authors: post.authors && post.authors.length > 0 && post.authors[0] ? [post.authors[0].name] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description || '',
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (error) {
    if (error instanceof Error && error.message === 'POST_NOT_FOUND') {
      notFound();
    }
    return {
      title: 'Post Not Found | Mantlz Blog',
      description: 'The requested blog post could not be found.',
    };
  }
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const { posts } = await getPosts();
    
    return posts.map((post: MarblePost) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Revalidate this page every hour
export const revalidate = 3600;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const { post } = await getSinglePost(params.slug);
    
    if (!post) {
      notFound();
    }

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/blog" className="hover:text-gray-700 dark:hover:text-gray-300">
                Blog
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-white font-medium">
              {post.title}
            </li>
          </ol>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {/* Category */}
            {post.category && (
              <div className="flex flex-wrap gap-2 mb-6">
                <span
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full font-medium"
                >
                  {post.category.name}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
              {post.authors && post.authors.length > 0 && post.authors[0] && (
                <div className="flex items-center gap-3">
                  {post.authors[0].image && (
                    <img
                      src={post.authors[0].image}
                      alt={post.authors[0].name}
                      className="w-10 h-10 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {post.authors[0].name}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-sm">
                <time dateTime={post.publishedAt}>
                  {post.publishedAt && !isNaN(new Date(post.publishedAt).getTime()) 
                    ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })
                    : 'Recently'
                  }
                </time>
                {post.reading_time && (
                  <>
                    <span>•</span>
                    <span>{post.reading_time} min read</span>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div 
              className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Updated Date */}
            {post.updatedAt !== post.publishedAt && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Last updated: {post.updatedAt && !isNaN(new Date(post.updatedAt).getTime()) 
                    ? formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
                    : 'Recently'
                  }
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Back to Blog Link */}
        <div className="mt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    if (error instanceof Error && error.message === 'POST_NOT_FOUND') {
      notFound();
    }
    // For other errors, re-throw to show error page
    throw error;
  }
}