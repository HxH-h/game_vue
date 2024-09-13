<template>
    <div style=" background-size:100% 100%;">
        <el-menu :default-active="route.currentRoute.name" class="el-menu-demo" mode="horizontal" :ellipsis="false"
            style="background-color: transparent;" @select="">
            <el-menu-item style="width: 5vw;margin-left: 10vw">
                <img style="width: 5vw; background-color: transparent ;" alt="Element logo" />
            </el-menu-item>

            <el-menu-item index="0" style="margin-left: 10vw;color: white"
                @click="jumpPage('gamemode')">对战模式</el-menu-item>
            <el-menu-item index="1" style="margin-left: 3svw;color: white"
                @click="jumpPage('GameList')">对战列表</el-menu-item>
            <el-menu-item index="2" style="margin-left: 3svw;color: white"
                @click="jumpPage('RankList')">排行榜</el-menu-item>

            <div class="flex-grow" />
            <el-sub-menu index="3" v-if="true">
                <template #title>{{ store.state.username }}</template>
                <el-menu-item index="3-1" @click="jumpPage('gamerinfo')">个人信息</el-menu-item>
                <el-menu-item index="3-2" @click="logout">登出</el-menu-item>
                <el-menu-item index="3-3">item three</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="3" @click="jumpPage('login')" v-else>登录</el-menu-item>
        </el-menu>
    </div>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useStore } from "vuex"
import route from '../router/index'
const activeIndex = ref('1')
const store = useStore()
function logout() {
    store.dispatch("logout")
    localStorage.removeItem("jwt_token")
    route.push({ name: 'login' })
}
function jumpPage(page) {
    route.push({ name: page })
}

</script>
<style scoped>
.flex-grow {
    flex-grow: 1;
}

.el-menu-demo>.el-menu-item {
    border-bottom: none;
    text-decoration: none;
}

.el-submenu__title:focus,
.el-submenu__title:hover {
    outline: 0 !important;
    color: transparent !important;
    background: transparent !important;
}

.el-menu-item:hover {
    outline: 0 !important;
    color: #7bafe4 !important;
    background: transparent !important;
}

.el-menu-item.is-active {
    color: transparent !important;
    background: transparent !important;
}
</style>