# in between space

## Vision

**in between space** is an infinite, deterministic web labyrinth: a website that feels like the internet half-remembering itself through other websites.

It is not a horror site in the obvious sense. It should feel familiar first: an ecommerce page, a hotel booking page, a news portal, a blog, a search page, a kids' game portal, a corporate landing page. Then, as the user looks closer, the site should stop resolving. Components belong to different eras. Text almost makes sense. A shopping cart sits next to local news. A luxury booking form sells software memberships. A footer claims copyright from the wrong year. A blog about wellness continues under a product grid for glitched subscriptions.

The feeling should be:

- nostalgic but not cute
- broken but not careless
- modern but incorrectly assembled
- endless but shareable
- random but intentional
- familiar at a glance, wrong on inspection

The core fantasy is simple: every link is another version of the web.

## Core Experience

The user lands on a generated page. It has a coherent first impression, but the coherence is unstable. It may look like a hotel site, an ecommerce catalog, a news portal, or a blog, but other website memories intrude.

The user scrolls. Below the hero is something that should not belong there. A product grid becomes a local events column. A corporate footer appears under a children-style game panel. A sidebar uses a different decade of design. Some text is English, some is German, some is Japanese, some is pseudo-translated corporate language.

The user clicks a link. They go deeper. The next page is different, but it feels connected by mood, motif, and seed logic.

The user sends the URL to a friend. The friend sees the same page.

The user scrolls away, then back. Some details have changed. Not everything. Just enough to suggest the page has misremembered itself.

## Name

The project is called **in between space**.

The name should stay lowercase in product/UI usage unless a context requires title case.

It suggests:

- being between websites
- being between old and modern internet
- being between memory and interface
- being between usefulness and nonsense

## Design Principles

### Recognizable Before Uncanny

Every page should initially read as a real kind of website. The wrongness should emerge after a few seconds of attention.

Avoid pure chaos. Avoid random meme collage. Avoid making every component broken. The experience works because most pieces are close to normal.

### Randomness With Taste

Generation should use authored systems, not raw randomness.

Pages are built from:

- archetypes
- style recipes
- reusable content blocks
- language packs
- seeded layout rules
- controlled glitch rules
- depth-based weirdness

The result should feel designed by something that almost understands the web.

### Deterministic Infinity

The site should be infinite, but not ephemeral.

Every page is generated from an internal seed, but the URL should not expose hashes, random letters, or obvious seed parameters. The public URL should look like a plausible web page path: readable, specific, and a little wrong.

This creates infinite exploration while preserving shareability.

### Liminal, Not Loud

The mood should come from web-native emptiness, repetition, stale interface patterns, nostalgia, and small inconsistencies.

Use:

- abandoned loading states
- stale widgets
- underfilled layouts
- overfilled portals
- repeated nav structures
- dead search results
- default form controls
- mismatched ad units
- low-resolution thumbnails
- empty comment sections
- broken recommendation rails
- lonely buttons
- oversized blank areas
- slightly wrong corporate polish

Avoid:

- jump scares
- gore
- monsters
- horror UI cliches
- excessive glitch noise
- making everything unreadable

## Deterministic Generation

Every route is seeded internally, but the route itself should feel like something a real website might produce.

Do not use visible hash routes like `/r/c9f42b` or query strings like `?seed=abc123`. The URL is part of the experience. It should look meaningful at a glance and nonsensical on inspection.

Example routes:

```txt
/products/featured-checkout-for-quiet-membership
/watch/seasonal-suite-preview-episode-12
/news/local-subscription-index-remains-open
/account/continue-guest-cart-from-yesterday
/guides/how-to-compare-breakfast-software
/games/daily-booking-rewards-standard-edition
```

The route should be converted to and from an internal deterministic seed using a reversible or mostly reversible phrase codec.

The model is similar in spirit to seed phrases and private keys: a compact internal value can become a readable phrase, and the readable phrase can resolve back into the same generation state.

The URL codec should encode:

- page seed
- depth
- surface genre
- content genre
- action genre
- residue genre
- optional motif
- optional language hint

The route does not need to expose those values directly. It can encode them through controlled word choices.

Example conceptual mapping:

```txt
internal seed:
  8f1a... + depth 14 + streaming/hotel/checkout/news

public route:
  /watch/continue-deluxe-booking-after-headlines
```

The route parser should be tolerant. If a user edits a URL manually, the system should still hash the readable path into a stable internal seed and generate a page.

The seed controls:

- page archetype
- secondary archetypes
- web mood
- style recipe
- layout density
- color palette
- fonts
- languages
- text topics
- block sequence
- link destinations
- glitch intensity
- depth level
- recurring motifs

Links are generated from the current seed:

```ts
nextSeed = hash(currentSeed + clickedElementId + linkLabel)
```

The next seed is then encoded into a readable route:

```ts
nextRoute = encodeSeedAsRoute(nextSeed, nextGenreFormula, nextMotifs)
```

This means every product, headline, footer link, ad, broken image, and navigation item can lead to another plausible-but-wrong page without exposing raw randomness.

## URL Phrase Codec

The URL system should be reusable and deterministic.

It has two jobs:

1. Convert internal generation state into a readable, off-kilter route.
2. Convert any incoming route back into stable generation state.

The codec should use curated word banks rather than arbitrary slugs.

Word banks:

