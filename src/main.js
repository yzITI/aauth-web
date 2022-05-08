import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './index.css'
import srpc from './plugins/srpc.js'
window.srpc = srpc

createApp(App).use(router).mount('#app')
