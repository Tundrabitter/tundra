import type { Temperature } from '../core/temperature'
import {
  HOLD_REPEAT_DELAY_MS,
  HOLD_REPEAT_INTERVAL_MS,
} from '../shared/constants'

export function setupKeyboard(temperature: Temperature): void {
  let holdTimer: number | null = null
  let repeatTimer: number | null = null
  let activeKey: string | null = null

  const stopRepeat = (): void => {
    if (holdTimer !== null) {
      window.clearTimeout(holdTimer)
      holdTimer = null
    }
    if (repeatTimer !== null) {
      window.clearInterval(repeatTimer)
      repeatTimer = null
    }
    activeKey = null
  }

  const isDecreaseKey = (key: string): boolean =>
    key === 'ArrowLeft' || key === 'ArrowDown'

  const isIncreaseKey = (key: string): boolean =>
    key === 'ArrowRight' || key === 'ArrowUp'

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.altKey || event.ctrlKey || event.metaKey) return

    const isDecrease = isDecreaseKey(event.key)
    const isIncrease = isIncreaseKey(event.key)
    if (!isDecrease && !isIncrease) return

    event.preventDefault()

    if (event.repeat) return
    if (activeKey === event.key) return

    stopRepeat()
    activeKey = event.key

    const action = isDecrease
      ? (): void => temperature.decrease()
      : (): void => temperature.increase()

    action()
    holdTimer = window.setTimeout(() => {
      repeatTimer = window.setInterval(action, HOLD_REPEAT_INTERVAL_MS)
    }, HOLD_REPEAT_DELAY_MS)
  }

  const onKeyUp = (event: KeyboardEvent): void => {
    if (isDecreaseKey(event.key) || isIncreaseKey(event.key)) {
      stopRepeat()
    }
  }

  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', stopRepeat)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopRepeat()
  })
}