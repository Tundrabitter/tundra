import gsap from 'gsap'
import type { SceneClipContext, SceneClipTimeline } from './manager'

const ICE_DURATION = 8.0

export function buildIceTimeline(context: SceneClipContext): SceneClipTimeline {
  const { overlay, root, sound, onComplete } = context

  overlay.style.background =
    'radial-gradient(ellipse at center, #E8F4FF 0%, #A8C8E8 65%, #7098C0 100%)'
  overlay.style.clipPath = 'none'
  overlay.style.mixBlendMode = 'screen'
  overlay.style.opacity = '0'

  const soundHandle = sound.playFreezeScene(ICE_DURATION)

  const tl = gsap.timeline({
    onComplete: () => {
      soundHandle?.stop()
      onComplete()
    },
  })

  tl.to(overlay, { opacity: 0.3, duration: 0.5, ease: 'power2.in' }, 0)
  tl.to(overlay, { opacity: 0.5, duration: 0.5, ease: 'power2.out' }, 0.5)
  tl.to(overlay, { opacity: 0.7, duration: 0.6, ease: 'power2.in' }, 1.0)
  tl.to(overlay, { opacity: 0.9, duration: 0.8, ease: 'power2.out' }, 1.6)

  tl.to(
    root,
    {
      scale: 0.98,
      duration: 0.8,
      ease: 'power2.inOut',
    },
    1.8,
  )

  tl.to(
    overlay,
    {
      opacity: 0,
      duration: 2.6,
      ease: 'power2.out',
    },
    5.4,
  )

  tl.to(
    root,
    {
      scale: 1,
      duration: 1.0,
      ease: 'power2.out',
    },
    5.4,
  )

  return tl
}