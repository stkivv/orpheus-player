import UserPreferences from "../interfaces/user-preferences";
import { styleMappings } from "./style-mappings";

export const loadUserPreferences = () => {
  const savedPreferences = localStorage.getItem("userPreferences");
  if (savedPreferences) {
    const preferences = JSON.parse(savedPreferences) as UserPreferences;
    const songListOptions = preferences?.colors?.songList;
    const controlPanelOptions = preferences?.colors?.controlPanel;

    applyStyles(songListOptions, styleMappings.colors.songList);
    applyStyles(controlPanelOptions, styleMappings.colors.controlPanel);
  }
};

const applyStyles = (options, mappings) => {
  const rootStyle = document.documentElement.style;
  Object.entries(mappings).forEach(([key, cssVar]) => {
    if (options?.[key]) {
      rootStyle.setProperty(cssVar as string, options[key]);
    }
  });
};
