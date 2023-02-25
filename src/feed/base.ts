import { parseStringPromise } from "xml2js";

export interface FeedItem {
  title: string;
  content: string;
  link: string;
  date: number;
  image?: string;
}

export interface Profile {
  name: string;
  about: string;
  picture: string;
  nip05?: string;
}

export interface FeedPlugin<I> {
  url: string;
  profile: Profile;
  feed: () => Promise<FeedItem[]>;
  translateResponse: (response: I) => FeedItem[];
}

interface BasePlugin<I> {
  url: string;
  profile: Profile;
  fetch: (url: string) => Promise<I>;
}

export function createBasePlugin<I>(
  url: string,
  profile: Profile
): BasePlugin<I> {
  return {
    url,
    profile,
    fetch: async (url: string) => {
      const res = await fetch(url).then((r) => r.text());
      return parseStringPromise(res) as I;
    },
  };
}
