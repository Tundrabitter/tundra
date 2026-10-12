import type { AmbientLayer } from './types'

const BASE_FREQUENCY = 200
const BANDPASS_FREQUENCY = 350
const BANDPASS_Q = 1.2
const TREMOLO_FREQUENCY = 12
const TREMOLO_DEPTH = 0.08
const BASE_GAIN = 0.06
const FADE_SECONDS = 0.4

export function createBeesBuzzLayer(context: AudioContext): AmbientLayer {
  const output = context.createGain()
  output.gain.value = 0

  const osc = context.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = BASE_FREQUENCY

  const filter = context.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = BANDPASS_FREQUENCY
  filter.Q.value = BANDPASS_Q

  const gain = context.createGain()
  gain.gain.value = BASE_GAIN

  const tremoloOsc = context.createOscillator()
  tremoloOsc.type = 'sine'
  tremoloOsc.frequency.value = TREMOLO_FREQUENCY

  const tremoloGain = context.createGain()
  tremoloGain.gain.value = BASE_GAIN * TREMOLO_DEPTH

  tremoloOsc.connect(tremoloGain)
  tremoloGain.connect(gain.gain)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(output)

  osc.start()
  tremoloOsc.start()

  const setActive = (value: boolean): void => {
    const now = context.currentTime
    output.gain.cancelScheduledValues(now)
    output.gain.setValueAtTime(output.gain.value, now)
    output.gain.linearRampToValueAtTime(value ? 1 : 0, now + FADE_SECONDS)
  }

  return { output, setActive }
}