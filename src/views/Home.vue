<template>
  <div class="is-align-items-center is-flex is-flex-direction-column has-text-centered is-justify-content-center" style="height: 100vh; width: 100vw;">
    <img src="/bigger_logo.png" alt="logo">
    <h2 class="mt-0"><span @click="router.push('/launch/aauth/')">Auth</span> with Anything</h2>
    <p class="has-text-grey"><a href="http://beian.miit.gov.cn/" class="has-text-grey">苏ICP备20040754号-1</a><br />copyright&copy;南京世创工程技术有限公司</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
h2 {
  color: #273849;
  font-size: 3.2em;
  font-weight: 300;
}
img {
  width: 40vw;
  max-width: 250px;
}
p {
  position: fixed;
  bottom: 0;
  width: 100%;
  text-decoration: none;
}
@media (max-width: 440px) {
  h2 {
    font-size: 2rem;
  }
}
</style>