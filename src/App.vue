<template>
  <router-view />
</template>

<style>

</style>
<script lang="ts" setup>
import { onMounted } from "vue"

onMounted(() => {
  const debounce = (callback: (...args: any[]) => void, delay: number) => {
    let tid: any;
    return function (...args: any[]) {
      const ctx = self;
      tid && clearTimeout(tid);
      tid = setTimeout(() => {
        callback.apply(ctx, args);
      }, delay);
    };
  };

  const _ = (window as any).ResizeObserver;
  (window as any).ResizeObserver = class ResizeObserver extends _ {
    constructor(callback: (...args: any[]) => void) {
      callback = debounce(callback, 20);
      super(callback);
    }
  }
})

</script>