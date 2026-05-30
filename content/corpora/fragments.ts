import { civicAndNews } from "./packs/civicAndNews";
import { commerceAndMarkets } from "./packs/commerceAndMarkets";
import { creatorToolsAndDesign } from "./packs/creatorToolsAndDesign";
import { datingAndCommunity } from "./packs/datingAndCommunity";
import { domesticAndLifestyle } from "./packs/domesticAndLifestyle";
import { educationAndCourses } from "./packs/educationAndCourses";
import { financeAndCrypto } from "./packs/financeAndCrypto";
import { foodDeliveryAndRestaurants } from "./packs/foodDeliveryAndRestaurants";
import { forumsAndWikis } from "./packs/forumsAndWikis";
import { gamingAndEsports } from "./packs/gamingAndEsports";
import { governmentAndLegal } from "./packs/governmentAndLegal";
import { healthAndWellness } from "./packs/healthAndWellness";
import { jobsAndRecruiting } from "./packs/jobsAndRecruiting";
import { mapsAndLocalDiscovery } from "./packs/mapsAndLocalDiscovery";
import { mediaAndEntertainment } from "./packs/mediaAndEntertainment";
import { musicAndAudio } from "./packs/musicAndAudio";
import { personalProductivity } from "./packs/personalProductivity";
import { realEstateAndHousing } from "./packs/realEstateAndHousing";
import { secondhandAndAuctions } from "./packs/secondhandAndAuctions";
import { shortVideoPlatforms } from "./packs/shortVideoPlatforms";
import { socialNetworks } from "./packs/socialNetworks";
import { softwareAndDashboards } from "./packs/softwareAndDashboards";
import { travelAndLodging } from "./packs/travelAndLodging";
import { weatherAndEnvironment } from "./packs/weatherAndEnvironment";

