<template>
  <div id="APP">
    <el-row >
    <el-col :span="1"><div class="grid-content ep-bg-purple" >
      
    </div></el-col>
    <el-col :span="22"><div class="grid-content ep-bg-purple-light">
      <router-view> </router-view>
    </div></el-col>
    <el-col :span="1"><div class="grid-content ep-bg-purple" >
    </div></el-col>
    </el-row>
    
   
  </div>
</template>

<style>
body{
  margin: 0px;
  background-size:100% 100%;
}
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
