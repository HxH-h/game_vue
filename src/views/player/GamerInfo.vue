<template>
    <CardItem :width=80 :height=90 >
        <template #head>
            <img />
        </template>
        <template #body>
            <el-row :guter="24">
                <el-col :span="6">
                    <div class="grid-content ep-bg-purple" />
                    <div class="userInfo" style="margin-top: 4vh">
                        <el-card style="max-width: 280px;height: 70vh;">
                            <template #header>
                                <div class="card-header">
                                    <img v-if="store.state.photo != '' && store.state.photo != null"
                                        :src=store.state.photo style="width: 100%" />
                                    <el-upload v-else class="avatar-uploader" action="" :show-file-list="false"
                                        :on-success="handleAvatarSuccess" :http-request="uploadPicture"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                                        <el-icon v-else class="avatar-uploader-icon">
                                            <Plus />
                                        </el-icon>
                                    </el-upload>
                                </div>
                            </template>
                            <span>{{ store.state.username }}</span>
                            <p>邮箱: {{ store.state.email }} </p>
                            <p>排名: {{ store.state.rank }}</p>
                            <el-progress :text-inside="true" :stroke-width="13" :percentage="percentage" :format="text" /><br>
                            <el-button type="success" @click="signIn" >签到</el-button>
                            <template #footer>
                                <p>总对局: {{ gamedata.gameNum }}</p>
                                <p>胜局: {{ gamedata.winNum }}</p>
                                <p>胜率: {{ gamedata.winRate }}%</p>
                            </template>
                        </el-card>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="grid-content ep-bg-purple-light" />
                    <div class="historyList">
                        <el-scrollbar max-height="500px">
                            <el-table :data="history" :header-cell-style="{ 'text-align': 'center' }"
                                :cell-style="{ 'text-align': 'center' }"
                                :default-sort="{ prop: 'time', order: 'descending' }" @cell-click="getDetailedChess"
                                style="width: 100%">

                                <el-table-column label="序号" type="index" width="45" />
                                <el-table-column prop="first" label="先手" width="150" />
                                <el-table-column prop="second" label="后手" width="150" />
                                <el-table-column prop="vic" label="胜负" width="45" />
                                <el-table-column prop="score" label = "得分" width="90" />
                                <el-table-column prop="turn" label="回合数" width="45" />
                                <el-table-column prop="time" label="对局时间" />

                            </el-table>
                        </el-scrollbar>
                    </div>
                    <div class="pagination">
                        <el-pagination layout="prev, pager, next" :total=total @current-change="getHistory" />
                    </div>
                </el-col>
            </el-row>
        </template>

    </CardItem>
</template>
<script setup>
import CardItem from '@/components/CardItem.vue'
import { ref, onMounted } from 'vue';
import { useStore } from "vuex"
import axios from 'axios';
import route from '@/router/index';
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { reactive } from 'vue';
import { get , post } from '@/ts/request';
import {transform} from '@/ts/utils'
import { HISTORY_NUM_URL , PLAYER_INFO_URL , HISTORY_URL , SIGN_URL} from '@/ts/url';

const store = useStore()

const history = ref([])
const total = ref(0)
const gamedata = reactive({})
const imageUrl = ref('')
// 经验条百分比
const percentage = ref(0)

function getDetailedChess(e) {
    const query = e
    const params = JSON.stringify(e)
    route.push({ name: 'chesshistory', state: { params } })
}
function uploadPicture(params) {
    let formData = new FormData();
    formData.append('file', params.file);
    axios({
        method: "post",
        url: "http://localhost:8080/player/photo",
        data: formData,
        headers: {
            'Authorization': store.state.token
        }
    }).then(function (resp) {
        if (resp.data.code == 1051) {
            store.commit("setPhoto", resp.data.data)
            ElMessage({
                message: 'Add headphoto successfully',
                type: 'success',
            })
        } else {
            ElMessage({
                message: 'Add headphoto failed,please try again',
                type: 'error',
            })
        }

    })
}

function handleAvatarSuccess(res, file) {
    imageUrl.value = URL.createObjectURL(file.raw);
}

function beforeAvatarUpload(file) {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
}

function text(){
    return 'Lv' + gamedata.level
}

onMounted(async () => {

    let hisnum = await get(HISTORY_NUM_URL, store.state.accessToken)
    let inforesp = await get(PLAYER_INFO_URL, store.state.accessToken)
    let historyresp = await get(HISTORY_URL, store.state.accessToken, 1 , 10)

    if (inforesp.code == 4001 || historyresp.code == 4001 || hisnum.code == 4001) {
        ElMessage({
            message: 'your request are blocked please wait sometime',
            type: 'warning',
        })
        return
    }
    if (inforesp.code == 1031 && historyresp.code == 1041 && hisnum.code == 1061) {
        store.commit("setUserInfo", inforesp.data)
        total.value = hisnum.data
        history.value = historyresp.data.map(history => {
            history.chess = transform(history.chess)
            return history
        })
        // 计算胜率
        gamedata.gameNum = Number(inforesp.data.gameNum)
        gamedata.winNum = Number(inforesp.data.winNum)
        gamedata.winRate = (inforesp.data.winNum / inforesp.data.gameNum * 100).toFixed(2)
        // 计算经验
        let exp = Number(inforesp.data.level)
        gamedata.level = parseInt(exp / 10000)
        percentage.value = (exp % 10000) / 100
        console.log(percentage.value + " " + gamedata.level)
    }


})
async function getHistory(page) {
    let historyresp = await get(HISTORY_URL + '/' + page + '/10', store.state.accessToken)
    if(historyresp.code == 4001){
        ElMessage({
            message: 'your request are blocked please wait sometime',
            type: 'warning',
        })
        return
    }
    if(historyresp.code == 1041){
        history.value = historyresp.data.map(history => {
            history.chess = transform(history.chess)
            return history
        })
    }
}

async function signIn(){
    let resp = await post(SIGN_URL, store.state.accessToken)
    console.log(resp)
    if(resp.code == 200){
        ElMessage({
            message: resp.msg,
            type: 'success',
        })
    }else{
        ElMessage({
            message: resp.msg,
            type: 'error',
        })
    }
}



</script>
<style scoped>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.historyList {
    padding: 0 10%;
}

p {
    text-align: left;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
}
.pagination{
    padding: 0 10%;
    padding-top: 5vh;
    padding-left: 20vw;
}
</style>