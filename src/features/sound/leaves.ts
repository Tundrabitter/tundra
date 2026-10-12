import { createNoiseBuffer } from './noise'
import type { AmbientLayer } from './types'

const FADE_SECONDS = 0.4
const BASE_GAIN = 0.12
const MODULATION_DEPTH = 0.08
const LFO_FREQUENCY = 0.15
const BANDPASS_FREQUENCY = 1500
const BANDPASS_Q = 0.5

export function createLeavesLayer(context: AudioContext): AmbientLayer {
  const output = context.createGain()
  output.gain.value = 0

  const noiseBuffer = createNoiseBuffer(context, 3)

  const source = context.createBufferSource()
  source.buffer = noiseBuffer
  source.loop = true

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = BANDPASS_FREQUENCY
  filter.Q.value = BANDPASS_Q

  const baseGain = context.createGain()
  baseGain.gain.value = BASE_GAIN

  const lfo = context.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = LFO_FREQUENCY

  const lfoGain = context.createGain()
  lfoGain.gain.value = MODULATION_DEPTH

  lfo.connect(lfoGain)
  lfoGain.connect(baseGain.gain)

  source.connect(filter)
  filter.connect(baseGain)
  baseGain.connect(output)

  source.start()
  lfo.start()

  const setActive = (value: boolean): void => {
    const now = context.currentTime
    output.gain.cancelScheduledValues(now)
    output.gain.setValueAtTime(output.gain.value, now)
    output.gain.linearRampToValueAtTime(value ? 1 : 0, now + FADE_SECONDS)
  }

  return { output, setActive }
}