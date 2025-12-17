<template>
  <li class="news-item">
    <span class="score">{{ item.score }}</span>
    <span class="title">
      <template v-if="item.url">
        <a :href="item.url" target="_blank" rel="noopener">{{ item.title }}</a>
        <span class="host"> ({{ host(item.url) }})</span>
      </template>
      <template v-else>
        <RouterLink :to="'/item/' + item.id">{{ item.title }}</RouterLink>
      </template>
    </span>
    <br>
    <span class="meta">
      <span v-if="item.type !== 'job'" class="by">
        by <RouterLink :to="'/user/' + item.by">{{ item.by }}</RouterLink>
      </span>
      <span class="time">
        {{ timeAgo(item.time) }} ago
      </span> 
      <span v-if="item.type !== 'job'" class="comments-link">
        | <RouterLink :to="'/item/' + item.id">{{ item.descendants }} comments</RouterLink>
      </span>
    </span>
    <span class="label" v-if="item.type !== 'story'">{{ item.type }}</span>
  </li>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router"
import { timeAgo as utilTimeAgo, host as utilHost } from '../util/filters.ts'

interface Item {
  id: number
  title: string
  url?: string
  score: number
  by?: string
  time: number
  type: string
  descendants?: number
  __lastUpdated?: number
}

const props = defineProps<{ item: Item }>()

const timeAgo = utilTimeAgo
const host = utilHost
</script>

<style lang="stylus">
.news-item
  background-color #fff
  padding 20px 30px 20px 80px
  border-bottom 1px solid #eee
  position relative
  line-height 20px
  .score
    color #ff6600
    font-size 1.1em
    font-weight 700
    position absolute
    top 50%
    left 0
    width 80px
    text-align center
    margin-top -10px
  .meta, .host
    font-size .85em
    color #828282
    a
      color #828282
      text-decoration underline
      &:hover
        color #ff6600
    .by
      margin-right 3.5px
</style>
