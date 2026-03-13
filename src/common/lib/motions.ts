const itemUpVariants: TMotionVariant = {
  initial: { y: 14, opacity: 0 },
  whileInView: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.25, duration: 0.6 },
  },
};

const itemLeftVariants: TMotionVariant = {
  initial: { x: 14, opacity: 0 },
  whileInView: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.25, duration: 0.6 },
  },
};

export const itemUpMotion = {
  initial: 'initial',
  whileInView: 'whileInView',
  viewport: { once: true },
  variants: itemUpVariants,
};

export const itemLeftMotion = {
  initial: 'initial',
  whileInView: 'whileInView',
  viewport: { once: true },
  variants: itemLeftVariants,
};

export const itemVariants = {
  initial: { opacity: 0, y: 20 },
  whileHover: {
    scale: 1.018,
    transition: { duration: 0.2, stiffness: 130, damping: 10 },
  },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    type: 'spring',
    duration: 0.6,
    delay: 0.1,
    staggerChildren: 0.15,
  },
};

export const itemListVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: {
    type: 'spring',
    duration: 0.7,
    delay: 0.2,
    staggerChildren: 0.12,
  },
};

export const itemMotion = {
  initial: 'initial',
  whileInView: 'whileInView',
  whileHover: 'whileHover',
  variants: itemVariants,
  viewport: { once: true },
};

export const itemListMotion = {
  initial: 'initial',
  whileInView: 'whileInView',
  variants: itemListVariants,
  viewport: { once: true },
};

const floatingVariants: TMotionVariant = {
  initial: { x: 0, y: 0, opacity: 0 },
  animate: {
    y: [-10, 10, -10],
    opacity: 1,
    x: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatingMotion = {
  animate: 'animate',
  variants: floatingVariants,
};
