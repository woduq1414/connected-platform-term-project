import type { PaletteMode } from "@mui/material";

const PRIMARY = {
  light: "#B8B8B8",
  main: "#141414",
  // main : "#BB2649",
  dark: "#0E0A0A",
};

const SECONDARY =  {

  main: '#BB2649',
};

const GREY = {
  100: "#F9FAFB",
  200: "#F4F6F8",
  300: "#DFE3E8",
  400: "#C4CDD5",
  500: "#919EAB",
  600: "#637381",
  700: "#454F5B",
  800: "#363636",
  900: "#242424",
};

const COMMON = {
  common: { black: "#000", white: "#fff" },
  primary: { ...PRIMARY, contrastText: "#fff" },
  secondary: { ...SECONDARY, contrastText: "#fff" },
  grey: GREY,
  action: {
    active: GREY[500],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

const palette = {
  ...COMMON,
  text: { primary: "#fff", secondary: GREY[500], disabled: GREY[600] },
  background: { default: PRIMARY.main, paper: PRIMARY.main,
  container : GREY[900]
  },
  mode: "dark" as PaletteMode,
};

export default palette;
