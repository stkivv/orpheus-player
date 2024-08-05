<script setup lang="ts">
import { onMounted, ref } from "vue";

interface Song {
  name: string;
  data: string;
}

let songs = ref([] as Song[]);

const loadSongs = async () => {
  songs.value = await window.api.getSongs();
};

const playSong = async (buffer) => {
  const blob = new Blob([buffer], { type: "audio/mpeg" });
  const url = URL.createObjectURL(blob);

  const audioPlayer = document.getElementById(
    "audioPlayer"
  ) as HTMLMediaElement;
  const audioSource = document.getElementById(
    "audioSource"
  ) as HTMLSourceElement;
  audioSource.src = url;
  await audioPlayer.load();
  await audioPlayer.play();

  audioPlayer.onloadeddata = () => {
    URL.revokeObjectURL(url);
  };
};

onMounted(() => {
  loadSongs();
});
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
</template>

<style>
@import "./song-list.scss";
</style>
