<template>
  <div class="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
    <h3 v-if="!app" class="text-3xl font-bold">{{ tip }}</h3>
    <template v-else>
      <div class="text-3xl font-bold flex items-center justify-center">
        <img alt="logo" :src="app.icon || '/logo.png'" onerror="this.src = '/logo.png'" class="w-20 h-20 mx-1">
        <h1>{{ app.name }}</h1>
      </div>
      <p class="mt-3 mb-4">{{ pts ? '请选择登录平台' : '正在前往登录平台...' }}</p>
      <wrapper :show="pts?.length" class="py-1">
        <div class="flex items-center justify-between shadow-md my-4 py-2 px-5 cursor-pointer w-80 bg-white transition hover:shadow-xl" v-for="p in pts" @click="go(p)">
          <div class="flex items-center">
            <div style="min-width: 4rem;">
              <img :src="p.icon" class="h-10 mx-auto">
            </div>
            <h2 class="text-xl font-bold" :style="{ color: p.color }">{{ p.name }}</h2>
          </div>
          <qrcode-icon class="w-8 opacity-50 cursor-pointer" v-if="p.qrcode" @click.stop="go(p, 1)"></qrcode-icon>
        </div>
      </wrapper>
    </template> 
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import Wrapper from '../components/Wrapper.vue'
import { QrcodeIcon } from '@heroicons/vue/solid'
import axios from '../plugins/axios.js'
import platforms from '../plugins/platforms.js'
const route = useRoute(), router = useRouter()
const id = route.params.id, state = route.query.state || '', queryPts = route.query.platforms || ''

let app = $ref(null), gone = $ref(false)
let tip = $ref('正在载入应用信息')
const pts = $computed(() => {
  if (gone) return false
  if (!app) return []
  let qPts = Object.keys(platforms)
  if (queryPts) qPts = queryPts.replace(/\s/g, '').split(',')
  let aPts = Object.keys(platforms)
  if (app.platforms) aPts = app.platforms.replace(/\s/g, '').split(',')
  const res = []
  for (const p in platforms) {
    if (qPts.includes(p) && aPts.includes(p)) res.push(platforms[p])
  }
  if (res.length === 1) return go(res[0])
  else return res
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

function go (p, qrcode) {
  if (!app) return
  gone = true
  p.go(id, state, qrcode)
}
</script>
