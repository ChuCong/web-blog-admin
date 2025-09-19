<template>
  <div class="flex">
    <div class="banner">
    </div>
    <div class="login-content ">
      <router-link to="/log_in">
        <div class="flex justify-center">
          <img width="30%" src="@/assets/logo-login.png">
        </div>
      </router-link>
      <!-- <div>
        <p class="text-des">Nền tảng Thi trắc nghiệm, Trộn và Tạo đề thi miễn <br> phí nhiều người sử dụng nhất</p>
      </div> -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Content"
}
</script>

<style lang="scss" scoped>
.input-email {
  border-radius: 8px;
  border: 1px solid #C4C4C4;
}

.login-content {
  @apply flex flex-col items-center m-auto mt-[11%];

  .text-des {
    @apply text-[16px] mt-5 text-[#A1A1A1] text-center;
  }

}

.banner {
  background-image: url(@/assets/banner_login.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100vh;
  width: 58%;

}

@media screen and (max-width: 1278px) {
  .banner {
    display: none;
  }

  .login-content {
    @apply mt-[65px]
  }
}
</style>