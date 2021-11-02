<template>
  <div class="h-screen w-screen flex flex-col justify-around items-center">
    <h3 v-if="!user" class="text-3xl font-bold">{{ tip }}</h3>
    <template v-else>
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-center">{{ user.name }}</h1>
        <p class="text-center">{{ platforms[user.platform].name }} 登录</p>
      </div>
      <div class="flex flex-col items-center">
        <button class="bg-red-700 rounded m-3 w-80 text-white px-5 py-2" @click="jump">点击前往 {{ appName }}</button>
        <label>
          <input type="checkbox" v-model="remember">
          30天内自动登录此应用
        </label>
      </div>
    </template>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import platforms from '../plugins/platforms.js'
const route = useRoute(), router = useRouter()

let tip = $ref('正在登录')
let user = $ref(null)
let appName = $ref('')
let remember = $ref(false)
let token
const code = route.query.code
const [platform, app, state] = route.query.state.split('$$')
if (!code || !platform || !app) tip = '-_- 您似乎跑错啦！'
axios.put('/auth/', { code, platform, app })
  .then(({ data }) => {
    user = data.info
    token = data.token
    appName = data.app
    console.log('user id:', user.id)
  })
  .catch(err => {
    if (!err.response) tip = '网络错误'
    else if (err.response.status == 502) tip = '登录超时'
    else tip = err.response.data
  })

function jump () {
  if (!token) return
  const SS = window.sessionStorage, LS = window.localStorage
  SS[app] = token
  if (remember) LS[app] = token
  router.push(`/explode/${app}?state=${state}`)
}
</script>
