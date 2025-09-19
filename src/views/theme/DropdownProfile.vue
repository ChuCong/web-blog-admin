<template>
  <div class="bg-white content-dropdown ">
    <div class="flex justify-around p-4">
      <div class="  w-[29%]">
        <img class="cursor-pointer w-[50px]" src="@/assets/images/avatar.png" />
      </div>
      <div class=" w-[69%] text-user-name ">
        <!-- <span class=" ">{{ detailUser ? detailUser.user_name : '' }}</span>
        <div class="text-email">
          <span>{{ detailUser ? detailUser.email : '' }}</span>
        </div> -->
      </div>
    </div>
    <hr class="border-gray-103">
    <div class=" flex justify-between px-4 pt-4">
      <div class=" cursor-pointer" @click="resetPassword">
        <span class="text-logout ">Đổi mật khẩu</span>
      </div>
      <!-- <div class=" w-[25px]" @click="logout">
        <button><img src="@/assets/images/icon/logout.png" /></button>
      </div> -->
    </div>
    <div class=" flex justify-between p-4">
      <div class="" @click="logout">
        <span class="text-logout cursor-pointer">Đăng xuất</span>
      </div>
      <div class=" w-[25px]" @click="logout">
        <button><img src="@/assets/images/icon/logout.png" /></button>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line no-undef
import { computed, onMounted, ref } from "vue";
import JwtService from "@/common/jwt.service";
import { useAdminStore } from "@/stores/admin";

const adminStore = useAdminStore();
const showChangePassword = ref(false);
// import { getItemHeader } from "@/common/local-data.service";
// import { LOGOUT } from "@/store/login";
// import { ADMIN_DETAIL } from "@/store/auth";

// const store = useStore();
let name_page = ref('Quản lý đề thi')
onMounted(() => {
  // let name = getItemHeader()
  // if (name) {
  //   name_page.value = name.name_page
  // }
  // store.dispatch(ADMIN_DETAIL)

})

// const detailUser = computed(() => {
//   return store.getters.admin;
// })
const dataPassword = {
  confirm_password: '',
  newPassword: ''
};
const logout = () => {
  JwtService.destroyToken();
  JwtService.destroyUser();
  location.href = '/'
}
const resetPassword = () => {
  location.href = `/change-password`;
}

</script>
<style scoped lang="scss">
.content-dropdown {
  border-radius: 0.75rem;
}

.text-user-name {
  word-wrap: break-word;
  font-weight: 600;
  @apply text-[16px] text-[#585858];
}

.text-email {
  word-wrap: break-word;
  font-weight: 400;
  @apply text-[#A1A1A1] text-[12px];
}

.text-logout {
  font-weight: 400;
  @apply text-[15px] text-[#585858];
}
</style>
