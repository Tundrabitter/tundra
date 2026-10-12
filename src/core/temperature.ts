import {
  TEMPERATURE_INITIAL,
  TEMPERATURE_MAX,
  TEMPERATURE_MIN,
  TEMPERATURE_STEP,
} from '../shared/constants'
import { getZoneForTemperature, type Zone } from './zones'

export interface TemperatureEvents {
  'temperature:change': number
  'zone:change': Zone
}

export type TemperatureEventName = keyof TemperatureEvents

export type TemperatureListener<K extends TemperatureEventName> = (
  payload: TemperatureEvents[K],
) => void

export class Temperature {
  private value: number
  private currentZone: Zone
  private locked: boolean

  private readonly listeners: {
    [K in TemperatureEventName]: Set<TemperatureListener<K>>
  } = {
    'temperature:change': new Set(),
    'zone:change': new Set(),
  }

  constructor(initial: number = TEMPERATURE_INITIAL) {
    this.value = initial
    this.currentZone = getZoneForTemperature(initial)
    this.locked = false
  }

  get current(): number {
    return this.value
  }

  get min(): number {
    return TEMPERATURE_MIN
  }

  get max(): number {
    return TEMPERATURE_MAX
  }

  get isLocked(): boolean {
    return this.locked
  }

  getZone(): Zone {
    return this.currentZone
  }

  lock(): void {
    this.locked = true
  }

  unlock(): void {
    this.locked = false
  }

  increase(): void {
    if (this.locked) return
    this.set(this.value + TEMPERATURE_STEP)
  }

  decrease(): void {
    if (this.locked) return
    this.set(this.value - TEMPERATURE_STEP)
  }

  reset(): void {
    if (this.locked) return
    this.set(TEMPERATURE_INITIAL)
  }

  subscribe<K extends TemperatureEventName>(
    event: K,
    listener: TemperatureListener<K>,
  ): () => void {
    this.listeners[event].add(listener)
    return (): void => {
      this.listeners[event].delete(listener)
    }
  }

  private set(next: number): void {
    const clamped = Math.min(TEMPERATURE_MAX, Math.max(TEMPERATURE_MIN, next))
    if (clamped === this.value) return

    const previousZone = this.currentZone
    this.value = clamped
    this.currentZone = getZoneForTemperature(clamped)

    this.emit('temperature:change', this.value)

    if (this.currentZone !== previousZone) {
      this.emit('zone:change', this.currentZone)
    }
  }

  private emit<K extends TemperatureEventName>(
    event: K,
    payload: TemperatureEvents[K],
  ): void {
    for (const listener of this.listeners[event]) {
      listener(payload)
    }
  }
}