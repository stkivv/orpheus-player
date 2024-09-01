export default interface UserPreferences {
  fileDirPath: string | undefined;
  colors: {
    trackList: {
      bg: string | undefined;
      highlight: string | undefined;
      font: string | undefined;
      scrollbar: string | undefined;
    };
    controlPanel: {
      bg: string | undefined;
      icon: string | undefined;
      iconHighlight: string | undefined;
      timelineBg: string | undefined;
      timelineFilled: string | undefined;
      font: string | undefined;
      toggleEnabled: string | undefined;
    };
  };
}
