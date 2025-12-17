<template>
  <div class="item-view" v-if="item">
    <div class="item-view-header">
      <a :href="item.url" target="_blank">
        <h1>{{ item.title }}</h1>
      </a>
      <span v-if="item.url" class="host">({{ getHostName(item.url) }})</span>
      <p class="meta">
        {{ item.score }} points | by  
        <span>
          <RouterLink :to="'/user/' + item.by">{{ item.by }}</RouterLink> {{ timeAgo(item.time) }} ago
        </span>
      </p>
    </div>

    <div class="item-view-comments">
      <p class="item-view-comments-header">
        {{ item.kids?.length ? item.descendants + ' comments' : 'No comments yet.' }}
        <Spinner :show="loading" />
      </p>

      <ul v-if="!loading" class="comment-children">
        <Comment v-for="id in item.kids" :key="id" :id="id" />
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useMainStore } from '../store'
import Spinner from '../components/Spinner.vue'
import Comment from '../components/Comment.vue'

interface ItemData {
  id: number
  title: string
  url?: string
  by: string
  time: number
  score: number
  descendants?: number
  kids?: number[]
}

const store = useMainStore()
const route = useRoute()
const loading = ref(false)

const itemId = computed(() => Number(route.params.id))
const item = computed<ItemData | undefined>(() => store.items[itemId.value])

function getHostName(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

function timeAgo(time: number): string {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

function pluralize(time: number, label: string): string {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

async function fetchComments(currentItem: ItemData | undefined): Promise<void> {
  if (!currentItem || !currentItem.kids?.length) {
    return
  }

  
  try {
    await store.FETCH_ITEMS(currentItem.kids)
    
    const commentPromises = currentItem.kids.map(id => {
      const commentItem = store.items[id] as ItemData | undefined
      return fetchComments(commentItem)
    })
    
    await Promise.all(commentPromises)
  } catch (error) {
    console.error('Error fetching comments:', error)
  }
}

async function loadItemData(id: number) {
  loading.value = true

  try {
    await store.FETCH_ITEMS([id])
    
    if (item.value) {
      document.title = `Vue HN 3.0 | ${item.value.title}`
      await fetchComments(item.value)
    } 
  } 
  catch (error) {
    console.error('Error loading item:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  loadItemData(itemId.value)
})
  
watch(itemId, async (newId) => {
  loadItemData(newId)
})
</script>

<style lang="stylus">
.item-view-header
  background-color #fff
  padding 1.8em 2em 1em
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  h1
    display inline
    font-size 1.5em
    margin 0
    margin-right .5em
  .host, .meta, .meta a
    color #828282
  .meta a
    text-decoration underline

.item-view-comments
  background-color #fff
  margin-top 10px
  padding 0 2em .5em

.item-view-comments-header
  margin 0
  font-size 1.1em
  padding 1em 0
  position relative
  .spinner
    display inline-block
    margin -15px 0

.comment-children
  list-style-type none
  padding 0
  margin 0

@media (max-width 600px)
  .item-view-header
    h1
      font-size 1.25emz
.space
  display inline
  width 0.25em
</style>
