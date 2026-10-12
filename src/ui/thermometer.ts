export interface ThermometerHandle {
  readonly element: HTMLDivElement
  setTemperature(value: number, min: number, max: number): void
}

export function createThermometer(): ThermometerHandle {
  const element = document.createElement('div')
  element.classList.add('thermometer')

  const fill = document.createElement('div')
  fill.classList.add('thermometer-fill')
  element.appendChild(fill)

  const setTemperature = (
    value: number,
    min: number,
    max: number,
  ): void => {
    const span = max - min
    const normalized = span === 0 ? 0 : (value - min) / span
    const percent = Math.max(0, Math.min(1, normalized)) * 100
    const clip = 100 - percent
    fill.style.clipPath = `inset(0 ${clip}% 0 0)`
  }

  return { element, setTemperature }
}