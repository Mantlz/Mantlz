import { getPosts } from '@/lib/query';
import { MarblePost } from '@/types/marble-cms';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Container } from '@/components/global/landing/container';
import { Navbar } from '@/components/global/landing/navbar';
import Footer from '@/components/global/landing/footer';

// Revalidate this page every hour
export const revalidate = 3600;

export const metadata = {
  title: 'Blog | Mantlz',
  description: 'Read the latest articles and insights from the Mantlz team.',
};

export default async function BlogPage() {
  try {
    const { posts } = await getPosts();

    return (
      <div className="min-h-screen bg-background">
        <Container>
          <Navbar />
        </Container>
        
        <main className="py-16">
          <Container>
            <div className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-foreground mb-6">
                Blog
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover insights, tutorials, and updates from the Mantlz team.
              </p>
            </div>

            {posts && posts.length > 0 ? (
               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                 {posts.map((post: MarblePost) => (
                   <article
                     key={post.id}
                     className="bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
                   >
                     {post.coverImage && (
                       <div className="aspect-video w-full overflow-hidden">
                         <img
                           src={post.coverImage}
                           alt={post.title}
                           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         />
                       </div>
                     )}
                 
                     <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {post.authors && post.authors.length > 0 && post.authors[0] && (
                      <span className="flex items-center gap-2">
                        {post.authors[0].image && (
                          <img
                            src={post.authors[0].image}
                            alt={post.authors[0].name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {post.authors[0].name}
                      </span>
                    )}
                    <span>•</span>
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

                      <h2 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/blog/${post.slug}`}>
                          {post.title}
                        </Link>
                      </h2>

                      {post.description && (
                        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed">
                          {post.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.category && (
                          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {post.category.name}
                          </span>
                        )}
                        {post.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag.id}
                            className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-full font-medium"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-2 group/link text-sm"
                      >
                        Read more 
                        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 max-w-2xl mx-auto">
                <div className="bg-card border border-border rounded-xl p-12">
                  <h2 className="text-3xl font-semibold text-foreground mb-4">
                    No posts found
                  </h2>
                  <p className="text-muted-foreground text-lg">
                    Check back later for new content!
                  </p>
                </div>
              </div>
            )}
          </Container>
        </main>
        
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error loading blog posts:', error);
    
    return (
      <div className="min-h-screen bg-background">
        <Container>
          <Navbar />
        </Container>
        
        <main className="py-16">
          <Container>
            <div className="text-center py-20 max-w-2xl mx-auto">
              <h1 className="text-5xl font-bold text-foreground mb-8">
                Blog
              </h1>
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-destructive mb-4">
                  Unable to load blog posts
                </h2>
                <p className="text-muted-foreground text-lg">
                  There was an error loading the blog posts. Please try again later.
                </p>
              </div>
            </div>
          </Container>
        </main>
        
        <Footer />
      </div>
    );
  }
}