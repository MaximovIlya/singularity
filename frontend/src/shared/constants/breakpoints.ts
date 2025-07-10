// Константы для адаптивных breakpoints
export const BREAKPOINTS = {
  // Размеры экранов
  EXTRA_LARGE: 1200,
  LARGE: 992,
  MEDIUM: 768,
  SMALL: 576,
  EXTRA_SMALL: 480,
  TINY: 360,
} as const;

// Проверки размеров экрана
export const SCREEN_QUERIES = {
  isExtraLarge: (width: number) => width >= BREAKPOINTS.EXTRA_LARGE,
  isLarge: (width: number) => width >= BREAKPOINTS.LARGE && width < BREAKPOINTS.EXTRA_LARGE,
  isMedium: (width: number) => width >= BREAKPOINTS.MEDIUM && width < BREAKPOINTS.LARGE,
  isSmall: (width: number) => width >= BREAKPOINTS.SMALL && width < BREAKPOINTS.MEDIUM,
  isExtraSmall: (width: number) => width >= BREAKPOINTS.EXTRA_SMALL && width < BREAKPOINTS.SMALL,
  isTiny: (width: number) => width < BREAKPOINTS.EXTRA_SMALL,
  
  // Основные категории
  isDesktop: (width: number) => width >= BREAKPOINTS.LARGE,
  isTablet: (width: number) => width >= BREAKPOINTS.SMALL && width < BREAKPOINTS.LARGE,
  isMobile: (width: number) => width < BREAKPOINTS.SMALL,
  isPhone: (width: number) => width < BREAKPOINTS.EXTRA_SMALL,
} as const;

// Константы для spacing (расстояния между элементами)
export const HEADER_SPACING = {
  // Расстояние между кнопками
  BUTTON_GAP: {
    EXTRA_LARGE: '1.25rem',
    LARGE: '1rem', 
    MEDIUM: '0.75rem',
    SMALL: '0.5rem',
    EXTRA_SMALL: '0.375rem',
    TINY: '0.25rem',
  },
  
  // Общие отступы в header
  CONTENT_GAP: {
    EXTRA_LARGE: '1.5rem',
    LARGE: '1rem',
    MEDIUM: '0.75rem', 
    SMALL: '0.5rem',
    EXTRA_SMALL: '0.375rem',
    TINY: '0.25rem',
  },
  
  // Padding для header
  HEADER_PADDING: {
    EXTRA_LARGE: '1.25rem 0',
    LARGE: '1rem 0',
    MEDIUM: '0.875rem 0',
    SMALL: '0.75rem 0', 
    EXTRA_SMALL: '0.625rem 0',
    TINY: '0.5rem 0',
  },
} as const;

export type ScreenSize = keyof typeof HEADER_SPACING.BUTTON_GAP; 