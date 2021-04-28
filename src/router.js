import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('./views/Home.vue')
  },
  {
    path: '/launch/:id',
    component: () => import('./views/Launch.vue')
  },
  {
    path: '/land',
    component: () => import('./views/Land.vue')
  },
  {
    path: '/explode',
    component: () => import('./views/Explode.vue')
  },
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router
