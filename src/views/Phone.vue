<script setup>
import { watch } from 'vue'
import OverlayLoading from '../components/OverlayLoading.vue'
import { ArrowCircleRightIcon } from '@heroicons/vue/solid'
import { useRouter, useRoute } from 'vue-router'
import axios from '../plugins/axios.js'

const router = useRouter(), route = useRoute()
let loading = $ref(false), input = $ref(''), number = $ref('')

watch($$(input), v => {
  input = v.replace(/[^0-9]/g, '')
})

async function next () {
  loading = true
  if (number) {
    await axios.post('/phone/' + number, { code: input })
      .then(r => { router.push(`/land?code=${r.data}&state=${route.query.state}`) })
      .catch(err => Swal.fire('错误', err.response ? err.response.data : '网络错误', 'error'))
    number = ''
    input = ''
  } else {
    await axios.get('/phone/' + input)
      .then(() => { number = input })
      .catch(err => Swal.fire('错误', err.response ? err.response.data : '网络错误', 'error'))
    input = ''
  }
  loading = false
}
</script>

<template>
  <div class="h-screen bg-gray-100 flex justify-center items-center">
    <overlay-loading :show="loading"></overlay-loading>
    <div class="absolute w-80 h-56 bg-white shadow-md flex justify-center items-center flex-col rounded transition-all">
      <h1 class="text-2xl font-semibold">手机号登录</h1>
      <input ref="inputElement" class="mt-6 mb-4 rounded px-3 py-2 radius-2 border-2 border-gray-300 focus:ring-1 focus:border-blue-300 transition"
        :placeholder="number ? '请输入短信验证码' : '请输入手机号'"
        type="text" v-model="input" @keyup.enter="next"
      >
      <button @click="next"><arrow-circle-right-icon class="w-12 h-12 transition" :class="input.length == (number ? 6 : 11) ? 'text-blue-500' : 'text-gray-300'"/></button>
    </div>
  </div>
</template>
