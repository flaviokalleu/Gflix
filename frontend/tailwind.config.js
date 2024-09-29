// tailwind.config.js
module.exports = {
  mode: 'jit', // Ativar o modo JIT para compilar apenas as classes usadas
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Cores personalizadas
      colors: {
        primary: '#1a202c', // Cor primária
        secondary: '#edf2f7', // Cor secundária
        accent: '#f472b6', // Cor de destaque
        muted: '#cbd5e1', // Cor neutra
        success: '#38a169', // Cor de sucesso
        warning: '#dd6b20', // Cor de aviso
        error: '#e53e3e', // Cor de erro
        info: '#3182ce', // Cor de informação
      },
      // Fontes personalizadas
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        serif: ['Merriweather', 'serif'],
        mono: ['Menlo', 'monospace'],
      },
      // Espaçamentos personalizados
      spacing: {
        '72': '18rem', // Adiciona um espaço de 18rem
        '84': '21rem', // Adiciona um espaço de 21rem
        '96': '24rem', // Adiciona um espaço de 24rem
      },
      // Propriedades de transição
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'opacity': 'opacity',
        'color': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      },
      // Breakpoints personalizados
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
      },
      // Animações personalizadas
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideIn: 'slideIn 0.5s ease-in-out',
      },
      // Z-index personalizado
      zIndex: {
        '-10': '-10',
        '100': '100',
        '200': '200',
        '300': '300',
      },
      // Opacidade personalizada
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      },
      // Radios de borda personalizados
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Plugin para estilização de formulários
    require('@tailwindcss/typography'), // Plugin para estilização de tipografia
    require('@tailwindcss/aspect-ratio'), // Plugin para manter proporções de elementos
    require('@tailwindcss/line-clamp'), // Plugin para limitar linhas de texto
  ],
}
