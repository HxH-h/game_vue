<template>
    <el-date-picker v-model="date" type="daterange" range-separator="-" :start-placeholder="defaultStart"
        :end-placeholder="defaultEnd" size="default" 
        :disabled-date="pickerOptions" @change="durationChange" />


    <div ref="gameCnt" class="chart"></div>
</template>

<script lang="ts" setup>
// TODO 组件化
import * as echarts from 'echarts';
import { onMounted, ref } from "vue";
import { useStore } from "vuex"
import { get } from '../../ts/request'

const store = useStore()


const date = ref('')
const defaultStart = ref('')
const defaultEnd = ref('')

// 禁用今天之后的日期
function pickerOptions(time:any) {
    return time.getTime() > Date.now();
}


// echarts关联
const gameCnt = ref(null)
var gameCntChart: any = null
// 数据集
const gamecnt = ref([])

onMounted(async () => {
    // 初始化日期
    initDates()
    // 获取游戏场数
    let resp = await get('/analysis/gameCnt', store.state.accessToken, defaultStart.value, defaultEnd.value)
    let ret = getGameCnt(resp.data)
    gameCntChart = echarts.init(gameCnt.value)
    rendeCnt(ret.xAxis, ret.yCnt, ret.yVic)
})


function rendeCnt(x: any, yCnt: any, yVic: any) {

    const option = {
        title: {
            text: '场数统计',
            x: 'left',
            y: 'top',
            textStyle: {
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 24,

            },
        },
        legend: {
            data: ['总场数', '胜场数'],
            x: 'center',
            y: 'top'
        },
        xAxis: {
            type: 'category',
            data: x,
            axisLabel: {
                interval: 0,
                rotate: -40
            }
        },
        yAxis: {
            type: 'value',
            minInterval: 1,
        },
        series: [
            {
                name: '总场数',
                data: yCnt,
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        //position: 'bottom', // 文字位置
                        // 显示的文字
                        formatter: '{c}',
                        textStyle: {
                            color: '#000' // 文字颜色
                        }
                    }
                },

            },
            {
                name: '胜场数',
                data: yVic,
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom', // 文字位置
                        // 显示的文字
                        formatter: '{c}',
                        textStyle: {
                            color: '#000' // 文字颜色
                        }
                    }
                },
            }
        ]
    }
    gameCntChart.setOption(option)
}
async function durationChange() {
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    let start = formatDate(new Date(date.value[0]))
    let end = formatDate(new Date(date.value[1]))
    let resp = await get('/analysis/gameCnt', store.state.accessToken, start, end)
    let ret = getGameCnt(resp.data)
    rendeCnt(ret.xAxis, ret.yCnt, ret.yVic)
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
    defaultStart.value = formatDate(oneWeekAgo)
    defaultEnd.value = formatDate(now)
}

function getGameCnt(data: any) {
    // 处理数据
    const xAxis: string[] = [];
    const yCnt: number[] = [];
    const yVic: number[] = [];

    data.forEach(item => {
        xAxis.push(item.date);
        yCnt.push(item.cnt ?? 0);
        yVic.push(item.vic);
    });
    return { xAxis, yCnt, yVic };
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