- route sections: products, news, watch, account, guide, games, search, booking, help, download, article, offers
- commerce nouns: checkout, cart, subscription, bundle, listing, offer, sample, membership
- media nouns: episode, preview, playlist, channel, trailer, feature, stream
- hotel nouns: suite, guest, booking, breakfast, availability, stay
- news nouns: update, index, report, bulletin, headline, digest
- interface nouns: tab, widget, sidebar, modal, thumbnail, profile, feed
- adjectives: quiet, standard, familiar, nearby, official, seasonal, previous, available
- time fragments: today, yesterday, later, archived, current, nightly, morning

Route grammar examples:

```txt
/{section}/{adjective}-{contentNoun}-{actionNoun}
/{section}/{verb}-{adjective}-{genreNoun}-after-{residueNoun}
/{section}/{timeFragment}-{contentNoun}-for-{interfaceNoun}
/{section}/{genreNoun}-{number}-with-{motif}
```

Generated examples:

```txt
/products/quiet-membership-checkout
/watch/continue-seasonal-suite-after-headlines
/news/current-thumbnail-index
/booking/standard-preview-with-breakfast
/help/archived-cart-for-sidebar
```

Implementation shape:

```ts
type RouteState = {
  seed: string
  depth: number
  surfaceGenre: string
  contentGenre: string
  actionGenre: string
  residueGenre: string
  motifs: string[]
}

encodeRoute(state: RouteState): string
decodeRoute(path: string): RouteState
```

If full reversibility becomes too constraining, use hybrid determinism:

- encode the important visible traits into the words
- derive the full seed by hashing the entire path
- store no backend state
- guarantee that the same URL always renders the same page

## Page Archetypes

Each page has one dominant archetype and one or more intruding archetypes.

Dominant archetypes:

- ecommerce catalog
- hotel booking site
- news portal
- personal blog
- web forum
- corporate landing page
- kids' game portal
- travel planner
- recipe site
- SaaS dashboard
- abandoned local council page
- search engine
- documentation site
- product manual
- events directory

Example combinations:

- hotel booking page with ecommerce product cards and a 1998 travel sidebar
- news portal with a modern SaaS hero and a kids-site footer
- children-style game site with luxury hotel search fields
- ecommerce page for furniture that becomes a local government update feed
- minimalist corporate homepage interrupted by old web banner ads

## Genre Mixing

Genre mixing is the main uncanny engine. Each page should be generated as a collision of website genres, not just a random stack of components.

Every page has:

- a **surface genre**: what the page initially appears to be
- a **content genre**: what the page is actually talking about
- a **commerce/action genre**: what the page wants the user to do
- a **residue genre**: the older or foreign website memory leaking through

Example genre formulas:

```txt
surface: ecommerce
content: real estate blog
action: hotel booking
residue: 2001 travel directory
```

```txt
surface: video streaming platform
content: hotel availability
action: checkout
residue: local news portal
```

```txt
surface: games portal
content: municipal announcements
action: newsletter signup
residue: kids 2006
```

```txt
surface: luxury accommodation site
content: furniture catalog
action: download software
residue: Web 1.0 map service
```

This is what should make the site feel wrong. A page should not merely contain mixed components; its purpose should be confused.

Useful genre collisions:

- ecommerce site that is also a blog selling houses
- games site filled with financial and local news modules
- video streaming service where every video is a hotel booking
- hotel booking site selling software downloads and membership bundles
- recipe blog with SaaS analytics widgets
- corporate landing page with children's game reward panels
- search engine that returns only checkout pages
- documentation site for an impossible web platform
- real estate site where listings behave like downloadable games
- social network where posts are product manuals

The generator should preserve a faint internal logic. If the page is a streaming-hotel hybrid, labels might include "Watch Suite", "Continue Booking Episode", "Recently Viewed Rooms", and "Available in HD until checkout."

## Web Moods

Each page should have a web-native mood. Do not style pages as literal real-life places such as abandoned offices, malls, corridors, pools, or transit tunnels. The moodboard should inform the feeling, not become the theme.

The site should feel liminal because of how the web page behaves: half-empty modules, dead links, familiar layouts with the wrong content, stale widgets, and pages that look useful but cannot explain what they are for.

Possible web moods:

- abandoned ecommerce category
- underfilled hotel booking flow
- overfilled 2000s portal
- dead streaming platform
- stale news homepage
- forgotten corporate microsite
- broken search results page
- children's games portal with adult content categories
- SaaS dashboard with impossible metrics
- multilingual travel directory
- fake app store listing
- local services directory
- product comparison page with unrelated products
- content farm blog with checkout controls
- webmail-style inbox for public pages

These moods should influence layout density, UI patterns, typography, color, interaction states, and content roles.

## Reusable Blocks

All blocks should be modular components that can be nested, restyled, and reused across page genres.

Every component should receive generation context as input. Components should not call unseeded randomness. They should derive all content, media, layout quirks, loading states, and visual variants from the page seed plus a stable component ID.

Core component input:

```ts
type GeneratedComponentContext = {
  routeState: RouteState
  pageSeed: string
  componentId: string
  componentSeed: string
  depth: number
  genreFormula: GenreFormula
  webMood: string
  mediaProfile: MediaProfile
  styleRecipe: StyleRecipe
  languageBlend: LanguageBlend
  motifs: string[]
}
```

Nested components should derive child seeds from the parent:

```ts
childSeed = hash(parentComponentSeed + childSlot + childIndex)
```

This means a product card, news item, thumbnail, loading placeholder, or footer link can be reused anywhere and still feel coherent on the current page.

