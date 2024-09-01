<script setup lang="ts">
import { loadUserPreferences } from "../../helpers/functions";

loadUserPreferences();
</script>

<template>
  <div class="main">
    <RouterView></RouterView>
  </div>
</template>

<style>
@import "./root.scss";
</style>
