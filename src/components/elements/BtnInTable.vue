<template>
  <div class="cursor-pointer">
    <img :src="icon?icon:''" :width="width" />
  </div>
</template>
<script lang="ts" setup>
import {defineProps} from "vue";

// eslint-disable-next-line
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 0,
  },
  width: {
    type: Number,
    default: 0
  }
})
</script>