Components should expose content slots rather than fixed assumptions:

- `title`
- `subtitle`
- `body`
- `media`
- `actions`
- `metadata`
- `children`
- `linkTargets`

The same component can then appear as:

- a product card inside a news portal
- a video tile inside a hotel booking page
- a blog preview inside an ecommerce grid
- a dashboard widget inside a kids' games portal
- a fake ad inside a help center page

Styling should also be composable. Components have a base genre style, a page style recipe, and optional intrusion styles.

```txt
finalComponentStyle =
  componentBaseStyle
  + pageStyleRecipe
  + genreIntrusion
  + seededGlitchVariant
```

The result should be consistent across the page, but not uniform. A page can have a dominant look with a few components that clearly belong to another web era.

### Hero Memory

A large opening block that resembles a normal homepage hero, masthead, product feature, or booking panel.

It should be nearly convincing.

Example headings:

- Welcome Home to Available Rooms
- Find Your Next Interior Stay
- Everything Nearby, Delivered Quietly
- Local Updates for Tomorrow's Floor
- Reserve the Window You Remember

### Navigation Residue

Headers, breadcrumbs, sidebars, tab bars, and footer navs that feel left over from different websites.

Some links repeat. Some labels are translated. Some appear useful but lead deeper.

Example links:

- View Similar Listings
- Continue Shopping Later
- Open Guest Directory
- Plan Your Account Route
- Read More About Tomorrow
- Download Previous Version
- Return to Available Areas

### Product Grid

An ecommerce block selling plausible but uncanny digital products, bookings, subscriptions, listings, downloads, and services.

Example products:

- Standard Guest Membership
- Conference Account Sample 4-Pack
- Warm Fluorescent Replacement Theme
- Interior Preview Subscription
- Unmarked Notification Bell
- Quiet Shelf Cloud Storage
- Pool Tile UI Icon Set
- Corridor Plant Avatar Pack

Prices should be oddly plausible:

- `$14.95`
- `$404.00`
- `€8,800`
- `¥0`
- `3 payments of later`

### News Portal

A dense module with headlines, timestamps, weather, markets, and category links.

Example headlines:

- Local Sidebar Announces Extended Opening
- Markets Close Slightly Near the Sound
- Council Approves New Thumbnail Visibility Standard
- Guests Report Familiar Lightbox in Beta
- Furniture Index Remains Mostly Available

### Blog Article

Long-form lifestyle, travel, productivity, or wellness writing that seems legitimate until read closely.

Text should use sentence templates, mixed languages, and pseudo-translation.

Example tone:

```txt
Today we continue the listing with a practical guide to softer arrival.
Many guests prefer a subscription that has already been nearby. In German
this is sometimes called the available corner, although the official
translation remains under review.
```

### Directory Block

Old-web lists of links, categories, downloads, maps, and "featured" pages.

Use dense layouts, small type, underlined links, and mismatched icons.

### Form Block

Search, booking, login, newsletter, checkout, survey, or account forms.

Fields should be familiar but slightly wrong:

- Check In
- Check Out
- Number of Guests
- Preferred Hallway
- Remember Floor
- Search Suite
- Email for Building Updates
- Delivery Window View

### Ad Block

Fake promotional banners and side ads.

Examples:

- LIMITED TIME: MoveQuest Premium Directions for Indoor Travel
- You May Also Like: Chair Adjacent
- Download the Official Room Toolbar
- Join 77,775 Players Nearby
- Free Shipping on All Previous Orders

### Footer From Elsewhere

Every page should have a footer, but it may belong to a different imaginary site.

It can include:

- old copyright years
- broken policy links
- partner logos
- guestbook links
- sitemap links
- support numbers
- language selectors
- terms that do not match the page

## Text System

The site should not use ordinary lorem ipsum.

Text should be generated from structured phrase systems that produce near-real language. It should be readable at a glance and nonsensical on inspection.

Use phrase components:

- web nouns: account, cart, portal, download, update, checkout, directory
- interface nouns: tab, modal, sidebar, thumbnail, banner, feed, profile, listing
- genre nouns: suite, article, product, episode, post, listing, booking, review
- emotional adjectives: familiar, quiet, official, warm, missing, available
- corporate verbs: discover, compare, reserve, continue, confirm, update
- interface verbs: open, return, locate, refresh, submit, continue, subscribe
- time fragments: today, later, already, since 2006, tomorrow morning

Example template:

```txt
{verb} your {adjective} {object} for {timeFragment}
```

Example outputs:

- Compare your official listing for later
- Reserve your familiar tab since 2006
- Continue your quiet account tomorrow morning
- Confirm available thumbnail near checkout

## Content Generation Engine

Content generation should be reusable across every block. It should combine deterministic templates with seeded Markov chains.

The goal is not perfect prose. The goal is text that has the rhythm and shape of real website copy while being semantically displaced.

### Seed Corpora

Create small authored corpora for different web genres and tones:

- ecommerce product listings
- hotel booking copy
- local news headlines
- lifestyle blog posts
- software update notes
- game portal blurbs
- corporate SaaS landing pages
- municipal notices
- real estate listings
- travel guides
- recipe introductions
- privacy policy language
- help center articles

Each corpus should include short fragments rather than long articles:

- headings
- subheadings
- button labels
- product names
- article openings
- feature blurbs
- alerts
- footer text
- form labels
- meta descriptions

The corpora are ingredients. They should be intentionally mundane.

