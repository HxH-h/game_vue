<template>
    <CardItem :background = backgroundImg>
        <template #head>
            <img />
        </template>
        <template #body >
            
                <el-row :gutter="20">
                    <el-col :span="6" :offset="9">
                        <div class="grid-content ep-bg-purple">
                            <el-button @click="jump('chessgame', 'startAI')">人机对战</el-button>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6" :offset="9">
                        <div class="grid-content ep-bg-purple">
                            <el-button @click="jump('chessgame', 'start-matching')">多人对战</el-button>
                        </div>
                    </el-col>
                </el-row>
                
        </template>
    </CardItem>

</template>

<script>
import CardItem from '@/components/CardItem.vue'
import route from '@/router/index'
import router from '@/router';
export default {
    components: {
        CardItem,
    },
    setup() {
        function jumpPage(page) {
            route.push({ name: page })
        }
        function jump(page, type) {
            var data = { 'event': type }
            router.push({ name: page, state: { data } })
        }
        return {
            jumpPage,
            jump,
            backgroundImg : require('../../assets/gamemode.png')
        }
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
</style>