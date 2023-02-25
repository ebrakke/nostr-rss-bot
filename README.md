# Nostr RSS bot

Tools to create an RSS bot that publishes messages from an RSS feed.

## Requirements

Download and install [bun](https://bun.sh/)

## TL;DR

Set environment variables in `.env`

Create a new relay plugin and use it in `main.ts` (you can follow examples in `src/feed/plugins`)

```
bun start main
```

## Environment variables

RELAY_LIST - The list of relays you wish to publish to
SECRET_KEY - The Nostr secret key for the account you wish to publish these events under
