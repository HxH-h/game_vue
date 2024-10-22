<template>
  <el-container style="align-items: center;
                      justify-content: center;
                      ">
    <el-card :style="{ '--width': width + 'vw', 
    '--height': height + 'vh',
    '--background': 'url(' + background + ')' }">
      <template #header >
        <slot name="head"></slot>
      </template>
      <slot name="body"></slot>
    </el-card>
  </el-container>
</template>
<script>
export default {
  props: {
    width: {
      type: Number,
      default: 80,
    },
    height: {
      type: Number,
      default: 80,
    },
    background: {
      type: String
    }
  },
};
</script>
<style>
.el-card {
  text-align: center;
  width: var(--width);
  height: var(--height);
  background: var(--background);
  background-size: 100% 100%;
}
</style>
