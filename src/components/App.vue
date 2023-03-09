<script setup>
import { watchEffect, nextTick } from 'vue'
import OverlayLoading from './OverlayLoading.vue'
import { TrashIcon, CheckIcon, KeyIcon } from '@heroicons/vue/24/outline'
import srpc from '../plugins/srpc.js'
const props = defineProps(['app'])
const emit = defineEmits(['put', 'del'])
let app = $ref(props.app), loading = $ref(false), secret = $ref('')

watchEffect(() => { app = props.app })

const properties = {
  name: ['名称', '应用名称（必填）'],
  icon: ['图标', '图片链接地址'],
  url: ['地址', '登录跳转地址或源地址'],
  platforms: ['平台', '允许登录的平台，默认全部允许'],
  token: ['令牌', 'key1,key2,key3']
}

const SS = window.sessionStorage

async function submit () {
  loading = true
  const data = {
    name: app.name,
    icon: app.icon,
    url: app.url,
    platforms: app.platforms,
    token: app.token
  }
  const res = await srpc.app.put(SS.aauth, app.id, data)
  if (res) {
    Swal.fire('成功', '应用信息提交成功', 'success')
    data.id = app.id
    emit('put', data)
  } else Swal.fire('错误', '提交失败', 'error')
  loading = false
}

async function remove () {
  const dialog = await Swal.fire({
    title: '确认删除',
    text: '您正在尝试删除应用' + app.name,
    icon: 'warning',
    showCancelButton: true
  })
  if (!dialog.isConfirmed) return
  loading = true
  const res = await srpc.app.del(SS.aauth, app.id)
  if (res) {
    Swal.fire('成功', '删除应用成功', 'success')
    emit('del', app.id)
  } else Swal.fire('错误', '删除失败', 'error')
  loading = false
}

async function refreshSecret () {
  const dialog = await Swal.fire({
    title: '确认刷新密钥',
    text: '您正在尝试刷新应用' + app.name + '的密钥',
    icon: 'warning',
    showCancelButton: true
  })
  if (!dialog.isConfirmed) return
  loading = true
  const res = await srpc.app.refreshSecret(SS.aauth, app.id)
  if (res) {
    secret = res
    await nextTick()
    copySecret()
    Swal.fire('成功', '新密钥已经复制到剪切板', 'success')
  } else Swal.fire('错误', '刷新密钥失败', 'error')
  loading = false
}

function copySecret () {
  let testingCodeToCopy = document.querySelector('#secret')
  testingCodeToCopy.setAttribute('type', 'text')
  testingCodeToCopy.select()
  document.execCommand('copy')
  /* unselect the range */
  testingCodeToCopy.setAttribute('type', 'hidden')
  window.getSelection().removeAllRanges()
}
</script>

<template>
  <div class="m-2 w-11/12">
    <img alt="logo" :src="app.icon || '/logo.png'" onerror="this.src = '/logo.png'" class="w-20 h-20">
    <div class="m-3" v-for="(n, p) in properties">
      <label class="inline-block w-12">{{ n[0] }}：</label>
      <input class="px-2 py-1 w-3/4 focus:ring-2" type="text" v-model="app[p]" :placeholder="n[1]">
    </div>
    <div class="m-3 flex items-center">
      <button :class="app.name ? 'bg-blue-500' : 'bg-gray-500'" @click="submit" :disabled="!app.name"><check-icon class="w-5 mr-1" />提交</button>
      <button class="bg-red-500" @click="remove"><trash-icon class="w-5 mr-1" />删除</button>
      <button class="bg-yellow-500" @click="refreshSecret"><key-icon class="w-5 mr-1" />刷新密钥</button>
    </div>
    <input type="hidden" id="secret" :value="secret">
  </div>
  <overlay-loading :show="loading" />
</template>

<style scoped>
button {
  transition: all 0.3s ease;
  @apply font-bold text-white rounded px-4 py-2 text-sm mr-3 shadow hover:shadow-md flex items-center;
}
</style>
