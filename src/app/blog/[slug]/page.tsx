import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types'; // Import the type

interface PostParams {
  params: { slug: string };
}

interface Author {
  name: string;
  image: {
    asset: {
      _ref: string;
    };
  };
}

interface Post {
  title: string;
  mainImage: {
    asset: {
      _ref: string;
    };
  };
  body: PortableTextBlock[]; // Use the specific type for Portable Text
  author: Author;
  publishedAt: string;
}

const query = groq`
  *[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    body,
    author->{name, image},
    publishedAt
  }
`;

const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { asset: { _ref: string }; alt?: string } }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <div className="relative w-full h-64 md:h-96 my-8">
          <Image
            src={urlFor(value).width(800).height(600).fit('max').auto('format').url()}
            alt={value.alt || ' '}
            className="rounded-lg"
            fill
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>,
    normal: ({ children }: { children?: React.ReactNode }) => <p className="mt-4 leading-7">{children}</p>,
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul className="mt-4 list-disc list-inside">{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol className="mt-4 list-decimal list-inside">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li className="mt-2">{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li className="mt-2">{children}</li>,
  },
  marks: {
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a href={value?.href} target={target} rel={target === '_blank' ? 'noindex nofollow' : undefined} className="text-blue-500 hover:text-blue-600 transition-colors duration-200">
          {children}
        </a>
      );
    },
  },
};

export default async function BlogPost({ params }: PostParams) {
  const post = await client.fetch<Post>(query, { slug: params.slug });

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link href="/blog" className="text-sm font-medium bg-orange-600 p-2  border border-black rounded-lg text-black hover:text-gray-400 dark:text-gray-400 dark:hover:text-white transition-colors duration-200">
          ← Back to Blog
        </Link>
        <article className="mt-8">
          <header className="mb-16">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{post.title}</h1>
            <div className="mt-6 flex items-center">
              {post.author.image && (
                <Image
                  src={urlFor(post.author.image).width(40).height(40).url()}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                  <time dateTime={post.publishedAt}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </div>
          </header>
          {post.mainImage && (
          <div className="mb-12 relative h-[400px] md:h-[500px] border border-orange-600 rounded-lg">
            <Image
              src={urlFor(post.mainImage).width(1240).height(740).url()}
              alt={post.title}
              fill
              className=" rounded-lg shadow-lg"
            />
          </div>
          )}
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText
              value={post.body}
              components={ptComponents}
            />
          </div>
        </article>
      </div>
    </div>
  );
}