<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getFileDirPath } from "../../helpers/functions";

interface Song {
  name: string;
  data: string;
}

let songs = ref([] as Song[]);
let isLoading = true;
const isPlaying = ref(false);
const shuffleEnabled = ref(false);
const loopEnabled = ref(false);
const currentSong = ref<null | Song>(null);
let audioPlayer: HTMLMediaElement | null = null;
const currentTime = ref<string>("0:00");
const currentDuration = ref<string>("0:00");
const songHistory = [] as Song[];
const barFilledPercent = ref(0);

const tooltipTime = ref<string>("0:00");
const tooltipVisible = ref(false);
const tooltipPosition = ref({ x: 0, y: 0 });

onMounted(() => {
  loadSongs();
  audioPlayer = document.getElementById("audioPlayer") as HTMLMediaElement;
  if (audioPlayer) {
    isPlaying.value = !audioPlayer.paused;
    audioPlayer.addEventListener("play", updateIsPlaying);
    audioPlayer.addEventListener("pause", updateIsPlaying);
    audioPlayer.addEventListener("timeupdate", updateTime);
  }
});

const loadSongs = async () => {
  const path = getFileDirPath();
  //@ts-ignore
  songs.value = await window.api.getSongs(path);
  isLoading = false;
};

const playSong = async (song: Song, addToHistory = true) => {
  const blob = new Blob([song.data], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  if (audioPlayer) {
    const audioSource = document.getElementById("audioSource") as HTMLSourceElement;
    audioSource.src = url;
    audioPlayer.load();
    await audioPlayer.play();

    currentDuration.value = formatSecondsToMinutes(audioPlayer.duration);
    if (addToHistory && currentSong.value !== song) {
      songHistory.push(song);
    }

    audioPlayer.onloadeddata = () => {
      URL.revokeObjectURL(url);
    };

    currentSong.value = song;
  }
};

const updateIsPlaying = () => {
  if (audioPlayer) {
    isPlaying.value = !audioPlayer.paused;
  }
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
  songHistory.pop();
  songHistory.length >= 1 ? playSong(songHistory[songHistory.length - 1], false) : skipForward();
};

const skipForward = () => {
  if (!audioPlayer || songs.value.length === 0) return;
  if (loopEnabled.value && currentSong.value) {
    playSong(currentSong.value, false);
    return;
  }
  if (shuffleEnabled.value) {
    const randIndex = Math.floor(Math.random() * songs.value.length);
    playSong(songs.value[randIndex]);
  } else {
    let currentIndex = -1;
    songs.value.forEach((song, index) => {
      if (song == currentSong.value) {
        currentIndex = index;
      }
    });
    if (currentIndex + 1 > songs.value.length - 1) {
      playSong(songs.value[0]);
    } else {
      playSong(songs.value[currentIndex + 1]);
    }
  }
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
  <div class="songlist">
    <div class="empty-warning" v-if="songs.length == 0 && !isLoading">No files found at current source :(</div>
    <div class="loader-wrapper" v-if="isLoading"><span class="loader"></span></div>
    <div v-for="(song, index) in songs" class="song-card" @click="playSong(song)">
      <span class="song-index">{{ index + 1 + "." }}</span> <span class="song-label">{{ song.name }}</span>
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
          {{ currentSong ? currentSong.name : "No current song" }}
        </div>
        <div class="content__buttons">
          <div class="content__buttons__back" @click="skipBack">
            <svg fill="currentColor" width="32" height="32" viewBox="0 0 16 16">
              <use href="./icons.svg#skip-back"></use>
            </svg>
          </div>
          <div class="content__buttons__play" @click="pauseUnpause">
            <svg fill="currentColor" width="46" height="46" viewBox="0 0 16 16">
              <use v-if="isPlaying" href="./icons.svg#pause"></use>
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
@import "./song-list.scss";
@import "./control-panel.scss";
</style>
