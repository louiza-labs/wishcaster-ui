# WishCaster

A channel-focused Farcaster client for someone-build to help builders find what to work on

## Features
- Filtering, sorting and searching of casts
- Generated topics for casts
- Deeper stats for a given cast
- Ability to post a bounty for a given post

## Requirements
This relies on Neynar for all Farcaster read/write activities, so the following env variables are needed to get started:
- NEYNAR_API_KEY
- NEXT_PUBLIC_NEYNAR_CLIENT_ID

This also has Posthog tracking, so to enable that, an account is needed for the following environment:
 - NEXT_PUBLIC_POSTHOG_KEY
 - NEXT_PUBLIC_POSTHOG_HOST


## Usage

```bash
pnpm run dev
```





