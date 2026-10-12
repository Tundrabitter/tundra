import { createNoiseBuffer } from './noise'
import type { WindLayer } from './types'

const WIND_MIN_VOLUME = 0.28
const WIND_MAX_VOLUME = 0.05

export function createWindLayer(context: AudioContext): WindLayer {
  const noiseBuffer = createNoiseBuffer(context, 3)

  const output = context.createGain()
  output.gain.value = WIND_MIN_VOLUME

  const upperSource = context.createBufferSource()
  upperSource.buffer = noiseBuffer
  upperSource.loop = true

  const upperFilter = context.createBiquadFilter()
  upperFilter.type = 'lowpass'
  upperFilter.frequency.value = 500
  upperFilter.Q.value = 0.7

  const upperBase = context.createGain()
  upperBase.gain.value = 0.6

  const upperLfo = context.createOscillator()
  upperLfo.type = 'sine'
  upperLfo.frequency.value = 0.08

  const upperLfoGain = context.createGain()
  upperLfoGain.gain.value = 0.4

  upperLfo.connect(upperLfoGain)
  upperLfoGain.connect(upperBase.gain)

  upperSource.connect(upperFilter)
  upperFilter.connect(upperBase)
  upperBase.connect(output)

  const lowerSource = context.createBufferSource()
  lowerSource.buffer = noiseBuffer
  lowerSource.loop = true

  const lowerFilter = context.createBiquadFilter()
  lowerFilter.type = 'bandpass'
  lowerFilter.frequency.value = 180
  lowerFilter.Q.value = 1.2

  const lowerGain = context.createGain()
  lowerGain.gain.value = 0.25

  lowerSource.connect(lowerFilter)
  lowerFilter.connect(lowerGain)
  lowerGain.connect(output)

  upperSource.start()
  lowerSource.start()
  upperLfo.start()

  const setVolume = (value: number): void => {
    output.gain.setTargetAtTime(value, context.currentTime, 0.5)
  }

  return { output, setVolume }
}

export const WIND_VOLUME_RANGE = {
  min: WIND_MIN_VOLUME,
  max: WIND_MAX_VOLUME,
} as const