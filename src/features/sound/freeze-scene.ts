import { createBurst } from './noise'
import type { SceneSoundHandle } from './types'

const FADE_IN_SECONDS = 0.4
const FADE_OUT_SECONDS = 2.6
const TONE_FREQUENCY = 1400
const TONE_GAIN = 0.08
const VIBRATO_FREQUENCY = 5
const VIBRATO_DEPTH = 30
const CRYSTAL_INTERVAL_MIN_MS = 80
const CRYSTAL_INTERVAL_MAX_MS = 250
const CRYSTAL_GAIN_MIN = 0.3
const CRYSTAL_GAIN_MAX = 0.6
const CRYSTAL_HIGHPASS_MIN = 4000
const CRYSTAL_HIGHPASS_MAX = 7000
const CRYSTAL_DURATION = 0.1
const CRYSTAL_DECAY = 15

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

export function createFreezeSceneSound(
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

  const toneOsc = context.createOscillator()
  toneOsc.type = 'sine'
  toneOsc.frequency.value = TONE_FREQUENCY

  const toneGain = context.createGain()
  toneGain.gain.value = TONE_GAIN

  const vibratoOsc = context.createOscillator()
  vibratoOsc.type = 'sine'
  vibratoOsc.frequency.value = VIBRATO_FREQUENCY

  const vibratoGain = context.createGain()
  vibratoGain.gain.value = VIBRATO_DEPTH

  vibratoOsc.connect(vibratoGain)
  vibratoGain.connect(toneOsc.frequency)
  toneOsc.connect(toneGain)
  toneGain.connect(output)

  toneOsc.start(startTime)
  vibratoOsc.start(startTime)

  const crystalBuffer = createBurst(context, CRYSTAL_DURATION, CRYSTAL_DECAY)

  let cancelled = false
  const crystalTimers: number[] = []

  const scheduleNextCrystal = (): void => {
    if (cancelled) return
    const delay = randomBetween(CRYSTAL_INTERVAL_MIN_MS, CRYSTAL_INTERVAL_MAX_MS)
    const id = window.setTimeout(() => {
      if (cancelled) return
      const time = context.currentTime

      const source = context.createBufferSource()
      source.buffer = crystalBuffer
      source.playbackRate.value = randomBetween(1.0, 1.8)

      const filter = context.createBiquadFilter()
      filter.type = 'highpass'
      filter.frequency.value = randomBetween(
        CRYSTAL_HIGHPASS_MIN,
        CRYSTAL_HIGHPASS_MAX,
      )

      const gain = context.createGain()
      gain.gain.value = randomBetween(CRYSTAL_GAIN_MIN, CRYSTAL_GAIN_MAX)

      source.connect(filter)
      filter.connect(gain)
      gain.connect(output)
      source.start(time)

      scheduleNextCrystal()
    }, delay)
    crystalTimers.push(id)
  }

  scheduleNextCrystal()

  const cleanup = (): void => {
    cancelled = true
    for (const id of crystalTimers) {
      window.clearTimeout(id)
    }
    crystalTimers.length = 0
    try {
      toneOsc.stop()
      vibratoOsc.stop()
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