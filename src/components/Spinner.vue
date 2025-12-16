<template>
  <transition name="fade">
    <svg
      v-if="show"
      class="spinner"
      width="44px"
      height="44px"
      viewBox="0 0 44 44"
    >
      <circle
        class="path"
        fill="none"
        stroke-width="4"
        stroke-linecap="round"
        cx="22"
        cy="22"
        r="20"
      ></circle>
    </svg>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps<{ show: boolean }>()
</script>

<style lang="stylus">
$offset = 126
$duration = 1.4s

.spinner
  animation rotator $duration linear infinite
  animation-play-state running

@keyframes rotator
  0%
    transform scale(0.5) rotate(0deg)
  100%
    transform scale(0.5) rotate(270deg)

.spinner .path
  stroke #ff6600
  stroke-dasharray $offset
  stroke-dashoffset 0
  transform-origin center
  animation dash $duration ease-in-out infinite

@keyframes dash
  0%
    stroke-dashoffset $offset
  50%
    stroke-dashoffset ($offset/2)
    transform rotate(135deg)
  100%
    stroke-dashoffset $offset
    transform rotate(450deg)

/* Vue 3 fade transition */
.fade-enter-from, .fade-leave-to
  opacity 0
.fade-enter-to, .fade-leave-from
  opacity 1
.fade-enter-active, .fade-leave-active
  transition opacity .15s ease
</style>
