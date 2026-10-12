import '../styles/reset.css'
import '../styles/main.css'
import '../styles/scene.css'
import '../styles/animations.css'
import '../styles/ui.css'

import { AchievementsManager } from './features/achievements'
import { Temperature } from './core/temperature'
import { setupEasterEggs } from './features/easter-eggs'
import {
  buildFireTimeline,
  buildIceTimeline,
  SceneClipManager,
} from './features/scene-clips'
import { SoundEngine } from './features/sound'
import { Scene } from './scene/scene'
import { createAchievementToast } from './ui/achievement-toast'
import {
  createAchievementsButton,
  createAchievementsModal,
} from './ui/achievements-modal'
import { createControls } from './ui/controls'
import { setupKeyboard } from './ui/keyboard'
import { createMuteButton } from './ui/mute'

const root = document.querySelector<HTMLDivElement>('#app')

if (!root) {
  throw new Error('Root element #app not found')
}

const temperature = new Temperature()
const scene = new Scene(root)
const sound = new SoundEngine(temperature)
const achievements = new AchievementsManager()

scene.setTemperature(temperature.current)
scene.update(temperature.getZone())

const display = document.createElement('div')
display.classList.add('temperature-display')
display.textContent = `${temperature.current} °C — ${temperature.getZone().name}`
root.appendChild(display)

temperature.subscribe('temperature:change', (value) => {
  scene.setTemperature(value)
  const zone = temperature.getZone()
  display.textContent = `${value} °C — ${zone.name}`
})

temperature.subscribe('zone:change', (zone) => {
  scene.update(zone)
})

const muteButton = createMuteButton(sound.isMuted, (muted) => {
  sound.setMuted(muted)
})
root.appendChild(muteButton.element)

sound.onMutedAttempt(() => muteButton.shake())

const controls = createControls(temperature)
root.appendChild(controls.element)

const achievementsModal = createAchievementsModal(achievements)
root.appendChild(achievementsModal.element)

const achievementsButton = createAchievementsButton(() => {
  achievementsModal.open()
})
root.appendChild(achievementsButton)

const achievementToast = createAchievementToast(achievements)
root.appendChild(achievementToast)

setupKeyboard(temperature)
setupEasterEggs(temperature, scene, achievements, sound, controls.warmerButton)

new SceneClipManager({
  temperature,
  scene,
  sound,
  achievements,
  definitions: [
    {
      id: 'fire',
      achievementId: 'fire',
      triggerTemperature: 40,
      buildTimeline: buildFireTimeline,
    },
    {
      id: 'ice',
      achievementId: 'ice',
      triggerTemperature: -60,
      buildTimeline: buildIceTimeline,
    },
  ],
})

const initSound = (): void => {
  void sound.init()
  muteButton.stopInviting()
  document.removeEventListener('pointerdown', initSound)
}

document.addEventListener('pointerdown', initSound)