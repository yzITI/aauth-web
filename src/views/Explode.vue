<template>
  <div class="h-screen w-screen flex flex-col justify-around items-center  bg-gray-100">
    <h1 class="text-3xl font-bold">{{ tip }}</h1>
    <x-icon class="w-10 text-red-500 cursor-pointer transition-all duration-500" v-if="route.query.remember && canExplode" :class="showCross ? 'opacity-100' : 'opacity-0'" @click="abort" />
  </div> 
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import { XIcon } from '@heroicons/vue/solid'
const route = useRoute(), router = useRouter()
const id = route.params.id

let tip = $ref(''), showCross = $ref(true), canExplode = $ref(true)
const SS = window.sessionStorage, LS = window.localStorage

if (!SS[id]) router.push('/launch/' + id)
if (route.query.remember) {
  tip = '准备尝试自动登录'
  setTimeout(explode, 2000)
} else explode()

function abort () {
  canExplode = false
  tip = '用户放弃自动登录'
  SS.removeItem(id)
  LS.removeItem(id)
  setTimeout(() => { router.push('/launch/' + id) }, 1000)
}

async function explode () {
  if (!canExplode) return
  canExplode = false
  tip = '正在请求跳转'
  axios.get('/auth/' + id, { headers: { token: SS[id] } })
    .then(resp => { go(resp.data) })
    .catch(err => {
      tip = err.response ? err.response.data : '网络错误'
      SS.removeItem(id)
      LS.removeItem(id)
      setTimeout(() => { router.push('/launch/' + id) }, 1000)
    })
}

function go (data) {
  if (window.opener) {
    const msg = {}
    if (data.token) msg.token = data.token
    if (data.code) msg.code = data.code
    if (route.query.state) msg.state = route.query.state
    window.opener.postMessage(msg, data.redirect)
    setTimeout(window.close, 1000)
  } else {
    const type = data.token ? 'token' : 'code'
    const value = data.token || data.code
    let url = `${data.redirect}?${type}=${value}`
    if (route.query.state) url += '&state=' + route.query.state
    window.location.href = url
  }
}
</script>
