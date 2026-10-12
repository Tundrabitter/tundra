const CALL_DURATION = 1.2
const GLIDE_DURATION = 1.0
const START_FREQUENCY = 130
const END_FREQUENCY = 90
const MAIN_GAIN = 0.95
const SUB_GAIN = 0.25

export function playReindeerCallSound(
  context: AudioContext,
  destination: AudioNode,
): void {
  const startTime = context.currentTime

  const mainOsc = context.createOscillator()
  mainOsc.type = 'sine'
  mainOsc.frequency.setValueAtTime(START_FREQUENCY, startTime)
  mainOsc.frequency.linearRampToValueAtTime(
    END_FREQUENCY,
    startTime + GLIDE_DURATION,
  )

  const mainFilter = context.createBiquadFilter()
  mainFilter.type = 'lowpass'
  mainFilter.frequency.value = 500

  const mainGain = context.createGain()
  mainGain.gain.setValueAtTime(0, startTime)
  mainGain.gain.linearRampToValueAtTime(MAIN_GAIN, startTime + 0.12)
  mainGain.gain.exponentialRampToValueAtTime(0.001, startTime + CALL_DURATION)

  mainOsc.connect(mainFilter)
  mainFilter.connect(mainGain)
  mainGain.connect(destination)

  const subOsc = context.createOscillator()
  subOsc.type = 'sine'
  subOsc.frequency.value = 60

  const subGain = context.createGain()
  subGain.gain.setValueAtTime(0, startTime)
  subGain.gain.linearRampToValueAtTime(SUB_GAIN, startTime + 0.12)
  subGain.gain.exponentialRampToValueAtTime(0.001, startTime + CALL_DURATION)

  subOsc.connect(subGain)
  subGain.connect(destination)

  mainOsc.start(startTime)
  subOsc.start(startTime)
  mainOsc.stop(startTime + CALL_DURATION + 0.05)
  subOsc.stop(startTime + CALL_DURATION + 0.05)
}