import type { AchievementsManager } from '../features/achievements'

const SVG_NS = 'http://www.w3.org/2000/svg'

export interface AchievementsModalHandle {
  readonly element: HTMLElement
  open(): void
  close(): void
}

export function createAchievementsButton(
  onClick: () => void,
): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('achievements-button')
  button.textContent = 'Достижения'
  button.addEventListener('click', onClick)
  return button
}

function createCloseIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '20')
  svg.setAttribute('height', '20')
  svg.setAttribute('aria-hidden', 'true')

  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', 'M 6 6 L 18 18 M 18 6 L 6 18')
  path.setAttribute('stroke', 'currentColor')
  path.setAttribute('stroke-width', '2')
  path.setAttribute('stroke-linecap', 'round')
  path.setAttribute('fill', 'none')

  svg.appendChild(path)
  return svg
}

function renderAchievementCard(
  achievement: ReturnType<AchievementsManager['getAll']>[number],
): HTMLDivElement {
  const card = document.createElement('div')
  card.classList.add('achievement-card')
  card.dataset.unlocked = String(achievement.unlocked)

  const header = document.createElement('div')
  header.classList.add('achievement-card-header')

  const name = document.createElement('span')
  name.classList.add('achievement-card-name')
  name.textContent = achievement.name

  const status = document.createElement('span')
  status.classList.add('achievement-card-status')
  status.textContent = achievement.unlocked ? 'получено' : 'не получено'

  header.appendChild(name)
  header.appendChild(status)
  card.appendChild(header)

  if (!achievement.unlocked) {
    const hint = document.createElement('p')
    hint.classList.add('achievement-card-hint')
    hint.textContent = achievement.hint
    card.appendChild(hint)
  }

  return card
}

export function createAchievementsModal(
  achievements: AchievementsManager,
): AchievementsModalHandle {
  const overlay = document.createElement('div')
  overlay.classList.add('achievements-overlay')
  overlay.dataset.open = 'false'

  const modal = document.createElement('div')
  modal.classList.add('achievements-modal')
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-label', 'Достижения')

  const header = document.createElement('div')
  header.classList.add('achievements-header')

  const title = document.createElement('h2')
  title.classList.add('achievements-title')
  title.textContent = 'Достижения'

  const counter = document.createElement('span')
  counter.classList.add('achievements-counter')

  const closeButton = document.createElement('button')
  closeButton.type = 'button'
  closeButton.classList.add('achievements-close')
  closeButton.setAttribute('aria-label', 'Закрыть')
  closeButton.appendChild(createCloseIcon())

  header.appendChild(title)
  header.appendChild(counter)
  header.appendChild(closeButton)

  const list = document.createElement('div')
  list.classList.add('achievements-list')

  modal.appendChild(header)
  modal.appendChild(list)
  overlay.appendChild(modal)

  const render = (): void => {
    counter.textContent = `${achievements.getUnlockedCount()} из ${achievements.getTotal()}`
    list.innerHTML = ''
    for (const achievement of achievements.getAll()) {
      list.appendChild(renderAchievementCard(achievement))
    }
  }

  const open = (): void => {
    render()
    overlay.dataset.open = 'true'
  }

  const close = (): void => {
    overlay.dataset.open = 'false'
  }

  closeButton.addEventListener('click', close)

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close()
  })

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && overlay.dataset.open === 'true') {
      close()
    }
  }
  document.addEventListener('keydown', onKeyDown)

  return { element: overlay, open, close }
}