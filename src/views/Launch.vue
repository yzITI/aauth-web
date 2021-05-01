<template>
  <div class="launch flex-center">
    <h3 v-if="!app" class="title is-3">{{ tip }}</h3>
    <template v-else>
      <div class="title flex-center">
        <img alt="logo" :src="app.icon || '/logo.png'" onerror="this.src = '/logo.png'" style="max-width: 6rem; max-height: 7rem; margin: 0 1rem;">
        <h1 class="title is-2">{{ app.name }}</h1>
      </div>
      <p>请选择一种登录方式</p>
      <div>
        <div class="platform flex-center" v-for="p in pts" :style="{ borderColor: p.color, color: p.color }" @click="go(p)">
          <div style="width: 2.5rem; margin-right: 24px;" class="flex-center">
            <img :src="p.icon" style="max-width: 2.5rem; max-height: 2.5rem;">
          </div>
          <h2 class="title is-4" :style="{ color: p.color }">{{ p.name }}</h2>
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

ref: app = null
ref: tip = '正在载入应用信息'
const pts = computed(() => {
  if (!app || !app.platforms) return platforms
  const res = []
  for (const p of app.platforms.split(',')) {
    if (platforms[p]) res.push(platforms[p])
  }
  return res
})

const SS = window.sessionStorage, LS = window.localStorage
if (SS[id] || LS[id]) {
  if (!SS[id]) SS[id] = LS[id]
  router.push(`/explode/${id}?state=${state}&remember=1`)
} else axios.get('/app/' + id)
  .then(({ data }) => { app = data })
  .catch(err => {
    tip = err.response ? err.response.data.toString() : '网络错误'
  })

function go (p) {
  if (!app) return
  p.go(id, state)
}
</script>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
div.launch {
  width: 100%;
  height: 100vh;
  flex-direction: column;
}
div.title {
  height: 8rem;
  width: 90vw;
  max-width: 640px;
}
div.platform {
  width: 80vw;
  max-width: 320px;
  height: 3rem;
  margin: 16px;
  padding: 1.8rem;
  border-radius: 8px;
  border: 1px solid;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
}
div.platform:hover {
  box-shadow: 2px 2px 4px #999;
  transform: scale(1.05);
}
@media (max-width: 640px) {
  div.title {
    flex-direction: column;
    height: auto;
  }
}
</style>