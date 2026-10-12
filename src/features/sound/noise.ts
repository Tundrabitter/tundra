export function createNoiseBuffer(
  context: AudioContext,
  seconds: number,
): AudioBuffer {
  const sampleRate = context.sampleRate
  const length = Math.floor(sampleRate * seconds)
  const buffer = context.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1
  }
  return buffer
}

export function createBurst(
  context: AudioContext,
  duration: number,
  decay: number,
): AudioBuffer {
  const sampleRate = context.sampleRate
  const length = Math.floor(sampleRate * duration)
  const buffer = context.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i += 1) {
    const t = i / length
    const envelope = Math.exp(-t * decay)
    data[i] = (Math.random() * 2 - 1) * envelope
  }
  return buffer
}