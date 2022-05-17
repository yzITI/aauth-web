<script setup>
const { show } = defineProps(['show'])
</script>

<template>
  <transition name="fade">
    <div class="w-screen h-screen top-0 left-0 fixed z-50 bg-gray-100 flex justify-center items-center" v-if="show">
      <img src="/loading.svg" class="absolute w-40">
    </div>
  </transition>
</template>
