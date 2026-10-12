import type { Temperature } from '../core/temperature'
import {
  HOLD_REPEAT_DELAY_MS,
  HOLD_REPEAT_INTERVAL_MS,
} from '../shared/constants'
import { createThermometer } from './thermometer'

export interface ControlsHandle {
  readonly element: HTMLDivElement
  readonly warmerButton: HTMLButtonElement
}

interface ControlButtonOptions {
  readonly label: string
  readonly className?: string
  readonly onClick: () => void
}

function createControlButton(options: ControlButtonOptions): HTMLButtonElement {
  const button = document.createElement('button')
  button.type = 'button'
  button.classList.add('control-button')
  if (options.className) {
    button.classList.add(options.className)
  }
  button.textContent = options.label

  let holdTimer: number | null = null
  let repeatTimer: number | null = null

  const stopRepeat = (): void => {
    if (holdTimer !== null) {
      window.clearTimeout(holdTimer)
      holdTimer = null
    }
    if (repeatTimer !== null) {
      window.clearInterval(repeatTimer)
      repeatTimer = null
    }
  }

  button.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return
    options.onClick()
    holdTimer = window.setTimeout(() => {
      repeatTimer = window.setInterval(() => {
        options.onClick()
      }, HOLD_REPEAT_INTERVAL_MS)
    }, HOLD_REPEAT_DELAY_MS)
  })

  button.addEventListener('pointerup', stopRepeat)
  button.addEventListener('pointerleave', stopRepeat)
  button.addEventListener('pointercancel', stopRepeat)
  button.addEventListener('blur', stopRepeat)

  window.addEventListener('blur', stopRepeat)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRepeat()
  })

  button.addEventListener('click', (event) => {
    event.preventDefault()
  })

  return button
}

export function createControls(temperature: Temperature): ControlsHandle {
  const element = document.createElement('div')
  element.classList.add('controls')

  const buttonsRow = document.createElement('div')
  buttonsRow.classList.add('controls-row')

  const colder = createControlButton({
    label: 'Холоднее',
    onClick: () => temperature.decrease(),
  })

  const reset = createControlButton({
    label: 'Сбросить',
    className: 'control-button-accent',
    onClick: () => temperature.reset(),
  })

  const warmer = createControlButton({
    label: 'Теплее',
    onClick: () => temperature.increase(),
  })

  buttonsRow.appendChild(colder)
  buttonsRow.appendChild(reset)
  buttonsRow.appendChild(warmer)

  const thermometer = createThermometer()

  element.appendChild(buttonsRow)
  element.appendChild(thermometer.element)

  const updateThermometer = (value: number): void => {
    thermometer.setTemperature(value, temperature.min, temperature.max)
  }

  updateThermometer(temperature.current)
  temperature.subscribe('temperature:change', updateThermometer)

  return { element, warmerButton: warmer }
}