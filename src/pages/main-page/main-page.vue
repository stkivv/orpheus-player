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
            <path
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
            />
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
              <path
                d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5"
              />
            </svg>
          </div>
          <div class="content__buttons__play" @click="pauseUnpause">
            <svg fill="currentColor" width="46" height="46" viewBox="0 0 16 16">
              <path
                v-if="audioPlayer && !audioPlayer.paused"
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5"
              />
              <path
                v-else
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"
              />
            </svg>
          </div>
          <div class="content__buttons__forward" @click="skipForward">
            <svg fill="currentColor" width="32" height="32" viewBox="0 0 16 16">
              <path
                d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5"
              />
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
          <path
            fill-rule="evenodd"
            d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
          />
          <path
            d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"
          />
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
          <path
            fill-rule="evenodd"
            d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5"
          />
          <path
            d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192"
          />
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
          <path
            d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
          />
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
          <path
            d="M11 5.466V4H5a4 4 0 0 0-3.584 5.777.5.5 0 1 1-.896.446A5 5 0 0 1 5 3h6V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m3.81.086a.5.5 0 0 1 .67.225A5 5 0 0 1 11 13H5v1.466a.25.25 0 0 1-.41.192l-2.36-1.966a.25.25 0 0 1 0-.384l2.36-1.966a.25.25 0 0 1 .41.192V12h6a4 4 0 0 0 3.585-5.777.5.5 0 0 1 .225-.67Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style>
@import "./track-list.scss";
@import "./control-panel.scss";
</style>
