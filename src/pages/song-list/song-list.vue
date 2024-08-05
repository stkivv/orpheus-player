<script setup>
import { onMounted, ref } from "vue";

let songs = ref([]);

const loadSongs = async () => {
  songs.value = await window.api.getSongs();
};

const playSong = async (buffer) => {
  const blob = new Blob([buffer], { type: 'audio/mpeg' });
  const url = URL.createObjectURL(blob);
  
  const audioPlayer = document.getElementById("audioPlayer");
  const audioSource = document.getElementById("audioSource");
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
