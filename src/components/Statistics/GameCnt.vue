<template>
    <div ref="gameCnt" class="chart"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { onMounted, ref, watch, toRefs } from "vue";
import { useStore } from "vuex"
import { get } from '../../ts/request'
import { ElMessage } from 'element-plus'

// 设置绑定属性
const props = defineProps({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    }
})

const { start, end } = toRefs(props);

const store = useStore()



// echarts关联
const gameCnt = ref(null)
var gameCntChart: any = null

onMounted(async () => {
    gameCntChart = echarts.init(gameCnt.value)
    // 监听start end变化
    watch(() => [start.value, end.value],
        async ([newStart, newEnd], [oldStart, oldEnd]) => {
            let resp = await get('/analysis/gameCnt', store.state.accessToken, newStart, newEnd)
            if (resp.code == 3061) {
                ElMessage.error('日期非法')
                return
            }
            renderChart(resp.data)
        })
    // 初始化获取数据
    let resp = await get('/analysis/gameCnt', store.state.accessToken, start.value, end.value)
    if (resp.code == 3061) {
        ElMessage.error('日期非法')
        return
    }
    renderChart(resp.data)
})

function renderChart(data: any) {
    let ret = getGameCnt(data)
    rendeCnt(ret.xAxis, ret.yCnt, ret.yVic)
}

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
            boundaryGap: false,
            data: x,
            axisLabel: {
                interval: 0,
                rotate: -40,
                margin: 25
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
                    show: true,
                    //position: 'bottom', // 文字位置
                    // 显示的文字
                    formatter: '{c}',
                    color: '#000' // 文字颜色

                },

            },
            {
                name: '胜场数',
                data: yVic,
                type: 'line',
                label: {
                    show: true,
                    position: 'bottom', // 文字位置
                    // 显示的文字
                    formatter: '{c}',
                    color: '#000' // 文字颜色
                },
            }
        ]
    }
    gameCntChart.setOption(option)
}


function getGameCnt(data: any) {

    // 处理数据
    const xAxis: string[] = [];
    const yCnt: number[] = [];
    const yVic: number[] = [];

    data.forEach((item: any) => {
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

    padding: 10px;
    width: 42vw;
    height: 50vh;

}
</style>