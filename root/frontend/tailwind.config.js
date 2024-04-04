/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
/*cette configuration met en place Tailwind CSS pour traiter les fichiers dans les répertoires spécifiés, 
sans aucune modification de thème personnalisée, et avec l'ajout du plugin daisyui.*/