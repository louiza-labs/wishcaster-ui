export const LOCAL_STORAGE_KEYS = {
  FARCASTER_USER: "farcasterUser",
  // ... any other keys
}

export const DEFAULT_CAST = `gm Farcaster!

              
- Sent from my Neynar App`

export const PRODUCT_CATEGORIES = `Frames, Frames Tooling, Actions, Memecoins, Shitcoin, Trading, messaging, Wallets, Lending, API's, Clients, Attestations, Gambling, Transportation, DeFi, NFTs Marketplaces, Blockchain Gaming, DAOs, Identity, Social Graphs, Intent Graphs, Decentralized Storage, Marketplaces, Supply Chain, Voting, Identity, Dev Tools, Oracles, Bridges, Content Creation, Staking, Auth, Prediction Markets, IP, Advertising, Privacy, Energy, Healthcare, Education, Charity, Governance, Asset Management, Real Estate, Jobs, Insurance, Music, Freelancing, E-commerce, Ticketing, Reputation, Legal,Payments, Healthcare Records, Social Impact, Data Marketplace, Notaries, Domain Names, Agricultural, Weather, Browsers, Collectibles, RWA, Tokenization, Grants, Channels, Extensions`

interface CategoryDetails {
  label: string
  keywords: Set<string>
}

