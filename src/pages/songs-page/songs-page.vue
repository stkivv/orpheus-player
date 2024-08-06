<script setup lang="ts">
import { ref, onMounted } from "vue";

interface Song {
  name: string;
  data: string;
}

let songs = ref([] as Song[]);
const isPlaying = ref(false);
let audioPlayer: HTMLMediaElement | null = null;

onMounted(() => {
  loadSongs();
  audioPlayer = document.getElementById("audioPlayer") as HTMLMediaElement;
  if (audioPlayer) {
    isPlaying.value = !audioPlayer.paused;
    audioPlayer.addEventListener("play", updateIsPlaying);
    audioPlayer.addEventListener("pause", updateIsPlaying);
  }
});

const loadSongs = async () => {
  songs.value = await window.api.getSongs();
};

const playSong = async (buffer) => {
  const blob = new Blob([buffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  if (audioPlayer) {
    const audioSource = document.getElementById(
      "audioSource"
    ) as HTMLSourceElement;
    audioSource.src = url;
    audioPlayer.load();
    await audioPlayer.play();

    audioPlayer.onloadeddata = () => {
      URL.revokeObjectURL(url);
    };
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
</script>

<template>
  <audio id="audioPlayer">
    <source id="audioSource" src="" type="audio/mpeg" />
  </audio>
  <div class="songlist">
    <div v-for="song in songs" class="song-card" @click="playSong(song.data)">
      {{ song.name }}
    </div>
  </div>
  <div class="control-panel">
    <div class="wrapper">
      <div class="top">
        <svg fill="currentColor" width="28" height="28" viewBox="0 0 16 16">
          <use href="./icons.svg#settings"></use>
        </svg>
      </div>
      <div class="content">
        <div class="content__title">Song title</div>
        <div class="content__buttons">
          <div class="content__buttons__back">
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
          <div class="content__buttons__forward">
            <svg fill="currentColor" width="32" height="32" viewBox="0 0 16 16">
              <use href="./icons.svg#skip-forward"></use>
            </svg>
          </div>
        </div>
      </div>
      <div class="bottom">
        <svg fill="currentColor" width="28" height="28" viewBox="0 0 16 16">
          <use href="./icons.svg#shuffle"></use>
        </svg>
        <svg fill="currentColor" width="28" height="28" viewBox="0 0 16 16">
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
