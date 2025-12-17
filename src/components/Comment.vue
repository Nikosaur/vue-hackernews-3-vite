<template>
  <li v-if="comment" class="comment">
    <div class="by">
      <RouterLink :to="'/user/' + comment.by">{{ comment.by }}</RouterLink>
      {{ timeAgo(comment.time) }} ago
    </div>
    <div class="text" v-html="comment.text"></div>
    <div class="toggle" :class="{ open }" v-if="comment.kids?.length">
      <a @click="open = !open">
        {{ open ? '[-]' : '[+] ' + pluralize(comment.kids.length) + ' collapsed' }}
      </a>
    </div>
    
    <!-- Child comments -->
    <ul class="comment-children" v-show="open">
      <Comment v-for="id in comment.kids" :key="id" :id="id" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed } from "vue" // Hapus defineComponent
import { useMainStore, Item } from '../store'
import { timeAgo as utilTimeAgo } from '../util/filters'
import { RouterLink } from "vue-router"

interface Props {
  id: number
}

const props = defineProps<Props>()
const store = useMainStore()
const open = ref(true)

const comment = computed(() => store.items[props.id] as Item | undefined)

const pluralize = (n: number) => n + (n === 1 ? " reply" : " replies")
const timeAgo = utilTimeAgo

// TIDAK PERLU defineComponent manual di sini untuk <script setup>
</script>

<style lang="stylus">
.comment-children
  list-style-type none
  padding 0
  margin 0

.comment
  border-top 1px solid #eee
  position relative
  
  // Indentasi Child Comment
  .comment-children
    margin-left 1.5em  /* Ini kuncinya agar menjorok ke dalam */
    
  .by, .text, .toggle
    font-size .9em
    margin 1em 0
  .by
    color #828282
    a
      color #828282
      text-decoration underline
  .text
    overflow-wrap break-word
    a:hover
      color #ff6600
    pre
      white-space pre-wrap
  .toggle
    background-color #fffbf2
    padding .3em .5em
    border-radius 4px
    a
      color #828282
      cursor pointer
    &.open
      padding 0
      background-color transparent
      margin-bottom -0.5em
</style>