<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getFileDirPath } from "../../helpers/functions";

interface Track {
  name: string;
  data: string;
}

let tracks = ref([] as Track[]);
let isLoading = true;
const shuffleEnabled = ref(false);
const loopEnabled = ref(false);
const currentTrack = ref<null | Track>(null);
let audioPlayer: HTMLMediaElement | null = null;
const currentTime = ref<string>("0:00");
const currentDuration = ref<string>("0:00");
const trackHistory = [] as Track[];
const barFilledPercent = ref(0);

const tooltipTime = ref<string>("0:00");
const tooltipVisible = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });

onMounted(() => {
  loadTracks();
  audioPlayer = document.getElementById("audioPlayer") as HTMLMediaElement;
  if (audioPlayer) {
    audioPlayer.addEventListener("timeupdate", updateTime);
    audioPlayer.addEventListener("ended", skipForward);
  }
});

const loadTracks = async () => {
  const path = getFileDirPath();
  //@ts-ignore
  tracks.value = await window.api.getTracks(path);
  tracks.value.forEach((s) => {
    if (s.name.slice(-4) == ".mp3") {
      s.name = s.name.substring(0, s.name.length - 4);
    }
  });
  isLoading = false;
};

const playTrack = async (track: Track, addToHistory = true) => {
  if (!audioPlayer) return;
  const blob = new Blob([track.data], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  const audioSource = document.getElementById("audioSource") as HTMLSourceElement;
  audioSource.src = url;
  audioPlayer.load();
  await audioPlayer.play();

  currentDuration.value = formatSecondsToMinutes(audioPlayer.duration);
  if (addToHistory && currentTrack.value !== track) {
    trackHistory.push(track);
  }

  audioPlayer.onloadeddata = () => {
    URL.revokeObjectURL(url);
  };

  currentTrack.value = track;
};

const pauseUnpause = () => {
  if (!audioPlayer) return;
  audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
};

const updateTime = () => {
  if (!audioPlayer) return;
  currentTime.value = formatSecondsToMinutes(audioPlayer.currentTime);
  barFilledPercent.value = getBarFilledPercentage(audioPlayer.currentTime, audioPlayer.duration);
};

const formatSecondsToMinutes = (seconds: number) => {
  if (seconds < 0) return "0:00";
  const minutesString = Math.floor(seconds / 60).toFixed(0);
  const secondsString = (seconds % 60).toFixed(0);
  return minutesString + ":" + secondsString.padStart(2, "0");
};

const getBarFilledPercentage = (current: number, total: number) => {
  return (current / total) * 100;
};

const skipBack = () => {
  trackHistory.pop();
  trackHistory.length >= 1 ? playTrack(trackHistory[trackHistory.length - 1], false) : skipForward();
};

const skipForward = () => {
  if (!audioPlayer || tracks.value.length === 0) return;
  //loop
  if (loopEnabled.value && currentTrack.value) {
    playTrack(currentTrack.value, false);
    return;
  }
  //shuffle
  if (shuffleEnabled.value) {
    const randIndex = Math.floor(Math.random() * tracks.value.length);
    playTrack(tracks.value[randIndex]);
    return;
  }
  //no loop no shuffle
  if (!currentTrack.value) {
    playTrack(tracks.value[0]);
    return;
  }
  const index = tracks.value.findIndex((track) => track === currentTrack.value);
  if (index + 1 > tracks.value.length - 1) {
    playTrack(tracks.value[0]);
    return;
  }
  playTrack(tracks.value[index + 1]);
};

const toggleShuffle = () => {
  shuffleEnabled.value = !shuffleEnabled.value;
};

const toggleLoop = () => {
  loopEnabled.value = !loopEnabled.value;
};

const handleTimeLineHover = (event: MouseEvent) => {
  if (!audioPlayer) return;
  const timeInSeconds = getTimeInSeconds(event);
  tooltipTime.value = formatSecondsToMinutes(timeInSeconds ? timeInSeconds : 0);
  tooltipPosition.value = { x: event.clientX - 15, y: event.clientY - 25 };
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const handleTimeLineClick = (event: MouseEvent) => {
  if (!audioPlayer) return;
  audioPlayer.currentTime = getTimeInSeconds(event);
};

const getTimeInSeconds = (event: MouseEvent) => {
  if (!audioPlayer) return 0;
  const bar = event.currentTarget as HTMLElement;
  const rect = bar.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const percent = mouseX / rect.width;
  return percent * audioPlayer.duration;
};
</script>

<template>
  <audio id="audioPlayer">
    <source id="audioSource" src="" type="audio/mpeg" />
  </audio>
  <div class="tracklist">
    <div class="empty-warning" v-if="tracks.length == 0 && !isLoading">No files found at current source :(</div>
    <div class="loader-wrapper" v-if="isLoading"><span class="loader"></span></div>
    <div v-for="(track, index) in tracks" class="track-card" @click="playTrack(track)">
      <span class="track-index">{{ index + 1 + "." }}</span> <span class="track-label">{{ track.name }}</span>
    </div>
  </div>
  <div class="control-panel">
    <div class="wrapper">
      <div class="top">
        <RouterLink to="/settings">
          <svg class="settings-btn" fill="currentColor" width="28" height="28" viewBox="0 0 16 16">
            <use href="./icons.svg#settings"></use>
          </svg>
        </RouterLink>
      </div>
      <div class="content">
        <div class="content__title">
          {{ currentTrack ? currentTrack.name : "No track selected" }}
        </div>
        <div class="content__buttons">
          <div class="content__buttons__back" @click="skipBack">
            <svg fill="currentColor" width="32" height="32" viewBox="0 0 16 16">
              <use href="./icons.svg#skip-back"></use>
            </svg>
          </div>
          <div class="content__buttons__play" @click="pauseUnpause">
            <svg fill="currentColor" width="46" height="46" viewBox="0 0 16 16">
              <use v-if="audioPlayer && !audioPlayer.paused" href="./icons.svg#pause"></use>
              <use v-else href="./icons.svg#play"></use>
            </svg>
          </div>
          <div class="content__buttons__forward" @click="skipForward">
            <svg fill="currentColor" width="32" height="32" viewBox="0 0 16 16">
              <use href="./icons.svg#skip-forward"></use>
            </svg>
          </div>
        </div>
        <div class="content__elapsed">
          {{ currentTime }}
          <div
            class="content__elapsed__bar"
            @mousemove="handleTimeLineHover"
            @mouseleave="hideTooltip"
            @click="handleTimeLineClick"
          >
            <div class="content__elapsed__bar__filled" :style="{ width: barFilledPercent + '%' }"></div>
          </div>
          {{ currentDuration }}
          <div
            v-if="tooltipVisible"
            class="tooltip"
            :style="{
              left: tooltipPosition.x + 'px',
              top: tooltipPosition.y + 'px',
            }"
          >
            {{ tooltipTime }}
          </div>
        </div>
      </div>
      <div class="bottom">
        <svg
          v-if="shuffleEnabled"
          @click="toggleShuffle"
          class="shuffle-enabled"
          fill="currentColor"
          width="28"
          height="28"
          viewBox="0 0 16 16"
        >
          <use href="./icons.svg#shuffle"></use>
        </svg>
        <svg
          v-else
          @click="toggleShuffle"
          class="shuffle-disabled"
          fill="currentColor"
          width="28"
          height="28"
          viewBox="0 0 16 16"
        >
          <use href="./icons.svg#shuffle"></use>
        </svg>
        <svg
          v-if="loopEnabled"
          @click="toggleLoop"
          class="loop-enabled"
          fill="currentColor"
          width="28"
          height="28"
          viewBox="0 0 16 16"
        >
          <use href="./icons.svg#loop"></use>
        </svg>
        <svg
          v-else
          @click="toggleLoop"
          class="loop-disabled"
          fill="currentColor"
          width="28"
          height="28"
          viewBox="0 0 16 16"
        >
          <use href="./icons.svg#loop"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
@import "./track-list.scss";
@import "./control-panel.scss";
</style>
