import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/c/"],
      },
    ],
    sitemap: "https://askacela.xyz/sitemap.xml",
  };
}
