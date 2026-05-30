import {
  fetchGbifOccurrences,
  fetchINaturalistObservations,
  fetchNasaApod,
  fetchOpenMeteoWeather,
  fetchRandomMealDbRecipe,
  fixtureGbifOccurrences,
  fixtureMetObject,
  fixtureNaturalistObservations,
  fixtureOpenLibrarySearch,
  fixtureWikimediaSearch,
  searchMetObjects,
  searchOpenLibrary,
  searchWikimedia,
  seededPick,
  seededSample
} from "@/lib/real-data";
import type { RealDataIntrusion, RouteState } from "./types";
import { entropyLevel } from "./entropy";

const weatherPlaces = [
  { label: "Wellington", latitude: -41.2865, longitude: 174.7762 },
  { label: "New York", latitude: 40.7128, longitude: -74.006 },
  { label: "Tokyo", latitude: 35.6762, longitude: 139.6503 },
  { label: "Reykjavik", latitude: 64.1466, longitude: -21.9426 },
  { label: "Mexico City", latitude: 19.4326, longitude: -99.1332 },
  { label: "Copenhagen", latitude: 55.6761, longitude: 12.5683 }
];

const articleTerms = ["library", "weather", "recipe", "hotel", "radio", "market", "astronomy", "public transport"];
const bookTerms = ["frankenstein", "pride and prejudice", "moby dick", "sherlock holmes", "alice wonderland", "ghost", "cookery", "moon"];
const museumTerms = ["window", "weather", "book", "market", "garden", "room", "breakfast"];
const speciesTerms = ["Danaus plexippus", "Quercus robur", "Corvus corax", "Apis mellifera", "Taraxacum officinale"];

