import { createNostrClient } from "./nostr";
import { createReasonFeedPlugin } from "./feed/plugins/reason";
import invariant from "tiny-invariant";

invariant(process.env.RELAY_LIST, "RELAY_LIST must be set");
invariant(process.env.SECRET_KEY, "SECRET_KEY must be set");

const nostrClient = createNostrClient(
  process.env.SECRET_KEY,
  process.env.RELAY_LIST.split(",")
);
await nostrClient.init();
const url = "http://reason.com/rss/";
const reasonPlugin = createReasonFeedPlugin(url);
const feed = await reasonPlugin.feed();
await nostrClient.setProfile(reasonPlugin.profile);
// await Promise.all(feed.map((item) => nostrClient.publish(item)));
console.log("Published!");
nostrClient.disconnect();
