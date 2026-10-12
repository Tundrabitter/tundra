const SVG_NS = 'http://www.w3.org/2000/svg'

const VIEW_BOX_WIDTH = 1440
const VIEW_BOX_HEIGHT = 100
const BASE_Y = 100

interface Fir {
  readonly x: number
  readonly height: number
  readonly width: number
}

const FIRS: readonly Fir[] = [
  { x: 25, height: 55, width: 24 },
  { x: 60, height: 75, width: 30 },
  { x: 95, height: 45, width: 22 },
  { x: 130, height: 80, width: 32 },
  { x: 175, height: 60, width: 26 },
  { x: 210, height: 70, width: 28 },
  { x: 245, height: 50, width: 22 },
  { x: 280, height: 85, width: 34 },
  { x: 325, height: 65, width: 26 },
  { x: 360, height: 55, width: 24 },
  { x: 395, height: 75, width: 30 },
  { x: 430, height: 45, width: 22 },
  { x: 465, height: 80, width: 32 },
  { x: 510, height: 60, width: 26 },
  { x: 545, height: 70, width: 28 },
  { x: 580, height: 50, width: 22 },
  { x: 615, height: 85, width: 34 },
  { x: 660, height: 65, width: 26 },
  { x: 695, height: 55, width: 24 },
  { x: 730, height: 75, width: 30 },
  { x: 765, height: 45, width: 22 },
  { x: 800, height: 80, width: 32 },
  { x: 845, height: 60, width: 26 },
  { x: 880, height: 70, width: 28 },
  { x: 915, height: 50, width: 22 },
  { x: 950, height: 85, width: 34 },
  { x: 995, height: 65, width: 26 },
  { x: 1030, height: 55, width: 24 },
  { x: 1065, height: 75, width: 30 },
  { x: 1100, height: 45, width: 22 },
  { x: 1135, height: 80, width: 32 },
  { x: 1180, height: 60, width: 26 },
  { x: 1215, height: 70, width: 28 },
  { x: 1250, height: 50, width: 22 },
  { x: 1285, height: 85, width: 34 },
  { x: 1330, height: 65, width: 26 },
  { x: 1365, height: 55, width: 24 },
  { x: 1400, height: 75, width: 30 },
  { x: 1425, height: 45, width: 22 },
]

function firToPath(fir: Fir): string {
  const { x, height, width } = fir
  const halfWidth = width / 2

  const tier1Half = halfWidth
  const tier1ApexY = BASE_Y - height * 0.55

  const tier2Half = halfWidth * 0.72
  const tier2BaseY = BASE_Y - height * 0.3
  const tier2ApexY = BASE_Y - height * 0.8

  const tier3Half = halfWidth * 0.46
  const tier3BaseY = BASE_Y - height * 0.6
  const tier3ApexY = BASE_Y - height

  return [
    `M ${x - tier1Half} ${BASE_Y}`,
    `L ${x} ${tier1ApexY}`,
    `L ${x + tier1Half} ${BASE_Y}`,
    'Z',
    `M ${x - tier2Half} ${tier2BaseY}`,
    `L ${x} ${tier2ApexY}`,
    `L ${x + tier2Half} ${tier2BaseY}`,
    'Z',
    `M ${x - tier3Half} ${tier3BaseY}`,
    `L ${x} ${tier3ApexY}`,
    `L ${x + tier3Half} ${tier3BaseY}`,
    'Z',
  ].join(' ')
}

export function createFarForest(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`)
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const path = document.createElementNS(SVG_NS, 'path')
  path.setAttribute('d', FIRS.map(firToPath).join(' '))
  path.setAttribute('fill', 'var(--midground)')

  svg.appendChild(path)
  return svg
}