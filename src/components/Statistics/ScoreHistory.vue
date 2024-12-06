<template>
    <el-input-number v-model="num" :min="1" :max="50" size="small" @change="handleChange" />
    <div ref="history" class="chart"></div>
</template>

<script lang="ts" setup>
import * as echarts from 'echarts';
import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex"
import { get } from '../../ts/request'
import { ElMessage } from 'element-plus'
import { HISTORY_SCORE_URL } from '@/ts/url';

const store = useStore()

// 场数
const num = ref(20)

// echarts关联
const history = ref(null)
var scoreHistory: any = null

onMounted(async () => {
    scoreHistory = echarts.init(history.value)
    let resp = await get(HISTORY_SCORE_URL, store.state.accessToken, num.value)
    if (resp.code == 3071) {
        ElMessage({
            message: '场数超出限制',
            type: 'error',
            grouping: true
        })
        return
    }
    renderChart(resp.data)
})

function renderChart(data: any) {
    const option = {
        title: {
            text: '积分历史',
            x: 'left',
            y: 'top',
            textStyle: {
                fontFamily: 'Arial, Verdana, sans...',
                fontSize: 24,

            },
        },

        xAxis: {
            show: false,
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                interval: 0,
                rotate: -40,
                margin: 25
            }
        },
        yAxis: {
            type: 'value',
            scale: true,
            minInterval: 1,
        },
        series: [
            {
                name: '总场数',
                data: data.reverse(),
                type: 'line',
                label: {
                    show: true
                }
            }
        ]
    }
    scoreHistory.setOption(option)
}

const handleChange = async (value: number) => {
    if(value <= 0 || !value) return
    let resp = await get(HISTORY_SCORE_URL, store.state.accessToken, value)
    if (resp.code == 3071) {
        ElMessage({
            message: '场数超出限制',
            type: 'error',
            grouping: true
        })
        return
    }
    renderChart(resp.data)
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