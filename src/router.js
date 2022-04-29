import { createRouter, createWebHashHistory } from 'vue-router'

const index = {
  '/': () => import('./views/Home.vue'),
  '/launch/:id': () => import('./views/Launch.vue'),
  '/land': () => import('./views/Land.vue'),
  '/explode/:id': () => import('./views/Explode.vue'),
  '/phone': () => import('./views/Phone.vue')
}

const routes = []
for (const r in index) routes.push({ path: r, component: index[r] })
const router = createRouter({ history: createWebHashHistory(), routes }) 

router.afterEach(() => {
  Swal.close()
})

export default router
