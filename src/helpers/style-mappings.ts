import UserPreferences from "../interfaces/user-preferences";

// maps values in the UserPreferences interface to corresponding CSS variables.
export const styleMappings = {
  colors: {
    songList: {
      bg: "--song-list-bg",
      highlight: "--song-list-bg-highlight",
      font: "--song-list-font-col",
      scrollbar: "--song-list-scrollbar",
    },
    controlPanel: {
      bg: "--control-panel-bg",
      icon: "--control-panel-icon",
      iconHighlight: "--control-panel-icon-highlight",
      timelineBg: "--control-panel-timeline-bg",
      timelineFilled: "--control-panel-timeline-fill",
      font: "--control-panel-font-col",
      toggleEnabled: "--control-panel-button-toggle-enabled",
    },
  },
} as UserPreferences;
