import type { Temperature } from '../core/temperature'
import type { AchievementsManager } from './achievements'
import type { SoundEngine } from './sound'
import type { Scene } from '../scene/scene'
import { createButtonBee } from '../scene/shapes/animals'
import type { AnimalId } from '../scene/types'

interface EasterEgg {
  readonly animalId: AnimalId
  readonly achievementId: string
  readonly minTemp: number
  readonly maxTemp: number
}

const REINDEER_WINDOW = { minTemp: -22, maxTemp: -18 }
const BEES_WINDOW = { minTemp: 23, maxTemp: 27 }

const EASTER_EGGS: readonly EasterEgg[] = [
  {
    animalId: 'reindeer',
    achievementId: 'reindeer',
    ...REINDEER_WINDOW,
  },
  {
    animalId: 'fawn',
    achievementId: 'reindeer',
    ...REINDEER_WINDOW,
  },
  {
    animalId: 'bees',
    achievementId: 'bees',
    ...BEES_WINDOW,
  },
  {
    animalId: 'cornerBee',
    achievementId: 'bees',
    ...BEES_WINDOW,
  },
]

export function setupEasterEggs(
  temperature: Temperature,
  scene: Scene,
  achievements: AchievementsManager,
  sound: SoundEngine,
  warmerButton: HTMLButtonElement,
): void {
  const buttonBee = createButtonBee()
  buttonBee.dataset.visible = 'false'
  warmerButton.appendChild(buttonBee)

  let reindeerWasVisible = false
  let beesWereVisible = false

  temperature.subscribe('temperature:change', (value) => {
    for (const egg of EASTER_EGGS) {
      const visible = value >= egg.minTemp && value <= egg.maxTemp
      scene.setAnimalVisibility(egg.animalId, visible)
      if (visible) {
        achievements.unlock(egg.achievementId)
      }
    }

    const beesVisible =
      value >= BEES_WINDOW.minTemp && value <= BEES_WINDOW.maxTemp
    buttonBee.dataset.visible = String(beesVisible)

    const reindeerVisible =
      value >= REINDEER_WINDOW.minTemp && value <= REINDEER_WINDOW.maxTemp

    if (reindeerVisible !== reindeerWasVisible) {
      if (reindeerVisible) {
        sound.startReindeerCall()
      } else {
        sound.stopReindeerCall()
      }
    }
    reindeerWasVisible = reindeerVisible

    if (beesVisible !== beesWereVisible) {
      sound.setBeesBuzzActive(beesVisible)
    }
    beesWereVisible = beesVisible
  })
}