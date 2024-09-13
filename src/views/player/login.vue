<template>
    <el-container style="align-items: center;
                      justify-content: center;
                      ">
        <el-header style="height: 20vh;"></el-header>
        <el-card style="max-width: 360px; text-align: center;">
            <template #header>
                <div class="card-header">
                    <span>玩家登录</span>
                </div>
            </template>
            <el-form ref="ruleFormRef" style="max-width: 300px" :model="ruleForm" status-icon :rules="rules"
                label-width="auto" class="demo-ruleForm">
                <el-form-item label="用户名" prop="name">
                    <el-input v-model.number="ruleForm.username" />
                </el-form-item>

                <el-form-item label="密码" prop="pass">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
                </el-form-item>


                <el-form-item>
                    <el-button type="primary" @click="submitForm(ruleFormRef)" style="position: relative; left: 10px;">
                        Submit
                    </el-button>
                    <el-button type="primary" @click="toRegister()" style="position: relative; left: 80px;">
                        Register
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-container>




</template>

<script lang="ts" setup>

import { reactive, ref } from 'vue'
import { useStore } from 'vuex';
import type { FormInstance, FormRules } from 'element-plus'
import route from '@/router/index';
import { post } from '@/ts/request';
const ruleFormRef = ref<FormInstance>()
const store = useStore();

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password'))
    } else {

        callback()
    }
}

const ruleForm = reactive({
    password: '',
    username: '',
})

const rules = reactive<FormRules<typeof ruleForm>>({
    password: [{ validator: validatePass, trigger: 'blur' }],
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
        let response = await post('/login','' ,ruleForm)
        store.commit('setToken', response.data)
        route.push({ name: 'main' })
        if (valid) {
            console.log('submit!')
        } else {
            console.log('error submit!')
        }
    })
}

function toRegister(){
    route.push({ name: 'register' })
}


</script>

<style></style>