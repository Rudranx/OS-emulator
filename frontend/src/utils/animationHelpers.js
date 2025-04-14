// Helper functions for animations and transitions

// Fade in/out animations for page transitions
export const pageTransitions = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

// Fade in animation with custom delay support
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: (delay = 0) => ({ 
    duration: 0.5,
    delay
  }),
};

// Staggered children animations for lists
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation for list items
export const listItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 },
};

// Animation for revealing content on scroll
export const revealOnScroll = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8 },
};

// Scale animation for interactive elements
export const scaleOnHover = {
  initial: { scale: 1 },
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

// Slide in from left
export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

// Slide in from right
export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 },
};

// Slide in from bottom
export const slideInBottom = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

// Bounce animation for attention-grabbing elements
export const bounce = {
  initial: { y: 0 },
  animate: { y: -10 },
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
  },
};

// Pulse animation for highlighting elements
export const pulse = {
  initial: { scale: 1 },
  animate: { scale: 1.05 },
  transition: {
    duration: 0.5,
    repeat: Infinity,
    repeatType: 'reverse',
  },
};

// Rotate animation for loading indicators
export const rotate = {
  initial: { rotate: 0 },
  animate: { rotate: 360 },
  transition: {
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  },
};

// Utility to apply animations based on viewport visibility
export const createScrollAnimation = (inView) => {
  return inView ? 'animate' : 'initial';
};

// Animation sequences for more complex animations
export const createSequence = (animations, delayBetween = 0.1) => {
  return animations.map((animation, index) => ({
    ...animation,
    transition: {
      ...animation.transition,
      delay: index * delayBetween,
    },
  }));
}; 