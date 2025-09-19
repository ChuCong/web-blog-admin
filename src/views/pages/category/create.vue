<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-4">
                <label class="block font-semibold mb-1">Kích hoạt</label>
                <Switch v-model="category.active" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Tên Chương trình học</label>
                <!-- <Field name="title" type="text" v-slot="{ field }"> -->
                <InputTextOutline placeholder="Nhập tên Chương trình học" type="text" width="100" height="44"
                    :value="category.title" @input="(value) => category.title = value" />
                <!-- </Field> -->
                <!-- <ErrorMessage name="title" class="text-red-500  mt-1" /> -->
            </div>

            <!-- <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Upload ảnh bìa</label>
                <input type="file" accept="image/png, image/jpeg, image/bmp, image/webp" class="mt-1 block w-full"
                    @change="onChangeFileUpload" />
                <div v-if="category.full_url" class="mt-2">
                    <img :src="category.full_url" alt="preview" width="200" />
                </div>
                <p class="text-red-500  mt-1">{{ imageError }}</p>
            </div> -->
            <div class="mb-4">
                <label class="block font-semibold mb-2">Upload ảnh bìa</label>
                <div class="flex gap-10">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="onChangeFileUpload" accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG</div>
                        </label>
                    </div>
                    <div v-if="category.full_url" >
                        <img :src="category.full_url" alt="preview" width="300" />
                    </div>
                </div>
                <p class="text-red-500 mt-1">{{ imageError }}</p>
            </div>

            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Mô tả</label>
                <InputQuillEditor :placeholder="'Nhập mô tả Chương trình học'" v-model="category.description" />
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
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { messageError, messageSuccess } from "@/common/message.service";
import Switch from "@/components/elements/Switch.vue";
// import * as yup from 'yup';
import { useCategoryStore } from '@/stores/category';

const breadcrumb = [
    { name: "Danh sách Chương trình học", link: '/category/list' },
    { name: "Tạo Chương trình học", link: '/category/create' },
]

const router = useRouter();
const route = useRoute();
const store = useCategoryStore();

const category = ref<any>({});
const imageError = ref('');
const save = 'Lưu';
// const schema = yup.object({ title: yup.string().required('Bạn chưa nhập tiêu đề') });

onMounted(async () => {
    if (route.params.id) {
        await store.getCategoryDetail(Number(route.params.id));
        category.value = store.categoryDetail;
        console.log(category.value)
    }
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
        category.value.url = url;
        category.value.full_url = url;
        imageError.value = '';
    } else {
        imageError.value = 'File chưa đúng định dạng';
    }
};

const onSubmit = async () => {
    if (!category.value.description) {
        messageError('Bạn chưa nhập mô tả');
        return;
    }
    if (!category.value.url) {
        messageError('Bạn chưa chọn ảnh bìa');
        return;
    }
    const success = await store.saveCategory(category.value);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/category/list');
    }
};
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
