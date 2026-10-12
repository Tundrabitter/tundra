export interface AmbientLayer {
  readonly output: GainNode
  setActive(active: boolean): void
}

export interface WindLayer {
  readonly output: GainNode
  setVolume(value: number): void
}

export interface SceneSoundHandle {
  stop(): void
}