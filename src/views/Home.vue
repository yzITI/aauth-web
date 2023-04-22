<script setup>
import { useRouter, useRoute } from 'vue-router'
import srpc from '../plugins/srpc.js'
const router = useRouter(), route = useRoute()

const enc = new TextEncoder('utf-8')
const base64url = buffer => btoa(String.fromCharCode(...new Uint8Array(buffer))).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
const sha256 = str => window.crypto.subtle.digest('SHA-256', enc.encode(str)).then(base64url)

const SS = window.sessionStorage
async function root () {
  const input = await Swal.fire({ icon: 'question', input: 'password' })
  if (!input.value) return
  const secret = await sha256(input.value)
  const res = await srpc.auth.app('root', secret)
  if (!res) return
  const id = route.query.app || 'aauth'
  SS[id] = res
  router.push('/explode/' + id)
}
</script>

<template>
  <div class="flex items-center justify-center flex-col text-center h-screen w-screen">
    <img class="w-5/12 max-w-xs" src="/bigger_logo.png" alt="logo">
    <h2 class="mt-0 text-3xl sm:text-5xl font-light"><span @click="root">Auth</span> with Anything</h2>
    <p class="text-gray-300 fixed bottom-0"><a href="http://beian.miit.gov.cn/">苏ICP备20040754号-1</a><br />copyright&copy;南京世创工程技术有限公司</p>
  </div>
</template>
