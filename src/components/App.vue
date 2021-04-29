<template>
  <div class="form">
    <div class="is-flex is-align-items-center m-1" v-for="(n, p) in properties">
      <label class="label m-0" style="min-width: 4rem;">{{ n[0] }}：</label>
      <input class="input is-small" type="text" v-model="props.app[p]" :placeholder="n[1]">
    </div>
    <label class="checkbox ml-3">
      <input type="checkbox" v-model="props.app.secret">
      <span style="color: red; margin: 8px;">刷新secret</span>
    </label>
    <label class="checkbox ml-3">
      <input type="checkbox" v-model="props.app.key">
      <span style="color: red; margin: 8px;">刷新RSA密钥对</span>
    </label>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['app'])
const properties = {
  name: ['名称', '应用名称'],
  icon: ['图标', '图片链接地址'],
  redirect: ['跳转', '登录跳转地址'],
  platforms: ['平台', '允许登录的平台，默认全部允许'],
  token: ['令牌', '使用令牌登录，填写令牌模板']
}
</script>