### Markov Layer

A seeded Markov chain can generate sentence-like fragments from the corpora.

Use it for:

- paragraph filler
- product descriptions
- fake news summaries
- blog intros
- review snippets
- policy text
- loading messages
- help center answers

Keep the Markov chain constrained:

- use low-order chains for stranger output
- use higher-order chains for more plausible output
- seed by page, block, and content role
- cap sentence length
- reject outputs that are too broken or too repetitive
- blend corpora based on the page's genre formula

Example:

```txt
markovSources = [
  "hotel-booking",
  "ecommerce-products",
  "local-news"
]

role = "productDescription"
seed = hash(pageSeed + blockId + role)
```

Result style:

```txt
This available suite includes a soft delivery window, two featured previews,
and complimentary access to nearby checkout. Guests who purchased this listing
also reviewed the account policy.
```

### Template Layer

Templates should sit above the Markov layer for important UI copy. Buttons, headings, product names, prices, labels, and navigation must remain legible.

Examples:

```txt
{commerceVerb} the {spatialAdjective} {objectNoun}
{mediaVerb} this {accommodationNoun} in {qualityTier}
{newsNoun} confirms {domesticObject} near {placeNoun}
{bookingVerb} {quantity} nights of {productNoun}
```

Example outputs:

- Add the quiet listing to cart
- Watch this suite in standard definition
- Local update confirms thumbnail near checkout
- Reserve two nights of membership sample

### Genre-Aware Vocabulary

Each page should pull vocabulary from multiple genre packs.

For example, a "video streaming platform that is all hotel bookings" might mix:

- streaming words: watch, episode, continue, playlist, HD, trailer, featured
- hotel words: suite, guest, check-in, booking, availability, breakfast
- ecommerce words: cart, price, delivery, recommended, checkout

This creates copy like:

- Continue Watching: Deluxe Twin Room
- Add Episode to Booking
- Season 3, Room 407, breakfast included
- Trending Suites Near You

### Content Memory

Each generated page should have a handful of recurring nouns and motifs. These repeat across blocks so the page feels authored.

Example page memory:

```txt
motifs: checkout, autoplay, stale account, featured tab, quiet listing
```

Those motifs should appear in products, headlines, ads, forms, and footers. The page should feel like it is obsessed with a few mundane things.

### Reusable API Shape

The text engine should expose role-based functions:

```ts
generateHeading(context)
generateSubheading(context)
generateProductName(context)
generateProductDescription(context)
generateHeadline(context)
generateParagraph(context)
generateButtonLabel(context)
generateFormLabel(context)
generateLoadingMessage(context)
generateFooterLine(context)
```

The context should include:

- seed
- depth
- surface genre
- content genre
- action genre
- residue genre
- web mood
- primary language
- contamination language
- weirdness level
- recurring motifs

This keeps content generation reusable while allowing every block to feel connected to the current page.

## Languages

Pages should mix real languages and pseudo-translated English.

Language packs:

- English
- Japanese
- German
- French
- Spanish
- Dutch
- Swedish
- Portuguese
- Korean
- Simplified Chinese
- pseudo-corporate English
- pseudo-translated English

Each page can have:

- one primary language
- one contamination language
- one UI fallback language

The language mixing should feel like an international website, bad localization, machine translation, and memory fragments all at once.

## Image System

The project needs a large bank of discovered photos and videos, then a much larger space of deterministic variants made through transforms and filters.

The goal is to have hundreds of base images and thousands of usable combinations.

Media should come from provider APIs, not hand-picked one-off assets. The system should generate searches from the same page context used for text and layout, fetch candidate results, normalize metadata, cache usable assets, and then misuse those assets across unrelated web genres.

The important behavior is not "find the perfect image." It is "find a plausible stock/archive/web asset, then place it in the wrong web role."

### Media Providers

Use multiple providers with clear roles.

**Pexels**

- Best practical default provider.
- Use for broad stock-like photos and videos.
- Good query targets: hotel, office, product, mall, chair, lobby, apartment, desk, meeting, shopping, game, laptop, customer service.
- Useful because photo and video search can share the same query-generation system.

**Unsplash**

- Use for polished, modern, high-quality photography.
- Good for hero images, lifestyle blocks, clean product-adjacent imagery, and modern landing-page intrusions.
- Respect attribution and API guideline requirements.

**Pixabay**

- Use for broad generic photos, videos, vectors, and illustrations.
- Good fallback when Pexels/Unsplash do not return enough variety.
- Preserve provider/source display requirements around search-derived results.

**Wikimedia Commons**

- Use for archival, public-domain, Creative Commons, diagrams, historical web-adjacent material, public infrastructure, signs, documents, and unusual images.
- Metadata quality matters more here. Preserve license, author, source URL, and attribution.

**Openverse**

- Use as a license-aware discovery source, especially for building or refreshing an offline media manifest.
- Better for ingestion/source-building than hotlinking directly in rendered pages.
- Preserve license and attribution metadata.

### Provider Strategy

The app should not depend on live API calls during every page render. Use a hybrid model:

- generate deterministic search queries from page context
- fetch results through provider adapters
- enable safe-search or equivalent filtering for every provider that supports it
- normalize results into one internal media shape
- cache selected assets and metadata
- render from the local/cache manifest whenever possible
- refresh or expand the cache in background/admin tooling

Runtime pages should feel instant and deterministic. API discovery can happen during development, build time, scheduled ingestion, or explicit refresh tasks.

