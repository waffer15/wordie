import { createRouter, createWebHistory } from 'vue-router'
import Game from '../views/Game.vue';
import App from '../components/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/game/:word',
    alias: ['/game/daily/:word', '/game/custom/:word'],

    name: 'Game',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Game,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
