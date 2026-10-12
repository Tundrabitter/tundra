const SVG_NS = 'http://www.w3.org/2000/svg'

interface DeerPalette {
  readonly body: string
  readonly bodyHighlight: string
  readonly neck: string
  readonly head: string
  readonly muzzle: string
  readonly ears: string
  readonly earInner: string
  readonly antlers: string
  readonly legs: string
  readonly hooves: string
  readonly tail: string
  readonly tailTip: string
  readonly shadow: string
  readonly backLight: string
}

const ADULT_DEER: DeerPalette = {
  body: '#7A5A42',
  bodyHighlight: '#A8856A',
  neck: '#634A36',
  head: '#8B6A50',
  muzzle: '#A8856A',
  ears: '#7A5A42',
  earInner: '#C9A886',
  antlers: '#9B7B5B',
  legs: '#5A4130',
  hooves: '#2B2118',
  tail: '#8B6A50',
  tailTip: '#E0D5C0',
  shadow: 'rgba(0,0,0,0.20)',
  backLight: 'rgba(255,255,255,0.14)',
}

const FAWN_DEER: DeerPalette = {
  body: '#8B6A50',
  bodyHighlight: '#B09070',
  neck: '#7A5A42',
  head: '#9B7B5B',
  muzzle: '#B89578',
  ears: '#8B6A50',
  earInner: '#D5B79A',
  antlers: '#8B6A50',
  legs: '#7A5A42',
  hooves: '#3B2C20',
  tail: '#9B7B5B',
  tailTip: '#E0D5C0',
  shadow: 'rgba(0,0,0,0.18)',
  backLight: 'rgba(255,255,255,0.18)',
}

