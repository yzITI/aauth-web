<template>
  <code class="ml-3">{{ app.id }}</code>
  <div class="form m-2">
    <div class="is-flex is-align-items-center m-3">
      <label class="label m-0" style="min-width: 3.5rem;">id: </label>
      <input class="input is-small" type="text" readonly="true" :value="app.id">
    </div>
    <div class="is-flex is-align-items-center m-3" v-for="(n, p) in properties">
      <label class="label m-0" style="min-width: 3.5rem;">{{ n[0] }}：</label>
      <input class="input is-small" type="text" v-model="app[p]" :placeholder="n[1]">
    </div>
    <label class="checkbox ml-3">
      <input type="checkbox" v-model="app.updateSecret">
      <span style="color: red; margin: 8px;">刷新secret</span>
    </label>
    <label class="checkbox ml-3">
      <input type="checkbox" v-model="app.key">
      <span style="color: red; margin: 8px;">刷新RSA密钥对</span>
    </label>
    <div class="buttons m-3">
      <button class="button is-info" :class="{ 'is-loading': loading }" @click="submit" :disabled="!app.name">提交</button>
      <button class="button is-danger" @click="remove"  :class="{ 'is-loading': loading }">删除</button>
    </div>
    <p class="m-3">只有<b>刷新</b>secret或者RSA密钥对以后，才可以查看最新secret或sk。关闭此页后将无法再次查看!</p>
    <input type="hidden" id="pk" :value="app.pk">
    <input type="hidden" id="sk" :value="app.sk">
    <input type="hidden" id="secret" :value="app.secret">
    <div class="buttons m-2">
      <button class="button is-success is-light mb-2" v-if="app.pk" @click="copy('#pk')">点击复制public key</button>
      <button class="button is-warning is-light mb-2" v-if="app.sk" @click="copy('#sk')">点击复制private key</button>
      <button class="button is-danger is-light mb-2" v-if="app.secret" @click="copy('#secret')">点击复制secret</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmit, watchEffect } from 'vue'
import axios from '../plugins/axios.js'
const props = defineProps(['app'])
const emit = defineEmit(['upsert', 'remove'])
ref: app = props.app

watchEffect(() => { app = props.app })

const properties = {
  name: ['名称', '应用名称'],
  icon: ['图标', '图片链接地址'],
  redirect: ['跳转', '登录跳转地址'],
  platforms: ['平台', '允许登录的平台，默认全部允许'],
  token: ['令牌', '使用令牌登录，填写令牌模板']
}

ref: loading = false

async function submit () {
  if (app.updateSecret || app.key) {
    const res = await Swal.fire({
      title: '确认提交',
      text: '您正在尝试刷新secret或RSA密钥',
      icon: 'warning',
      showCancelButton: true
    })
    if (!res.isConfirmed) return
  }
  loading = true
  const body = {
    name: app.name,
    icon: app.icon,
    redirect: app.redirect,
    platforms: app.platforms,
    token: app.token,
    secret: app.updateSecret,
    key: app.key
  }
  await axios.post('/app/' + app.id, body, { headers: { token: window.sessionStorage.aauth } })
    .then(({ data }) => {
      app = data
      console.log(data)
      Swal.fire('成功', '应用信息提交成功', 'success')
    })
    .catch(err => {
      Swal.fire('错误', err.response ? err.response.data : '网络错误', 'error')
    })
  emit('upsert', {...app})
  loading = false
}

async function remove () {
  const res = await Swal.fire({
    title: '确认删除',
    text: '您正在尝试删除应用' + app.name,
    icon: 'warning',
    showCancelButton: true
  })
  if (!res.isConfirmed) return
  loading = true
  await axios.delete('/app/' + app.id, { headers: { token: window.sessionStorage.aauth } })
    .then(({ data }) => {
      Swal.fire('成功', '应用删除成功', 'success')
    })
    .catch(err => {
      Swal.fire('错误', err.response ? err.response.data : '网络错误', 'error')
    })
  emit('remove', app)
  loading = false
}

function copy (id) {
  let testingCodeToCopy = document.querySelector(id)
  testingCodeToCopy.setAttribute('type', 'text')
  testingCodeToCopy.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    swal.fire('复制成功', '', 'success')
  } catch (err) {
    swal.fire('复制失败', '', 'error')
  }

  /* unselect the range */
  testingCodeToCopy.setAttribute('type', 'hidden')
  window.getSelection().removeAllRanges()
}
</script>
