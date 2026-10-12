export interface AchievementDefinition {
  readonly id: string
  readonly name: string
  readonly hint: string
  readonly fact: string
}

export interface AchievementState extends AchievementDefinition {
  readonly unlocked: boolean
}

export type AchievementUnlockListener = (state: AchievementState) => void

const DEFINITIONS: readonly AchievementDefinition[] = [
  {
    id: 'reindeer',
    name: 'Северный олень',
    hint: 'Опустите температуру до −20 °C',
    fact: 'Один из немногих видов оленей, у которых рога растут и у самцов, и у самок. Самки сбрасывают их позже — весной, после отёла.',
  },
  {
    id: 'bees',
    name: 'Шмели',
    hint: 'Поднимите температуру до +25 °C',
    fact: 'В тундре главные опылители — шмели. Они разогревают тело до +30 °C за счёт работы мышц и летают даже в холод.',
  },
  {
    id: 'fire',
    name: 'Пожар',
    hint: 'Доведите температуру до +40 °C',
    fact: 'Тундровые пожары могут тлеть под землёй всю зиму в торфяном слое и разгораться снова весной. Их называют «зомби-пожарами».',
  },
  {
    id: 'ice',
    name: 'Ледяной плен',
    hint: 'Опустите температуру до −60 °C',
    fact: 'В полярную ночь температура в арктической тундре может опускаться до −60 °C. Верхний слой почвы там остаётся мёрзлым даже летом — это вечная мерзлота.',
  },
]

export class AchievementsManager {
  private readonly definitions: readonly AchievementDefinition[]
  private readonly unlocked: Set<string>
  private readonly unlockListeners: Set<AchievementUnlockListener>

  constructor(definitions: readonly AchievementDefinition[] = DEFINITIONS) {
    this.definitions = definitions
    this.unlocked = new Set()
    this.unlockListeners = new Set()
  }

  unlock(id: string): boolean {
    if (!this.definitions.some((d) => d.id === id)) return false
    if (this.unlocked.has(id)) return false
    this.unlocked.add(id)

    const definition = this.definitions.find((d) => d.id === id)
    if (definition) {
      const state: AchievementState = { ...definition, unlocked: true }
      for (const listener of this.unlockListeners) {
        listener(state)
      }
    }
    return true
  }

  onUnlock(listener: AchievementUnlockListener): () => void {
    this.unlockListeners.add(listener)
    return (): void => {
      this.unlockListeners.delete(listener)
    }
  }

  isUnlocked(id: string): boolean {
    return this.unlocked.has(id)
  }

  getAll(): readonly AchievementState[] {
    return this.definitions.map((definition) => ({
      ...definition,
      unlocked: this.unlocked.has(definition.id),
    }))
  }

  getUnlockedCount(): number {
    return this.unlocked.size
  }

  getTotal(): number {
    return this.definitions.length
  }
}