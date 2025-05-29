import { client } from '@/sanity/lib/client';
import { urlFor } from '@/sanity/lib/image';
import { groq } from 'next-sanity';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import { Suspense } from 'react';

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

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
  body: PortableTextBlock[];
  author: Author;
  publishedAt: string;
}

export const revalidate = 3600 // 1 hour

// Generate static params for all blog posts
export async function generateStaticParams() {
  const query = groq`*[_type == "post"]{ 'slug': slug.current }`;
  const slugs = await client.fetch<Array<{ slug: string }>>(query);
  
  return slugs.map((slug) => ({
    slug: slug.slug,
  }));
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
        <div className="relative w-full h-64 md:h-96 my-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-900">
          <Image
            src={urlFor(value).width(1200).height(800).fit('max').auto('format').url()}
            alt={value.alt || ' '}
            className="rounded-2xl object-cover"
            fill
          />
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => <h1 className="text-4xl font-bold mt-12 mb-6 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-100">{children}</h1>,
    h2: ({ children }: { children?: React.ReactNode }) => <h2 className="text-3xl font-semibold mt-10 mb-5 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-100">{children}</h2>,
    h3: ({ children }: { children?: React.ReactNode }) => <h3 className="text-2xl font-semibold mt-8 mb-4 bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-100">{children}</h3>,
    normal: ({ children }: { children?: React.ReactNode }) => <p className="mt-6 leading-8 text-lg text-gray-600 dark:text-gray-300">{children}</p>,
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => <ul className="mt-6 mb-8 list-disc list-inside text-lg text-gray-600 dark:text-gray-300 marker:text-gray-400 dark:marker:text-gray-500 space-y-3">{children}</ul>,
    number: ({ children }: { children?: React.ReactNode }) => <ol className="mt-6 mb-8 list-decimal list-inside text-lg text-gray-600 dark:text-gray-300 marker:text-gray-400 dark:marker:text-gray-500 space-y-3">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    link: ({ value, children }: { value?: { href: string }; children?: React.ReactNode }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a 
          href={value?.href} 
          target={target} 
          rel={target === '_blank' ? 'noindex nofollow' : undefined} 
          className="text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-colors duration-200"
        >
          {children}
        </a>
      );
    },
  },
};

async function getPost(slug: string) {
  const post = await client.fetch<Post>(query, { slug });
  return post;
}

export default async function BlogPost({ params }: Props) {
  // Await the params
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600 dark:text-gray-400">Post not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen transition-colors duration-300">
      <Suspense>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <nav className="mb-16">
            <Link 
              href="/blog" 
              className="inline-flex items-center text-sm font-medium bg-gray-50 hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-6 py-3 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 transition-all duration-200 hover:shadow-md"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </nav>
          
          <article className="relative">
            <div className="absolute inset-0 -z-10 -top-10 -bottom-20 -left-10 -right-10 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:from-zinc-900/50 dark:via-black/30 dark:to-zinc-900/50 rounded-3xl blur-3xl opacity-70"></div>
            
            {/* {post.mainImage && (
              <div className="mb-12 relative  overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900">
                <Image
                  src={urlFor(post.mainImage).width(1600).height(900).url()}
                  alt={post.title}
                  fill
                  className="rounded-2xl shadow-xl object-cover"
                  priority
                />
              </div>
            )} */}

            <header className="mb-16 text-center">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-gray-900 to-black bg-clip-text text-transparent dark:from-white dark:to-gray-100 leading-tight mb-8">{post.title}</h1>
              
              <div className="flex items-center justify-center">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-full p-1">
                  {post.author.image && (
                    <Image
                      src={urlFor(post.author.image).width(48).height(48).url()}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  )}
                </div>
                <div className="ml-4 text-left">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">{post.author.name}</p>
                  <time dateTime={post.publishedAt} className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
              </div>
            </header>

            <div className="prose prose-xl dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-gray-900 dark:prose-a:text-white hover:prose-a:text-gray-600 dark:hover:prose-a:text-gray-400 max-w-none">
              <PortableText
                value={post.body}
                components={ptComponents}
              />
            </div>
          </article>
        </div>
      </Suspense>
    </div>
  );
}