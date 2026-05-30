export type RealDataSource =
  | "fixture"
  | "gbif"
  | "inaturalist"
  | "met-museum"
  | "nasa-apod"
  | "open-library"
  | "open-meteo"
  | "radio-browser"
  | "the-meal-db"
  | "wikimedia";

export type RealDataResult<T> = {
  data: T;
  fallback: boolean;
  source: RealDataSource;
  error?: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type WeatherSummary = {
  latitude: number;
  longitude: number;
  timezone: string;
  currentTemperatureC: number;
  currentWindSpeedKph: number;
  daily: Array<{
    date: string;
    temperatureMinC: number;
    temperatureMaxC: number;
    precipitationMm: number;
  }>;
};

export type WikimediaSummary = {
  title: string;
  description?: string;
  extract: string;
  url: string;
  thumbnailUrl?: string;
};

export type WikimediaSearchResult = {
  title: string;
  snippet: string;
  url: string;
};

export type OpenLibraryWork = {
  key: string;
  title: string;
  authors: string[];
  description?: string;
  subjects: string[];
  readableUrl?: string;
  readerUrl?: string;
  coverUrl?: string;
};

export type OpenLibrarySearchResult = {
  key: string;
  title: string;
  authors: string[];
  firstPublishYear?: number;
  readableUrl?: string;
  readerUrl?: string;
  coverUrl?: string;
};

export type RecipeSummary = {
  id: string;
  name: string;
  category?: string;
  area?: string;
  instructions: string;
  ingredients: string[];
  sourceUrl?: string;
  thumbnailUrl?: string;
};

export type NasaApod = {
  title: string;
  date: string;
  explanation: string;
  mediaType: "image" | "video" | string;
  url: string;
  hdUrl?: string;
  copyright?: string;
};

export type MetObject = {
  objectId: number;
  title: string;
  artistDisplayName?: string;
  objectDate?: string;
  department?: string;
  medium?: string;
  imageUrl?: string;
  objectUrl?: string;
};

export type NaturalistObservation = {
  id: number;
  observedOn?: string;
  speciesGuess?: string;
  taxonName?: string;
  placeGuess?: string;
  imageUrl?: string;
  uri?: string;
};

export type GbifOccurrence = {
  key: number;
  scientificName?: string;
  country?: string;
  eventDate?: string;
  decimalLatitude?: number;
  decimalLongitude?: number;
  basisOfRecord?: string;
  gbifUrl: string;
};

export type RadioBrowserStation = {
  id: string;
  name: string;
  streamUrl: string;
  resolvedStreamUrl?: string;
  homepageUrl?: string;
  faviconUrl?: string;
  tags: string[];
  country?: string;
  countryCode?: string;
  state?: string;
  language?: string;
  codec?: string;
  bitrateKbps?: number;
  votes: number;
  clickCount: number;
  isOnline: boolean;
};

export type RadioBrowserSearchOptions = {
  query?: string;
  name?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  language?: string;
  tag?: string;
  codec?: string;
  limit?: number;
  offset?: number;
  randomize?: boolean;
};
