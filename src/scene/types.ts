export const LAYER_ORDER = [
  'sky',
  'farMountains',
  'nearMountains',
  'farForest',
  'ground',
  'vegetation',
  'animals',
  'particles',
  'foreground',
] as const

export type LayerType = (typeof LAYER_ORDER)[number]

export type AnimalId = 'reindeer' | 'fawn' | 'bees' | 'cornerBee'