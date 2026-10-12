import type {
  AchievementsManager,
  AchievementState,
} from '../features/achievements'

const TOAST_DURATION_MS = 8000
const TRANSITION_MS = 300

function renderToast(achievement: AchievementState): HTMLDivElement {
  const toast = document.createElement('div')
  toast.classList.add('achievement-toast')
  toast.dataset.visible = 'false'

  const label = document.createElement('div')
  label.classList.add('achievement-toast-label')
  label.textContent = 'Достижение разблокировано'

  const name = document.createElement('div')
  name.classList.add('achievement-toast-name')
  name.textContent = achievement.name

  const fact = document.createElement('div')
  fact.classList.add('achievement-toast-fact')
  fact.textContent = achievement.fact

  toast.appendChild(label)
  toast.appendChild(name)
  toast.appendChild(fact)
  return toast
}

export function createAchievementToast(
  achievements: AchievementsManager,
): HTMLElement {
  const container = document.createElement('div')
  container.classList.add('toast-container')

  const queue: AchievementState[] = []
  let isShowing = false

  const showNext = (): void => {
    const next = queue.shift()
    if (!next) {
      isShowing = false
      return
    }

    isShowing = true
    const toast = renderToast(next)
    container.appendChild(toast)

    void toast.offsetWidth
    toast.dataset.visible = 'true'

    window.setTimeout(() => {
      toast.dataset.visible = 'false'
      window.setTimeout(() => {
        toast.remove()
        showNext()
      }, TRANSITION_MS)
    }, TOAST_DURATION_MS)
  }

  achievements.onUnlock((state) => {
    queue.push(state)
    if (!isShowing) showNext()
  })

  return container
}