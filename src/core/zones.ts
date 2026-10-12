export interface ZonePalette {
  readonly skyTop: string
  readonly skyBottom: string
  readonly farMountains: string
  readonly nearMountains: string
  readonly ground: string
  readonly midground: string
  readonly accent: string
}

export interface Zone {
  readonly id: number
  readonly name: string
  readonly minTemp: number
  readonly maxTemp: number
  readonly colors: ZonePalette
}

const POLAR_DESERT: Zone = {
  id: 1,
  name: 'Полярная пустыня',
  minTemp: -60,
  maxTemp: -40,
  colors: {
    skyTop: '#C8DDF0',
    skyBottom: '#F0F5FA',
    farMountains: '#A8B8CC',
    nearMountains: '#C0CAD8',
    ground: '#F5F8FC',
    midground: '#B8D8E8',
    accent: '#9AA8B8',
  },
}

const ARCTIC_TUNDRA: Zone = {
  id: 2,
  name: 'Арктическая тундра',
  minTemp: -40,
  maxTemp: -20,
  colors: {
    skyTop: '#A8CCE8',
    skyBottom: '#E0EEF5',
    farMountains: '#8FA8C0',
    nearMountains: '#B0BEC8',
    ground: '#E8EFF0',
    midground: '#A8B8A0',
    accent: '#8898A8',
  },
}

const TYPICAL_TUNDRA: Zone = {
  id: 3,
  name: 'Типичная тундра',
  minTemp: -20,
  maxTemp: 0,
  colors: {
    skyTop: '#8FC0E0',
    skyBottom: '#F0F0E8',
    farMountains: '#7A98B0',
    nearMountains: '#A0B0A0',
    ground: '#C8C8B0',
    midground: '#8AA878',
    accent: '#E0E0D8',
  },
}

const FOREST_TUNDRA: Zone = {
  id: 4,
  name: 'Лесотундра',
  minTemp: 0,
  maxTemp: 15,
  colors: {
    skyTop: '#88B8D8',
    skyBottom: '#F5EDD8',
    farMountains: '#789878',
    nearMountains: '#98B088',
    ground: '#A8C088',
    midground: '#78A060',
    accent: '#F0D878',
  },
}

const TAIGA: Zone = {
  id: 5,
  name: 'Тайга',
  minTemp: 15,
  maxTemp: 30,
  colors: {
    skyTop: '#78B0D8',
    skyBottom: '#F8E8C0',
    farMountains: '#587848',
    nearMountains: '#688858',
    ground: '#88A868',
    midground: '#486838',
    accent: '#F0C858',
  },
}

const FIRE: Zone = {
  id: 6,
  name: 'Пожар',
  minTemp: 30,
  maxTemp: 40,
  colors: {
    skyTop: '#A87858',
    skyBottom: '#E88858',
    farMountains: '#584838',
    nearMountains: '#483828',
    ground: '#382818',
    midground: '#686058',
    accent: '#E85838',
  },
}

export const ZONES = [
  POLAR_DESERT,
  ARCTIC_TUNDRA,
  TYPICAL_TUNDRA,
  FOREST_TUNDRA,
  TAIGA,
  FIRE,
] as const

export function getZoneForTemperature(temperature: number): Zone {
  let current: Zone = ZONES[0]
  for (const zone of ZONES) {
    if (temperature >= zone.minTemp) {
      current = zone
    } else {
      break
    }
  }
  return current
}