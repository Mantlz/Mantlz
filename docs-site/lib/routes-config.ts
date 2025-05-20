// for page navigation & to sort on leftbar

export type EachRoute = {
  title: string;
  href: string;
  noLink?: true;
  items?: EachRoute[];
};

export const ROUTES: EachRoute[] = [
  {
    title: "Getting Started",
    href: "/getting-started",
    noLink: true,
    items: [
      { title: "Introduction", href: "/introduction" },
      {
        title: "Installation",
        href: "/installation",
        items: [
          { title: "Nextjs", href: "/nextjs" },
        ],
      },
      {
        title: "Components",
        href: "/components",
        items: [
          { title: "Overview", href: "" },
        
        ],
      },
    ],
  },
  {
    title: "Appearance",
    href: "/appearance",
    noLink: true,
   
  },
  {
    title: "API Reference",
    href: "/api-reference",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
      { title: "Authentication", href: "/authentication" },
      { title: "Providers and Hooks", href: "/context" },
      { title: "Redirects", href: "/redirects" },
      { 
        title: "Forms",
        href: "/forms",
        items: [
          { title: "List Forms", href: "/list" },
          { title: "Get Form", href: "/get" },
          { title: "Users Joined", href: "/users-joined" },
        ]
      },
      { 
        title: "Submissions",
        href: "/submissions",
        items: [
          { title: "Submit Form", href: "/submit" },
          { title: "List Submissions", href: "/list" },
        ]
      },
      { title: "Analytics", href: "/analytics" },
      { title: "Error Handling", href: "/error-handling" },
    ],
  },
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: EachRoute) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const page_routes = ROUTES.map((it) => getRecurrsiveAllLinks(it)).flat();
