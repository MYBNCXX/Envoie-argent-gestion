/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#F6F3EC",
          bgAlt: "#EFEAE0",
          surface: "#FFFFFF",
          ink: "#1B2130",
          inkSoft: "#5B6272",
          inkFaint: "#8B90A0",
          line: "#E3DED2",
          teal: "#0E5A56",
          tealDeep: "#0A3E3C",
          tealSoft: "#E4EFEC",
          gold: "#B8873A",
          goldSoft: "#F4EBD8",
          plum: "#432244",
          plumSoft: "#EFE6EF",
          danger: "#BE4141",
          dangerSoft: "#F8E7E5",
          success: "#1E7A52",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        popIn: { "0%": { opacity: 0, transform: "scale(.9)" }, "100%": { opacity: 1, transform: "scale(1)" } },
        riseIn: { "0%": { opacity: 0, transform: "translateY(14px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shake: {
          "10%,90%": { transform: "translateX(-2px)" },
          "20%,80%": { transform: "translateX(4px)" },
          "30%,50%,70%": { transform: "translateX(-8px)" },
          "40%,60%": { transform: "translateX(8px)" },
        },
        drawRing: { to: { strokeDashoffset: 0 } },
        drawCheck: { to: { strokeDashoffset: 0 } },
      },
      animation: {
        popIn: "popIn .35s cubic-bezier(.2,.9,.3,1.2)",
        riseIn: "riseIn .5s cubic-bezier(.2,.9,.3,1.1)",
        shake: "shake .5s ease",
        drawRing: "drawRing .7s ease forwards",
        drawCheck: "drawCheck .35s ease forwards .55s",
      },
    },
  },
  plugins: [],
};
