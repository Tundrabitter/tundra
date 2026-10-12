import type { Temperature } from '../../core/temperature'
import type { AchievementsManager } from '../achievements'
import type { Scene } from '../../scene/scene'
import type { SoundEngine } from '../sound'

export interface SceneClipTimeline {
  play(position?: number): unknown
}

export interface SceneClipContext {
  readonly overlay: HTMLDivElement
  readonly root: HTMLDivElement
  readonly sound: SoundEngine
  readonly onComplete: () => void
}

export interface SceneClipDefinition {
  readonly id: string
  readonly achievementId: string
  readonly triggerTemperature: number
  readonly buildTimeline: (context: SceneClipContext) => SceneClipTimeline
}

export interface SceneClipManagerOptions {
  readonly temperature: Temperature
  readonly scene: Scene
  readonly sound: SoundEngine
  readonly achievements: AchievementsManager
  readonly definitions: readonly SceneClipDefinition[]
}

interface SceneClipState {
  readonly definition: SceneClipDefinition
  isPlayed: boolean
}

export class SceneClipManager {
  private readonly temperature: Temperature
  private readonly scene: Scene
  private readonly sound: SoundEngine
  private readonly achievements: AchievementsManager
  private readonly clips: SceneClipState[]

  constructor(options: SceneClipManagerOptions) {
    this.temperature = options.temperature
    this.scene = options.scene
    this.sound = options.sound
    this.achievements = options.achievements
    this.clips = options.definitions.map((definition) => ({
      definition,
      isPlayed: false,
    }))

    this.temperature.subscribe('temperature:change', (value) => {
      this.check(value)
    })
  }

  private check(value: number): void {
    for (const clip of this.clips) {
      if (clip.isPlayed) continue
      if (value !== clip.definition.triggerTemperature) continue
      this.play(clip)
      return
    }
  }

  private play(clip: SceneClipState): void {
    clip.isPlayed = true
    this.temperature.lock()

    const overlay = this.scene.getOverlay()
    const root = this.scene.getRoot()

    const onComplete = (): void => {
      overlay.style.background = 'transparent'
      overlay.style.clipPath = 'none'
      overlay.style.mixBlendMode = 'normal'
      overlay.style.opacity = '0'
      root.style.transform = ''

      this.achievements.unlock(clip.definition.achievementId)

      this.temperature.unlock()
      this.temperature.reset()
    }

    const timeline = clip.definition.buildTimeline({
      overlay,
      root,
      sound: this.sound,
      onComplete,
    })
    timeline.play(0)
  }
}