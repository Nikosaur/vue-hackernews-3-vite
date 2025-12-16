<template>
  <div id="app">
    <header class="header">
      <nav class="inner">
        <RouterLink to="/" exact>
          <img class="logo" src="/logo-48.png" alt="logo" />
        </RouterLink>
        <RouterLink to="/top">Top</RouterLink>
        <RouterLink to="/new">New</RouterLink>
        <RouterLink to="/show">Show</RouterLink>
        <RouterLink to="/ask">Ask</RouterLink>
        <RouterLink to="/job">Jobs</RouterLink>
        <a
          class="github"
          href="https://v3-migration.vuejs.org/"
          target="_blank"
          rel="noopener"
        >
          Built with Vue.js Migrated to Vue3 Vite TS
        </a>
      </nav>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" class="view" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size: 15px;
  background-color: #eceef1;
  margin: 0;
  padding-top: 55px;
  color: #34495e;
  overflow-y: scroll;
}

a {
  color: #34495e;
  text-decoration: none;
}

.header {
  background-color: #ff6600;
  position: fixed;
  z-index: 999;
  height: 55px;
  top: 0;
  left: 0;
  right: 0;
}
.header .inner {
  max-width: 800px;
  box-sizing: border-box;
  margin: 0 auto;
  padding: 15px 5px;
}
.header .inner a {
  color: rgba(255, 255, 255, 0.8);
  line-height: 24px;
  transition: color 0.15s ease;
  display: inline-block;
  vertical-align: middle;
  font-weight: 300;
  letter-spacing: 0.075em;
  margin-right: 1.8em;
}
.header .inner a:hover {
  color: #fff;
}
.header .inner a.router-link-active {
  color: #fff;
  font-weight: 400;
}
.header .inner a:nth-child(6) {
  margin-right: 0;
}
.header .github {
  color: #fff;
  font-size: 0.9em;
  margin: 0;
  float: right;
}

.logo {
  width: 24px;
  margin-right: 10px;
  display: inline-block;
  vertical-align: middle;
}

.view {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}

@media (max-width: 860px) {
  .header .inner {
    padding: 15px 30px;
  }
}

@media (max-width: 600px) {
  .header .inner {
    padding: 15px;
  }
  .header a {
    margin-right: 1em;
  }
  .header .github {
    display: none;
  }
}
</style>
