<template>
  <ContentLogin>
    <div class=" w-[42%] mt-[5%]">
      <div class=" login">
        <div class="text-login">
          ĐĂNG NHẬP
        </div>
        <div class="">
          <VeeForm @submit="login" class="justify-center">
            <Field name="name" rules="required" v-slot="{ field }">
              <div class="flex input-email ">
                <div class="icon-input">
                  <img class="m-auto mt-[12px]" width="20" src="@/assets/images/icon/mail-icon.svg" />
                </div>
                <div class=" w-[6px] h-[30px] mt-1 mb-1" style="background-color:#D9D9D9;"></div>
                <div class="text-input">
                  <input class="input" v-model="email" placeholder="Nhập tên tài khoản" type="text" v-bind="field" />
                </div>
              </div>
              <div class="error">
                <ErrorMessage name="name" />
              </div>
            </Field>
            <Field name="password" rules="required|min:6" v-slot="{ field }">
              <div class="flex mt-5 input-email">
                <div class="icon-input">
                  <img class="m-auto mt-[10px]" width="24" src="@/assets/images/icon/lock-icon.svg" />
                </div>
                <div class=" w-[6px] h-[30px] mt-1 mb-1" style="background-color:#D9D9D9;"></div>
                <div class="text-input">
                  <input class="input" v-model="password" placeholder="Nhập password" v-bind="field"
                    :type="type ? 'text' : 'password'" name="password" />
                  <i class="icon-outline" @click="show">
                    <img v-if="type" class="m-auto mt-[10px]" width="20" src="@/assets/images/icon/view.png" />
                    <img v-else class="m-auto mt-[10px]" width="20" src="@/assets/images/icon/eye-hidden.png" />
                  </i>
                </div>
              </div>
              <div class="error">
                <ErrorMessage name="password" />
              </div>
            </Field>
            <div class="text-forgot-password " @click="forgotPassword">
              Quên mật khẩu.
            </div>
            <button class="btn-login" type="submit"> Đăng nhập</button>
          </VeeForm>
        </div>
      </div>
    </div>
  </ContentLogin>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import { messageError, messageSuccess } from "@/common/message.service";
import ContentLogin from "@/views/theme/ContentLogin.vue"
import { useAuthStore } from '@/stores/auth';

import { defineRule } from 'vee-validate';
import { required, min } from '@vee-validate/rules';

defineRule('required', required);
defineRule('min', min);

const email = ref("");
const password = ref("");
const type = ref(false);
const router = useRouter();
const auth = useAuthStore();

const login = () => {
  const payload = {
    user_name: email.value,
    password: password.value,
  };

  auth
    .login(payload)
    .then((data) => {
      if (data && data.status == 1) {
        messageSuccess(data.message);
        router.push("/");
      } else {
        messageError(data.message);
      }
    });
};

const show = () => {
  type.value = !type.value;
};

const forgotPassword = () => {
  router.push("/forgot-password");
};
</script>
<style lang="scss" scoped>
.input-email {
  border-radius: 8px;
  border: 1px solid #C4C4C4;
}

.login {
  @apply flex flex-col items-center m-auto;

  .text-des {
    @apply text-[16px] mt-5 text-[#A1A1A1] text-center;
  }

  .text-login {
    @apply text-[#585858] text-[24px] font-bold text-center mb-[20px];
  }
}

.icon-input {
  @apply border-solid w-[56px] rounded-lg z-10;
}

.text-input {
  @apply -ml-[5px] z-0;

  .input {
    background-color: white;
    @apply w-[300px] pl-[20px] pr-[40px] h-[40px] rounded-tr-lg rounded-br-lg focus:outline-none;
  }

  .icon-outline {
    @apply absolute -ml-[35px] cursor-pointer;
  }
}

.text-forgot-password {

  @apply text-[16px] text-[#4D4E50] underline underline-offset-1 my-6 cursor-pointer font-bold;
}

.btn-login {
  @apply w-[365px] h-[40px] rounded-md bg-[#4097A3] text-white;
}

.message {
  @apply absolute text-right w-[290px] text-red-200 text-[14px];
}
</style>
