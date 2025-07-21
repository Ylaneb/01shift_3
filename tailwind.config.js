/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    'node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
    // Add shadcn/ui paths if needed, e.g.:
    // 'node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@heroui/react'),
    // Add shadcn/ui plugin if needed
  ],
}; 