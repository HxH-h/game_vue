<template>
  <el-container style="align-items: center;
                      justify-content: center;
                      ">
    <el-card :style="{ '--width': width + 'vw', '--height': height + 'vh' }">
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
  },
};
</script>
<style>
.el-card {
  text-align: center;
  width: var(--width);
  height: var(--height);
}
</style>
