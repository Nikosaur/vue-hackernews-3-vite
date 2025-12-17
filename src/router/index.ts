import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import NewsView from '../views/ItemList.vue'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

const createListView = (type: string) => ({
  name: `${type}-stories-view`,
  render: () => h(NewsView, { type })
})

const routes = [
  { path: '/', redirect: '/top' },
  { path: '/top/:page(\\d+)?', component: createListView('top') },
  { path: '/new/:page(\\d+)?', component: createListView('new') },
  { path: '/show/:page(\\d+)?', component: createListView('show') },
  { path: '/ask/:page(\\d+)?', component: createListView('ask') },
  { path: '/job/:page(\\d+)?', component: createListView('job') },
  { path: '/item/:id(\\d+)', component: ItemView, props: true },
  { path: '/user/:id', component: UserView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (_to, _from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
