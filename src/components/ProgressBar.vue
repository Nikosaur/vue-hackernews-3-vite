<template>
  <div class="progress" :style="barStyle"></div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

const state = reactive({
  percent: 0,
  show: false,
  canSuccess: true,
  duration: 3000,
  height: '2px',
  color: '#ffca2b',
  failedColor: '#ff0000',
  _timer: null as number | null,
  _cut: 0
})

const barStyle = computed(() => ({
  width: state.percent + '%',
  height: state.height,
  backgroundColor: state.canSuccess ? state.color : state.failedColor,
  opacity: state.show ? 1 : 0
}))

function start() {
  state.show = true
  state.canSuccess = true
  if (state._timer) {
    clearInterval(state._timer)
    state.percent = 0
  }
  state._cut = 10000 / Math.floor(state.duration)
  state._timer = setInterval(() => {
    increase(state._cut * Math.random())
    if (state.percent > 95) finish()
  }, 100) as unknown as number
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function set(num: number) {
  state.show = true
  state.canSuccess = true
  state.percent = Math.floor(num)
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function get() {
  return Math.floor(state.percent)
}

function increase(num: number) {
  state.percent = state.percent + Math.floor(num)
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function decrease(num: number) {
  state.percent = state.percent - Math.floor(num)
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function finish() {
  state.percent = 100
  hide()
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function pause() {
  if (state._timer) clearInterval(state._timer)
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function hide() {
  if (state._timer) clearInterval(state._timer)
  state._timer = null
  setTimeout(() => {
    state.show = false
    setTimeout(() => {
      state.percent = 0
    }, 200)
  }, 500)
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}

function fail() {
  state.canSuccess = false
  return { start, set, get, increase, decrease, finish, pause, hide, fail }
}
</script>

<style scoped>
.progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  width: 0%;
  transition: width 0.2s, opacity 0.4s;
  opacity: 1;
  background-color: #efc14e;
  z-index: 999999;
}
</style>
