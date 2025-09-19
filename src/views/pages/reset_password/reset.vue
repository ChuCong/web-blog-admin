<template>

    <SubHeader :breadcrumb="breadcrumb" class="mb-4">
    </SubHeader>
    <Content>
        <div class="base_dialog ">
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                <InputTextOutline placeholder="Nhập mật khẩu mới" type="create_password" width="100" height="44"
                    :value="dataPassword.new_password" @input="(value) => dataPassword.new_password = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Xác nhận lại mật khẩu</label>
                <InputTextOutline placeholder="Nhập mật khẩu" type="create_password" width="100" height="44"
                    :value="dataPassword.confirm_password" @input="(value) => dataPassword.confirm_password = value" />
            </div>

            <div class="flex py-3 justify-center">
                <BtnBase text="Hủy" color="#4D4E50" :width="150" class="mr-8" @click="showChangePassword = false"
                    bg_color="#F9F9F9" />
                <BtnBase text="Lưu" color="#FFF" :width="170" @click="updatePassword" bg_color="#F27619" />
            </div>
        </div>
    </Content>
</template>
<script setup lang="ts">
import { computed, onMounted, ref,reactive, watch } from "vue";
import { useAdminStore } from "@/stores/admin";
import { messageSuccess, messageError } from "@/common/message.service";
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import JwtService from "@/common/jwt.service";
import SubHeader from "@/views/theme/SubHeader.vue"
import BtnBase from "@/components/elements/BtnBase.vue"
import Content from "@/views/theme/Content.vue"

const adminStore = useAdminStore();
const showChangePassword = ref(false);
const breadcrumb = [
    { name: "Trang chủ", link: '/' },
    { name: "Đổi mật khẩu", link: '/change-password' },
]

const dataPassword =  reactive({
    id: adminStore.roleAdminAuth?.id ?? '',
    confirm_password: '',
    new_password: ''
});
watch(() => adminStore.roleAdminAuth?.id, (newId) => {
  if (newId) dataPassword.id = newId
}, { immediate: true })
const updatePassword = async () => {
    if (!dataPassword.new_password) {
        messageError('Bạn chưa nhập mật khẩu');
        return;
    }
    if (dataPassword.new_password !== dataPassword.confirm_password) {
        messageError('Xác nhận mật khẩu không khớp');
        return;
    }
    const success = await adminStore.changePassword(dataPassword);
    if (success) {
        messageSuccess('Lưu thành công');
        JwtService.destroyToken();
        JwtService.destroyUser();
        window.location.href = '/login';
    }
}
</script>
<style scoped lang="scss">
</style>
