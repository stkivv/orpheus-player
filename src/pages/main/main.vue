<script setup>
import controlPanel from "../control-panel/control-panel.vue";
import songList from "../song-list/song-list.vue";
</script>

<template>
  <div class="main">
    <songList />
    <controlPanel />
  </div>
</template>

<style>
@import "./main.scss";
</style>
