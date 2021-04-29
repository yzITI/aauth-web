<template>
  <div class="land flex-col">
    <h3 v-if="!user" class="title is-3">{{ tip }}</h3>
    <template v-else>
      <div class="flex-col">
        <h1 class="title m-1">{{ user.name }}</h1>
        <p>{{ platforms[user.platform].name }} 登录</p>
      </div>
      <div class="flex-col">
        <button class="button m-3 mt-5 is-info" style="width: 90vw; max-width: 320px;" @click="jump">点击前往 {{ appName }}</button>
        <label class="checkbox">
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

ref: tip = '正在登录'
ref: user = null
ref: appName = ''
ref: remember = false
let token
const code = route.query.code
const [platform, app, state] = route.query.state.split('$$')
if (!code || !platform || !app) tip = '-_- 您似乎跑错啦！'
axios.put('/auth/', { code, platform, app })
  .then(({ data }) => {
    user = data.info
    token = data.token
    appName = data.app
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

<style scoped>
div.land {
  width: 100%;
  height: 100vh;
  justify-content: space-around;
}
div.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>