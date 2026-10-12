const SVG_NS = 'http://www.w3.org/2000/svg'
const SHAKE_COOLDOWN_MS = 600

function createIcon(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')
  svg.setAttribute('aria-hidden', 'true')
  svg.classList.add('mute-icon')

  const speaker = document.createElementNS(SVG_NS, 'path')
  speaker.setAttribute('d', 'M 3 9 L 6 9 L 11 5 L 11 19 L 6 15 L 3 15 Z')
  speaker.setAttribute('fill', 'currentColor')
  svg.appendChild(speaker)

  const waves = document.createElementNS(SVG_NS, 'path')
  waves.setAttribute('d', 'M 14 8 Q 16 12 14 16 M 17 6 Q 20 12 17 18')
  waves.setAttribute('stroke', 'currentColor')
  waves.setAttribute('stroke-width', '1.8')
  waves.setAttribute('stroke-linecap', 'round')
  waves.setAttribute('fill', 'none')
  waves.classList.add('mute-waves')
  svg.appendChild(waves)

  const slash = document.createElementNS(SVG_NS, 'path')
  slash.setAttribute('d', 'M 15 8 L 21 14 M 21 8 L 15 14')
  slash.setAttribute('stroke', 'currentColor')
  slash.setAttribute('stroke-width', '2')
  slash.setAttribute('stroke-linecap', 'round')
  slash.setAttribute('fill', 'none')
  slash.classList.add('mute-slash')
  svg.appendChild(slash)

  return svg
}

export interface MuteButtonHandle {
  readonly element: HTMLButtonElement
  setMuted(value: boolean): void
  shake(): void
  stopInviting(): void
}

export function createMuteButton(
  initialMuted: boolean,
  onToggle: (muted: boolean) => void,
): MuteButtonHandle {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('mute-button')
  button.classList.add('mute-button-inviting')
  button.dataset.muted = String(initialMuted)
  button.setAttribute('aria-label', 'Звук')

  const icon = createIcon()

  const label = document.createElement('span')
  label.classList.add('mute-label')
  label.textContent = 'звук'

  button.appendChild(icon)
  button.appendChild(label)

  button.addEventListener('click', () => {
    const next = button.dataset.muted !== 'true'
    button.dataset.muted = String(next)
    onToggle(next)
  })

  button.addEventListener('animationend', (event) => {
    if (event.animationName === 'mute-shake') {
      button.classList.remove('mute-button-shaking')
    }
  })

  let lastShakeTime = 0

  const shake = (): void => {
    const now = Date.now()
    if (now - lastShakeTime < SHAKE_COOLDOWN_MS) return
    lastShakeTime = now
    button.classList.remove('mute-button-shaking')
    void button.offsetWidth
    button.classList.add('mute-button-shaking')
  }

  const stopInviting = (): void => {
    button.classList.remove('mute-button-inviting')
  }

  const setMuted = (value: boolean): void => {
    button.dataset.muted = String(value)
  }

  return { element: button, setMuted, shake, stopInviting }
}