Provider priority:

1. Pexels for practical photo/video breadth
2. Unsplash for polished modern imagery
3. Pixabay for generic fallback and extra video/vector coverage
4. Wikimedia Commons for archival and strange public media
5. Openverse for license-aware discovery and manifest building

### Safe Search

Safe-search is mandatory.

Every provider adapter must enable the provider's safe-search, content filter, or equivalent option when one exists. If a provider does not support safe-search directly, the adapter should compensate with conservative query generation, result filtering, and manifest review.

Rules:

- Pexels: use safe-search/content-safety controls if available for the endpoint.
- Unsplash: use only appropriate query terms and respect API content-safety guidance.
- Pixabay: enable `safesearch=true`.
- Wikimedia Commons: filter conservatively because media can be archival and inconsistently categorized.
- Openverse: use mature/sensitive content filters where available.

The media manifest should record whether safe-search was applied:

```ts
type MediaSafety = {
  safeSearchApplied: boolean
  safeSearchMode?: string
  reviewed: boolean
}
```

No generated page should intentionally search for explicit, graphic, or adult content. The uncanny feeling should come from context mismatch and web-genre confusion, not unsafe media.

### Query Generation

Search queries should be generated from:

- surface genre
- content genre
- action genre
- residue genre
- web mood
- image role
- recurring motifs
- depth
- language hint

Queries should be plausible, not surreal. The uncanniness should come from selection, placement, cropping, filters, and genre mismatch.

Example query generation:

```txt
surface genre: streaming
content genre: hotel booking
action genre: checkout
residue genre: news portal
image role: video thumbnail

queries:
  hotel room
  booking reception
  travel customer service
  empty apartment
  business lounge
```

The resulting image can then be used as:

- video thumbnail
- ecommerce product photo
- news thumbnail
- game card
- dashboard preview

### Query Word Banks

The query engine should have provider-safe word banks.

General web/commercial:

- product
- shopping
- checkout
- customer service
- subscription
- delivery
- warehouse
- desk
- laptop
- package
- sale

Accommodation/travel:

- hotel
- apartment
- suite
- reception
- booking
- breakfast
- luggage
- travel
- guest

Media/games:

- video
- streaming
- television
- game
- arcade
- controller
- screen
- playlist
- entertainment

News/corporate:

- newspaper
- office
- meeting
- announcement
- report
- press
- city
- finance
- dashboard

Archival/weird-public:

- diagram
- catalog
- manual
- sign
- document
- map
- public domain
- archive
- brochure

The query engine can combine these conservatively:

```txt
{primaryTopic}
{primaryTopic} {secondaryTopic}
{genreTopic} {imageRole}
{motif} {providerSafeNoun}
```

Avoid generating searches that are too specific or intentionally nonsensical. Search APIs need normal queries. The page should make normal results feel wrong.

### Media Result Shape

Every provider adapter should normalize to one shape:

```ts
type MediaAsset = {
  id: string
  provider: "pexels" | "unsplash" | "pixabay" | "wikimedia" | "openverse"
  type: "photo" | "video" | "illustration" | "vector" | "document"
  sourceUrl: string
  previewUrl: string
  originalUrl?: string
  width?: number
  height?: number
  durationSeconds?: number
  author?: string
  authorUrl?: string
  license?: string
  licenseUrl?: string
  attributionRequired: boolean
  attributionText?: string
  queries: string[]
  tags: string[]
  dominantColor?: string
}
```

The renderer should not lose attribution/license data. Even if attribution is displayed in a small footer, inspector panel, or media credits page, the metadata must remain attached to the asset.

### Provider Adapters

Suggested modules:

```txt
/lib/media/providers/pexels.ts
/lib/media/providers/unsplash.ts
/lib/media/providers/pixabay.ts
/lib/media/providers/wikimedia.ts
/lib/media/providers/openverse.ts
/lib/media/queryEngine.ts
/lib/media/mediaManifest.ts
/lib/media/attribution.ts
/lib/media/transforms.ts
```

Each provider adapter should expose:

```ts
searchPhotos(query, options)
searchVideos(query, options)
normalizeResult(rawResult)
```

Not every provider supports every media type cleanly. Adapters should fail gracefully and return empty results for unsupported operations.

### Media Manifest

The cached media manifest should be the source of truth for rendering.

It should store:

- normalized asset metadata
- provider
- original query
- download/cache path
- license and attribution
- dimensions
- media type
- tags inferred from query/page context
- ingestion timestamp

This lets the app generate deterministic pages without relying on live provider availability.

### Base Image Categories

Generate or source project-owned base images for:

- low-resolution product photos
- impossible product renders
- generic accommodation thumbnails
- fake streaming thumbnails
- fake app screenshots
- fake dashboard previews
- fake profile images
- generated logos and badges
- fake banner ads
- generic stock-like lifestyle images
- cropped UI fragments
- icon sheets
- placeholder image states
- fake map and directory fragments
- fake document previews
- fake screenshots of unknown software
- fake game thumbnails
- fake news thumbnails
- broken product photography
- sterile brand imagery

The images should be mundane before they are strange. They should look like website assets, not literal environments used as page themes.

### Offness Requirements

Images should be slightly wrong:

