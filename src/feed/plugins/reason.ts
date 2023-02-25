import { getUnixTime } from "date-fns";
import { createBasePlugin, type FeedItem, type FeedPlugin } from "../base";

interface ReasonFeedResponse {
  rss: {
    channel: {
      title: string[];
      link: string[];
      description: string[];
      item: {
        title: string[];
        description: string[];
        link: string[];
        "media:content": {
          $: {
            url: string;
            medium: "image";
            width: string;
            height: string;
          };
        }[];
      }[];
    }[];
  };
}

export function createReasonFeedPlugin(
  url: string
): FeedPlugin<ReasonFeedResponse> {
  const base = createBasePlugin<ReasonFeedResponse>(url, {
    name: "Reason ",
    about:
      "Free minds and free markets. This account has no affiliation with Reason Magazine, just publishing the RSS feed",
    picture:
      "https://d2eehagpk5cl65.cloudfront.net/wp-content/themes/reason-dot-com-theme/dist/images/r-in-g1-01_36e38c66.svg",
  });
  const translateResponse = ((feed: ReasonFeedResponse) => {
    return feed.rss.channel[0].item.map((item) => {
      return {
        title: item.title[0],
        link: item.link[0],
        content: item.description[0],
        image: item["media:content"]?.[0]?.$?.url,
        date: dateFromLink(item.link[0]),
      } satisfies FeedItem;
    });
  }) satisfies FeedPlugin<ReasonFeedResponse>["translateResponse"];

  return {
    ...base,
    translateResponse,
    feed: async () => {
      const response = await base.fetch(base.url);
      return translateResponse(response);
    },
  };
}

function dateFromLink(link: string): number {
  try {
    const parts = new URL(link).pathname.split("/");
    const [year, month, day] = parts.reduce((acc, curr) => {
      if (acc.length === 3) return acc;
      if (isNaN(parseInt(curr))) return acc;
      return [...acc, parseInt(curr)];
    }, [] as number[]);
    const date = new Date(year, month - 1, day);
    return getUnixTime(date);
  } catch {
    return Math.floor(Date.now() / 1000);
  }
}
