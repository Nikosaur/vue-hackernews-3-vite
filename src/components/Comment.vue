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
    <ul class="comment-children" v-show="open">
      <Comment v-for="id in comment.kids" :key="id" :id="id" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, defineComponent } from "vue"
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

// recursive component registration
const Comment = defineComponent({
  name: "Comment",
  setup: () => ({})
})
</script>

<style scoped>
.comment-children .comment-children {
  margin-left: 1.5em;
}

.comment {
  border-top: 1px solid #eee;
  position: relative;
}

.comment .by,
.comment .text,
.comment .toggle {
  font-size: 0.9em;
  margin: 1em 0;
}

.comment .by {
  color: #828282;
}

.comment .by a {
  color: #828282;
  text-decoration: underline;
}

.comment .text {
  overflow-wrap: break-word;
}

.comment .text a:hover {
  color: #ff6600;
}

.comment .text pre {
  white-space: pre-wrap;
}

.comment .toggle {
  background-color: #fffbf2;
  padding: 0.3em 0.5em;
  border-radius: 4px;
}

.comment .toggle a {
  color: #828282;
  cursor: pointer;
}

.comment .toggle.open {
  padding: 0;
  background-color: transparent;
  margin-bottom: -0.5em;
}
</style>
