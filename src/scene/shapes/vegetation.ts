const SVG_NS = 'http://www.w3.org/2000/svg'

const VIEW_BOX_WIDTH = 1440
const VIEW_BOX_HEIGHT = 300

interface MossPatch {
  readonly cx: number
  readonly cy: number
  readonly rx: number
  readonly ry: number
}

interface AccentDot {
  readonly cx: number
  readonly cy: number
  readonly r: number
}

const MOSS_PATCHES: readonly MossPatch[] = [
  { cx: 90, cy: 280, rx: 80, ry: 22 },
  { cx: 250, cy: 290, rx: 100, ry: 25 },
  { cx: 420, cy: 275, rx: 70, ry: 20 },
  { cx: 580, cy: 288, rx: 90, ry: 24 },
  { cx: 740, cy: 278, rx: 75, ry: 21 },
  { cx: 910, cy: 292, rx: 110, ry: 26 },
  { cx: 1080, cy: 282, rx: 80, ry: 22 },
  { cx: 1240, cy: 290, rx: 95, ry: 24 },
  { cx: 1380, cy: 278, rx: 70, ry: 20 },
]

const ACCENT_DOTS: readonly AccentDot[] = [
  { cx: 40, cy: 250, r: 3 },
  { cx: 120, cy: 260, r: 2 },
  { cx: 190, cy: 245, r: 3 },
  { cx: 270, cy: 255, r: 2 },
  { cx: 340, cy: 265, r: 3 },
  { cx: 410, cy: 240, r: 2 },
  { cx: 480, cy: 258, r: 3 },
  { cx: 550, cy: 250, r: 2 },
  { cx: 620, cy: 262, r: 3 },
  { cx: 690, cy: 248, r: 2 },
  { cx: 760, cy: 256, r: 3 },
  { cx: 830, cy: 244, r: 2 },
  { cx: 900, cy: 260, r: 3 },
  { cx: 970, cy: 252, r: 2 },
  { cx: 1040, cy: 264, r: 3 },
  { cx: 1110, cy: 246, r: 2 },
  { cx: 1180, cy: 254, r: 3 },
  { cx: 1250, cy: 262, r: 2 },
  { cx: 1320, cy: 250, r: 3 },
  { cx: 1390, cy: 258, r: 2 },
]

export function createVegetation(): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', `0 0 ${VIEW_BOX_WIDTH} ${VIEW_BOX_HEIGHT}`)
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const mossGroup = document.createElementNS(SVG_NS, 'g')
  mossGroup.setAttribute('data-role', 'moss')
  for (const patch of MOSS_PATCHES) {
    const ellipse = document.createElementNS(SVG_NS, 'ellipse')
    ellipse.setAttribute('cx', String(patch.cx))
    ellipse.setAttribute('cy', String(patch.cy))
    ellipse.setAttribute('rx', String(patch.rx))
    ellipse.setAttribute('ry', String(patch.ry))
    ellipse.setAttribute('fill', 'var(--midground)')
    mossGroup.appendChild(ellipse)
  }

  const dotGroup = document.createElementNS(SVG_NS, 'g')
  dotGroup.setAttribute('data-role', 'accent')
  for (const dot of ACCENT_DOTS) {
    const circle = document.createElementNS(SVG_NS, 'circle')
    circle.setAttribute('cx', String(dot.cx))
    circle.setAttribute('cy', String(dot.cy))
    circle.setAttribute('r', String(dot.r))
    circle.setAttribute('fill', 'var(--accent)')
    dotGroup.appendChild(circle)
  }

  svg.appendChild(mossGroup)
  svg.appendChild(dotGroup)
  return svg
}