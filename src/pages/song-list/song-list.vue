<script setup>
async function getData() {
  console.log("getting data...");
  console.log(await window.api.getSongs());
}
</script>

<template>
  <div class="songlist">
    <button @click="getData">Get Data</button>
  </div>
</template>

<style>
@import "./song-list.scss";
</style>
