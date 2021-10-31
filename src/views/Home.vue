<template>
  <div class="flex items-center justify-center flex-col text-center h-screen w-screen">
    <img class="w-5/12 max-w-xs" src="/bigger_logo.png" alt="logo">
    <h2 class="mt-0 text-3xl sm:text-5xl font-light"><span @click="router.push('/launch/aauth/')">Auth</span> with Anything</h2>
    <p class="text-gray-300 fixed bottom-0"><a href="http://beian.miit.gov.cn/">苏ICP备20040754号-1</a><br />copyright&copy;南京世创工程技术有限公司</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
