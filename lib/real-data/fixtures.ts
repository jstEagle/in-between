import type {
  GbifOccurrence,
  MetObject,
  NasaApod,
  NaturalistObservation,
  OpenLibrarySearchResult,
  OpenLibraryWork,
  RecipeSummary,
  WeatherSummary,
  WikimediaSearchResult,
  WikimediaSummary
} from "./types";

export const fixtureWeather: WeatherSummary = {
  latitude: 40.7128,
  longitude: -74.006,
  timezone: "America/New_York",
  currentTemperatureC: 18,
  currentWindSpeedKph: 11,
  daily: [
    {
      date: "2026-05-30",
      precipitationMm: 1.2,
      temperatureMaxC: 22,
      temperatureMinC: 15
    }
  ]
};

export const fixtureWikimediaSummary: WikimediaSummary = {
  title: "Library",
  description: "Collection of sources of information",
  extract: "A library is a curated collection of sources of information and similar resources.",
  url: "https://en.wikipedia.org/wiki/Library"
};

export const fixtureWikimediaSearch: WikimediaSearchResult[] = [
  {
    title: "Library",
    snippet: "Curated collection of information resources.",
    url: "https://en.wikipedia.org/wiki/Library"
  }
];

export const fixtureOpenLibraryWork: OpenLibraryWork = {
  authors: ["Mary Wollstonecraft Shelley"],
  description: "A landmark novel often associated with early science fiction.",
  key: "/works/OL450229W",
  readerUrl: "https://archive.org/embed/frankensteinormo00shelgoog",
  readableUrl: "https://openlibrary.org/works/OL450229W/Frankenstein",
  subjects: ["Science fiction", "Gothic fiction"],
  title: "Frankenstein"
};

export const fixtureOpenLibrarySearch: OpenLibrarySearchResult[] = [
  {
    authors: ["Mary Wollstonecraft Shelley"],
    firstPublishYear: 1818,
    key: "/works/OL450229W",
    readerUrl: "https://archive.org/embed/frankensteinormo00shelgoog",
    readableUrl: "https://openlibrary.org/works/OL450229W/Frankenstein",
    title: "Frankenstein"
  }
];

export const fixtureRecipe: RecipeSummary = {
  area: "Japanese",
  category: "Vegetarian",
  id: "53065",
  ingredients: ["sushi rice", "rice wine", "cucumber", "avocado", "nori"],
  instructions: "Prepare seasoned rice, layer vegetables and nori, roll tightly, and slice.",
  name: "Sushi",
  sourceUrl: "https://www.themealdb.com/meal/53065"
};

export const fixtureNasaApod: NasaApod = {
  date: "2026-05-30",
  explanation: "A fallback astronomy entry used when NASA APOD is unavailable.",
  mediaType: "image",
  title: "Fallback Sky",
  url: "https://apod.nasa.gov/apod/image/1901/LOmbradellaLuna_Pedersoli_1024.jpg"
};

export const fixtureMetObject: MetObject = {
  artistDisplayName: "Claude Monet",
  department: "European Paintings",
  medium: "Oil on canvas",
  objectDate: "1869",
  objectId: 438008,
  objectUrl: "https://www.metmuseum.org/art/collection/search/438008",
  title: "La Grenouillere"
};

export const fixtureNaturalistObservations: NaturalistObservation[] = [
  {
    id: 196349776,
    observedOn: "2024-01-01",
    placeGuess: "California, US",
    speciesGuess: "Monarch",
    taxonName: "Danaus plexippus",
    uri: "https://www.inaturalist.org/observations/196349776"
  }
];

export const fixtureGbifOccurrences: GbifOccurrence[] = [
  {
    basisOfRecord: "HUMAN_OBSERVATION",
    country: "United States",
    decimalLatitude: 37.77,
    decimalLongitude: -122.42,
    eventDate: "2024-01-01",
    gbifUrl: "https://www.gbif.org/occurrence/4123456789",
    key: 4123456789,
    scientificName: "Danaus plexippus"
  }
];