function createDeerGroup(palette: DeerPalette): SVGGElement {
  const group = document.createElementNS(SVG_NS, 'g')

  const shadow = document.createElementNS(SVG_NS, 'ellipse')
  shadow.setAttribute('cx', '110')
  shadow.setAttribute('cy', '140')
  shadow.setAttribute('rx', '52')
  shadow.setAttribute('ry', '6')
  shadow.setAttribute('fill', palette.shadow)
  group.appendChild(shadow)

  const legPositions: readonly [number, number][] = [
    [80, 92],
    [95, 92],
    [130, 92],
    [145, 92],
  ]
  for (const [x, y] of legPositions) {
    const leg = document.createElementNS(SVG_NS, 'rect')
    leg.setAttribute('x', String(x))
    leg.setAttribute('y', String(y))
    leg.setAttribute('width', '7')
    leg.setAttribute('height', '46')
    leg.setAttribute('rx', '3')
    leg.setAttribute('fill', palette.legs)
    group.appendChild(leg)

    const hoof = document.createElementNS(SVG_NS, 'rect')
    hoof.setAttribute('x', String(x - 1))
    hoof.setAttribute('y', '134')
    hoof.setAttribute('width', '9')
    hoof.setAttribute('height', '5')
    hoof.setAttribute('rx', '2')
    hoof.setAttribute('fill', palette.hooves)
    group.appendChild(hoof)
  }

  const tail = document.createElementNS(SVG_NS, 'polygon')
  tail.setAttribute('points', '148,76 158,66 155,86')
  tail.setAttribute('fill', palette.tail)
  group.appendChild(tail)

  const tailTip = document.createElementNS(SVG_NS, 'polygon')
  tailTip.setAttribute('points', '155,70 158,66 157,74')
  tailTip.setAttribute('fill', palette.tailTip)
  group.appendChild(tailTip)

  const body = document.createElementNS(SVG_NS, 'ellipse')
  body.setAttribute('cx', '110')
  body.setAttribute('cy', '82')
  body.setAttribute('rx', '42')
  body.setAttribute('ry', '20')
  body.setAttribute('fill', palette.body)
  group.appendChild(body)

  const bodyHighlight = document.createElementNS(SVG_NS, 'ellipse')
  bodyHighlight.setAttribute('cx', '110')
  bodyHighlight.setAttribute('cy', '88')
  bodyHighlight.setAttribute('rx', '34')
  bodyHighlight.setAttribute('ry', '9')
  bodyHighlight.setAttribute('fill', palette.bodyHighlight)
  bodyHighlight.setAttribute('opacity', '0.45')
  group.appendChild(bodyHighlight)

  const backLight = document.createElementNS(SVG_NS, 'ellipse')
  backLight.setAttribute('cx', '108')
  backLight.setAttribute('cy', '73')
  backLight.setAttribute('rx', '36')
  backLight.setAttribute('ry', '5')
  backLight.setAttribute('fill', palette.backLight)
  group.appendChild(backLight)

  const neck = document.createElementNS(SVG_NS, 'polygon')
  neck.setAttribute('points', '60,78 82,92 74,70 52,66')
  neck.setAttribute('fill', palette.neck)
  group.appendChild(neck)

  const head = document.createElementNS(SVG_NS, 'ellipse')
  head.setAttribute('cx', '55')
  head.setAttribute('cy', '62')
  head.setAttribute('rx', '14')
  head.setAttribute('ry', '11')
  head.setAttribute('fill', palette.head)
  group.appendChild(head)

  const muzzle = document.createElementNS(SVG_NS, 'ellipse')
  muzzle.setAttribute('cx', '40')
  muzzle.setAttribute('cy', '68')
  muzzle.setAttribute('rx', '10')
  muzzle.setAttribute('ry', '7')
  muzzle.setAttribute('fill', palette.muzzle)
  group.appendChild(muzzle)

  const nose = document.createElementNS(SVG_NS, 'circle')
  nose.setAttribute('cx', '32')
  nose.setAttribute('cy', '68')
  nose.setAttribute('r', '2')
  nose.setAttribute('fill', palette.hooves)
  group.appendChild(nose)

  const earBack = document.createElementNS(SVG_NS, 'polygon')
  earBack.setAttribute('points', '56,52 62,42 66,54')
  earBack.setAttribute('fill', palette.ears)
  group.appendChild(earBack)

  const earBackInner = document.createElementNS(SVG_NS, 'polygon')
  earBackInner.setAttribute('points', '58,51 62,45 64,53')
  earBackInner.setAttribute('fill', palette.earInner)
  group.appendChild(earBackInner)

  const earFront = document.createElementNS(SVG_NS, 'polygon')
  earFront.setAttribute('points', '48,52 42,42 40,54')
  earFront.setAttribute('fill', palette.ears)
  group.appendChild(earFront)

  const earFrontInner = document.createElementNS(SVG_NS, 'polygon')
  earFrontInner.setAttribute('points', '46,51 43,45 42,53')
  earFrontInner.setAttribute('fill', palette.earInner)
  group.appendChild(earFrontInner)

  const antlers = document.createElementNS(SVG_NS, 'path')
  antlers.setAttribute(
    'd',
    'M 52 50 L 46 34 L 38 24 M 46 34 L 50 26 M 52 50 L 58 32 L 66 22 M 58 32 L 64 24',
  )
  antlers.setAttribute('stroke', palette.antlers)
  antlers.setAttribute('stroke-width', '2.5')
  antlers.setAttribute('stroke-linecap', 'round')
  antlers.setAttribute('stroke-linejoin', 'round')
  antlers.setAttribute('fill', 'none')
  group.appendChild(antlers)

  return group
}

function createDeerSvg(palette: DeerPalette): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 200 150')
  svg.setAttribute('aria-hidden', 'true')
  svg.appendChild(createDeerGroup(palette))
  return svg
}

export function createReindeer(): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.appendChild(createDeerSvg(ADULT_DEER))
  return wrapper
}

export function createFawn(): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.appendChild(createDeerSvg(FAWN_DEER))
  return wrapper
}

interface BeeShapeOptions {
  readonly bodyFill?: string
  readonly stripeFill?: string
  readonly wingFill?: string
  readonly scale?: number
}

