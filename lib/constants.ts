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
    keywords: new Set(["frame", "OpenGraph"]),
  },
  framesTooling: {
    label: "🛠️ Frames Tooling",
    keywords: new Set(["frame-api", "frame-dev-tools"]),
  },
  actions: {
    label: "🏃 Actions",
    keywords: new Set(["action"]),
  },
  memecoins: {
    label: "😂 Memecoins",
    keywords: new Set(["memecoin", "shitcoin"]),
  },
  trading: {
    label: "📈 Trading",
    keywords: new Set(["trade", "trading", "exchange", "swap"]),
  },
  messaging: {
    label: "💬 Messaging",
    keywords: new Set(["message", "messaging", "chat"]),
  },
  wallets: {
    label: "👛 Wallets",
    keywords: new Set(["wallet", "digital wallet", "multisig", "self-custody"]),
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
      "integrations",
    ]),
  },
  bots: {
    label: "🤖 Bots",
    keywords: new Set(["bot", "automate", "automation", "script"]),
  },
  art: {
    label: "🎨 Art",
    keywords: new Set([
      "painting",
      "art",
      "graphic-art",
      "dance",
      "sketch",
      "doodle",
      "drawing",
      "artwork",
      "sketching",
      "paint",
      "painter",
    ]),
  },
  clients: {
    label: "👥 Clients",
    keywords: new Set(["client"]),
  },
  attestations: {
    label: "📜 Attestations",
    keywords: new Set(["attest", "attestation", "certify"]),
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
      "poker",
      "blackjack",
    ]),
  },
  transportation: {
    label: "🚆 Transportation",
    keywords: new Set([
      "transport",
      "transportation",
      "travel",
      "train",
      "car",
      "plane",
      "roads",
      "tunnel",
      "transit",
    ]),
  },
  purple: {
    label: "🟪 Purple",
    keywords: new Set(["purple dao"]),
  },
  l2: {
    label: "⛓️ L2's",
    keywords: new Set(["layer 2", "l2"]),
  },
  defi: {
    label: "🌐 DeFi",
    keywords: new Set([
      "defi",
      "decentralized finance",
      "yield",
      "liquidity",
      "restaking",
      "leverage",
      "options",
      "levered",
      "vault",
      "staking",
    ]),
  },
  nftsMarketplaces: {
    label: "🖼️ NFTs Marketplaces",
    keywords: new Set(["nft marketplace", "opensea", "blur"]),
  },
  blockchainGaming: {
    label: "🎮 Blockchain Gaming",
    keywords: new Set([
      "onchain gaming",
      "onchain game",
      "blockchain game",
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
      "voting",
    ]),
  },
  ventureCapital: {
    label: "🤑 VC",
    keywords: new Set(["venture fund", "vc"]),
  },
  ai: {
    label: "🤖 AI",
    keywords: new Set([
      "ai",
      "self-driving",
      "artificial intelligence",
      "gpt",
      "claude",
      "embedding",
      "langchain",
    ]),
  },
  identity: {
    label: "🆔 Identity",
    keywords: new Set(["identity", "id", "identification", "credential"]),
  },
  socialGraphs: {
    label: "🕸️ Social Graphs",
    keywords: new Set([
      "social graphs",
      "friends",
      "social network",
      "social connections",
    ]),
  },
  intentGraphs: {
    label: "🎯 Intent Graphs",
    keywords: new Set([
      "intent",
      "onchain activity",
      "blockchain activity",
      "on-chain activity",
      "wallet history",
    ]),
  },
  decentralizedStorage: {
    label: "🗄️ Decentralized Storage",
    keywords: new Set([
      "onchain storage",
      "decentralized storage",
      "ipfs",
      "pinata",
      "arweave",
      "filecoin",
    ]),
  },
  marketplaces: {
    label: "🛒 Marketplaces",
    keywords: new Set(["marketplace", "exchange", "buy and sell"]),
  },
  supplyChain: {
    label: "📦 Supply Chain",
    keywords: new Set([
      "supply chain",
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
      "npm package",
      "library",
      "utlities",
    ]),
  },
  oracles: {
    label: "🔮 Oracles",
    keywords: new Set(["oracle", "pyth", "uma", "chainlink"]),
  },
  bridges: {
    label: "🌉 Bridges",
    keywords: new Set([
      "bridge",
      "bridging",
      "cross-chain",
      "interoperability",
    ]),
  },
  contentCreation: {
    label: "🎨 Content Creation",
    keywords: new Set(["content creation", "media", "publish", "art creation"]),
  },
  newsletter: {
    label: "📃 Newsletter",
    keywords: new Set(["newsletter"]),
  },
  books: {
    label: "📚 Books",
    keywords: new Set([
      "books",
      "novels",
      "book",
      "novela",
      "short-story",
      "poems",
    ]),
  },
  auth: {
    label: "🔑 Auth",
    keywords: new Set([
      "auth",
      "authentication",
      "login",
      "siwe",
      "siwn",
      "dynamic",
      "privy",
      "oauth",
    ]),
  },
  predictionMarkets: {
    label: "🔮 Prediction Markets",
    keywords: new Set([
      "prediction market",
      "prediction-market",
      "polymarket",
      "binary-option",
      "kalshi",
    ]),
  },
  ip: {
    label: "©️ IP",
    keywords: new Set(["ip", "intellectual property", "patent", "trademark"]),
  },
  advertising: {
    label: "📢 Advertising",
    keywords: new Set(["advertising", "ads", "marketing", "campaign"]),
  },
  privacy: {
    label: "🔒 Privacy",
    keywords: new Set([
      "privacy",
      "confidential",
      "anonymous",
      "anonymity",
      "private",
    ]),
  },
  energy: {
    label: "⚡ Energy",
    keywords: new Set([
      "energy",
      "power",
      "electricity",
      "solar panel",
      "nuclear",
      "windmill",
      "dams",
    ]),
  },
  healthcare: {
    label: "🏥 Healthcare",
    keywords: new Set([
      "healthcare",
      "genome",
      "medicine",
      "medical",
      "wellness",
      "doctor",
      "nurse",
      "patient",
      "genes",
      "outpatient",
      "ivf",
    ]),
  },
  education: {
    label: "🎓 Education",
    keywords: new Set([
      "education",
      "learning",
      "teach",
      "school",
      "lessons",
      "course",
      "professor",
      "learn",
    ]),
  },
  charity: {
    label: "❤️ Charity",
    keywords: new Set(["charity", "donation", "donate", "philanthropy"]),
  },
  assetManagement: {
    label: "📈 Asset Management",
    keywords: new Set([
      "asset management",
      "investment",
      "investment portfolio",
      "etf",
      "hedge fund",
      "mutual fund",
    ]),
  },
  realEstate: {
    label: "🏠 Real Estate",
    keywords: new Set([
      "real estate",
      "apartment",
      "house",
      "housing",
      "estate",
      "land",
    ]),
  },
  jobs: {
    label: "💼 Jobs",
    keywords: new Set(["job", "employment", "career"]),
  },
  insurance: {
    label: "🛡️ Insurance",
    keywords: new Set(["insurance", "reinsurance"]),
  },
  music: {
    label: "🎵 Music",
    keywords: new Set(["music", "song", "melody", "audio"]),
  },
  zk: {
    label: "🙈 ZK",
    keywords: new Set(["zero-knowledge", "zk", "zk-snarks", "privacy proof"]),
  },
  freelancing: {
    label: "💻 Freelancing",
    keywords: new Set(["freelance", "freelancing", "indie"]),
  },
  ecommerce: {
    label: "🛍️ E-commerce",
    keywords: new Set([
      "e-commerce",
      "shopping",
      "online store",
      "e commerce",
      "digital store",
    ]),
  },
  ticketing: {
    label: "🎟️ Ticketing",
    keywords: new Set(["ticket", "ticketing"]),
  },
  reputation: {
    label: "🌟 Reputation",
    keywords: new Set(["reputation", "credibility", "credible"]),
  },
  legal: {
    label: "⚖️ Legal",
    keywords: new Set([
      "legal",
      "law",
      "regulation",
      "compliance",
      "jurisdiction",
      "court",
      "judge",
    ]),
  },
  payments: {
    label: "💳 Payments",
    keywords: new Set(["payment", "remittance"]),
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
    keywords: new Set(["social impact", "impact investing"]),
  },
  dataMarketplace: {
    label: "📊 Data Marketplace",
    keywords: new Set(["data marketplace", "data broker"]),
  },
  notaries: {
    label: "✍️ Notaries",
    keywords: new Set(["notary", "notaries"]),
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
    keywords: new Set(["browser", "browsers", "internet", "search"]),
  },
  collectibles: {
    label: "🏺 Collectibles",
    keywords: new Set(["collectible", "collectibles", "souvenir"]),
  },
  rwa: {
    label: "🏗️ RWA",
    keywords: new Set(["rwa", "real-world asset", "tokenized"]),
  },
  tokenization: {
    label: "🔖 Tokenization",
    keywords: new Set(["token", "tokenization", "tokenize"]),
  },
  grants: {
    label: "💸 Grants",
    keywords: new Set(["grant", "grants"]),
  },
  channels: {
    label: "📡 Channels",
    keywords: new Set(["channel", "channels"]),
  },
  extensions: {
    label: "➕ Extensions",
    keywords: new Set(["extension", "extensions", "plugin"]),
  },
}
export const dateOptions = ["24-hours", "7-days", "30-days", "ytd"]

export const apiUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : `https://${process.env.VERCEL_URL}/api`
