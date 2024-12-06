<template>
    <el-container>
        <el-row :gutter="0">
            <!-- 左侧区域 -->
            <el-col :span="14">
                <el-row :gutter="0">
                    <!-- 左上区域 -->
                    <el-col :span="24">
                        <el-date-picker v-model="date" type="daterange" range-separator="-" :start-placeholder="Start"
                            :end-placeholder="End" size="default" :disabled-date="pickerOptions"
                            @change="durationChange" @calendar-change="canlenderChange"
                            @visible-change="visibleChange" />
                    </el-col>
                    <!-- 左下区域 -->
                    <el-col :span="24">
                        <GameCnt :start="Start" :end="End" />
                    </el-col>
                </el-row>
            </el-col>
            <!-- 右侧区域 -->
            <el-col :span="10">
                <SignCalendar/>
            </el-col>
        </el-row>
    </el-container>

    
    <ScoreHistory />

</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useStore } from "vuex"
import GameCnt from '@/components/Statistics/GameCnt.vue';
import ScoreHistory from "@/components/Statistics/ScoreHistory.vue";
import SignCalendar from "@/components/Statistics/SignCalendar.vue";

const store = useStore()

const date = ref('')
const Start = ref('')
const End = ref('')

const tempdate = ref()


// 初始化日期
initDates()

// 确定日期时触发
function durationChange() {
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    Start.value = formatDate(new Date(date.value[0]))
    End.value = formatDate(new Date(date.value[1]))
}

// 日期改变时触发
function canlenderChange(val: [Date, null | Date]) {
    tempdate.value = new Date(val[0])
}
function visibleChange(val: boolean) {
    if (val) tempdate.value = null
}

function initDates() {
    // 获取当前日期
    const now = new Date();

    // 计算一周前的日期
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 6);

    // 格式化日期为 YYYY-MM-DD
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    Start.value = formatDate(oneWeekAgo)
    End.value = formatDate(now)
}
// 禁用今天之后的日期
function pickerOptions(time: any) {
    if (!tempdate.value) {
        return time.getTime() > Date.now()
    } else {
        return time.getTime() > Date.now() ||
            time.getTime() + 31 * 24 * 3600000 < tempdate.value.getTime() ||
            tempdate.value.getTime() + 31 * 24 * 3600000 < time.getTime()
    }
}

</script>
<style scoped>
.chart {
    background-color: #f5f7fa;
    padding: 20px;
    width: 42vw;
    height: 50vh;

}
</style>