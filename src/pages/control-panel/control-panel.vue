<script setup>
const message = "hallo :D";
</script>

<template>
  <div class="control-panel">
    <div class="wrapper">
      <div class="top">Top bar</div>
      <div class="content">
        <div class="content__title">Song title</div>
        <div class="content__buttons">
          <div class="content__buttons__back">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-skip-backward-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M.5 3.5A.5.5 0 0 0 0 4v8a.5.5 0 0 0 1 0V8.753l6.267 3.636c.54.313 1.233-.066 1.233-.697v-2.94l6.267 3.636c.54.314 1.233-.065 1.233-.696V4.308c0-.63-.693-1.01-1.233-.696L8.5 7.248v-2.94c0-.63-.692-1.01-1.233-.696L1 7.248V4a.5.5 0 0 0-.5-.5"
              />
            </svg>
          </div>
          <div class="content__buttons__play">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="46"
              height="46"
              fill="currentColor"
              class="bi bi-play-circle-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z"
              />
            </svg>
          </div>
          <div class="content__buttons__forward">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              class="bi bi-skip-forward-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M15.5 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V8.753l-6.267 3.636c-.54.313-1.233-.066-1.233-.697v-2.94l-6.267 3.636C.693 12.703 0 12.324 0 11.693V4.308c0-.63.693-1.01 1.233-.696L7.5 7.248v-2.94c0-.63.693-1.01 1.233-.696L15 7.248V4a.5.5 0 0 1 .5-.5"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="bottom">Bottom bar</div>
    </div>
  </div>
</template>

<style>
@import "./control-panel.scss";
</style>
