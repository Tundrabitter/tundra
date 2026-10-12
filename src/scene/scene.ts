import type { Zone, ZonePalette } from '../core/zones'
import { Layer } from './layer'
import { getInterpolatedPalette } from './palette'
import {
  createBeeSwarm,
  createCornerBee,
  createFawn,
  createReindeer,
} from './shapes/animals'
import { createFarForest } from './shapes/forest'
import { createFarMountains, createNearMountains } from './shapes/mountains'
import { createVegetation } from './shapes/vegetation'
import { LAYER_ORDER, type AnimalId, type LayerType } from './types'

export class Scene {
  private readonly root: HTMLDivElement
  private readonly overlay: HTMLDivElement
  private readonly layers: Map<LayerType, Layer>
  private readonly animals: Map<AnimalId, HTMLElement>
  private currentZone: Zone | null
  private isTransitioning: boolean

  constructor(container: HTMLElement) {
    this.root = document.createElement('div')
    this.root.dataset.scene = 'root'
    container.appendChild(this.root)

    this.layers = new Map()
    for (const type of LAYER_ORDER) {
      const layer = new Layer(type)
      this.layers.set(type, layer)
      this.root.appendChild(layer.element)
    }

    this.overlay = document.createElement('div')
    this.overlay.dataset.effect = 'overlay'
    this.root.appendChild(this.overlay)

    this.animals = new Map()
    this.currentZone = null
    this.isTransitioning = false

    this.fillLayer('farMountains', createFarMountains())
    this.fillLayer('nearMountains', createNearMountains())
    this.fillLayer('farForest', createFarForest())
    this.fillLayer('vegetation', createVegetation())
    this.mountAnimal('reindeer', createReindeer())
    this.mountAnimal('fawn', createFawn())
    this.mountAnimal('bees', createBeeSwarm())
    this.mountAnimal('cornerBee', createCornerBee())
  }

  update(zone: Zone): void {
    if (this.currentZone === null) {
      this.currentZone = zone
      return
    }

    if (zone.id === this.currentZone.id) return

    this.transitionTo(zone)
  }

  transitionTo(zone: Zone): void {
    this.currentZone = zone
  }

  setTemperature(temperature: number): void {
    const palette = getInterpolatedPalette(temperature)
    this.applyPalette(palette)
  }

  mountAnimal(id: AnimalId, node: HTMLElement): void {
    const layer = this.layers.get('animals')
    if (!layer) return
    node.dataset.animalId = id
    node.dataset.visible = 'false'
    layer.element.appendChild(node)
    this.animals.set(id, node)
  }

  setAnimalVisibility(id: AnimalId, visible: boolean): void {
    const node = this.animals.get(id)
    if (!node) return
    node.dataset.visible = String(visible)
  }

  getZone(): Zone | null {
    return this.currentZone
  }

  get transitioning(): boolean {
    return this.isTransitioning
  }

  getOverlay(): HTMLDivElement {
    return this.overlay
  }

  getRoot(): HTMLDivElement {
    return this.root
  }

  getLayer(type: LayerType): Layer | undefined {
    return this.layers.get(type)
  }

  private fillLayer(type: LayerType, content: Node): void {
    const layer = this.layers.get(type)
    if (!layer) return
    layer.element.appendChild(content)
  }

  private applyPalette(palette: ZonePalette): void {
    const style = this.root.style
    style.setProperty('--sky-top', palette.skyTop)
    style.setProperty('--sky-bottom', palette.skyBottom)
    style.setProperty('--far-mountains', palette.farMountains)
    style.setProperty('--near-mountains', palette.nearMountains)
    style.setProperty('--ground', palette.ground)
    style.setProperty('--midground', palette.midground)
    style.setProperty('--accent', palette.accent)
  }
}