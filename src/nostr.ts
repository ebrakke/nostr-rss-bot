/**
 * functions related to nostr things
 */
import {
  Relay,
  Event,
  SimplePool,
  getEventHash,
  signEvent,
  getPublicKey,
  Pub,
  UnsignedEvent,
} from "nostr-tools";
import { FeedItem, Profile } from "./feed";
interface Nostr {
  pool: SimplePool;
  privateKey: string;
  publicKey: string;
  init: () => Promise<Relay[]>;
  disconnect: () => void;
  publish: (event: FeedItem) => Promise<Pub[]>;
  setProfile: (profile: Profile) => Promise<void>;
}

export const createNostrClient = (
  privateKey: string,
  relays: string[]
): Nostr => {
  const pool = new SimplePool();
  const publish = (async (item) => {
    const event = {
      kind: 1,
      content: `${item.title}\n${item.content}\n\n${item.link}`,
      created_at: item.date,
      pubkey: getPublicKey(privateKey),
      tags: [
        ["d", "rss"],
        ["r", item.link],
      ],
    } as Event;
    event.id = getEventHash(event);
    event.sig = signEvent(event, privateKey);
    return pool.publish(relays, event);
  }) satisfies Nostr["publish"];
  return {
    pool,
    init: async () => {
      return Promise.all(relays.map((r) => pool.ensureRelay(r)));
    },
    privateKey,
    publicKey: getPublicKey(privateKey),
    disconnect: () => pool.close(relays),
    publish,
    setProfile: async (profile: Profile) => {
      const profileEvent = profileToEvent(profile, privateKey);
      pool.publish(relays, profileEvent);
    },
  } satisfies Nostr;
};

const profileToEvent = (profile: Profile, sk: string): Event => {
  const ue = {
    kind: 0,
    content: JSON.stringify(profile),
    created_at: Math.floor(Date.now() / 1000),
    pubkey: getPublicKey(sk),
    tags: [],
  } as UnsignedEvent;
  const event = { ...ue } as Event;
  event.id = getEventHash(event);
  event.sig = signEvent(event, sk);
  return event;
};
