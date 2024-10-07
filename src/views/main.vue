<template>
    <Nav/>
    <router-view> </router-view>

</template>
<script setup>
import Nav from '@/components/Nav.vue';
import useWsStore from '@/store/WsSocket';
import { onMounted, onUnmounted, watch } from 'vue';
import router from '@/router';
import { useStore } from "vuex"


const wsstore = useWsStore();
const store = useStore()

// 对战基于该页面 直接在该页面开启websocket
onMounted(() => {
    console.log('start connection')
    wsstore.createWs()
    console.log('connected')
    watch(() => wsstore.msg, (newValue, oldValue) => {
        const data = JSON.parse(newValue)
        if (data.event == "reconnect"){
            router.push({name: "chessgame" , state: {data}})
        }else if(data.event == "exist"){
            wsstore.close()
            store.dispatch("logout")
            localStorage.removeItem("jwt_token")
            router.push({ name: 'login' })
        }
    })
})

// 离开页面关闭连接，避免长期占用资源
onUnmounted(() => {
    console.log('close connection')
    wsstore.close()
})





</script>

<style></style>