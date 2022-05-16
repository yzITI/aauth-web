<template>
  <div class="h-screen w-screen flex flex-col justify-around items-center  bg-gray-100">
    <h1 class="text-3xl font-bold">{{ tip }}</h1>
    <button class="bg-red-700 rounded m-3 w-80 text-white px-5 py-2 font-bold" v-if="route.query.remember && canExplode" @click="abort">取消自动登录</button>
  </div> 
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import srpc from '../plugins/srpc.js'
const route = useRoute(), router = useRouter()
const id = route.params.id

let tip = $ref(''), canExplode = $ref(true)
const SS = window.sessionStorage, LS = window.localStorage

if (!SS[id]) router.push('/launch/' + id)
if (route.query.remember) {
  tip = '准备尝试自动登录'
  setTimeout(explode, 2e3)
} else explode()

function abort () {
  canExplode = false
  tip = '放弃自动登录'
  SS.removeItem(id)
  LS.removeItem(id)
  router.push('/launch/' + id)
}

async function explode () {
  if (!canExplode) return
  canExplode = false
  tip = '正在获取用户凭证'
  const res = await srpc.auth.explode(SS[id], id)
  if (typeof res === 'string') {
    setTimeout(() => { router.push('/launch/' + id) }, 1000)
    SS.removeItem(id)
    LS.removeItem(id)
    return tip = res
  }
  go(res)
}

function go (data) {
  tip = '正在前往应用'
  if (window.opener) {
    const msg = {}
    if (data.token) msg.token = data.token
    if (data.code) msg.code = data.code
    if (route.query.state) msg.state = route.query.state
    window.opener.postMessage(msg, data.url)
    setTimeout(window.close, 1000)
  } else {
    const type = data.token ? 'token' : 'code'
    const value = data.token || data.code
    let url = `${data.url}?${type}=${value}`
    if (route.query.state) url += '&state=' + route.query.state
    window.location.href = url
  }
}
</script>