// Define categories with keywords
export const PRODUCT_CATEGORIES_AS_MAP: { [key: string]: CategoryDetails } = {
  frames: {
    label: "🖼️ Frames",
    keywords: new Set(["frame", "Frame"]),
  },
  framesTooling: {
    label: "🛠️ Frames Tooling",
    keywords: new Set(["frame-tools", "Frame"]),
  },
  actions: {
    label: "🏃 Actions",
    keywords: new Set(["action", "activity", "movement", "task", "operation"]),
  },
  memecoins: {
    label: "😂 Memecoins",
    keywords: new Set(["meme", "joke", "fun", "humor", "parody"]),
  },
  shitcoin: {
    label: "💩 Shitcoin",
    keywords: new Set([
      "shitcoin",
      "low-quality",
      "junk",
      "scam",
      "pump and dump",
    ]),
  },
  trading: {
    label: "📈 Trading",
    keywords: new Set([
      "trade",
      "trading",
      "exchange",
      "buy",
      "sell",
      "market",
    ]),
  },
  messaging: {
    label: "💬 Messaging",
    keywords: new Set([
      "message",
      "messaging",
      "chat",
      "communication",
      "text",
    ]),
  },
  wallets: {
    label: "👛 Wallets",
    keywords: new Set(["wallet", "purse", "funds", "vault", "digital wallet"]),
  },
  lending: {
    label: "💸 Lending",
    keywords: new Set(["lend", "lending", "loan", "borrow", "credit"]),
  },
  apis: {
    label: "🔌 API's",
    keywords: new Set([
      "api",
      "application programming interface",
      "endpoint",
      "interface",
      "integration",
    ]),
  },
  bots: {
    label: "🤖 Bots",
    keywords: new Set(["bot", "robot", "automation", "script"]),
  },
  art: {
    label: "🎨 Art",
    keywords: new Set([
      "painting",
      "art",
      "graphic-art",
      "drawing",
      "artwork",
      "sketching",
      "painter",
    ]),
  },
  clients: {
    label: "👥 Clients",
    keywords: new Set(["client", "customer", "user", "consumer", "patron"]),
  },
  attestations: {
    label: "📜 Attestations",
    keywords: new Set([
      "attest",
      "attestation",
      "proof",
      "verification",
      "certification",
    ]),
  },
  gambling: {
    label: "🎰 Gambling",
    keywords: new Set([
      "gamble",
      "gambling",
      "bet",
      "betting",
      "wager",
      "casino",
    ]),
  },
  transportation: {
    label: "🚆 Transportation",
    keywords: new Set([
      "transport",
      "transportation",
      "travel",
      "transit",
      "logistics",
    ]),
  },
  defi: {
    label: "🌐 DeFi",
    keywords: new Set([
      "defi",
      "decentralized finance",
      "crypto",
      "yield-farming",
      "liquidity",
      "staking",
    ]),
  },
  nftsMarketplaces: {
    label: "🖼️ NFTs Marketplaces",
    keywords: new Set([
      "nft",
      "non-fungible token",
      "marketplace",
      "digital art",
      "collectible",
    ]),
  },
  blockchainGaming: {
    label: "🎮 Blockchain Gaming",
    keywords: new Set([
      "blockchain",
      "gaming",
      "crypto games",
      "play-to-earn",
      "metaverse",
    ]),
  },
  daos: {
    label: "🏛️ DAOs",
    keywords: new Set([
      "dao",
      "decentralized autonomous organization",
      "governance",
      "community",
      "voting",
    ]),
  },
  identity: {
    label: "🆔 Identity",
    keywords: new Set([
      "identity",
      "id",
      "identification",
      "credentials",
      "verification",
    ]),
  },
  socialGraphs: {
    label: "🕸️ Social Graphs",
    keywords: new Set(["social", "graph", "network", "connections"]),
  },
  intentGraphs: {
    label: "🎯 Intent Graphs",
    keywords: new Set(["intent", "purpose", "objective", "goal"]),
  },
  decentralizedStorage: {
    label: "🗄️ Decentralized Storage",
    keywords: new Set([
      "storage",
      "decentralized",
      "data",
      "cloud",
      "dstorage",
    ]),
  },
  marketplaces: {
    label: "🛒 Marketplaces",
    keywords: new Set([
      "marketplace",
      "market",
      "bazaar",
      "exchange",
      "platform",
    ]),
  },
  supplyChain: {
    label: "📦 Supply Chain",
    keywords: new Set([
      "supply",
      "chain",
      "logistics",
      "distribution",
      "inventory",
    ]),
  },
  voting: {
    label: "🗳️ Voting",
    keywords: new Set(["vote", "voting", "election", "ballot", "poll"]),
  },
  devTools: {
    label: "🔧 Dev Tools",
    keywords: new Set([
      "dev tools",
      "development",
      "programming",
      "software",
      "coding",
    ]),
  },
  oracles: {
    label: "🔮 Oracles",
    keywords: new Set([
      "oracle",
      "data feed",
      "prediction",
      "forecast",
      "price feed",
    ]),
  },
  bridges: {
    label: "🌉 Bridges",
    keywords: new Set([
      "bridge",
      "bridging",
      "connection",
      "cross-chain",
      "interoperability",
    ]),
  },
  contentCreation: {
    label: "🎨 Content Creation",
    keywords: new Set([
      "content",
      "creation",
      "media",
      "production",
      "publishing",
    ]),
  },
  newsletter: {
    label: "📃 Newsletter",
    keywords: new Set(["newsletter"]),
  },
  books: {
    label: "📚 Books",
    keywords: new Set(["books", "novels", "book"]),
  },
  staking: {
    label: "💰 Staking",
    keywords: new Set(["stake", "staking", "investment", "yield", "rewards"]),
  },
  auth: {
    label: "🔑 Auth",
    keywords: new Set([
      "auth",
      "authentication",
      "login",
      "verification",
      "access",
    ]),
  },
  predictionMarkets: {
    label: "🔮 Prediction Markets",
    keywords: new Set([
      "prediction",
      "market",
      "forecast",
      "betting",
      "speculation",
    ]),
  },
  ip: {
    label: "©️ IP",
    keywords: new Set([
      "ip",
      "intellectual property",
      "rights",
      "patent",
      "trademark",
    ]),
  },
  advertising: {
    label: "📢 Advertising",
    keywords: new Set([
      "advertising",
      "ads",
      "promotion",
      "marketing",
      "campaign",
    ]),
  },
  privacy: {
    label: "🔒 Privacy",
    keywords: new Set([
      "privacy",
      "confidential",
      "security",
      "anonymity",
      "protection",
    ]),
  },
  energy: {
    label: "⚡ Energy",
    keywords: new Set([
      "energy",
      "power",
      "electricity",
      "renewable",
      "sustainability",
    ]),
  },
  healthcare: {
    label: "🏥 Healthcare",
    keywords: new Set([
      "healthcare",
      "health",
      "medicine",
      "medical",
      "wellness",
    ]),
  },
  education: {
    label: "🎓 Education",
    keywords: new Set([
      "education",
      "learning",
      "teaching",
      "school",
      "training",
    ]),
  },
  charity: {
    label: "❤️ Charity",
    keywords: new Set([
      "charity",
      "donation",
      "philanthropy",
      "non-profit",
      "fundraising",
    ]),
  },
  governance: {
    label: "🏛️ Governance",
    keywords: new Set([
      "governance",
      "government",
      "policy",
      "regulation",
      "administration",
    ]),
  },
  assetManagement: {
    label: "📈 Asset Management",
    keywords: new Set([
      "asset",
      "management",
      "investment",
      "portfolio",
      "wealth",
    ]),
  },
  realEstate: {
    label: "🏠 Real Estate",
    keywords: new Set(["real estate", "property", "land", "housing", "estate"]),
  },
  jobs: {
    label: "💼 Jobs",
    keywords: new Set(["job", "employment", "work", "career", "position"]),
  },
  insurance: {
    label: "🛡️ Insurance",
    keywords: new Set([
      "insurance",
      "coverage",
      "policy",
      "risk",
      "protection",
    ]),
  },
  music: {
    label: "🎵 Music",
    keywords: new Set(["music", "song", "melody", "audio", "track"]),
  },
  zk: {
    label: "🙈 ZK",
    keywords: new Set(["zero-knowledge", "zk", "zk-snarks", "privacy proof"]),
  },
  freelancing: {
    label: "💻 Freelancing",
    keywords: new Set([
      "freelance",
      "freelancing",
      "contract",
      "gig",
      "independent",
    ]),
  },
  ecommerce: {
    label: "🛍️ E-commerce",
    keywords: new Set([
      "e-commerce",
      "shopping",
      "online store",
      "retail",
      "commerce",
    ]),
  },
  ticketing: {
    label: "🎟️ Ticketing",
    keywords: new Set(["ticket", "ticketing", "admission", "event", "entry"]),
  },
  reputation: {
    label: "🌟 Reputation",
    keywords: new Set([
      "reputation",
      "credibility",
      "trust",
      "rating",
      "review",
    ]),
  },
  legal: {
    label: "⚖️ Legal",
    keywords: new Set([
      "legal",
      "law",
      "regulation",
      "compliance",
      "jurisdiction",
    ]),
  },
  payments: {
    label: "💳 Payments",
    keywords: new Set([
      "payment",
      "payments",
      "transaction",
      "transfer",
      "remittance",
    ]),
  },
  healthcareRecords: {
    label: "📋 Healthcare Records",
    keywords: new Set([
      "healthcare records",
      "medical records",
      "health records",
      "EHR",
      "EMR",
    ]),
  },
  socialImpact: {
    label: "🌍 Social Impact",
    keywords: new Set([
      "social impact",
      "impact",
      "community",
      "change",
      "development",
    ]),
  },
  dataMarketplace: {
    label: "📊 Data Marketplace",
    keywords: new Set([
      "data marketplace",
      "data",
      "marketplace",
      "exchange",
      "trading",
    ]),
  },
  notaries: {
    label: "✍️ Notaries",
    keywords: new Set([
      "notary",
      "notaries",
      "certification",
      "authentication",
      "verification",
    ]),
  },
  domainNames: {
    label: "🌐 Domain Names",
    keywords: new Set(["domain", "domain names", "website", "url", "dns"]),
  },
  agricultural: {
    label: "🌾 Agricultural",
    keywords: new Set([
      "agriculture",
      "agricultural",
      "farming",
      "crop",
      "farm",
    ]),
  },
  weather: {
    label: "🌦️ Weather",
    keywords: new Set([
      "weather",
      "climate",
      "forecast",
      "meteorology",
      "temperature",
    ]),
  },
  browsers: {
    label: "🌐 Browsers",
    keywords: new Set(["browser", "browsers", "web", "internet", "search"]),
  },
  collectibles: {
    label: "🏺 Collectibles",
    keywords: new Set([
      "collectible",
      "collectibles",
      "collection",
      "antique",
      "rare",
    ]),
  },
  rwa: {
    label: "🏗️ RWA",
    keywords: new Set([
      "rwa",
      "real-world asset",
      "assets",
      "physical asset",
      "tangible asset",
    ]),
  },
  tokenization: {
    label: "🔖 Tokenization",
    keywords: new Set([
      "token",
      "tokenization",
      "tokenize",
      "digital asset",
      "crypto token",
    ]),
  },
  grants: {
    label: "💸 Grants",
    keywords: new Set(["grant", "grants", "funding", "subsidy", "endowment"]),
  },
  channels: {
    label: "📡 Channels",
    keywords: new Set([
      "channel",
      "channels",
      "communication",
      "broadcast",
      "stream",
    ]),
  },
  extensions: {
    label: "➕ Extensions",
    keywords: new Set([
      "extension",
      "extensions",
      "add-on",
      "plugin",
      "module",
    ]),
  },
}
export const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]
