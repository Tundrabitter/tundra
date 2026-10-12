import {
  TEMPERATURE_MAX,
  TEMPERATURE_MIN,
} from '../shared/constants'
import {
  getZoneForTemperature,
  ZONES,
  type ZonePalette,
} from '../core/zones'

type Rgb = readonly [number, number, number]

function hexToRgb(hex: string): Rgb {
  const value = hex.startsWith('#') ? hex.slice(1) : hex
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

function rgbToHex(rgb: Rgb): string {
  const channel = (value: number): string =>
    Math.round(value).toString(16).padStart(2, '0')
  return `#${channel(rgb[0])}${channel(rgb[1])}${channel(rgb[2])}`.toUpperCase()
}

function lerpChannel(from: number, to: number, t: number): number {
  return from + (to - from) * t
}

function lerpColor(from: string, to: string, t: number): string {
  const a = hexToRgb(from)
  const b = hexToRgb(to)
  return rgbToHex([
    lerpChannel(a[0], b[0], t),
    lerpChannel(a[1], b[1], t),
    lerpChannel(a[2], b[2], t),
  ])
}

function interpolatePalette(
  from: ZonePalette,
  to: ZonePalette,
  t: number,
): ZonePalette {
  return {
    skyTop: lerpColor(from.skyTop, to.skyTop, t),
    skyBottom: lerpColor(from.skyBottom, to.skyBottom, t),
    farMountains: lerpColor(from.farMountains, to.farMountains, t),
    nearMountains: lerpColor(from.nearMountains, to.nearMountains, t),
    ground: lerpColor(from.ground, to.ground, t),
    midground: lerpColor(from.midground, to.midground, t),
    accent: lerpColor(from.accent, to.accent, t),
  }
}

export function getInterpolatedPalette(temperature: number): ZonePalette {
  const clamped = Math.max(
    TEMPERATURE_MIN,
    Math.min(TEMPERATURE_MAX, temperature),
  )
  const zone = getZoneForTemperature(clamped)
  const index = ZONES.indexOf(zone)
  const next = ZONES[index + 1]

  if (!next) {
    return zone.colors
  }

  const span = zone.maxTemp - zone.minTemp
  const t = span === 0 ? 0 : (clamped - zone.minTemp) / span

  return interpolatePalette(zone.colors, next.colors, t)
}