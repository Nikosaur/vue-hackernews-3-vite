<template>
  <div class="news-view">
    <div class="news-list-nav">
      <RouterLink v-if="page > 1" :to="'/' + type + '/' + (page - 1)">&lt; prev</RouterLink>
      <span v-else class="disabled">&lt; prev</span>
      <span>{{ page }}/{{ maxPage }}</span>
      <RouterLink v-if="hasMore" :to="'/' + type + '/' + (page + 1)">more &gt;</RouterLink>
      <span v-else class="disabled">more &gt;</span>
    </div>

    <transition :name="transition">
      <div class="news-list" :key="displayedPage" v-if="displayedPage > 0">
        <transition-group tag="ul" name="item">
          <Item v-for="item in displayedItems" :key="item.id" :item="item" />
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useMainStore, Item as ItemType } from '../store'
import { watchList } from '../api'
import Item from '../components/Item.vue'

interface Props {
  type: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const store = useMainStore()

const displayedPage = ref(Number(route.params.page) || 1)
const transition = ref<'slide-left' | 'slide-right' | null>('slide-right')
const displayedItems = ref<ItemType[]>([])

const page = computed(() => Number(route.params.page) || 1)
const maxPage = computed(() => {
  const list = store.lists[props.type] || []
  return Math.ceil(list.length / store.itemsPerPage)
})
const hasMore = computed(() => page.value < maxPage.value)

async function loadItems(to = page.value, from = -1) {
  await store.FETCH_LIST_DATA(props.type)
  
  if (to < 1 || to > maxPage.value) {
    router.replace(`/${props.type}/1`)
    return
  }
  
  transition.value = from === -1 ? null : to > from ? 'slide-left' : 'slide-right'
  displayedPage.value = to
  
  // Fetch the items for the current page
  const activeIds = store.activeIds(to)
  await store.ENSURE_ACTIVE_ITEMS(activeIds)
  
  const items = store.activeItems(to)
  displayedItems.value = items
}

// Watch for real-time updates
let unwatchList: (() => void) | null = null

onMounted(async () => {
  await loadItems(displayedPage.value)
  
  unwatchList = watchList(props.type, async (ids) => {
    store.lists[props.type] = ids
    
    // Pastikan activeIds adalah method di store
    const activeIds = store.activeIds ? store.activeIds(displayedPage.value) : []
    
    if (store.ENSURE_ACTIVE_ITEMS) {
      await store.ENSURE_ACTIVE_ITEMS(activeIds)
    }
    
    displayedItems.value = activeIds
      .map(id => store.items[id])
      .filter(Boolean) as ItemType[]
  })
})

onUnmounted(() => {
  unwatchList?.()
})

// Update items when route page changes
watch(() => route.params.page, (to, from) => {
  loadItems(Number(to) || 1, Number(from) || -1)
})

// Watch route type changes
watch(() => props.type, () => {
  loadItems(1)
})
</script>

<style scoped>
.news-view { 
  padding-top: 45px;
}

.news-list-nav, .news-list { 
  background-color: #fff; 
  border-radius: 2px;
}

.news-list-nav {
  padding: 15px 30px;
  position: fixed;
  text-align: center;
  top: 55px;
  left: 0;
  right: 0;
  z-index: 998;
  box-shadow: 0 1px 2px rgba(0,0,0,.1);
}

.news-list-nav a, 
.news-list-nav span { 
  margin: 0 1em;
}

.news-list-nav .disabled { 
  color: #ccc;
}

.news-list {
  position: absolute;
  margin: 30px 0;
  width: 100%;
  transition: all .5s cubic-bezier(.55,0,.1,1);
}

.news-list ul { 
  list-style-type: none; 
  padding: 0; 
  margin: 0;
}

.slide-left-enter-from, 
.slide-right-leave-to { 
  opacity: 0; 
  transform: translate(30px, 0);
}

.slide-left-leave-to, 
.slide-right-enter-from { 
  opacity: 0; 
  transform: translate(-30px, 0);
}

.item-move, 
.item-enter-active, 
.item-leave-active { 
  transition: all .5s cubic-bezier(.55,0,.1,1);
}

.item-enter-from { 
  opacity: 0; 
  transform: translate(30px, 0);
}

.item-leave-active { 
  position: absolute; 
  opacity: 0; 
  transform: translate(30px, 0);
}

@media (max-width: 600px) { 
  .news-list { 
    margin: 10px 0;
  }
}
</style>