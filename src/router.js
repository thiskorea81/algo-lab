import { createRouter, createWebHistory } from 'vue-router'
import Home from './pages/Home.vue'

// 주제 × 수준(초등·중등·고등) 학습 페이지. 새 주제는 TOPICS(topics.js)와 여기에 함께 추가한다.

export default createRouter({
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 }),
  routes: [
    { path: '/', component: Home },
    { path: '/hanoi/elementary', component: () => import('./pages/hanoi/Elementary.vue') },
    { path: '/hanoi/middle', component: () => import('./pages/hanoi/Middle.vue') },
    { path: '/hanoi/high', component: () => import('./pages/hanoi/High.vue') },
    { path: '/sieve/elementary', component: () => import('./pages/sieve/Elementary.vue') },
    { path: '/sieve/middle', component: () => import('./pages/sieve/Middle.vue') },
    { path: '/sieve/high', component: () => import('./pages/sieve/High.vue') },
    { path: '/about', component: () => import('./pages/About.vue') },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
})
