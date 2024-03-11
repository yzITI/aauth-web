<script setup>
import { watch } from 'vue'
import OverlayLoading from '../components/OverlayLoading.vue'
import { ArrowRightCircleIcon } from '@heroicons/vue/24/solid'
import { useRouter, useRoute } from 'vue-router'
import srpc from '../plugins/srpc.js'

const phoneNumberServer = new window.PhoneNumberServer()

const router = useRouter(), route = useRoute()
let loading = $ref(false), input = $ref(''), number = $ref('')

watch($$(input), v => {
  input = v.replace(/[^0-9]/g, '')
})

async function autoCheck () {
  const netType = phoneNumberServer.getConnection()
  if (netType === 'Wi-Fi') return false
  let res = await srpc.phone.getToken()
  if (!res) return false
  res = await new Promise((resolve, reject) => {
    phoneNumberServer.checkAuthAvailable({ phoneNumber: input, accessToken: res.AccessToken, jwtToken: res.JwtToken, success: resolve, error: reject })
  }).then(() => true).catch(() => false)
  if (!res) return
  res = await new Promise((resolve, reject) => {
    phoneNumberServer.getVerifyToken({ success: resolve, error: reject })
  }).catch(() => false)
  if (!res) return
  await Swal.fire('认证成功', '正在尝试使用本机号码认证...', 'success')
  res = await srpc.phone.verifyToken(input, res.spToken)
  router.push(`/land?code=${res}&state=${route.query.state}`)
  return res
}

async function next () {
  loading = true
  if (number) {
    const res = await srpc.phone.verifySMS(number, input)
    if (res) router.push(`/land?code=${res}&state=${route.query.state}`)
    else Swal.fire('错误', '验证码错误', 'error')
    number = ''
    input = ''
  } else {
    if (await autoCheck()) return
    const res = await srpc.phone.sendSMS(input)
    if (res) Swal.fire('错误', res, 'error')
    else number = input
    input = ''
  }
  loading = false
}
</script>

<template>
  <div class="h-screen bg-gray-100 flex justify-center items-center">
    <OverlayLoading :show="loading" />
    <div class="absolute w-80 h-56 bg-white shadow-md flex justify-center items-center flex-col rounded transition-all">
      <h1 class="text-2xl font-semibold">手机号登录</h1>
      <input ref="inputElement" class="mt-6 mb-4 rounded px-3 py-2 radius-2 border-2 border-gray-300 focus:ring-1 focus:border-blue-300 transition"
        :placeholder="number ? '请输入短信验证码' : '请输入手机号'"
        type="text" v-model="input" @keyup.enter="next"
      >
      <button @click="next"><ArrowRightCircleIcon class="w-12 h-12 transition" :class="input.length == (number ? 6 : 11) ? 'text-blue-500' : 'text-gray-300'"/></button>
      <div class="text-sm text-gray-300 absolute right-1 bottom-1">在流量环境下可一键认证</div>
    </div>
  </div>
</template>
