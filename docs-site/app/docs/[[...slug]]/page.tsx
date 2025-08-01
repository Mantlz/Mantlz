import Toc from "../../../components/toc";
import { page_routes } from "../../../lib/routes-config";
import { notFound } from "next/navigation";
import { getDocsForSlug } from "../../../lib/markdown";
import { Typography } from "../../../components/typography";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocsPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const pathName = slug.join("/");
  const res = await getDocsForSlug(pathName);

  if (!res) notFound();
  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] py-10">
        <Typography>
          <h1 className="text-3xl -mt-2">{res.frontmatter.title}</h1>
          <p className="-mt-4 text-muted-foreground text-[16.5px]">
            {res.frontmatter.description}
          </p>
          <div>{res.content}</div>
        </Typography>
      </div>
      <Toc path={pathName} />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug = [] } = await params;
  const pathName = slug.join("/");
  const res = await getDocsForSlug(pathName);
  if (!res) return null;
  const { frontmatter } = res;
  return {
    title: frontmatter.title,
    description: frontmatter.description,
  };
}

export function generateStaticParams() {
  return page_routes.map((item) => ({
    slug: item.href.split("/").slice(1),
  }));
}
