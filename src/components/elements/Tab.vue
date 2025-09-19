<template>
  <div>
    <div class="tab">
      <div v-for="(item, index) in itemTab" :key="index">
        <div class="tab-item" @click="activeTab(index)">
          <div class="item__text" :class="{ active: currentTab === index }">
            {{ item }}
          </div>
        </div>
      </div>
    </div>
    <div class="h-[200px]">{{ data }}</div>
  </div>
</template>

<script>
export default {
  props: {
    itemTab: Array
  },
  data() {
    return {
      data: 0,
      currentTab: 0,
    }
  },
  methods: {
    activeTab(index) {
      this.currentTab = index
      return this.data = index
    }
  }
}
</script>

<style scoped lang="scss">
.tab {
  @apply flex flex-wrap font-medium text-center text-white border-b;

  .tab-item {
    @apply mr-px cursor-pointer;

    .item__text {
      @apply inline-block p-4 rounded-t-3xl bg-[#9D9D9D];
    }

    .active {
      @apply bg-[#2D6097]
    }
  }
}
</style>