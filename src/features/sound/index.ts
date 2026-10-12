import {
  TEMPERATURE_MAX,
  TEMPERATURE_MIN,
} from '../../shared/constants'
import type { Temperature } from '../../core/temperature'
import { createBeesBuzzLayer } from './bees-buzz'
import { createFireSceneSound } from './fire-scene'
import { createFreezeSceneSound } from './freeze-scene'
import { createIceLayer } from './ice'
import { createLeavesLayer } from './leaves'
import { playReindeerCallSound } from './reindeer-call'
import { createSnowLayer } from './snow'
import type {
  AmbientLayer,
  SceneSoundHandle,
  WindLayer,
} from './types'
import { createWindLayer, WIND_VOLUME_RANGE } from './wind'

const ICE_LAYER_MIN = -60
const ICE_LAYER_MAX = -40
const SNOW_LAYER_MIN = -40
const SNOW_LAYER_MAX = -10
const LEAVES_LAYER_MIN = 0
const LEAVES_LAYER_MAX = 20
const REINDEER_CALL_INTERVAL_MS = 2500

export type MutedAttemptListener = () => void

interface AmbientSet {
  readonly ice: AmbientLayer
  readonly snow: AmbientLayer
  readonly leaves: AmbientLayer
}

export class SoundEngine {
  private readonly temperature: Temperature
  private context: AudioContext | null
  private master: GainNode | null
  private wind: WindLayer | null
  private ambient: AmbientSet | null
  private beesBuzz: AmbientLayer | null
  private reindeerTimer: number | null
  private muted: boolean
  private readonly mutedListeners: Set<MutedAttemptListener>

  constructor(temperature: Temperature) {
    this.temperature = temperature
    this.context = null
    this.master = null
    this.wind = null
    this.ambient = null
    this.beesBuzz = null
    this.reindeerTimer = null
    this.muted = false
    this.mutedListeners = new Set()

    this.temperature.subscribe('temperature:change', (value) => {
      this.updateWindVolume(value)
      this.updateAmbientLayers(value)
    })
  }

  get isMuted(): boolean {
    return this.muted
  }

  get isReady(): boolean {
    return this.context !== null
  }

  async init(): Promise<void> {
    if (this.context) {
      if (this.context.state === 'suspended') {
        await this.context.resume()
      }
      return
    }

    const context = new AudioContext()
    const master = context.createGain()
    master.gain.value = this.muted ? 0 : 1
    master.connect(context.destination)

    const wind = createWindLayer(context)
    wind.output.connect(master)

    const ice = createIceLayer(context)
    const snow = createSnowLayer(context)
    const leaves = createLeavesLayer(context)
    ice.output.connect(master)
    snow.output.connect(master)
    leaves.output.connect(master)

    const beesBuzz = createBeesBuzzLayer(context)
    beesBuzz.output.connect(master)

    this.context = context
    this.master = master
    this.wind = wind
    this.ambient = { ice, snow, leaves }
    this.beesBuzz = beesBuzz

    this.updateWindVolume(this.temperature.current)
    this.updateAmbientLayers(this.temperature.current)

    if (context.state === 'suspended') {
      await context.resume()
    }
  }

  setMuted(value: boolean): void {
    this.muted = value
    if (!this.context || !this.master) return
    const target = value ? 0 : 1
    this.master.gain.setTargetAtTime(target, this.context.currentTime, 0.05)
  }

  onMutedAttempt(listener: MutedAttemptListener): () => void {
    this.mutedListeners.add(listener)
    return (): void => {
      this.mutedListeners.delete(listener)
    }
  }

  playFireScene(duration: number): SceneSoundHandle | null {
    if (!this.context || !this.master) return null
    if (this.muted) this.notifyMutedAttempt()
    return createFireSceneSound(this.context, this.master, duration)
  }

  playFreezeScene(duration: number): SceneSoundHandle | null {
    if (!this.context || !this.master) return null
    if (this.muted) this.notifyMutedAttempt()
    return createFreezeSceneSound(this.context, this.master, duration)
  }

  startReindeerCall(): void {
    if (!this.context || !this.master) return
    if (this.muted) this.notifyMutedAttempt()
    if (this.reindeerTimer !== null) return

    const play = (): void => {
      if (!this.context || !this.master) return
      playReindeerCallSound(this.context, this.master)
    }

    play()
    this.reindeerTimer = window.setInterval(
      play,
      REINDEER_CALL_INTERVAL_MS,
    )
  }

  stopReindeerCall(): void {
    if (this.reindeerTimer !== null) {
      window.clearInterval(this.reindeerTimer)
      this.reindeerTimer = null
    }
  }

  setBeesBuzzActive(active: boolean): void {
    if (!this.beesBuzz) return
    if (active && this.muted) this.notifyMutedAttempt()
    this.beesBuzz.setActive(active)
  }

  private notifyMutedAttempt(): void {
    for (const listener of this.mutedListeners) {
      listener()
    }
  }

  private updateWindVolume(temperature: number): void {
    if (!this.wind) return
    const span = TEMPERATURE_MAX - TEMPERATURE_MIN
    const normalized = (temperature - TEMPERATURE_MIN) / span
    const volume =
      WIND_VOLUME_RANGE.min * (1 - normalized) +
      WIND_VOLUME_RANGE.max * normalized
    this.wind.setVolume(volume)
  }

  private updateAmbientLayers(temperature: number): void {
    if (!this.ambient) return

    this.ambient.ice.setActive(
      temperature >= ICE_LAYER_MIN && temperature <= ICE_LAYER_MAX,
    )
    this.ambient.snow.setActive(
      temperature > SNOW_LAYER_MIN && temperature <= SNOW_LAYER_MAX,
    )
    this.ambient.leaves.setActive(
      temperature >= LEAVES_LAYER_MIN && temperature <= LEAVES_LAYER_MAX,
    )
  }
}