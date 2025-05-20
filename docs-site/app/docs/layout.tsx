'use client'

import { Leftbar } from "../../components/leftbar";
import { MDXProvider } from '@mdx-js/react';
import { mdxComponents } from "../../components/mdx";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-start gap-14">
      <Leftbar key="leftbar" />
      <div className="flex-[4]">
        <MDXProvider components={mdxComponents}>
          {children}
        </MDXProvider>
      </div>
    </div>
  );
}
