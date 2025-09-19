<template>
  <div class="sub-header">
    <div class="block-header">
      <div>
        <div class="header__text" v-if="currentPageName">{{ t(currentPageName) }}</div>
        <div class="header__text" v-else>{{ name_page }}</div>
        <div class="breadcrumb">
          <Breadcrumb :breadcrumb="breadcrumb" />
        </div>
      </div>
      <div class="header__action">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from "@/components/elements/Breadcrumb.vue";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// eslint-disable-next-line no-undef
const props = defineProps({
  breadcrumb: Array
})
// const currentPageName = computed(() => store.getters['getCurrentPageName']);
</script>

<style scoped lang="scss">
.sub-header {
  border-radius: 16px 16px 0 0;
  @apply bg-white pt-[30px] pl-[30px] pr-[30px] h-[70px];

}

.header__text {
  @apply text-[#504d4d] text-[18px];
  // font-weight: 500;
}

@media only screen and (max-width: 1278px) {
  .sub-header {
    @apply bg-white pt-[20px] pl-[10px] pr-[10px] h-[70px];
  }
}

@media screen and (min-width: 1279px) {
  .block-header {
    @apply flex justify-between;
  }
}
</style>