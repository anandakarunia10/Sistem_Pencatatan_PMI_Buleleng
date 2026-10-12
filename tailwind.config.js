/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 🔽 TAMBAHKAN KONFIGURASI FONT DI SINI
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      keyframes: {
        typing: {
          "0%": { width: "0%", visibility: "hidden" },
          "100%": { width: "100%" }
        },
        blink: {
          "50%": { borderColor: "transparent" },
          "100%": { borderColor: "white" }
        }
      },
      animation: {
        typing: "typing 3.5s steps(25) infinite alternate, blink .7s infinite"
      }
    },
  },
  plugins: [],
}