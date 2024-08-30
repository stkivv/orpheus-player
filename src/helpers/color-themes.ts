import UserPreferences from "../interfaces/user-preferences";

export const defaultTheme = {
  colors: {
    songList: {
      bg: "#4c3f52",
      highlight: "#5f4f67",
      font: "white",
      scrollbar: "rgba(0, 0, 0, 0.25)",
    },
    controlPanel: {
      bg: "linear-gradient(to bottom, #582da7, #d76d77, #ffaf7b)",
      icon: "#273b4a",
      iconHighlight: "#9a69f5",
      timelineBg: "#273b4a",
      timelineFilled: "#9a69f5",
      font: "#273b4a",
      toggleEnabled: "white",
    },
  },
} as UserPreferences;

export const midnightTheme = {
  colors: {
    songList: {
      bg: "#1d1e1f",
      highlight: "#343436",
      font: "whitesmoke",
      scrollbar: "rgba(190, 190, 190, 0.25)",
    },
    controlPanel: {
      bg: "#131313",
      icon: "#596669",
      iconHighlight: "#b4b3b3",
      timelineBg: "#273b4a",
      timelineFilled: "#b4b3b3",
      font: "#596669",
      toggleEnabled: "white",
    },
  },
} as UserPreferences;

export const autumnTheme = {
  colors: {
    songList: {
      bg: "#1e3226",
      highlight: "#2f4638",
      font: "#fbedc3",
      scrollbar: "rgba(190, 190, 190, 0.25)",
    },
    controlPanel: {
      bg: "linear-gradient(to bottom, #c27e35, #76290b)",
      icon: "#1e3226",
      iconHighlight: "#fbdec3",
      timelineBg: "#1e3226",
      timelineFilled: "#76290b",
      font: "#1e3226",
      toggleEnabled: "fbdec3",
    },
  },
} as UserPreferences;

export const navyTheme = {
  colors: {
    songList: {
      bg: "#2f4156",
      highlight: "#3d546e",
      font: "#f5efeb",
      scrollbar: "rgba(190, 190, 190, 0.25)",
    },
    controlPanel: {
      bg: "#f5efeb",
      icon: "#567c8d",
      iconHighlight: "#c8d9e6",
      timelineBg: "#2f4156",
      timelineFilled: "#567c8d",
      font: "#567c8d",
      toggleEnabled: "#2f4156",
    },
  },
} as UserPreferences;
