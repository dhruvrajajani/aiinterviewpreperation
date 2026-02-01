/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6', // Blue 500
                secondary: '#22c55e', // Green 500
                accent: '#facc15', // Yellow 400
                background: '#000000', // Pure Black
                surface: '#121212', // Neutral Dark Gray
                text: '#ffffff', // Pure White
                muted: '#737373', // Neutral Gray 500
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