- product photos with no obvious product
- accommodation thumbnails used like software screenshots
- app screenshots with impossible controls
- fake people cropped like old profile photos
- product photos with strange shadows
- hotel listings with ecommerce price tags
- game thumbnails that look like booking cards
- news thumbnails that look like product photos
- badges with generic or unreadable text
- overly clean surfaces with one low-res element
- screenshots with slightly impossible reflections or overlays

### Variant Pipeline

Each base image can produce many deterministic variants.

Transforms:

- crop
- zoom
- rotate by tiny amounts
- mirror
- stretch
- blur
- sharpen
- posterize
- dither
- jpeg artifact simulation
- color cast
- overexposure
- underexposure
- fake CRT scanlines
- pixelation
- water distortion
- glass reflection overlay
- fluorescent flicker overlay
- broken-image fallback
- low-res thumbnail conversion
- apparent resolution downsampling
- video bitrate simulation
- frame skipping
- buffering poster frame selection

The same source image can appear as:

- a luxury hero image
- a tiny old-web thumbnail
- a broken product photo
- a news image
- a banner ad background
- a game tile
- a dashboard preview

This matters because repeated images should feel like the site is reusing memories, not loading a normal asset library.

### Page Media Profile

Each page should have one deterministic media profile. This profile controls the apparent quality, loading style, and media behavior for all images and videos on that page.

The same URL should produce the same or very similar media every time:

- same selected source assets
- same apparent resolution tier
- same crop families
- same filter stack
- same loading animation family
- same video poster frame behavior
- same broken/loaded balance

Media should vary between pages, not randomly on every render.

Possible media profiles:

- **2000s thumbnail page**: 160p-360p apparent resolution, heavy jpeg artifacts, hard-edged loading placeholders, tiny thumbnails.
- **720p broadband page**: moderate compression, old streaming spinners, image dimensions that feel like early responsive web.
- **HD marketing page**: clean 1080p-like hero imagery, but mismatched low-res thumbnails in secondary modules.
- **Ultra high definition page**: sharp polished images, slow luxury loading animations, overly clean video previews.
- **Archive scrape page**: mixed resolutions, inconsistent aspect ratios, some missing previews, metadata-heavy presentation.
- **Mobile app mirror page**: vertical crops, app-store-like screenshots, blurred background fills.

The media profile should influence:

- requested or cached asset size
- CSS object-fit behavior
- crop and focal point
- compression simulation
- blur-up or hard-load behavior
- skeleton style
- spinner style
- whether videos autoplay, poster, buffer, or appear as static thumbnails
- whether images appear as modern responsive media or old fixed-size assets

Example:

```txt
pageMediaProfile = pick(routeSeed, mediaProfiles)
componentMediaSeed = hash(routeSeed + componentId + imageRole)
asset = pickFromManifest(componentMediaSeed, queryTags)
variant = applyProfile(asset, pageMediaProfile, componentMediaSeed)
```

The page profile keeps the whole page feeling internally consistent. A 2000s-ish page should not randomly contain one ultra-clean 4K thumbnail unless that is an intentional intrusion from another genre.

### Deterministic Image Selection

Image choice and transforms should be seeded.

```txt
baseImage = pick(seed, imageCategory)
variant = hash(seed + blockId + imageRole)
filters = pickMany(variant, filterSet)
crop = pick(variant, cropRules)
```

The same page seed should always produce the same base image and filter stack.

Scroll mutation can change the variant while keeping the same base image family.

The component should receive a seed from the page generator rather than creating fresh randomness internally. This applies to images, videos, text, layout, loading states, and interaction glitches.

### Image Roles

Images should be selected by role, not just category:

- hero background
- product image
- news thumbnail
- blog image
- fake ad
- game tile
- profile/avatar
- logo-like mark
- directory icon
- loading placeholder
- broken image replacement

The uncanny effect is strongest when the role is wrong but plausible: a hotel listing used as a video thumbnail, a product render used as breaking news, a checkout screenshot used as a game tile.

## Style Recipes

### Old Portal

- table-like grid
- blue underlined links
- grey panels
- tiny fonts
- dense sidebars
- low-res icons

### Corporate Hotel

- pale backgrounds
- elegant spacing
- thin sans-serif typography
- muted teal or green accents
- booking form overlay
- lifestyle imagery used too cleanly

### Kids 2006

- thick outlines
- bright panels
- playful stickers
- rounded buttons
- bubbly navigation
- cheerful elements used in the wrong context

### Web 1.0 Travel

- yellow patterned sidebar
- heavy borders
- dense link lists
- image-map feeling
- fake badges and badges that do not load

### Dark Club Landing Page

- black background
- neon blue, green, or purple light
- large white type
- nightclub energy mixed with irrelevant product modules

### Public Directory

- directory grids
- signage arrows
- institutional green or blue
- public information panels
- route maps that go nowhere

### Abandoned SaaS

- dashboards
- empty charts
- account menus
- skeleton loaders
- clean but sterile UI
- metrics with impossible labels

### Soft Utility

- aqua and white utility palette
- reflective gradients
- overclean panels
- empty content wells
- soft focus image treatment
- subtle distortion on thumbnails

## Loading And Transitional States

Loading states should feel familiar but slightly misapplied.

Loading states should be deterministic per page. The page media profile should choose the main loading animation family, then each component can derive small variations from its component seed.

Actual loading should still be fast. The uncanny loading states are part of the rendered fiction, not a permission for the app to be slow. Use intentional artificial states sparingly and deterministically after the core content is ready.

Use:

