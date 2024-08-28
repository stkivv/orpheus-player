<script setup lang="ts">
import { ref } from "vue";
import UserPreferences from "../../interfaces/user-preferences";
import { getFileDirPath, loadUserPreferences } from "../../helpers/functions";
import { styleMappings } from "../../helpers/style-mappings";

const root = document.documentElement;
const rootStyles = getComputedStyle(root);

const preferences = ref({
  colors: {
    songList: { bg: "", highlight: "", font: "", scrollbar: "" },
    controlPanel: {
      bg: "",
      icon: "",
      iconHighlight: "",
      timelineBg: "",
      timelineFilled: "",
      font: "",
      toggleEnabled: "",
    },
  },
} as UserPreferences);

const getColors = (obj, mappings) => {
  Object.entries(mappings).forEach(([key, cssVar]) => {
    if (cssVar) {
      obj[key] = rootStyles.getPropertyValue(cssVar as string);
    }
  });
};

getColors(preferences.value.colors.songList, styleMappings.colors.songList);
getColors(preferences.value.colors.controlPanel, styleMappings.colors.controlPanel);
preferences.value.fileDirPath = getFileDirPath();

const openDirectoryDialog = async () => {
  //@ts-ignore
  preferences.value.fileDirPath = (await window.api.selectDirPath()) as string;
};

const saveUserPreferences = () => {
  localStorage.setItem("userPreferences", JSON.stringify(preferences.value));
};
</script>

<template>
  <div class="settings">
    <RouterLink to="/" class="close-button">X</RouterLink>
    <h1 class="settings-title">Settings</h1>
    <hr />
    <h2>File source</h2>
    <div class="source-input">
      <div id="file-source-field">{{ preferences.fileDirPath }}</div>
      <div id="file-source-button" @click="openDirectoryDialog">Choose directory</div>
    </div>
    <h2>Colors</h2>
    <h4>Main colors</h4>
    <div class="color-input-group">
      <div class="color-input" id="bg-color-picker">
        <span>background color: </span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.songList.bg }"></div>
        <input v-model="preferences.colors.songList.bg" />
      </div>
      <div class="color-input" id="highlight-color-picker">
        <span>highlight color: </span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.songList.highlight }"></div>
        <input v-model="preferences.colors.songList.highlight" />
      </div>
      <div class="color-input" id="font-color-picker">
        <span>font color: </span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.songList.font }"></div>
        <input v-model="preferences.colors.songList.font" />
      </div>
      <div class="color-input" id="scrollbar-color-picker">
        <span>scrollbar color: </span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.songList.scrollbar }"></div>
        <input v-model="preferences.colors.songList.scrollbar" />
      </div>

      <h4>Control panel</h4>
      <div class="color-input" id="panel-bg-color-picker">
        <span>background color:</span>
        <div class="color-preview" :style="{ background: preferences.colors.controlPanel.bg }"></div>
        <input v-model="preferences.colors.controlPanel.bg" />
      </div>
      <div class="color-input" id="icon-color-picker">
        <span>icon color:</span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.controlPanel.icon }"></div>
        <input v-model="preferences.colors.controlPanel.icon" />
      </div>
      <div class="color-input" id="icon-highlight-picker">
        <span>icon highlight color:</span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.controlPanel.iconHighlight }"></div>
        <input v-model="preferences.colors.controlPanel.iconHighlight" />
      </div>
      <div class="color-input" id="toggled-color-picker">
        <span>toggle enabled color:</span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.controlPanel.toggleEnabled }"></div>
        <input v-model="preferences.colors.controlPanel.toggleEnabled" />
      </div>
      <div class="color-input" id="timeline-empty-color-picker">
        <span>song timeline empty color:</span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.controlPanel.timelineBg }"></div>
        <input v-model="preferences.colors.controlPanel.timelineBg" />
      </div>
      <div class="color-input" id="timeline-filled-color-picker">
        <span>song timeline filled color:</span>
        <div
          class="color-preview"
          :style="{ 'background-color': preferences.colors.controlPanel.timelineFilled }"
        ></div>
        <input v-model="preferences.colors.controlPanel.timelineFilled" />
      </div>
      <div class="color-input" id="panel-font-color-pciker">
        <span>font color:</span>
        <div class="color-preview" :style="{ 'background-color': preferences.colors.controlPanel.font }"></div>
        <input v-model="preferences.colors.controlPanel.font" />
      </div>
    </div>
    <div
      class="button confirm"
      @click="
        () => {
          saveUserPreferences();
          loadUserPreferences();
          this.$router.push('/');
        }
      "
    >
      Save
    </div>
    <div class="button cancel">
      <RouterLink to="/">Cancel</RouterLink>
    </div>
  </div>
</template>

<style>
@import "./settings.scss";
</style>
