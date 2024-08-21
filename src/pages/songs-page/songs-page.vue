<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Song {
  name: string;
  data: string;
}

let songs = ref([] as Song[]);
const isPlaying = ref(false);
const shuffleEnabled = ref(false);
const loopEnabled = ref(false);
const currentSong = ref<null | Song>(null);
let audioPlayer: HTMLMediaElement | null = null;
const currentTime = ref<string>("0:00");
const currentDuration = ref<string>("0:00");
const songHistory = [] as Song[];
const barFilledPercent = ref(0);

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
  //@ts-ignore
  songs.value = await window.api.getSongs();
};

const playSong = async (song: Song, addToHistory = true) => {
  const blob = new Blob([song.data], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  if (audioPlayer) {
    const audioSource = document.getElementById(
      "audioSource"
    ) as HTMLSourceElement;
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
  barFilledPercent.value = getBarFilledPercentage(
    audioPlayer.currentTime,
    audioPlayer.duration
  );
};

const formatSecondsToMinutes = (seconds: number) => {
  const minutesString = (seconds / 60).toFixed(0);
  const secondsString = (seconds % 60).toFixed(0);
  return minutesString + ":" + secondsString.padStart(2, "0");
};

const getBarFilledPercentage = (current: number, total: number) => {
  return (current / total) * 100;
};

const skipBack = () => {
  songHistory.pop();
  songHistory.length >= 1
    ? playSong(songHistory[songHistory.length - 1], false)
    : skipForward();
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
    let currentIndex = -1; // will pick next song in list, so -1 will give first song
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
</script>

<template>
  <audio id="audioPlayer">
    <source id="audioSource" src="" type="audio/mpeg" />
  </audio>
  <div class="songlist">
    <div v-for="song in songs" class="song-card" @click="playSong(song)">
      {{ song.name }}
    </div>
  </div>
  <div class="control-panel">
    <div class="wrapper">
      <div class="top">
        <RouterLink to="/settings">
          <svg
            class="settings-btn"
            fill="currentColor"
            width="28"
            height="28"
            viewBox="0 0 16 16"
          >
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
          <div class="content__elapsed__bar">
            <div
              class="content__elapsed__bar__filled"
              :style="{ width: barFilledPercent + '%' }"
            ></div>
          </div>
          {{ currentDuration }}
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
