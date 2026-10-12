import gsap from 'gsap'
import type { SceneClipContext, SceneClipTimeline } from './manager'

const FIRE_DURATION = 8.0

export function buildFireTimeline(context: SceneClipContext): SceneClipTimeline {
  const { overlay, root, sound, onComplete } = context

  overlay.style.background =
    'linear-gradient(90deg, #E85838 0%, #F0A040 55%, #F8D060 100%)'
  overlay.style.clipPath = 'inset(0 100% 0 0)'
  overlay.style.mixBlendMode = 'screen'
  overlay.style.opacity = '1'

  const soundHandle = sound.playFireScene(FIRE_DURATION)

  const tl = gsap.timeline({
    onComplete: () => {
      soundHandle?.stop()
      onComplete()
    },
  })

  tl.to(
    overlay,
    {
      clipPath: 'inset(0 0% 0 0)',
      duration: 3.0,
      ease: 'power1.inOut',
    },
    0,
  )

  tl.to(
    root,
    {
      x: 2,
      duration: 0.15,
      repeat: 20,
      yoyo: true,
      ease: 'none',
    },
    0.5,
  )

  tl.to(
    overlay,
    {
      opacity: 0,
      duration: 3.0,
      ease: 'power2.in',
    },
    5.0,
  )

  return tl
}