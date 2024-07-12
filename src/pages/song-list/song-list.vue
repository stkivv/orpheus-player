<script setup>
import { onMounted, ref } from "vue";

let songs = ref([]);

const loadSongs = async () => {
  songs.value = await window.api.getSongs();
};

onMounted(() => {
  loadSongs();
});
</script>

<template>
  <div class="songlist">
    <div v-for="song in songs" class="song-card">{{ song }}</div>
  </div>
</template>

<style>
@import "./song-list.scss";
</style>
