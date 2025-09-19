<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="grid grid-cols-2 gap-4">
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Tên</label>
                    <Field name="name" type="text" v-slot="{ field }">
                        <InputTextOutline placeholder="Nhập tên" type="text" width="100" height="44" :value="admin.name"
                            @input="(value) => admin.name = value" />
                    </Field>
                    <ErrorMessage name="name" class="text-red-500  mt-1" />
                </div>
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                    <InputTextOutline placeholder="Nhập tên đăng nhập" type="text" width="100" height="44"
                        :value="admin.user_name" @input="(value) => admin.user_name = value" />
                </div>
            </div>
            <div v-if="!route.params.id" class="grid grid-cols-2 gap-4 mt-3">
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Email</label>
                    <InputTextOutline placeholder="Nhập email" type="text" width="100" height="44" :value="admin.email"
                        @input="(value) => admin.email = value" />
                </div>
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Mật khẩu</label>
                    <InputTextOutline placeholder="Nhập mật khẩu" type="text" width="100" height="44"
                        :value="admin.password" @input="(value) => admin.password = value" />
                </div>
            </div>
            <div v-if="route.params.id" class="mt-3">
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Email</label>
                    <InputTextOutline placeholder="Nhập email" type="text" width="100" height="44" :value="admin.email"
                        @input="(value) => admin.email = value" />
                </div>
                <div class="block font-semibold text-gray-700 my-5">Đổi mật khẩu mới</div>
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                        <InputTextOutline placeholder="Nhập mật khẩu mới" type="create_password" width="100" height="44"
                            :value="admin.password" @input="(value) => admin.password = value" />
                    </div>
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Xác nhận lại mật khẩu</label>
                        <InputTextOutline placeholder="Nhập mật khẩu" type="create_password" width="100" height="44"
                            :value="admin.confirm_password" @input="(value) => admin.confirm_password = value" />
                    </div>
                </div>
            </div>
            <div>
                <div class="input_data_admin mt-3">
                    <p class="input__text">Vai trò</p>
                    <InputTextOutline type="select" label="Chọn vai trò" class="mb-8 mt-3" width="100"
                        :value="admin.roles" :multiple="true"
                        @input="(value) => admin.roles = value" :items="roleStore.roles" item-text="name"
                        item-value="id" />
                </div>
            </div>
            <div class="text-center mt-3">
                <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
            </div>
        </Form>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import BtnBase from "@/components/elements/BtnBase.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { messageSuccess, messageError } from "@/common/message.service";
// import * as yup from 'yup';
import { useAdminStore } from '@/stores/admin';
import { useRoleStore } from '@/stores/role';
const breadcrumb = [
    { name: "Danh sách Admin", link: '/admin/list' },
]
const payload = ref({
    page: 1,
    limit: 1000,
});
const router = useRouter();
const route = useRoute();
const roleStore = useRoleStore();
const store = useAdminStore();
const admin = reactive({
    id: '',
    name: '',
    user_name: '',
    email: '',
    password: '',
    confirm_password: '',
    is_super_admin: 0,
    is_main: 1,
    roles: [],
});

if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật Admin", link: '/admin/create' });
} else {
    breadcrumb.push({ name: "Tạo Admin", link: '/admin/create' });
}
onMounted(async () => {
    if (route.params.id) {
        await store.getAdminDetail(Number(route.params.id));
        Object.assign(admin, store.adminDetail);
        admin.roles = store.adminDetail.roles.map(role => role.id);
    }
    await roleStore.fetchRole(payload.value);
});

const onSubmit = async () => {
    if (!admin.name) {
        messageError('Bạn chưa nhập tên');
        return;
    }
    if (!admin.user_name) {
        messageError('Bạn chưa nhập tên đăng nhập');
        return;
    }
    if (!admin.email) {
        messageError('Bạn chưa nhập email');
        return;
    }
    if (!route.params.id && !admin.password) {
        messageError('Bạn chưa nhập mật khẩu');
        return;
    }
    if (route.params.id && admin.password !== admin.confirm_password) {
        messageError('Xác nhận mật khẩu không khớp');
        return;
    }
    const success = await store.saveAdmin(admin);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/admin/list');
    }
};
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
