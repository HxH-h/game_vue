import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
.use(store)
.use(router)
.use(VueAxios,axios)
.use(ElementPlus)
.use(createPinia())
.mount('#app')
