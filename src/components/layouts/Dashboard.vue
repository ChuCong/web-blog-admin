<template>
  <div class="content">
    <div class="header">
      <div class="header__desktop">
        <Header @toggleSidebar="toggleSidebar"></Header>
      </div>
      <div class="mobile">
        <HeaderMobile></HeaderMobile>
      </div>
    </div>
    <div class="main-content">
      <div class="main-content__sidebar " id="sidebar">
        <MenuLeft ref="sidebar" />
      </div>
      <div class="main-content__content">
        <router-view></router-view>
      </div>
    </div>
    <Loading v-if="isLoading" />
  </div>
</template>
<script setup>
import MenuLeft from "@/views/theme/MenuLeft.vue"
import Header from "@/views/theme/Header.vue"
import { ref, computed } from 'vue'
import HeaderMobile from "@/views/theme/HeadMobile.vue"
import Loading from "@/components/elements/Loading.vue"
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const isLoading = computed(() => {
  return loading.isLoading
})

// const store = useStore();
// store.dispatch(ADMIN_DETAIL)

const sidebar = ref(null)
const toggleSidebar = () => {
  var element = document.getElementById("sidebar");
  element.classList.toggle("main-content__sidebar_sm");
  sidebar.value.openMenu()
}

</script>
<style lang="scss" scoped>
$height_header : 5rem;

.content {
  @apply bg-[#F1F1F4];
}

.header {
  height: $height_header;
}

.main-content {
  // height: calc(100vh - $height_header);
  @apply flex;

  &__sidebar {
    transition: width 500ms;
    @apply h-full 2xl:w-[15%] w-[22%] p-5;
  }

  &__sidebar_sm {
    @apply h-full w-16 p-3;
  }

  &__content {
    @apply rounded-tl-xl 2xl:w-[85%] w-[78%] h-full bg-white pr-5;
  }
}

@media only screen and (max-width: 1279px) {
  .main-content__sidebar {
    display: none;
  }

  .main-content__content {
    @apply pr-0;
  }

  .header__desktop {
    display: none;
  }
}

@media only screen and (min-width: 1280px) {
  .mobile {
    display: none;
  }
}
</style>