import { createBurst, createNoiseBuffer } from './noise'
import type { SceneSoundHandle } from './types'

const FADE_IN_SECONDS = 0.5
const FADE_OUT_SECONDS = 3.0
const CRACK_INTERVAL_MIN_MS = 40
const CRACK_INTERVAL_MAX_MS = 150
const CRACK_GAIN_MIN = 0.3
const CRACK_GAIN_MAX = 0.7
const CRACK_HIGHPASS_MIN = 3000
const CRACK_HIGHPASS_MAX = 6000
const CRACK_DURATION = 0.06
const CRACK_DECAY = 12

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function createFireSceneSound(
  context: AudioContext,
  destination: AudioNode,
  duration: number,
): SceneSoundHandle {
  const startTime = context.currentTime

  const output = context.createGain()
  output.gain.setValueAtTime(0, startTime)
  output.gain.linearRampToValueAtTime(1, startTime + FADE_IN_SECONDS)
  output.gain.setValueAtTime(1, startTime + duration - FADE_OUT_SECONDS)
  output.gain.linearRampToValueAtTime(0, startTime + duration)
  output.connect(destination)

  const noiseBuffer = createNoiseBuffer(context, 3)
  const crackBuffer = createBurst(context, CRACK_DURATION, CRACK_DECAY)

  const rumbleSource = context.createBufferSource()
  rumbleSource.buffer = noiseBuffer
  rumbleSource.loop = true

  const rumbleFilter = context.createBiquadFilter()
  rumbleFilter.type = 'lowpass'
  rumbleFilter.frequency.value = 400
  rumbleFilter.Q.value = 0.7

  const rumbleGain = context.createGain()
  rumbleGain.gain.value = 0.5

  rumbleSource.connect(rumbleFilter)
  rumbleFilter.connect(rumbleGain)
  rumbleGain.connect(output)

  const flameSource = context.createBufferSource()
  flameSource.buffer = noiseBuffer
  flameSource.loop = true

  const flameFilter = context.createBiquadFilter()
  flameFilter.type = 'bandpass'
  flameFilter.frequency.value = 800
  flameFilter.Q.value = 0.8

  const flameGain = context.createGain()
  flameGain.gain.value = 0.4

  flameSource.connect(flameFilter)
  flameFilter.connect(flameGain)
  flameGain.connect(output)

  rumbleSource.start(startTime)
  flameSource.start(startTime)

  let cancelled = false
  const crackTimers: number[] = []

  const scheduleNextCrack = (): void => {
    if (cancelled) return
    const delay = randomBetween(CRACK_INTERVAL_MIN_MS, CRACK_INTERVAL_MAX_MS)
    const id = window.setTimeout(() => {
      if (cancelled) return
      const time = context.currentTime

      const source = context.createBufferSource()
      source.buffer = crackBuffer
      source.playbackRate.value = randomBetween(0.8, 1.4)

      const filter = context.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = randomBetween(
        CRACK_HIGHPASS_MIN,
        CRACK_HIGHPASS_MAX,
      )

      const gain = context.createGain()
      gain.gain.value = randomBetween(CRACK_GAIN_MIN, CRACK_GAIN_MAX)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(output)
      source.start(time)

      scheduleNextCrack()
    }, delay)
    crackTimers.push(id)
  }

  scheduleNextCrack()

  const cleanup = (): void => {
    cancelled = true
    for (const id of crackTimers) {
      window.clearTimeout(id)
    }
    crackTimers.length = 0
    try {
      rumbleSource.stop()
      flameSource.stop()
    } catch {
      // источники уже остановлены
    }
    output.disconnect()
  }

  const naturalStopTimer = window.setTimeout(
    cleanup,
    (duration + 0.2) * 1000,
  )

  const stop = (): void => {
    if (cancelled) return
    window.clearTimeout(naturalStopTimer)
    const time = context.currentTime
    output.gain.cancelScheduledValues(time)
    output.gain.setValueAtTime(output.gain.value, time)
    output.gain.linearRampToValueAtTime(0, time + 0.15)
    window.setTimeout(cleanup, 200)
  }

  return { stop }
}