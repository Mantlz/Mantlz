import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Link from 'next/link';
import Image from 'next/image';

interface ImageType {
  asset: {
    _ref: string;
    _type: string;
  };
}

interface Author {
  name: string;
  image: ImageType;
}

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  mainImage: ImageType;
  excerpt: string;
  author: Author;
}

const query = groq`
{
  "posts": *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    excerpt,
    "author": author->{name, image}
  }
}
`;

export default async function BlogPage() {
  const { posts } = await client.fetch<{ posts: Post[] }>(query);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-4 relative mb-16">
          <div className="absolute inset-0 -z-10 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-zinc-900/50 dark:via-black/30 dark:to-zinc-900/50 rounded-3xl blur-3xl opacity-70"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-100">
            Insights & Innovation
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Exploring the cutting edge of technology and beyond. Discover the latest insights, tutorials, and industry trends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-12 lg:gap-y-16">
          {posts.map((post: Post) => (
            <Link 
              href={`/blog/${post.slug.current}`}
              key={post._id} 
              className="group"
            >
              <article className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-start hover:bg-gray-50 dark:hover:bg-zinc-900/50 p-6 -mx-6 rounded-2xl transition-all duration-300">
                <div className="lg:col-span-4 relative aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
                  {post.mainImage && (
                    <Image
                      src={urlFor(post.mainImage).width(800).height(500).url()}
                      alt={post.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {post.author.image && (
                        <Image
                          src={urlFor(post.author.image).width(32).height(32).url()}
                          alt={post.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                    <time className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-black dark:group-hover:text-gray-200 transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-base text-gray-600 dark:text-gray-400 line-clamp-2">{post.excerpt}</p>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                      Read article
                      <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}