<template >
  <el-container style="align-items: center;
                      justify-content: center;
                      ">
    <el-card style="width: 70vw; height: 90vh; 
    background: url('https://game-platform-hxh.oss-cn-beijing.aliyuncs.com/backgroundimg/PKbackground.jpg');
    background-size:100% 100%;  ">
      <template #header><slot name="head"></slot></template>
      <slot name="body"></slot>
    </el-card>
  </el-container>
</template>
<style>
.el-card{
  text-align: center;
}


</style>
