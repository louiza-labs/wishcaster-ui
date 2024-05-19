export const LOCAL_STORAGE_KEYS = {
  FARCASTER_USER: "farcasterUser",
  // ... any other keys
}

export const DEFAULT_CAST = `gm Farcaster!

              
- Sent from my Neynar App`

export const PRODUCT_CATEGORIES = `Frames, Frames Tooling, Actions, Memecoins, Shitcoin, Trading, messaging, Wallets, Lending, API's, Clients, Attestations, Gambling, Transportation, DeFi, NFTs Marketplaces, Blockchain Gaming, DAOs, Identity, Social Graphs, Intent Graphs, Decentralized Storage, Marketplaces, Supply Chain, Voting, Identity, Dev Tools, Oracles, Bridges, Content Creation, Staking, Auth, Prediction Markets, IP, Advertising, Privacy, Energy, Healthcare, Education, Charity, Governance, Asset Management, Real Estate, Jobs, Insurance, Music, Freelancing, E-commerce, Ticketing, Reputation, Legal,Payments, Healthcare Records, Social Impact, Data Marketplace, Notaries, Domain Names, Agricultural, Weather, Browsers, Collectibles, RWA, Tokenization, Grants, Channels, Extensions`

type Categories = {
  [category: string]: Set<string>
}

// Define categories with keywords
export const PRODUCT_CATEGORIES_AS_SETS: Categories = {
  Frames: new Set(["frame", "Frame", "structure", "framework"]),
  "Frames Tooling": new Set(["tool", "tooling", "instrument"]),
  Actions: new Set(["action", "activity", "movement"]),
  Memecoins: new Set(["meme", "joke", "fun"]),
  Shitcoin: new Set(["shitcoin", "low-quality", "junk"]),
  Trading: new Set(["trade", "trading", "exchange"]),
  Messaging: new Set(["message", "messaging", "chat"]),
  Wallets: new Set(["wallet", "purse", "funds"]),
  Lending: new Set(["lend", "lending", "loan"]),
  "API's": new Set(["api", "application programming interface", "endpoint"]),
  Clients: new Set(["client", "customer", "user"]),
  Attestations: new Set(["attest", "attestation", "proof"]),
  Gambling: new Set(["gamble", "gambling", "bet"]),
  Transportation: new Set(["transport", "transportation", "travel"]),
  DeFi: new Set(["defi", "decentralized finance", "crypto"]),
  "NFTs Marketplaces": new Set(["nft", "non-fungible token", "marketplace"]),
  "Blockchain Gaming": new Set(["blockchain", "gaming", "crypto games"]),
  DAOs: new Set(["dao", "decentralized autonomous organization", "governance"]),
  Identity: new Set(["identity", "id", "identification"]),
  "Social Graphs": new Set(["social", "graph", "network"]),
  "Intent Graphs": new Set(["intent", "graph", "purpose"]),
  "Decentralized Storage": new Set(["storage", "decentralized", "data"]),
  Marketplaces: new Set(["marketplace", "market", "bazaar"]),
  "Supply Chain": new Set(["supply", "chain", "logistics"]),
  Voting: new Set(["vote", "voting", "election"]),
  "Dev Tools": new Set(["dev tools", "development", "programming"]),
  Oracles: new Set(["oracle", "data feed", "prediction"]),
  Bridges: new Set(["bridge", "bridging", "connection"]),
  "Content Creation": new Set(["content", "creation", "media"]),
  Staking: new Set(["stake", "staking", "investment"]),
  Auth: new Set(["auth", "authentication", "login"]),
  "Prediction Markets": new Set(["prediction", "market", "forecast"]),
  IP: new Set(["ip", "intellectual property", "rights"]),
  Advertising: new Set(["advertising", "ads", "promotion"]),
  Privacy: new Set(["privacy", "confidential", "security"]),
  Energy: new Set(["energy", "power", "electricity"]),
  Healthcare: new Set(["healthcare", "health", "medicine"]),
  Education: new Set(["education", "learning", "teaching"]),
  Charity: new Set(["charity", "donation", "philanthropy"]),
  Governance: new Set(["governance", "government", "policy"]),
  "Asset Management": new Set(["asset", "management", "investment"]),
  "Real Estate": new Set(["real estate", "property", "land"]),
  Jobs: new Set(["job", "employment", "work"]),
  Insurance: new Set(["insurance", "coverage", "policy"]),
  Music: new Set(["music", "song", "melody"]),
  Freelancing: new Set(["freelance", "freelancing", "contract"]),
  "E-commerce": new Set(["e-commerce", "shopping", "online store"]),
  Ticketing: new Set(["ticket", "ticketing", "admission"]),
  Reputation: new Set(["reputation", "credibility", "trust"]),
  Legal: new Set(["legal", "law", "regulation"]),
  Payments: new Set(["payment", "payments", "transaction"]),
  "Healthcare Records": new Set([
    "healthcare records",
    "medical records",
    "health records",
  ]),
  "Social Impact": new Set(["social impact", "impact", "community"]),
  "Data Marketplace": new Set(["data marketplace", "data", "marketplace"]),
  Notaries: new Set(["notary", "notaries", "certification"]),
  "Domain Names": new Set(["domain", "domain names", "website"]),
  Agricultural: new Set(["agriculture", "agricultural", "farming"]),
  Weather: new Set(["weather", "climate", "forecast"]),
  Browsers: new Set(["browser", "browsers", "web"]),
  Collectibles: new Set(["collectible", "collectibles", "collection"]),
  RWA: new Set(["rwa", "real-world asset", "assets"]),
  Tokenization: new Set(["token", "tokenization", "tokenize"]),
  Grants: new Set(["grant", "grants", "funding"]),
  Channels: new Set(["channel", "channels", "communication"]),
  Extensions: new Set(["extension", "extensions", "add-on"]),
}
