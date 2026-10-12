const SVG_NS = 'http://www.w3.org/2000/svg'

const FAR_MOUNTAINS_POINTS = [
  '0,300',
  '0,200', '100,150', '200,190', '300,120', '400,180',
  '500,140', '600,190', '700,130', '800,170', '900,120',
  '1000,180', '1100,140', '1200,190', '1300,150',
  '1440,200', '1440,300',
].join(' ')

const NEAR_MOUNTAINS_POINTS = [
  '0,250',
  '0,220', '80,140', '160,200', '240,120', '320,180',
  '400,100', '480,170', '560,110', '640,180', '720,130',
  '800,190', '880,140', '960,200', '1040,150', '1120,190',
  '1200,130', '1280,180', '1360,150',
  '1440,180', '1440,250',
].join(' ')

function createMountains(
  viewBoxHeight: number,
  points: string,
  fillVariable: string,
): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('viewBox', `0 0 1440 ${viewBoxHeight}`)
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.setAttribute('aria-hidden', 'true')

  const polygon = document.createElementNS(SVG_NS, 'polygon')
  polygon.setAttribute('points', points)
  polygon.setAttribute('fill', fillVariable)
  svg.appendChild(polygon)

  return svg
}

export function createFarMountains(): SVGSVGElement {
  return createMountains(300, FAR_MOUNTAINS_POINTS, 'var(--far-mountains)')
}

export function createNearMountains(): SVGSVGElement {
  return createMountains(250, NEAR_MOUNTAINS_POINTS, 'var(--near-mountains)')
}
