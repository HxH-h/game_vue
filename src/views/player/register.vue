<template>
    <el-container style="align-items: center;
                      justify-content: center;
                      ">
        <el-header style="height: 20vh;"></el-header>
        <el-card style="max-width: 360px; text-align: center;">
            <template #header>
                <div class="card-header">
                    <span>注册</span>
                </div>
            </template>
            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" status-icon :rules="rules"
                label-width="auto" class="demo-ruleForm">
                <el-form-item label="username" prop="username">
                    <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Email" prop="email">
                    <el-input v-model="ruleForm.email" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Confirm" prop="checkPass">
                    <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Captcha" prop="captcha">
                    <el-input v-model="ruleForm.captcha" type="text" autocomplete="off" >
                        <template #append>
                            
                            <img :src="imgBase64" @click="getCaptcha" style="width: 100%; height: 100%;" />
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="Code" prop="code">
                    <el-input v-model="ruleForm.code" type="text" autocomplete="off" >
                        <template #append>
                            <el-button @click="getCode" :disabled="ruleForm.email != '' && ruleForm.captcha != '' ? false:true">Get Code</el-button>
                        </template>
                    </el-input>
                </el-form-item>


            </el-form>
            <template #footer>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    Submit
                </el-button>
            </template>
        </el-card>
    </el-container>

</template>
<script lang="ts" setup>

import { reactive, ref , onMounted} from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import {get,post} from '../../ts/request'
import router from '@/router';

const ruleFormRef = ref<FormInstance>()
const imgBase64 = ref('')

onMounted(() => {
    getCaptcha()
})
const validateUsername = (rule: any, value: any, callback: any) => {
    // 判断username是否符合正则表达式要求
    const reg = /^[A-Za-z][A-Za-z0-9!#$%^&*]*$/

    if (value === '') {
        callback(new Error('Please input the username'))
    }else if (!reg.test(value)) {
        callback(new Error('The username is invalid'))
    }else if(value.length < 3 || value.length > 100){
        callback(new Error('The username length is invalid'))
    }else {
        callback()
    }
}
const validateEmail = (rule: any, value: any, callback: any) => {
    // 判断email是否符合正则表达式要求
    const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

    if (value === '') {
        callback(new Error('Please input the email'))
    }else if (!reg.test(value)) {
        callback(new Error('The email is invalid'))
    }else{
        callback()
    }
}
const validateCode = (rule: any, value: any, callback: any) => {

    if (value === '') {
        callback(new Error('Please input the code'))
    }else if (value.length !== 6) {
        callback(new Error('The code length is invalid'))
    }else{
        callback()
    }
}
const checkAge = (rule: any, value: any, callback: any) => {
    if (!value) {
        return callback(new Error('Please input the age'))
    }
    setTimeout(() => {
        if (!Number.isInteger(value)) {
            callback(new Error('Please input digits'))
        } else {
            if (value < 18) {
                callback(new Error('Age must be greater than 18'))
            } else {
                callback()
            }
        }
    }, 1000)
}

const validatePass = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password'))
    } else {
        if (ruleForm.checkPass !== '') {
            if (!ruleFormRef.value) return
            ruleFormRef.value.validateField('checkPass')
        }
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== ruleForm.password) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}

const ruleForm = reactive({
    username: '',
    password: '',
    checkPass: '',
    email: '',
    captcha: '',
    code: ''

})

const rules = reactive<FormRules<typeof ruleForm>>({
    username: [{validator: validateUsername, trigger: 'blur'}],
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ validator: validatePass, trigger: 'blur' }],
    checkPass: [{ validator: validatePass2, trigger: 'blur' }],
    captcha: [{ validator: validateCode, trigger: 'blur' }],
    code: [{ validator: validateCode, trigger: 'blur' }]
})

const submitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            post('/register/register','',ruleForm)
            console.log('submit!')
            router.push({ name: 'login' })
        } else {
            console.log('error submit!')
        }
    })
}

function getCode(){
    get('/register/genCode','',ruleForm.email,ruleForm.captcha)
}
async function  getCaptcha(){
    imgBase64.value =await get('/register/genCaptcha','')

}

</script>
<style></style>