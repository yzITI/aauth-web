<template>
  <div class="explode">
    <h1 class="title">{{ tip }}</h1>
  </div> 
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
const route = useRoute(), router = useRouter()
const id = route.params.id

ref: tip = '正在请求跳转'
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
    delete LS[id]
    delete SS[id]
    router.push('/launch/' + id)
  })
</script>

<style scoped>
div.explode {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
