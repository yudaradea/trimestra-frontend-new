/** @type {import('tailwindcss').Config} */

import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // menambahkan warna
      colors: {
        primary: '#3CAEA3',
        textSecondary: '#7B7B7B',
        third: '#0000FF',
      },
      fontFamily: {
        signika: ['Signika', 'sans-serif'],
      },
    },
  },
  plugins: [forms, typography],
};