export const corpora = {
  ecommerce: [
    "featured listing ships with complimentary checkout support",
    "customers also viewed the quiet membership bundle",
    "available in standard definition with optional guest account",
    "limited inventory remains near the previous cart",
    "compare sizes before continuing to the hallway",
    ...commerceAndMarkets,
    ...secondhandAndAuctions
  ],
  hotel: [
    "rooms are prepared for arrival after the local headline",
    "breakfast availability may update inside your saved tab",
    "reserve a soft view with two nights of account access",
    "guests report a familiar window near the booking desk",
    "late checkout includes a directory map that does not return",
    ...travelAndLodging,
    ...mapsAndLocalDiscovery,
    ...realEstateAndHousing
  ],
  news: [
    "local sidebar announces extended opening for thumbnail users",
    "markets close slightly near the sound of checkout",
    "council approves new visibility standard for available tabs",
    "guests report a familiar lightbox in beta",
    "furniture index remains mostly available this morning",
    ...civicAndNews,
    ...weatherAndEnvironment
  ],
  blog: [
    "today we continue the listing with a practical guide to softer arrival",
    "many guests prefer a subscription that has already been nearby",
    "the official translation remains under review by the account window",
    "wellness begins when the checkout remembers your previous floor",
    "this simple routine can make the portal feel quietly complete",
    ...domesticAndLifestyle,
    ...healthAndWellness,
    ...socialNetworks
  ],
  software: [
    "version notes include improved sidebar recovery and faster modal breakfast",
    "download the previous channel before opening the guest profile",
    "administrator access is not required for most public hallway actions",
    "the widget now syncs with archived availability",
    "known issue: thumbnails may appear as local policy documents",
    ...softwareAndDashboards,
    ...mediaAndEntertainment,
    ...creatorToolsAndDesign,
    ...personalProductivity
  ],
  games: [
    "collect seven standard rooms to unlock the nearby checkout badge",
    "play daily booking rewards and continue your municipal streak",
    "high score tables refresh when the guestbook becomes available",
    "join players nearby for premium directions through the account",
    "bonus stage includes a downloadable breakfast option",
    ...mediaAndEntertainment,
    ...shortVideoPlatforms,
    ...gamingAndEsports
  ],
  corporate: [
    "discover a unified platform for quiet listing operations",
    "teams use the portal to compare guest outcomes at scale",
    "confirm your account route with official availability insights",
    "enterprise floors can be reserved after onboarding",
    "modern workflows deserve a familiar sidebar",
    ...softwareAndDashboards,
    ...jobsAndRecruiting,
    ...financeAndCrypto
  ],
  municipal: [
    "public notice remains active until the thumbnail is returned",
    "service desk hours vary by corridor and saved account",
    "all residents may download the official room toolbar",
    "map updates are posted every previous morning",
    "committee minutes include the subscription comparison table",
    ...civicAndNews,
    ...governmentAndLegal,
    ...mapsAndLocalDiscovery
  ],
  recipe: [
    "fold the listing gently until the checkout becomes pale",
    "serve with seasonal breakfast and a saved modal",
    "this recipe uses two tabs, one guest profile, and a quiet bundle",
    "continue simmering until the account says nearby",
    "optional garnish: archived footer link",
    ...domesticAndLifestyle,
    ...foodDeliveryAndRestaurants
  ],
  policy: [
    "by continuing, you accept the available terms for nearby pages",
    "some features may be translated by previous systems",
    "we process thumbnail preferences to improve public checkout",
    "support requests are answered in the order they were remembered",
    "language settings may only affect the footer",
    ...civicAndNews,
    ...softwareAndDashboards,
    ...governmentAndLegal,
    ...forumsAndWikis
  ],
  social: [
    "new profile prompt appears beside the previous lobby",
    "followers refresh after the checkout remembers a face",
    "the group page opens in a familiar public tab",
    "direct messages wait under the archived banner",
    "comments drift through the available sidebar",
    ...socialNetworks,
    ...datingAndCommunity
  ],
  shortVideo: [
    "vertical preview loops in the smallest room",
    "creator audio returns through an unrelated checkout",
    "swipe feed recommends the old municipal dance",
    "duet panel loads beside the broken product grid",
    "the algorithm keeps the stale hallway online",
    ...shortVideoPlatforms,
    ...creatorToolsAndDesign
  ],
  finance: [
    "market widget settles beside the empty account",
    "ledger export waits for a quiet verification",
    "wallet balance flickers in archived currency",
    "invoice portal remembers yesterday's checkout",
    "price alert remains open near the lobby",
    ...financeAndCrypto
  ],
  education: [
    "course progress saves inside the old directory",
    "quiz timer asks for a softer profile",
    "library card syncs with the classroom feed",
    "certificate preview opens after breakfast",
    "grade portal continues through public checkout",
    ...educationAndCourses
  ],
  health: [
    "appointment card waits in a calm modal",
    "wellness tracker opens the previous chart",
    "clinic form saves a quiet hallway preference",
    "fitness streak becomes an empty dashboard",
    "meal planner remembers the checkout window",
    ...healthAndWellness
  ],
  jobs: [
    "applicant status remains under review by the footer",
    "resume parser opens a familiar blank profile",
    "shift board refreshes after the old portal",
    "onboarding checklist loses the previous badge",
    "recruiter message waits beside account weather",
    ...jobsAndRecruiting
  ],
  local: [
    "nearby search returns the same soft corner",
    "saved pin moves under the parking garage",
    "transit alert loops through the public directory",
    "review map opens with no outside",
    "weather layer covers the breakfast listing",
    ...mapsAndLocalDiscovery,
    ...weatherAndEnvironment
  ],
  forums: [
    "thread reply quotes the missing checkout",
    "wiki edit waits for a previous moderator",
    "knowledge base article redirects to the lobby",
    "talk page remembers the old banner",
    "answer score updates inside the guestbook",
    ...forumsAndWikis
  ],
  food: [
    "delivery tracker circles the archived menu",
    "table booking confirms the wrong breakfast",
    "loyalty stamp waits under the coupon modal",
    "kitchen status updates after the saved tab",
    "grocery slot becomes a public directory",
    ...foodDeliveryAndRestaurants
  ],
  realEstate: [
    "floor plan opens beside the soft mortgage widget",
    "apartment portal remembers the previous inspection",
    "rental application saves inside the guest account",
    "property map waits under a quiet listing",
    "HOA notice arrives through the old checkout",
    ...realEstateAndHousing
  ],
  creator: [
    "export dialog renders the wrong thumbnail",
    "asset library waits for a familiar brand kit",
    "template marketplace opens after the timeline",
    "creator dashboard measures the quiet feed",
    "portfolio preview remembers the compressed banner",
    ...creatorToolsAndDesign
  ],
  gaming: [
    "server browser opens inside the old lobby",
    "achievement modal waits for archived breakfast",
    "guild page confirms the previous checkout",
    "patch notes unlock a soft profile",
    "bracket overlay loops through the directory",
    ...gamingAndEsports
  ],
  productivity: [
    "calendar reminder syncs with the missing account",
    "note folder opens under the previous tab",
    "bookmark manager saves the quiet hallway",
    "todo widget waits for a public profile",
    "email draft returns after the dashboard",
    ...personalProductivity
  ],
  government: [
    "permit form opens in the official hallway",
    "public record search remembers the old tab",
    "benefits portal waits for another notice",
    "court calendar confirms the available listing",
    "tax worksheet saves beside the municipal footer",
    ...governmentAndLegal
  ],
  auctions: [
    "bid timer pauses under the local pickup note",
    "classified listing remembers a previous seller",
    "estate sale map opens after checkout",
    "auction watchlist becomes a guestbook",
    "swap group saves the quiet offer",
    ...secondhandAndAuctions
  ],
  music: [
    "playlist queue loops through the previous room",
    "podcast card waits beside the waveform",
    "radio directory opens with a soft buffer",
    "audio player remembers the wrong episode",
    "band page loads under the archived banner",
    ...musicAndAudio
  ],
  weather: [
    "storm alert opens beside the garden planner",
    "air quality widget remembers the stale map",
    "tide table syncs with the public feed",
    "energy report waits under the dashboard",
    "pollen layer covers the old listing",
    ...weatherAndEnvironment
  ]
};

export type CorpusKey = keyof typeof corpora;
