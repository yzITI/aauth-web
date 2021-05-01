<template>
  <div class="admin">
    <h1 v-if="!apps" class="title m-4">正在载入...</h1>
    <div v-else class="main" :style="mainStyle">
      <div class="list p-2">
        <h2 class="title is-4 m-3">应用列表</h2>
        <button class="button is-info is-outlined is-fullwidth is-small" @click="select()">创建应用</button>
        <div class="app m-2" v-for="(a, id) in apps" @click="select(id)">
          <img style="max-width: 1.8rem; max-height: 1.8rem;" :src="a.icon || '/logo.png'" onerror="this.src = '/logo.png'">
          <h3 class="title is-6 ml-2">{{ a.name }}</h3>
        </div>
      </div>
      <div class="edit p-2">
        <h1 class="title m-3">
          <i v-if="width <= 640" class="mdi mdi-24px mdi-menu" @click="open = !open"></i>
          {{ edit ? '应用管理' : ''}}
        </h1>
        <app v-if="edit" :app="edit" @upsert="upsert" @remove="remove"></app>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../plugins/axios.js'
import App from '../components/App.vue'
const route = useRoute(), router = useRouter()

const SS = window.sessionStorage
const token = () => ({ headers: { token: SS.aauth } })
ref: apps = null
ref: edit = null
ref: open = true
const width = window.innerWidth
const mainStyle = computed(() => (open || width > 640) ? '' : 'width: calc(100% + 240px); left: -240px;')

function catchErr (e) {
  console.log(e)
  Swal.fire('错误', e.response ? e.response.data : '网络错误', 'error')
}

if (!SS.aauth) router.push('/')
else {
  if (route.query.token) router.push('/admin')
  axios.get('/app/', token())
    .then(({ data }) => { apps = data })
    .catch(catchErr)
}

function randomString(e = 10) {
  const t = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnoprstuvwxyz1234567890'
  let n = ''
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * 62))
  return n
}

window.add = id => {
  edit = { id }
  open = false
}

function select (id) {
  edit = id ? ({...apps[id]}) : ({ id: randomString() })
  open = false
}

function upsert (app) {
  delete app.secret
  delete app.sk
  apps[app.id] = app
}

function remove (app) {
  console.log(app)
  delete apps[app.id]
  edit = null
}
</script>

<style scoped>
div.main {
  position: relative;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}
div.list {
  min-width: 240px;
  width: 240px;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
div.app {
  display: flex;
  align-items: center;
  cursor: pointer;
}
div.edit {
  position: relative;
  background-color: #f1f2f3;
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
}
div.edit * {
  min-width: 300px;
}
</style>