function createBeeSvg(options: BeeShapeOptions = {}): SVGSVGElement {
  const {
    bodyFill = '#1A1612',
    stripeFill = '#FFC84A',
    wingFill = 'rgba(255,255,255,0.55)',
    scale = 1,
  } = options

  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', '0 0 30 24')
  svg.setAttribute('aria-hidden', 'true')

  const group = document.createElementNS(SVG_NS, 'g')
  if (scale !== 1) {
    group.setAttribute('transform', `translate(15 12) scale(${scale}) translate(-15 -12)`)
  }

  const wingLeft = document.createElementNS(SVG_NS, 'ellipse')
  wingLeft.setAttribute('cx', '11')
  wingLeft.setAttribute('cy', '6')
  wingLeft.setAttribute('rx', '5')
  wingLeft.setAttribute('ry', '3')
  wingLeft.setAttribute('fill', wingFill)
  group.appendChild(wingLeft)

  const wingRight = document.createElementNS(SVG_NS, 'ellipse')
  wingRight.setAttribute('cx', '19')
  wingRight.setAttribute('cy', '6')
  wingRight.setAttribute('rx', '5')
  wingRight.setAttribute('ry', '3')
  wingRight.setAttribute('fill', wingFill)
  group.appendChild(wingRight)

  const body = document.createElementNS(SVG_NS, 'ellipse')
  body.setAttribute('cx', '15')
  body.setAttribute('cy', '13')
  body.setAttribute('rx', '8')
  body.setAttribute('ry', '6')
  body.setAttribute('fill', bodyFill)
  group.appendChild(body)

  for (const offset of [12, 17]) {
    const stripe = document.createElementNS(SVG_NS, 'line')
    stripe.setAttribute('x1', String(offset))
    stripe.setAttribute('y1', '8')
    stripe.setAttribute('x2', String(offset))
    stripe.setAttribute('y2', '18')
    stripe.setAttribute('stroke', stripeFill)
    stripe.setAttribute('stroke-width', '1.6')
    group.appendChild(stripe)
  }

  const head = document.createElementNS(SVG_NS, 'circle')
  head.setAttribute('cx', '7')
  head.setAttribute('cy', '14')
  head.setAttribute('r', '3.4')
  head.setAttribute('fill', bodyFill)
  group.appendChild(head)

  const eye = document.createElementNS(SVG_NS, 'circle')
  eye.setAttribute('cx', '6')
  eye.setAttribute('cy', '13.4')
  eye.setAttribute('r', '0.7')
  eye.setAttribute('fill', '#FFFFFF')
  group.appendChild(eye)

  svg.appendChild(group)
  return svg
}

interface SwarmBeeSpec {
  readonly top: number
  readonly left: number
  readonly size: number
  readonly animation: 'bee-drift-a' | 'bee-drift-b' | 'bee-drift-c'
  readonly duration: number
  readonly delay: number
}

const SWARM: readonly SwarmBeeSpec[] = [
  { top: 12, left: 8, size: 20, animation: 'bee-drift-a', duration: 4.2, delay: 0 },
  { top: 20, left: 22, size: 24, animation: 'bee-drift-b', duration: 5.1, delay: 0.8 },
  { top: 8, left: 35, size: 18, animation: 'bee-drift-c', duration: 4.6, delay: 1.5 },
  { top: 28, left: 48, size: 22, animation: 'bee-drift-a', duration: 5.5, delay: 0.3 },
  { top: 15, left: 60, size: 20, animation: 'bee-drift-b', duration: 4.3, delay: 2.1 },
  { top: 24, left: 72, size: 26, animation: 'bee-drift-c', duration: 4.9, delay: 0.6 },
  { top: 10, left: 85, size: 22, animation: 'bee-drift-a', duration: 5.2, delay: 1.2 },
  { top: 38, left: 8, size: 24, animation: 'bee-drift-b', duration: 4.4, delay: 1.8 },
  { top: 42, left: 30, size: 18, animation: 'bee-drift-c', duration: 5.0, delay: 0.4 },
  { top: 35, left: 55, size: 22, animation: 'bee-drift-a', duration: 4.7, delay: 2.5 },
  { top: 45, left: 78, size: 20, animation: 'bee-drift-b', duration: 5.3, delay: 1.0 },
  { top: 32, left: 92, size: 22, animation: 'bee-drift-c', duration: 4.5, delay: 0.2 },
]

export function createBeeSwarm(): HTMLDivElement {
  const wrapper = document.createElement('div')

  for (const spec of SWARM) {
    const bee = document.createElement('div')
    bee.className = 'swarm-bee'
    bee.style.top = `${spec.top}%`
    bee.style.left = `${spec.left}%`
    bee.style.width = `${spec.size}px`
    bee.style.height = `${spec.size * 0.8}px`
    bee.style.animation = `${spec.animation} ${spec.duration}s ease-in-out ${spec.delay}s infinite`
    bee.appendChild(createBeeSvg())
    wrapper.appendChild(bee)
  }

  return wrapper
}

export function createCornerBee(): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.appendChild(createBeeSvg())
  return wrapper
}

export function createButtonBee(): HTMLDivElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'button-bee'
  const svg = createBeeSvg({ scale: 0.9 })
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '20')
  wrapper.appendChild(svg)
  return wrapper
}