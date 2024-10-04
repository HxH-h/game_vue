<template>
    <CardItem>
        <template #head>
            <img />
        </template>
        <template #body>
            <el-row :gutter="20">
                <el-col :span="6" :offset="9">
                    <div class="grid-content ep-bg-purple" >
                        <el-button @click="jumpPage('gameAI')">人机对战</el-button>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="6" :offset="9">
                    <div class="grid-content ep-bg-purple" >
                        <el-button @click="jumpPage('gamepk')">多人对战</el-button>
                    </div>
                </el-col>
            </el-row> 
            <el-row :gutter="20">
                <el-col :span="6" :offset="9">
                    <div class="grid-content ep-bg-purple" >
                        <el-button @click="jump('chessgame','test')">test</el-button>
                    </div>
                </el-col>
            </el-row> 
        </template>
    </CardItem>

</template>

<script>
import CardItem from '@/components/CardItem.vue'
import router from '@/router/index';
import route from '@/router/index'
export default {
    components: {
        CardItem,
    },
    setup() {
        function jumpPage(page){
          route.push({ name: page })
        }
        function jump(page , params){
            router.push({ name: page, state: {params} })
        }
        return{
            jumpPage,
            jump
        }
    }

}

</script>
<style>
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