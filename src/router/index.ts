import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'
import NewsView from '../views/ItemList.vue'
import ItemView from '../views/ItemView.vue'
import UserView from '../views/UserView.vue'

const routes = [
  { path: '/', redirect: '/top/1' },
  {
    path: '/:type(top|new|show|ask|job)/:page(\\d+)?',
    component: NewsView,
    props: (route: RouteLocationNormalized) => ({
      type: route.params.type,
      page: Number(route.params.page) || 1
    })
  },
  { path: '/item/:id(\\d+)', component: ItemView, props: true },
  { path: '/user/:id', component: UserView, props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
