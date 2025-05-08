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
    <div className="min-h-screen dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center text-orange-600 dark:text-white">
          Insights & Innovation
        </h1>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          Exploring the cutting edge of technology and beyond
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ">
          {posts.map((post: Post) => (
            <div key={post._id} className="bg-white border border-zinc-400 dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-xl transition-all duration-300 flex flex-col">
              <div className="relative h-48 w-full">
                {post.mainImage && (
                  <Image
                    src={urlFor(post.mainImage).width(750).height(440).url()}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                )}
                <div className="absolute top-2 right-2 flex items-center bg-orange-500 dark:bg-gray-800 rounded-full p-1 shadow-md">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(32).height(32).url()}
                      alt={post.author.name}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-2 py-1 rounded-full">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{post.author.name}</span>
                </div>
                <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{post.excerpt}</p>
                <Link href={`/blog/${post.slug.current}`} className="text-black bg-gray-100 p-2 border-2 border-orange-600 rounded-lg text-center hover:text-orange-600 font-semibold text-sm">
                  Read more 
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}