- skeleton loaders that reveal the wrong kind of content
- spinners inside old-web table cells
- progress bars labeled with spatial actions
- shimmer effects over low-resolution thumbnails
- "buffering" states on hotel listings
- checkout loaders on news articles
- game loading screens for municipal notices
- fake connection messages from different decades
- VHS-like buffering overlays for video previews
- 2000s progressive jpeg reveal
- modern blur-up placeholders applied to old-looking thumbnails
- ultra-HD shimmer loaders for mundane low-value assets

Example loading messages:

- Loading nearby listings
- Buffering available suite
- Checking thumbnail inventory
- Preparing local headline
- Restoring previous tab
- Downloading breakfast options
- Finding similar widgets

Loading should sometimes complete into a different genre than expected. A video card can load into a hotel booking panel. A product grid can resolve into news headlines. A blog preview can become a checkout module.

The same URL should keep the same loading behavior on repeat visits. If a hero uses a slow blur-up loader and product cards use old broken-image placeholders, that pattern should remain stable for the page.

Errors should follow the same rule. Real app errors should be minimized and monitored, but expected empty states, failed media placeholders, fake 404 panels, broken-image tiles, and retry widgets can be intentionally generated as part of the page.

## Fonts, Colors, And Familiar Wrongness

Fonts and colors should be generated from curated pairings, not arbitrary random values.

Use Tailwind CSS as the styling foundation. Randomized styling should be expressed through deterministic CSS variables, Tailwind utility composition, and generated theme tokens rather than inline chaos.

Each page should combine:

- one dominant font system
- one intruding font system
- one accent font or era-specific UI font

Examples:

- modern geometric sans with default Times New Roman sidebars
- elegant hotel serif with chunky kids-site buttons
- system UI dashboard text with pixelated old-web headings
- corporate grotesk with handwritten promo stickers

Fonts can come from Google Fonts, but font selection must be deterministic per page. A page can choose any Google Font from a curated manifest, then apply it through Next.js font optimization or predeclared font variables.

Font rules:

- choose fonts from a local manifest of allowed Google Fonts
- derive font choices from the decoded route seed
- keep the same fonts on repeat visits to the same URL
- limit the number of loaded font families per page
- use `next/font` or an equivalent optimized loading strategy
- fall back cleanly to system fonts if a font is unavailable

Color palettes should also be genre-aware:

- ecommerce blue/orange mixed with utility aqua
- hotel white/teal polluted by old-web yellow
- kids-site cyan/pink inside corporate grey
- dark streaming UI with beige directory accents
- municipal green signage on a luxury landing page

The wrongness should come from a deliberate mismatch: the palette is almost brand-consistent, but one or two colors belong to another website entirely.

Tailwind theme variables should be generated per page:

```txt
--page-bg
--page-fg
--page-accent
--page-muted
--page-border
--page-link
--page-danger
--page-font-primary
--page-font-intrusion
```

Components should consume these variables through Tailwind classes and CSS variable-backed utilities so the page stays coherent while still feeling procedurally assembled.

## Glitch Rules

Glitches should be structural and tasteful.

Use:

- cut-off cards
- repeated nav items
- mismatched headers and body content
- one component using the wrong theme
- orphaned buttons
- broken image placeholders
- low-resolution thumbnails
- hover labels that change
- impossible counters
- duplicated footers
- slight baseline misalignment
- form fields with strange defaults
- fake loading states
- translucent panels overlapping content
- one bright thumbnail-like element in a dark layout

Avoid:

- unreadable pages
- nonstop distortion
- pure random placement
- constant animation
- obvious horror effects

## Scroll Mutation

When the user scrolls away and back, some components should change.

The page identity remains stable, but individual components may misremember themselves.

Possible mutations:

- headline swaps to a sibling phrase
- product image changes within the same product family
- a counter increments
- a language changes for one label
- a broken image loads
- a loaded image breaks
- a sidebar shifts slightly
- a duplicate component appears
- a footer year changes
- a button label changes but the link does not

Implementation model:

```txt
baseSeed = decoded route seed
componentSeed = hash(baseSeed + componentId)
reentrySeed = hash(componentSeed + viewportEnterCount)
```

The base page is deterministic and shareable. Re-entry mutations are local to the session unless intentionally encoded into history.

## Depth System

The deeper the user goes, the stranger the site becomes.

### Depth 0-5

- mostly familiar
- clean but odd
- realistic ecommerce/news/blog hybrids
- mild language contamination
- minimal glitching

### Depth 6-20

- more mixed layouts
- stronger era collisions
- more broken imagery
- stranger products and headlines
- repeated components become common

### Depth 21-50

- pages feel less like single websites and more like endless webs made of other websites
- web residue becomes stronger
- navigation labels become more self-referential
- content contradicts itself
- UI begins to feel administrative or abandoned

### Depth 50+

- identity instability
- sparse pages alternating with dense portals
- empty directories
- fake search results
- admin panels with no authority
- occasional beautiful modern pages that are almost normal

## Interaction Ideas

- Hovering a link changes its visible label.
- Search autocomplete suggests strange but plausible queries.
- Cart count increments without adding anything.
- Page title changes after a delay.
- Sidebar says "You are here" but points elsewhere.
- Language selector only translates some of the page.
- Cookie modal has options like "Accept Nearby" and "Manage Previous."
- Back links do not go back; they lead to pages that feel related to the previous one.
- Broken image icons can be links.
- Tiny footer links can be more important than primary CTAs.

## Technical Shape

