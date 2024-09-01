import UserPreferences from "../interfaces/user-preferences";

// maps values in the UserPreferences interface to corresponding CSS variables.
export const styleMappings = {
  colors: {
    trackList: {
      bg: "--track-list-bg",
      highlight: "--track-list-bg-highlight",
      font: "--track-list-font-col",
      scrollbar: "--track-list-scrollbar",
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
