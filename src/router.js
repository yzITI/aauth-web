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
    path: '/explode/:id',
    component: () => import('./views/Explode.vue')
  },
  {
    path: '/phone',
    component: () => import('./views/Phone.vue')
  },
  {
    path: '/admin',
    component: () => import('./views/Admin.vue')
  }
]

const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router
