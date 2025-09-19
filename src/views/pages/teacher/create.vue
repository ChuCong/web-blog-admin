<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="w-full mb-10 ">
            <nav class="flex space-x-4 text-center ">
                <button class="py-2 px-4 font-bold " :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-1',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-1'
                }" @click="changeTab('tab-1')">
                    Giảng viên
                </button>

                <button class="py-2 px-4 font-bold" :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-2',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-2'
                }" @click="changeTab('tab-2')">
                    Tài khoản đăng nhập
                </button>
            </nav>
        </div>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div v-if="activeTab === 'tab-1'">
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Tên Giảng viên</label>
                    <InputTextOutline placeholder="Nhập tên Giảng viên" type="text" width="100" height="44"
                        :value="teacher.full_name" @input="(value) => teacher.full_name = value" />
                </div>
                <div class="mb-4 ">
                    <label class="block font-semibold mb-1">Tải File tài nguyên</label>
                    <div class="flex gap-10 mt-3">
                        <div class="upload-container flex gap-3 h-fit">
                            <label class="upload-box">
                                <input type="file" @change="onChangeFileUpload"
                                    accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                                <div class="w-fit mx-auto pb-[15px]">
                                    <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                                </div>
                                <span>Click để upload file</span>
                                <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG,..</div>
                            </label>
                        </div>
                        <div v-if="teacher.avatar_url">
                            <img :src="teacher.avatar_url" alt="preview" width="200" />
                            <p class="text-red-500  mt-1">{{ imageError }}</p>
                        </div>
                    </div>
                </div>
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Email</label>
                    <InputTextOutline placeholder="Nhập Email" type="text" width="100" height="44"
                        :value="teacher.email" @input="(value) => teacher.email = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Số điện thoại</label>
                    <InputTextOutline placeholder="Nhập Số điện thoại" type="text" width="100" height="44"
                        :value="teacher.phone_number" @input="(value) => teacher.phone_number = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Tuổi</label>
                    <InputTextOutline placeholder="Nhập Tuổi" type="number" width="100" height="44" :value="teacher.age"
                        @input="(value) => teacher.age = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Vị trí</label>
                    <InputTextOutline placeholder="Nhập Vị trí" type="text" width="100" height="44"
                        :value="teacher.position" @input="(value) => teacher.position = value" />
                </div>

                <div class="mb-4">
                    <label class="bloc font-semibold text-gray-700 mb-2">Tổ chức</label>
                    <InputTextOutline placeholder="Nhập Tổ chức" type="text" width="100" height="44"
                        :value="teacher.organization" @input="(value) => teacher.organization = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Tiểu sử</label>
                    <InputQuillEditor theme="snow" placeholder="Nhập Tiểu sử" v-model="teacher.biography" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Lĩnh vực chuyên môn</label>
                    <InputTextOutline placeholder="Nhập Lĩnh vực chuyên môn" type="text" width="100" height="44"
                        :value="teacher.area_of_expertise" @input="(value) => teacher.area_of_expertise = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Kỹ năng</label>
                    <InputTextOutline placeholder="Nhập Kỹ năng" type="text" width="100" height="44"
                        :value="teacher.skills" @input="(value) => teacher.skills = value" />
                </div>
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">LinkedIn</label>
                    <InputTextOutline placeholder="Nhập LinkedIn" type="text" width="100" height="44"
                        :value="teacher.linkedin_link" @input="(value) => teacher.linkedin_link = value" />
                </div>
                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Facebook</label>
                    <InputTextOutline placeholder="Nhập Facebook" type="text" width="100" height="44"
                        :value="teacher.fb_link" @input="(value) => teacher.fb_link = value" />
                </div>

                <div class="mb-4">
                    <label class="block font-semibold text-gray-700 mb-2">Trạng thái</label>
                    <InputTextOutline placeholder="Chọn Trạng thái" type="select" height="44" :value="teacher.status"
                        @input="(value) => teacher.status = value" :items="statuses" item-text="name" item-value="value"
                        class="w-full" width="100" />
                </div>
            </div>
            <div v-else-if="activeTab === 'tab-2'">
                <div class="grid grid-cols-2 gap-4">
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Tên</label>
                        <Field name="name" type="text" v-slot="{ field }">
                            <InputTextOutline placeholder="Nhập tên" type="text" width="100" height="44"
                                :value="adminTeacher.name" @input="(value) => adminTeacher.name = value" />
                        </Field>
                        <ErrorMessage name="name" class="text-red-500  mt-1" />
                    </div>
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Tên đăng nhập</label>
                        <InputTextOutline placeholder="Nhập tên đăng nhập" type="text" width="100" height="44"
                            :value="adminTeacher.user_name" @input="(value) => adminTeacher.user_name = value" />
                    </div>
                </div>
                <div v-if="!route.params.id" class="grid grid-cols-2 gap-4 mt-3">
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Email</label>
                        <InputTextOutline placeholder="Nhập email" type="text" width="100" height="44"
                            :value="adminTeacher.email" @input="(value) => adminTeacher.email = value" />
                    </div>
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Mật khẩu</label>
                        <InputTextOutline placeholder="Nhập mật khẩu" type="text" width="100" height="44"
                            :value="adminTeacher.password" @input="(value) => adminTeacher.password = value" />
                    </div>
                </div>
                <div v-if="route.params.id" class="mt-3">
                    <div class="mb-4">
                        <label class="block font-semibold text-gray-700 mb-2">Email</label>
                        <InputTextOutline placeholder="Nhập email" type="text" width="100" height="44"
                            :value="adminTeacher.email" @input="(value) => adminTeacher.email = value" />
                    </div>
                    <div class="block font-semibold text-gray-700 my-5">Đổi mật khẩu mới</div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="mb-4">
                            <label class="block font-semibold text-gray-700 mb-2">Mật khẩu mới</label>
                            <InputTextOutline placeholder="Nhập mật khẩu mới" type="create_password" width="100"
                                height="44" :value="adminTeacher.password"
                                @input="(value) => adminTeacher.password = value" />
                        </div>
                        <div class="mb-4">
                            <label class="block font-semibold text-gray-700 mb-2">Xác nhận lại mật khẩu</label>
                            <InputTextOutline placeholder="Nhập mật khẩu" type="create_password" width="100" height="44"
                                :value="adminTeacher.confirm_password"
                                @input="(value) => adminTeacher.confirm_password = value" />
                        </div>
                    </div>
                </div>
                <div>
                    <div class="input_data_adminTeacher mt-3">
                        <p class="input__text">Vai trò</p>
                        <InputTextOutline type="select" label="Chọn vai trò" class="mb-8 mt-3" width="100"
                            :value="adminTeacher.roles" :multiple="true" @input="(value) => adminTeacher.roles = value"
                            :items="roleStore.roles" item-text="name" item-value="id" />
                    </div>
                </div>
            </div>

            <div class="text-center">
                <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
            </div>
        </Form>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useTeacherStore } from '@/stores/teacher';
