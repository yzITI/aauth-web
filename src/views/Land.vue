<script setup>
import { useRoute, useRouter } from 'vue-router'
import srpc from '../plugins/srpc.js'
import platforms from '../plugins/platforms.js'
const route = useRoute(), router = useRouter()

let tip = $ref('正在验证您的身份')
let user = $ref(null)
let appName = $ref('')
let remember = $ref(false)
let token, state, app

async function init () {
  const code = route.query.code
  let s = (route.query.state instanceof Array) ? route.query.state[0] : route.query.state
  try {
    s = s.split('$$')
    if (s.length < 3) throw 1
    state = s[2]
    app = s[1]
  } catch { return tip = '-_- 跑错啦！' }
  try {
    const res = await srpc.auth.land(code, s[1], s[0])
    if (typeof res === 'string') return tip = res
    user = res.info
    token = res.token
    appName = res.app
    console.log('userid:', user.id)
  } catch { tip = '登录超时' }
}
init()

function jump () {
  if (!token) return
  const SS = window.sessionStorage, LS = window.localStorage
  SS[app] = token
  if (remember) LS[app] = token
  router.push(`/explode/${app}?state=${state}`)
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col justify-around items-center">
    <h3 v-if="!user" class="text-3xl font-bold">{{ tip }}</h3>
    <template v-else>
      <div class="flex flex-col">
        <h1 class="text-3xl font-bold text-center">{{ user.name }}</h1>
        <p class="text-center">{{ platforms[user.platform].name }} 登录</p>
      </div>
      <div class="flex flex-col items-center">
        <button class="bg-red-700 rounded m-3 w-80 text-white px-5 py-2 font-bold" @click="jump">点击前往 {{ appName }}</button>
        <label>
          <input type="checkbox" v-model="remember">
          14天内自动登录此应用
        </label>
      </div>
    </template>
  </div>
</template>

