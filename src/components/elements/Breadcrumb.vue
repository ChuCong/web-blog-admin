<template>
  <div class="breadcrumb">
    <div v-for="(item, index) in breadcrumb" :key="index">
      <span @click="link(item.link)" class="cursor-pointer"
        :class="index < breadcrumb.length - 1 ? 'text-[#9D9D9D] ' : 'text-[#9D9D9D]'"><span
          v-html="item.name"></span></span>
      <span class="icon-more" v-if="index < breadcrumb.length - 1"> >></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { defineProps } from "vue";
// eslint-disable-next-line
const props = defineProps({
  breadcrumb: Array<{ link: string, name: string }>
})
const router = useRouter();
const link = (item) => {
  if (item) {
    router.push(item)
  }
}
</script>

<style scoped lang="scss">
.breadcrumb {
  @apply bg-white flex text-[14px] items-center h-[30px];
  font-weight: 300;

  .icon-more {
    @apply text-[#9D9D9D] text-[13px] px-3;
  }
}
</style>