import { messageError, messageSuccess } from "@/common/message.service";
import { useRoleStore } from '@/stores/role';
import { useAdminStore } from '@/stores/admin';
import { email } from "@vee-validate/rules";
import { useLoadingStore } from '@/stores/loading';
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";

const loading = useLoadingStore();
const roleStore = useRoleStore();
const adminStore = useAdminStore();
const breadcrumb = [
    { name: "Danh sách Giảng viên", link: '/teacher/list' },
    { name: "Tạo Giảng viên", link: '/teacher/create' },
]

const router = useRouter();
const route = useRoute();
const store = useTeacherStore();
const payload = ref({
    page: 1,
    limit: 1000,
});
const teacher = ref<any>({});
const imageError = ref('');
const adminTeacher = reactive({
    id: '',
    name: teacher.value.name ?? '',
    user_name: '',
    email: teacher.value.email ?? '',
    password: '',
    confirm_password: '',
    is_super_admin: 0,
    is_main: 1,
    roles: [],
});
const statuses = [
    { name: 'Active', value: 1 },
    { name: 'Block', value: 0 }
]

onMounted(async () => {
    if (route.params.id) {
        await store.getTeacherDetail(Number(route.params.id));
        teacher.value = { ...store.teacherDetail };
        const adminData = store.teacherDetail.admin || {};
        Object.assign(adminTeacher, adminData);
        adminTeacher.roles = store.teacherDetail.admin.roles.map(role => role.id);
    }
    await roleStore.fetchRole(payload.value);
});

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    console.log(file)
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadImage(formData);
    console.log('url', url);
    if (url) {
        teacher.value.avatar_url = url;
        imageError.value = '';
    } else {
        imageError.value = 'File chưa đúng định dạng';
    }
};
const onSubmit = async () => {
    loading.setLoading(true);
    try {
        // Validate
        if (!teacher.value.full_name) {
           return messageError('Bạn chưa nhập Tên giảng viên')
        }
        if (!teacher.value.email) {
           return messageError('Bạn chưa nhập Email')
        }
        if (!teacher.value.position) {
           return messageError('Bạn chưa nhập Vị trí')
        }
        if (!teacher.value.organization) {
           return messageError('Bạn chưa nhập Tổ chức')
        }
        if (!teacher.value.biography) {
           return messageError('Bạn chưa nhập Tiểu sử')
        }
        if (!teacher.value.area_of_expertise) {
           return messageError('Bạn chưa nhập Lĩnh vực chuyên môn')
        }
        if (!teacher.value.skills) {
           return messageError('Bạn chưa nhập Kỹ năng')
        }
        if (!adminTeacher.user_name) {
            return messageError('Bạn chưa nhập tên đăng nhập');
        }
        if (!adminTeacher.password && !adminTeacher.id) {
            return messageError('Bạn chưa nhập mật khẩu');
        }
        // Save admin
        const adminSuccess = await adminStore.saveAdmin(adminTeacher);
        if (!adminSuccess?.data) {
            return messageError('Không thể tạo tài khoản đăng nhập');
        }
        messageSuccess(adminTeacher.id ? 'Cập nhật tài khoản thành công' : 'Tạo tài khoản đăng nhập thành công');
        teacher.value.admin_id = adminSuccess.data.id;
        // Gửi email khi tạo mới admin
        if (!adminTeacher.id) {
            await adminStore.sendEmail({
                email: adminTeacher.email,
                user_name: adminTeacher.user_name,
                password: adminTeacher.password,
            });
        }
        // Save teacher

        const success = await store.saveTeacher(teacher.value);
        if (success) {
            messageSuccess('Lưu thành công');
            router.push('/teacher/list');
        }
    } catch (error) {
        console.error(error);
        messageError('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
        loading.setLoading(false);
    }
};


const activeTab = ref('tab-1');
function changeTab(tabId) {
    if (tabId === 'tab-2') {
        adminTeacher.name = teacher.value.full_name;
        adminTeacher.email = teacher.value.email;
    }
    activeTab.value = tabId;
    handleTabChange(tabId);
}

function handleTabChange(tabId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.replace({
        query: {
            ...route.query,
            viewType: tabId.replace('tab-', '')
        }
    });
}
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
