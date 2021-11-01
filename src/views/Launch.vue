<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
    <h3 v-if="!app" class="text-3xl font-bold">{{ tip }}</h3>
    <template v-else>
      <div class="text-3xl font-bold flex items-center justify-center">
        <img alt="logo" :src="app.icon || '/logo.png'" onerror="this.src = '/logo.png'" class="w-20 h-20 mx-1">
        <h1>{{ app.name }}</h1>
      </div>
      <p class="mt-3 mb-4">{{ pts ? '请选择登录平台' : '正在跳转登录...' }}</p>
      <div>
        <div class="flex items-center shadow-md my-4 py-2 px-5 cursor-pointer w-80 bg-white transition hover:shadow-xl" v-for="p in pts" @click="go(p)">
          <img :src="p.icon" class="h-10 mx-4">
          <h2 class="text-xl font-bold" :style="{ color: p.color }">{{ p.name }}</h2>
        </div>
      </div>
    </template> 
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import platforms from '../plugins/platforms.js'
const route = useRoute(), router = useRouter()
const id = route.params.id, state = route.query.state || ''

let app = $ref(null)
let tip = $ref('正在载入应用信息')
const pts = computed(() => {
  if (!app || !app.platforms) return platforms
  const res = []
  for (const p of app.platforms.split(',')) {
    if (platforms[p]) res.push(platforms[p])
  }
  if (res.length === 1) {
    setTimeout(() => { go(res[0]) }, 1000)
    return null
  } else return res
})

const SS = window.sessionStorage, LS = window.localStorage
if (SS[id] || LS[id]) {
  if (!SS[id]) SS[id] = LS[id]
  router.push(`/explode/${id}?state=${state}&remember=1`)
} else axios.get('/app/' + id)
  .then(({ data }) => {
    if (!data.redirect) tip = '应用不支持登录'
    else app = data
  })
  .catch(err => {
    tip = err.response ? err.response.data.toString() : '网络错误'
  })

function go (p) {
  if (!app) return
  p.go(id, state)
}
</script>
