


// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     './app/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/app/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   // plugins: [],
//   plugins: [
//   require('@tailwindcss/typography'),
// ],
// }






/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:        '#D97742',
        'primary-dark': '#B85C2E',
        'primary-light':'#F5E6D3',
        'brand-accent': '#BF6F4A',
        surface:        '#FFFFFF',
        'surface-alt':  '#F5EDE4',
        bg:             '#FAFAF7',
        border:         '#E6E1D8',
        'text-1':       '#1E1E1E',
        'text-2':       '#6B6B6B',
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        brand: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      borderColor: {
        DEFAULT: '#E6E1D8',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}