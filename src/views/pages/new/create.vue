<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Tiêu đề tin tức</label>
                <Field name="title" type="text" v-slot="{ field }">
                    <InputTextOutline placeholder="Nhập tên tài nguyên" type="text" width="100" height="44"
                        :value="news.title" @input="(value) => news.title = value" />
                </Field>
                <ErrorMessage name="title" class="text-red-500  mt-1" />
            </div>
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Link tin tức</label>
                <InputTextOutline placeholder="Nhập đường dẫn" type="text" width="100" height="44" :value="news.link"
                    @input="(value) => news.link = value" />
            </div>
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Mô tả ngắn</label>
                <InputTextOutline placeholder="Nhập đường dẫn" type="textarea" width="100" height="44"
                    :value="news.description" @input="(value) => news.description = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Chọn ngôn ngữ</label>
                <InputTextOutline placeholder="Chọn ngôn ngữ" type="select" width="100" height="44" :value="news.lang"
                    @input="(value) => news.lang = value" :items="LANGUAGE" item-text="title" item-value="key" />
            </div>
            <div class="mb-10 ">
                <label class="block font-semibold mb-1">Tải File tài nguyên </label>
                <span>(Kích thước 436px x 360px)</span>
                <div class="flex gap-10 mt-3">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="uploadImage('image', $event)" accept="image/png, image/jpeg, image/bmp, image/webp"
                                class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG,..</div>
                        </label>
                    </div>

                    <img v-if="urlFile" :src="urlFile" class="max-h-40" />
                    <img v-else :src="news.media?.src_url" class="max-h-40" />
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
import BtnBase from "@/components/elements/BtnBase.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { messageSuccess, messageError } from "@/common/message.service";
import { useNewsStore } from '@/stores/new';
import { LANGUAGE } from "@/config/constant"
const breadcrumb = [
    { name: "Danh sách tin tức", link: '/new/list' },
]

const router = useRouter();
const route = useRoute();
const store = useNewsStore();
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật tin tức", link: `/new/edit/${route.params.id}` });
} else {
    breadcrumb.push({ name: "Tạo mới tin tức", link: '/new/create' });
}
const news = ref<any>({});
const urlFile = ref(null)

onMounted(async () => {
    if (route.params.id) {
        await store.getNewDetail(Number(route.params.id));
        news.value = { ...store.newDetail };
    }
});
const onSubmit = async () => {
    if (!news.value.title) {
        messageError('Bạn chưa nhập tiêu đề tin tức');
        return;
    }
    if (!news.value.link) {
        messageError('Bạn chưa nhập link tin tức');
        return;
    }
    const success = await store.saveNew(news.value);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/new/list');
    }
};

const uploadImage = async (type: 'image', event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadNewImage(formData);
    if (url) {
        urlFile.value = url[0].url
        news.value.url_media = url[0].path;
        messageSuccess('Tải file thành công');
    }
};

</script>
<style scoped>
img {
    border-radius: 4px;
}
</style>
