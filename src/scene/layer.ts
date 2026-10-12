import type { LayerType } from './types'

export class Layer {
  readonly type: LayerType
  readonly element: HTMLDivElement

  constructor(type: LayerType) {
    this.type = type
    this.element = document.createElement('div')
    this.element.dataset.layer = type
  }

  render(): void {}

  fadeIn(): void {}

  fadeOut(): void {}
}