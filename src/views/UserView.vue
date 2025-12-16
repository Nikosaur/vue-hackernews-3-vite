<template>
  <div class="user-view">
    <template v-if="user">
      <h1>User : {{ user.id }}</h1>
      <ul class="meta">
        <li><span class="label">Created:</span> {{ timeAgo(user.created) }} ago</li>
        <li><span class="label">Karma:</span> {{ user.karma }}</li>
        <li v-if="user.about" v-html="user.about" class="about"></li>
      </ul>
      <p class="links">
        <a :href="`https://news.ycombinator.com/submitted?id=${user.id}`">submissions</a> |
        <a :href="`https://news.ycombinator.com/threads?id=${user.id}`">comments</a>
      </p>
    </template>
    <template v-else-if="user === null">
      <h1>User not found.</h1>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMainStore } from '../store'

// Types
interface User {
  id: string
  created: number
  karma: number
  about?: string
}

const route = useRoute()
const store = useMainStore()

// Computed - akses users langsung dari store, bukan store.state
const user = computed<User | null>(() => {
  const userId = route.params.id as string
  return store.users[userId] || null
})

// Helper function untuk timeAgo
const timeAgo = (time: number): string => {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

const pluralize = (time: number, label: string): string => {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

// Fetch user data on mount and when route changes
const fetchUser = async () => {
  const userId = route.params.id as string
  if (userId) {
    await store.FETCH_USER(userId)
  }
}

// Watch route changes
watch(
  () => route.params.id,
  () => {
    fetchUser()
  }
)

// Initial fetch
onMounted(() => {
  fetchUser()
})

// Update document title
watch(user, (newUser) => {
  if (newUser) {
    document.title = newUser.id
  } else {
    document.title = 'User not found'
  }
}, { immediate: true })
</script>

<style lang="stylus">
.user-view
  background-color #fff
  box-sizing border-box
  padding 2em 3em
  h1
    margin 0
    font-size 1.5em
  .meta
    list-style-type none
    padding 0
  .label
    display inline-block
    min-width 4em
  .about
    margin 1em 0
  .links a
    text-decoration underline
</style>
