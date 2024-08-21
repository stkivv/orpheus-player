import { createApp } from "vue";
import App from "./pages/app.vue";
import { createMemoryHistory, createRouter } from "vue-router";

import songsPage from "./pages/songs-page/songs-page.vue";
import settings from "./pages/settings-page/settings.vue";

const routes = [
  { path: "/", component: songsPage },
  { path: "/settings", component: settings },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
