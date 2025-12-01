// Montana State Club Soccer Brand Colors
// These colors should match the MSCSS library exactly

export const colors = {
  // Primary Brand Colors
  primary: {
    blue: '#003865',      // Montana State Blue
    gold: '#FFC72C',      // Montana State Gold
  },
  
  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
}

// Tailwind color configuration export
export const tailwindColors = {
  'mscs-blue': colors.primary.blue,
  'mscs-gold': colors.primary.gold,
}

export default colors
