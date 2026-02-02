export const fadeUp = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, easing: 'ease-out' } }
} as const

export const fadeSlow = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 2, easing: 'ease-in-out' } }
} as const

export type VariantKeys = keyof typeof fadeUp | keyof typeof fadeSlow

