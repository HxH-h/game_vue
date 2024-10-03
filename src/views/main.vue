<template>
    <Nav/>
    <router-view> </router-view>

</template>
<script setup>
import Nav from '@/components/Nav.vue';
import useWsStore from '@/store/WsSocket';
import { useStore } from 'vuex';
import { onMounted, onUnmounted, watch } from 'vue';
import router from '@/router';

const store = useStore();
const wsstore = useWsStore();

// 对战基于该页面 直接在该页面开启websocket
onMounted(() => {
    console.log('start connection')
    wsstore.createWs("ws://localhost:8080/websocket" , store.state.token)
    console.log('connected')
    watch(() => wsstore.msg, (newValue, oldValue) => {
        const data = JSON.parse(newValue)
        if (data.event == "reconnect"){
            router.push({name: "gameAI" , state: {data}})
            console.log("main 断线重连")
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