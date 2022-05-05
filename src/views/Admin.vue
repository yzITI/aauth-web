<script setup>
import { useRoute, useRouter } from 'vue-router'
const route = useRoute(), router = useRouter()
import axios from '../plugins/axios.js'
import App from '../components/App.vue'

let apps = $ref(null)
let selected = $ref('')

const SS = window.sessionStorage
const token = () => ({ headers: { token: SS.aauth } })
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

function upsert (a) {
  apps[selected] = a
}

function remove ({ id }) {
  delete apps[id]
}

window.add = (id) => {
  apps[id] = { id }
  selected = id
}
</script>

<template>
  <div class="bg-gray-100 min-h-screen w-screen flex flex-col p-10">
    <h1 class="text-3xl font-bold mb-5">Aauth 应用管理</h1>
    <p v-if="!apps">Loading...</p>
    <select v-else v-model="selected" class="border roundedfoverlay px-4 py-2 font-bold m-5">
      <option v-for="(v, k) in apps" :value="k" :key="k">{{ v.name }} ({{ k }})</option>
    </select>
    <app v-if="selected" :app="apps[selected]" @upsert="upsert" @remove="remove"></app>
  </div>
</template>
