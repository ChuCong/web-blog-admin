<template>
  <div class=" content">
    <div class=" content__table" style="">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content"
}
</script>

<style scoped>
.content {
  @apply pl-[30px] pb-[30px] pr-[30px] bg-white min-h-[750px];
}

.content__table {
  border-radius: 16px;
  border: 1px solid #F1F1F4;
  @apply bg-white p-8 h-full min-h-[745px];
}


@media screen and (max-width: 1279px) {
  .content {
    @apply pl-[10px] pb-[0px] pr-[10px] bg-white min-h-[750px]
  }

  .content__table {
    border-radius: 16px;
    border: 1px solid #F1F1F4;
    @apply bg-white p-[8px] h-full min-h-[750px];
  }
}
</style>
