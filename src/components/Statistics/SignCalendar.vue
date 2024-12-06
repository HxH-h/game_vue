<template>
    <el-calendar v-model="date" ref="calendar">
        <template #header="{ date }">
            <span>{{ date }}</span>
            <el-button-group>
                <el-button size="small" @click="selectDate('prev-month')">
                    上月
                </el-button>
                <el-button size="small" @click="selectDate('today')">本月</el-button>
            </el-button-group>
        </template>
        <template #date-cell="{ data }">
            <!-- 每个单元格 -->
            <div :class="getCellClass(data.day)">
                {{ data.day.split('-').slice(2).join('-') }}
                <br>
                <span v-if="isSigned(data.day)" class="signed" >
                    <img src="../../assets/sign.png" height="50" width="50" alt="">
                </span>
            </div>
        </template>
    </el-calendar>

</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { get } from '../../ts/request'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { HISTORY_SIGN_URL } from '@/ts/url'


const store = useStore()
const date = ref(new Date())
const signData = ref([])

onMounted(async () => {
    let resp = await get(HISTORY_SIGN_URL, store.state.accessToken, formatDate(date.value))
    if (resp.code == 200) {
        signData.value = resp.data
    }
})

const isSigned = (day: string): boolean => {
    const [year, month, dayOfMonth] = day.split('-').map(Number)
    const currentYear = date.value.getFullYear()
    const currentMonth = date.value.getMonth() + 1
    if (year !== currentYear || month !== currentMonth) {
        return false
    }

    const dayIndex = new Date(day).getDate() - 1
    return signData.value[dayIndex] === true
}

const getCellClass = (day: string): string => {
    if (isSigned(day)) {
        return 'signed-cell'
    }
    return ''
}

const calendar = ref<CalendarInstance>()
const selectDate = async (val: CalendarDateType) => {
    if (!calendar.value) return
    calendar.value.selectDate(val)
    signData.value = []
    let resp = await get(HISTORY_SIGN_URL, store.state.accessToken, formatDate(date.value))
    if (resp.code == 200) {
        signData.value = resp.data
    }
}

function formatDate(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${year}:${month}`
}
</script>
<style>
.el-calendar-table:not(.is-range) td.next,
.el-calendar-table:not(.is-range) td.prev {
    pointer-events: none;
}

</style>