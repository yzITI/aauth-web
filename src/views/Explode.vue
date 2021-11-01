<template>
  <div class="h-screen w-screen flex justify-center items-center">
    <h1 class="text-4xl font-bold">{{ tip }}</h1>
  </div> 
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
const route = useRoute(), router = useRouter()
const id = route.params.id

let tip = $ref('正在请求跳转')
const SS = window.sessionStorage, LS = window.localStorage

if (!SS[id]) router.push('/launch/' + id)
else axios.get('/auth/' + id, { headers: { token: SS[id] } })
  .then(({ data }) => {
    const type = data.token ? 'token' : 'code'
    const value = data.token || data.code
    let url = `${data.redirect}?${type}=${value}`
    if (route.query.state) url += '&state=' + route.query.state
    window.location.href = url
  })
  .catch(err => {
    tip = err.response ? err.response.data : '网络错误'
    SS.removeItem(id)
    LS.removeItem(id)
    if (route.query.remember) setTimeout(() => { router.push('/launch/' + id) }, 800)
  })
</script>
