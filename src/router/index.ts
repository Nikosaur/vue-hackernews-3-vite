import { createRouter, createWebHistory } from 'vue-router'
import NewsView from '../views/ItemList.vue'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

const routes = [
  { path: '/', redirect: '/top' },
  { 
    path: '/top/:page(\\d+)?', 
    name: 'top',
    component: NewsView,
    props: { type: 'top' }
  },
  { 
    path: '/new/:page(\\d+)?', 
    name: 'new',
    component: NewsView,
    props: { type: 'new' }
  },
  { 
    path: '/show/:page(\\d+)?', 
    name: 'show',
    component: NewsView,
    props: { type: 'show' }
  },
  { 
    path: '/ask/:page(\\d+)?', 
    name: 'ask',
    component: NewsView,
    props: { type: 'ask' }
  },
  { 
    path: '/job/:page(\\d+)?', 
    name: 'job',
    component: NewsView,
    props: { type: 'job' }
  },
  { 
    path: '/item/:id(\\d+)', 
    name: 'item',
    component: ItemView, 
    props: true 
  },
  { 
    path: '/user/:id', 
    name: 'user',
    component: UserView, 
    props: true 
  },
]

const router = createRouter({
  history: createWebHistory('/Vue-HN-3/'),
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