export const infiniteScrollConfig = {
  social: {
    initialItems: 12,
    batchSize: 10,
    itemHeight: 430,
    compactItemHeight: 400,
    mediaGridItemHeight: 220,
    preloadItems: 5,
    overscanItems: 4
  },
  shorts: {
    initialItems: 10,
    batchSize: 8,
    reelItemHeight: 720,
    gridItemHeight: 360,
    discoverItemHeight: 250,
    preloadItems: 4,
    overscanItems: 3
  }
} as const;
