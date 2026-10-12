import { createBurst } from './noise'
import type { AmbientLayer } from './types'

const FADE_SECONDS = 0.4
const FIRST_DELAY_MIN = 0.5
const FIRST_DELAY_MAX = 1.5
const INTERVAL_MIN = 4
const INTERVAL_MAX = 7
const CRACK_DURATION = 0.15
const CRACK_DECAY = 8
const CRACK_GAIN_MIN = 0.4
const CRACK_GAIN_MAX = 0.8
const HIGHPASS_MIN = 2000
const HIGHPASS_MAX = 4000

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function playCrack(
  context: AudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
): void {
  const source = context.createBufferSource()
  source.buffer = buffer

  const filter = context.createBiquadFilter()
  filter.type = 'highpass'
  filter.frequency.value = randomBetween(HIGHPASS_MIN, HIGHPASS_MAX)

  const gain = context.createGain()
  gain.gain.value = randomBetween(CRACK_GAIN_MIN, CRACK_GAIN_MAX)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)

  source.start()
}

export function createIceLayer(context: AudioContext): AmbientLayer {
  const output = context.createGain()
  output.gain.value = 0

  const crackBuffer = createBurst(context, CRACK_DURATION, CRACK_DECAY)

  let active = false
  let timerId: number | null = null

  const scheduleNext = (first: boolean): void => {
    if (!active) return
    const delay = first
      ? randomBetween(FIRST_DELAY_MIN, FIRST_DELAY_MAX)
      : randomBetween(INTERVAL_MIN, INTERVAL_MAX)
    timerId = window.setTimeout(() => {
      if (!active) return
      playCrack(context, output, crackBuffer)
      scheduleNext(false)
    }, delay * 1000)
  }

  const setActive = (value: boolean): void => {
    if (active === value) return
    active = value

    const now = context.currentTime
    output.gain.cancelScheduledValues(now)
    output.gain.setValueAtTime(output.gain.value, now)
    output.gain.linearRampToValueAtTime(value ? 1 : 0, now + FADE_SECONDS)

    if (value) {
      scheduleNext(true)
    } else if (timerId !== null) {
      window.clearTimeout(timerId)
      timerId = null
    }
  }

  return { output, setActive }
}