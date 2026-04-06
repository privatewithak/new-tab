export const COLOR_RGB = {
  slate: "148,163,184", gray: "156,163,175", zinc: "161,161,170",
  neutral: "163,163,163", stone: "168,162,158", red: "248,113,113",
  orange: "251,146,60", amber: "251,191,36", yellow: "250,204,21",
  lime: "163,230,53", green: "74,222,128", emerald: "52,211,153",
  teal: "45,212,191", cyan: "34,211,238", sky: "56,189,248",
  blue: "96,165,250", indigo: "129,140,248", violet: "167,139,250",
  purple: "192,132,252", fuchsia: "232,121,249", pink: "244,114,182",
  rose: "251,113,133",
};

const LIGHT_TEXT_COLORS = ["yellow", "lime"];

export const generateTheme = (color) => {
  const rgb = COLOR_RGB[color] || "148,163,184";
  const isLight = LIGHT_TEXT_COLORS.includes(color)
  const textColor = isLight ? "text-slate-900" : 'text-white'

    const base = {
      cardHalo: `border-${color}-400/40`,
      cardShadow: `0 0 60px rgba(${rgb},0.45)`,
    border: `border-${color}-400/70`,
    textAccent: `text-${color}-300`,
    textSoft: `text-${color}-200/80`,
  };

  base.buttonBg = `relative bg-gradient-to-b from-${color}-600 to-${color}-700 ${textColor} shadow-[0_4px_20px_rgba(${rgb},0.35)] before:absolute before:inset-0 before:bg-gradient-to-b before:from-${color}-500/30 before:to-${color}-900/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300 active:shadow-[0_2px_12px_rgba(${rgb},0.45)] active:translate-y-0.5 after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-${color}-300/25 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500 after:animate-shimmer`;

  return base;
}