<template>
  <div class="admin box">
    <h1 v-if="!apps" class="title">正在载入...</h1>
    <template v-else>
      <h1 class="title">应用管理</h1>
      <div class="app box p-2" v-for="(a, id) in apps" @click="edit = {...a}">
        <div class="is-flex" style="align-items: center;">
          <img style="max-width: 3rem; max-height: 3rem;" :src="a.icon || '/logo.png'" onerror="this.src = '/logo.png'">
          <h3 class="title is-5 ml-3">{{ a.name }}</h3>
        </div>
        <code @click.stop="">{{ id }}</code>
      </div>
    </template>
  </div>
  <div v-if="edit" class="modal is-clipped is-active">
    <div class="modal-background" @click="edit = false"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">编辑应用信息</p>
      </header>
      <section class="modal-card-body form">
        <app :app="edit"></app>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-info">提交</button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import App from '../components/App.vue'
const route = useRoute(), router = useRouter()

const SS = window.sessionStorage
const token = () => ({ headers: { token: SS.aauth } })
ref: apps = null
ref: edit = null

function catchErr (e) {
  console.log(e)
  Swal.fire('错误', e.response ? e.response.data : '网络错误', 'error')
}

console.log(route.query.state)
if (route.query.token) router.push('/admin')
else if (!SS.aauth) router.push('/')
else axios.get('/app/', token())
  .then(({ data }) => { apps = data })
  .catch(catchErr)
</script>

<style scoped>
div.admin {
  width: 100%;
  min-height: 100vh;
}
div.app {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}
</style>