function sentence(value: string, max = 180) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max).replace(/\s+\S*$/, "")}...`;
}

function sourceLabel(provider: string, fallback: boolean) {
  return fallback ? `${provider} via local fallback` : provider;
}

export async function generateRealDataIntrusions(routeState: RouteState): Promise<RealDataIntrusion[]> {
  const seed = `${routeState.seed}:real-data`;
  const weatherPlace = seededPick(`${seed}:weather-place`, weatherPlaces);
  const articleTerm = seededPick(`${seed}:article-term`, [...articleTerms, ...routeState.motifs]);
  const bookTerm = seededPick(`${seed}:book-term`, [...bookTerms, ...routeState.motifs]);
  const museumTerm = seededPick(`${seed}:museum-term`, [...museumTerms, ...routeState.motifs]);
  const speciesTerm = seededPick(`${seed}:species-term`, speciesTerms);

  const [weather, articles, books, recipe, nasa, artObjects, observations, occurrences] = await Promise.all([
    fetchOpenMeteoWeather(weatherPlace, 7),
    searchWikimedia(articleTerm, 6),
    searchOpenLibrary(bookTerm, 8),
    fetchRandomMealDbRecipe(),
    fetchNasaApod(),
    searchMetObjects(museumTerm, 4),
    fetchINaturalistObservations(speciesTerm, 6),
    fetchGbifOccurrences(speciesTerm, 6)
  ]);

  const article = seededPick(`${seed}:article`, articles.data.length ? articles.data : fixtureWikimediaSearch);
  const readerBooks = [...books.data, ...fixtureOpenLibrarySearch].filter((book) => book.readerUrl);
  const readableBooks = books.data.filter((book) => book.readableUrl);
  const book = seededPick(`${seed}:book`, readerBooks.length ? readerBooks : readableBooks.length ? readableBooks : books.data.length ? books.data : fixtureOpenLibrarySearch);
  const art = seededPick(`${seed}:art`, artObjects.data.length ? artObjects.data : [fixtureMetObject]);
  const observation = seededPick(`${seed}:observation`, observations.data.length ? observations.data : fixtureNaturalistObservations);
  const occurrence = seededPick(`${seed}:occurrence`, occurrences.data.length ? occurrences.data : fixtureGbifOccurrences);
  const forecast = weather.data.daily[0];

  const intrusions: RealDataIntrusion[] = [
    {
      actionLabel: "Check forecast",
      body: forecast
        ? `${weatherPlace.label}: ${Math.round(weather.data.currentTemperatureC)}C now, ${Math.round(forecast.temperatureMinC)}-${Math.round(forecast.temperatureMaxC)}C today, ${forecast.precipitationMm}mm precipitation.`
        : `${weatherPlace.label}: ${Math.round(weather.data.currentTemperatureC)}C and wind at ${Math.round(weather.data.currentWindSpeedKph)} kph.`,
      fallback: weather.fallback,
      id: "real-weather",
      kind: "weather",
      kicker: "forecast found under the wrong tab",
      meta: [weather.data.timezone, `${weather.data.latitude.toFixed(2)}, ${weather.data.longitude.toFixed(2)}`],
      provider: "Open-Meteo",
      source: sourceLabel("Open-Meteo", weather.fallback),
      title: `${weatherPlace.label} weather`
    },
    {
      actionLabel: book.readerUrl ? "Read here" : "Catalog card",
      body: `${book.authors.slice(0, 2).join(", ") || "Unknown author"}${book.firstPublishYear ? `, ${book.firstPublishYear}` : ""}. ${book.readerUrl ? "A full reader has been folded into this page." : "Catalog record absorbed into the page."}`,
      fallback: books.fallback,
      id: "real-book",
      imageUrl: book.coverUrl,
      kind: "book",
      kicker: "library shelf pretending to be navigation",
      meta: [book.key, ...book.authors.slice(0, 1)],
      provider: "Open Library",
      readerUrl: book.readerUrl,
      source: sourceLabel("Open Library", books.fallback),
      title: book.title
    },
    {
      actionLabel: "Read article",
      body: sentence(article.snippet || `Wikipedia has a page titled ${article.title}.`),
      fallback: articles.fallback,
      href: article.url,
      id: "real-article",
      kind: "article",
      kicker: "encyclopedia leak",
      meta: [articleTerm],
      provider: "Wikimedia",
      source: sourceLabel("Wikimedia", articles.fallback),
      title: article.title
    },
    {
      actionLabel: recipe.data.sourceUrl ? "Open recipe" : "Keep stirring",
      body: sentence(`${recipe.data.area ?? "Somewhere"} ${recipe.data.category ?? "food"}: ${recipe.data.ingredients.slice(0, 5).join(", ")}.`),
      fallback: recipe.fallback,
      href: recipe.data.sourceUrl,
      id: "real-recipe",
      imageUrl: recipe.data.thumbnailUrl,
      kind: "recipe",
      kicker: "recipe card in the account settings",
      meta: [recipe.data.area ?? "unknown area", recipe.data.category ?? "unknown category"],
      provider: "TheMealDB",
      source: sourceLabel("TheMealDB", recipe.fallback),
      title: recipe.data.name
    },
    {
      actionLabel: "Open sky",
      body: sentence(nasa.data.explanation),
      fallback: nasa.fallback,
      href: nasa.data.url,
      id: "real-space",
      imageUrl: nasa.data.mediaType === "image" ? nasa.data.url : undefined,
      kind: "space",
      kicker: `NASA APOD ${nasa.data.date}`,
      meta: [nasa.data.mediaType, nasa.data.copyright ? `copyright ${nasa.data.copyright}` : "public NASA feed"],
      provider: "NASA APOD",
      source: sourceLabel("NASA APOD", nasa.fallback),
      title: nasa.data.title
    },
    {
      actionLabel: art.objectUrl ? "View object" : "Inspect label",
      body: sentence(`${art.artistDisplayName || "Unknown artist"}; ${art.objectDate || "date unknown"}. ${art.medium || art.department || "Museum collection object"}.`),
      fallback: artObjects.fallback,
      href: art.objectUrl,
      id: "real-art",
      imageUrl: art.imageUrl,
      kind: "art",
      kicker: "museum object misfiled as checkout",
      meta: [art.department ?? "Met collection", `object ${art.objectId}`],
      provider: "The Met",
      source: sourceLabel("The Met", artObjects.fallback),
      title: art.title
    },
    {
      actionLabel: observation.uri ? "Open observation" : "Log sighting",
      body: sentence(`${observation.speciesGuess || observation.taxonName || "Unknown organism"} observed ${observation.observedOn || "recently"} near ${observation.placeGuess || "an unspecified place"}.`),
      fallback: observations.fallback,
      href: observation.uri,
      id: "real-wildlife",
      imageUrl: observation.imageUrl,
      kind: "wildlife",
      kicker: "wildlife note in the booking flow",
      meta: [observation.taxonName ?? speciesTerm, `observation ${observation.id}`],
      provider: "iNaturalist",
      source: sourceLabel("iNaturalist", observations.fallback),
      title: observation.speciesGuess || observation.taxonName || speciesTerm
    },
    {
      actionLabel: "Open GBIF record",
      body: sentence(`${occurrence.scientificName || speciesTerm} recorded in ${occurrence.country || "an unspecified country"}${occurrence.eventDate ? ` on ${occurrence.eventDate.slice(0, 10)}` : ""}.`),
      fallback: occurrences.fallback,
      href: occurrence.gbifUrl,
      id: "real-biodiversity",
      kind: "biodiversity",
      kicker: "biodiversity receipt",
      meta: [occurrence.basisOfRecord ?? "occurrence", `${occurrence.decimalLatitude ?? "?"}, ${occurrence.decimalLongitude ?? "?"}`],
      provider: "GBIF",
      source: sourceLabel("GBIF", occurrences.fallback),
      title: occurrence.scientificName || speciesTerm
    }
  ];

  const requiredKinds = new Set<RealDataIntrusion["kind"]>(["weather", "book"]);
  const required = intrusions.filter((intrusion) => requiredKinds.has(intrusion.kind));
  const entropy = entropyLevel(routeState.depth);
  const rotatingCount = entropy <= 0 ? 1 : routeState.depth > 34 ? 5 : routeState.depth > 18 ? 4 : 2;
  const rotating = seededSample(
    `${seed}:visible`,
    intrusions.filter((intrusion) => !requiredKinds.has(intrusion.kind)),
    rotatingCount
  );

  return seededSample(`${seed}:ordered`, [...required, ...rotating], required.length + rotating.length);
}
