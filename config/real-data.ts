export const realDataConfig = {
  requestTimeoutMs: 4500,
  maxSearchResults: 12,
  providers: {
    gbif: {
      baseUrl: "https://api.gbif.org/v1"
    },
    inaturalist: {
      baseUrl: "https://api.inaturalist.org/v1"
    },
    metMuseum: {
      baseUrl: "https://collectionapi.metmuseum.org/public/collection/v1"
    },
    nasa: {
      apodUrl: "https://api.nasa.gov/planetary/apod",
      apodApiKey: "DEMO_KEY"
    },
    openLibrary: {
      baseUrl: "https://openlibrary.org"
    },
    openMeteo: {
      forecastUrl: "https://api.open-meteo.com/v1/forecast"
    },
    radioBrowser: {
      baseUrl: "https://de1.api.radio-browser.info/json",
      defaultOrder: "votes",
      defaultReverse: true,
      hideBrokenStations: true,
      maxStationResults: 96,
      musicTags: ["music", "rock", "pop", "dance", "jazz", "soul", "funk", "indie", "electronic", "classical", "blues", "reggae", "world"],
      excludedTags: [
        "news",
        "talk",
        "religion",
        "politics",
        "sports",
        "weather",
        "scanner",
        "police",
        "quran",
        "koran",
        "sunnah",
        "islam",
        "christian",
        "catholic",
        "bible",
        "sermon",
        "preaching",
        "recitation"
      ]
    },
    theMealDb: {
      baseUrl: "https://www.themealdb.com/api/json/v1/1"
    },
    wikimedia: {
      restBaseUrl: "https://en.wikipedia.org/api/rest_v1",
      searchUrl: "https://en.wikipedia.org/w/api.php"
    }
  }
} as const;

export type RealDataConfig = typeof realDataConfig;
