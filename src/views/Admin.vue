<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()
import srpc from '../plugins/srpc.js'
import App from '../components/App.vue'
import SideDrawer from '../components/SideDrawer.vue'
import { MenuIcon, CheckIcon } from '@heroicons/vue/outline'

let apps = $ref(null), showList = $ref(false)
let selected = $ref(''), newId = $ref('')

const SS = window.sessionStorage
function catchErr (e) {
  console.log(e)
  Swal.fire('错误', e.response ? e.response.data : '网络错误', 'error')
}

if (!SS.aauth) router.push('/')
else {
  if (route.query.token) router.push('/admin')
  srpc.app.getAll(SS.aauth)
    .then(data => { apps = data })
}

function put (a) { apps[selected] = a }

function del (id) {
  delete apps[id]
  if (selected === id) selected = ''
}

function add () {
  const id = newId
  apps[id] = { id }
  selected = id
  newId = ''
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen w-screen flex">
    <side-drawer v-model="showList">
      <div class="p-4 sm:p6">
        <h1 class="text-xl font-bold mb-5">应用列表</h1>
        <p v-if="!apps">Loading...</p>
        <div class="flex items-center rounded shadow px-2 py-1 mx-2 border">
          <input class="flex-grow" v-model="newId" placeholder="Create new app by appid">
          <check-icon class="text-blue-500 w-8 cursor-pointer" @click="add" />
        </div>
        <div v-for="(v, k) in apps" :key="k" class="flex items-center cursor-pointer m-2" @click="selected = k; showList = false">
          <img alt="logo" :src="v.icon || '/logo.png'" onerror="this.src = '/logo.png'" class="w-7 h-7 mr-2">
          {{ v.name }} ({{ k }})
        </div>
      </div>
    </side-drawer>
    <div class="flex-grow p-4 sm:p-10">
      <h1 class="text-3xl font-bold mb-5 flex items-center">
        <menu-icon class="w-10 mr-2 cursor-pointer" @click="showList = true" />
        Aauth 应用管理
      </h1>
      <p v-if="!apps || !apps[selected]">请选择应用</p>
      <app v-if="selected" :app="apps[selected]" @put="put" @del="del"></app>
    </div>
  </div>
</template>
