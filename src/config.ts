import type { PostFilter } from "./utils/posts";

export interface SiteConfig {
  title: string;
  slogan: string;
  description?: string;
  site: string,
  social: {
    github?: string;
    linkedin?: string;
    email?: string;
    rss?: boolean;
  };
  homepage: PostFilter;
  googleAnalysis?: string;
  search?: boolean;
}

export const siteConfig: SiteConfig = {
  site: "https://yeying-xingchen.github.io", // your site url
  title: "夜影星辰的博客",
  slogan: "倘能生存，我当然仍要学习。",
  description: "在技术中不失自我，记录，分享，学习。",
  social: {
    github: "https://github.com/yeying-xingchen/blog", // leave empty if you don't want to show the github
    linkedin: "",
    email: "yeying.xingchen@yeah.net", // leave empty if you don't want to show the email
    rss: true, // set this to false if you don't want to provide an rss feed
  },
  homepage: {
    maxPosts: 5,
    tags: [],
    excludeTags: [],
  },
  googleAnalysis: "", // your google analysis id
  search: true, // set this to false if you don't want to provide a search feature
};