The implementation should use:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- seeded random utility
- deterministic hash function
- component registry
- style recipe registry
- grammar-based text engine
- CSS variables per page
- `next/font` with a curated Google Fonts manifest
- `next/image` or a controlled equivalent for optimized media delivery
- procedural CSS textures
- optional canvas effects for noise, compression, scanlines, shimmer, and image decay

## Performance Strategy

The site should feel instant and snappy even when it pretends to be broken, old, low-resolution, or loading strangely.

Use Next.js performance features aggressively:

- App Router with server components by default
- client components only for interaction, viewport mutation, animation, and browser-only effects
- deterministic page generation on the server where possible
- static generation or cached rendering for stable generated routes when practical
- route segment caching for generated page shells
- streaming/Suspense only where it improves perceived speed
- `next/image` optimization or preprocessed local media variants
- `next/font` to avoid layout shift from Google Fonts
- manifest-first media lookup instead of live API calls during render
- precomputed corpora and manifests loaded as static data
- dynamic imports for heavy visual effects
- CSS transforms and opacity for animations where possible
- avoid layout thrash from randomized dimensions by using stable aspect ratios
- prefetch likely generated links when cheap and useful

Performance rule:

```txt
real app = fast
fictional web page = allowed to appear slow, broken, low-res, or awkward
```

Uncanny loading states should be generated UI states, not accidental network delays. If a component shows a 2000s spinner, fake buffering bar, broken thumbnail, retry panel, or loading skeleton, that state should be intentional, seeded, and cheap to render.

Real error handling should be robust:

- failed provider API calls should not break page rendering
- missing media should fall back to deterministic placeholders
- invalid readable URLs should decode into stable generated pages
- malformed cached manifest entries should be skipped
- attribution metadata should stay attached to fallback media
- client-side animation failures should degrade to static components

Use performance budgets:

- keep initial JavaScript small
- avoid shipping all corpora to the browser
- avoid shipping all media manifest data to the browser
- virtualize or lazily render very long/infinite sections
- lazy-load below-the-fold media
- cap video autoplay and animated effects
- prefer CSS and precomputed variants over expensive runtime canvas work
- respect reduced-motion preferences while preserving the uncanny design through static alternatives

Suggested structure:

```txt
/app/
/app/[...slug]/page.tsx
/app/[...slug]/loading.tsx
/app/[...slug]/error.tsx
/app/media-credits/page.tsx
/lib/seed.ts
/lib/generatePage.ts
/lib/textEngine.ts
/lib/markov.ts
/lib/fonts.ts
/lib/theme.ts
/lib/styleRecipes.ts
/lib/linkEngine.ts
/lib/routeCodec.ts
/lib/genreEngine.ts
/lib/imageEngine.ts
/lib/componentRegistry.ts
/lib/componentSeed.ts
/lib/media/mediaProfiles.ts
/lib/media/queryEngine.ts
/lib/media/mediaManifest.ts
/lib/media/attribution.ts
/lib/media/transforms.ts
/lib/media/providers/pexels.ts
/lib/media/providers/unsplash.ts
/lib/media/providers/pixabay.ts
/lib/media/providers/wikimedia.ts
/lib/media/providers/openverse.ts
/components/blocks/
/components/glitches/
/components/layouts/
/components/textures/
/styles/globals.css
/tailwind.config.ts
/content/corpora/
/content/fonts/google-fonts-manifest.json
/content/image-manifest.json
/content/media-cache/
```

Generation flow:

```txt
Readable URL path
  -> route codec
  -> decoded route state
  -> seeded RNG
  -> page archetype
  -> genre formula
  -> web mood
  -> style recipe
  -> Tailwind/CSS variable theme
  -> Google font selection
  -> media profile
  -> language blend
  -> recurring motifs
  -> component list
  -> component seeds
  -> content packets
  -> image packets
  -> media manifest lookup
  -> deterministic media transforms
  -> link graph
  -> render
```

## MVP

The first version should include:

- Next.js App Router
- TypeScript
- Tailwind CSS
- deterministic page theme variables
- deterministic Google Fonts selection from a curated manifest
- deterministic seeded routing
- readable generated URL codec
- infinite generated links
- 8-10 reusable block types
- deterministic component context and child seed system
- 6-8 style recipes
- page-level media profile system
- genre formula generation
- mixed-language phrase engine
- reusable Markov content engine
- initial corpora for 8-10 genres
- provider-backed media query engine
- initial Pexels provider adapter
- media manifest cache
- attribution metadata preservation
- initial image/video transform pipeline
- deterministic loading animation profiles
- scroll-away mutation behavior
- product/news/blog/form/nav/footer components
- depth-based weirdness
- procedural backgrounds and textures
- loading states that resolve into wrong genres
- Next.js image/font optimization
- manifest-first media rendering
- fast real loading with intentional generated loading/error states
- no backend requirement

A strong MVP page might contain:

1. hotel-style hero with booking search
2. ecommerce product row for impossible subscriptions
3. old-web sidebar of links
4. news widget
5. blog article in mixed English, French, and German
6. fake banner ad
7. duplicated footer from another era
8. readable generated links that produce deterministic pages

## Target Feeling

**in between space** should feel like:

- an ecommerce site remembering a hotel
- a news portal inside a broken ecommerce platform
- a children's site built over a corporate booking engine
- a modern landing page translated through old internet memory
- a website that is not scary until the user realizes there is no outside

Every piece should be recognizable. The whole should never fully resolve.
