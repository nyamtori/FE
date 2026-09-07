/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F4E3',
        olive: {
          light: '#E8E7A8',
          DEFAULT: '#8B8C4A',
          dark: '#5C5D30',
        },
        khaki: '#8C8C5A',
        brand: {
          orange: '#D9822B',
          orangeDark: '#B8631A',
          brown: '#4A3B2A',
        },
        badge: {
          red: '#E8536B',
          green: '#B7C98A',
          greenDark: '#8FA35E',
        },
      },
      fontFamily: {
        sans: ['"Pretendard"', '"Apple SD Gothic Neo"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '1.5rem',
      },
    },
  },
  plugins: [],
}
