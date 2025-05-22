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
          { title: "Next.js", href: "/nextjs" },
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
    title: "Features",
    href: "/features",
    noLink: true,
    items: [
      { title: "Form Types", href: "/form-types" },
      { title: "Error Handling", href: "/error-handling" },
      { title: "File Upload", href: "/file-upload" },
      { title: "Product Fields", href: "/product-fields" },
      { title: "Users Joined", href: "/users-joined" },
    ],
  },
  {
    title: "Appearance",
    href: "/appearance",
    noLink: true,
    items: [
      { title: "Themes", href: "/themes" },
    ],
  },
  {
    title: "API Reference",
    href: "/api-reference",
    noLink: true,
    items: [
      { title: "Overview", href: "/overview" },
      { title: "Authentication", href: "/authentication" },
      { title: "Client Configuration", href: "/client-config" },
      { 
        title: "v1 API",
        href: "/v1",
        items: [
          { title: "List Forms", href: "/list" },
          { title: "Get Form", href: "/get" },
          { title: "Submit Form", href: "/submit" },
          { title: "Analytics", href: "/analytics" },
        ]
      },
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
