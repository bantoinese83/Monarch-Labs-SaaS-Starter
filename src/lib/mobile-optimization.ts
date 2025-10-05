// Mobile optimization utilities
export const mobileBreakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

export const touchTargetSize = {
  min: '44px',
  recommended: '48px',
  large: '56px',
} as const

export const mobileOptimizations = {
  // Touch-friendly spacing
  touchSpacing: {
    small: '8px',
    medium: '12px',
    large: '16px',
    xlarge: '24px',
  },

  // Mobile-first font sizes
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  // Safe area handling
  safeArea: {
    top: 'env(safe-area-inset-top)',
    right: 'env(safe-area-inset-right)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
  },
} as const

export function getMobileClasses() {
  return {
    container: 'w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    touchTarget: 'min-touch-target',
    safeArea: 'safe-area-inset',
    textBalance: 'text-balance',
    scrollSmooth: 'scroll-smooth',
    touchManipulation: 'touch-manipulation',
  }
}

export function getResponsiveClasses() {
  return {
    // Grid responsive classes
    grid: {
      '1': 'grid-cols-1',
      '2': 'sm:grid-cols-2',
      '3': 'sm:grid-cols-2 lg:grid-cols-3',
      '4': 'sm:grid-cols-2 lg:grid-cols-4',
    },

    // Text responsive classes
    text: {
      hero: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
      heading: 'text-2xl sm:text-3xl lg:text-4xl',
      subheading: 'text-lg sm:text-xl',
      body: 'text-sm sm:text-base',
      small: 'text-xs sm:text-sm',
    },

    // Spacing responsive classes
    spacing: {
      section: 'py-12 sm:py-16 lg:py-20',
      container: 'px-4 sm:px-6 lg:px-8',
      gap: 'gap-4 sm:gap-6 lg:gap-8',
    },
  }
}
