import { createBurst } from './noise'
import type { AmbientLayer } from './types'

const FADE_SECONDS = 0.4
const FIRST_DELAY_MIN = 0.4
const FIRST_DELAY_MAX = 1.0
const INTERVAL_MIN = 1.5
const INTERVAL_MAX = 3.0
const CRUNCH_DURATION = 0.25
const CRUNCH_DECAY = 5
const CRUNCH_GAIN_MIN = 0.5
const CRUNCH_GAIN_MAX = 0.9
const BANDPASS_MIN = 400
const BANDPASS_MAX = 1200

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function playCrunch(
  context: AudioContext,
  destination: AudioNode,
  buffer: AudioBuffer,
): void {
  const source = context.createBufferSource()
  source.buffer = buffer
  source.playbackRate.value = randomBetween(0.9, 1.15)

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = randomBetween(BANDPASS_MIN, BANDPASS_MAX)
  filter.Q.value = 0.8

  const gain = context.createGain()
  gain.gain.value = randomBetween(CRUNCH_GAIN_MIN, CRUNCH_GAIN_MAX)

  source.connect(filter)
  filter.connect(gain)
  gain.connect(destination)

  source.start()
}

export function createSnowLayer(context: AudioContext): AmbientLayer {
  const output = context.createGain()
  output.gain.value = 0

  const crunchBuffer = createBurst(context, CRUNCH_DURATION, CRUNCH_DECAY)

  let active = false
  let timerId: number | null = null

  const scheduleNext = (first: boolean): void => {
    if (!active) return
    const delay = first
      ? randomBetween(FIRST_DELAY_MIN, FIRST_DELAY_MAX)
      : randomBetween(INTERVAL_MIN, INTERVAL_MAX)
    timerId = window.setTimeout(() => {
      if (!active) return
      playCrunch(context, output, crunchBuffer)
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