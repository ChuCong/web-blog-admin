<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Chọn ngôn ngữ</label>
                <InputTextOutline placeholder="Chọn ngôn ngữ" type="select" width="100" height="44"
                    :value="newData.lang" @input="(value) => newData.lang = value" :items="LANGUAGE" item-text="title"
                    item-value="key" />
            </div>
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Nội dung</label>
                <Field name="title" type="text" v-slot="{ field }">
                    <InputQuillEditor :placeholder="'Nhập mô tả Chương trình học'" v-model="newData.content" />
                </Field>
                <ErrorMessage name="title" class="text-red-500  mt-1" />
            </div>
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Dạng File</label>
                <Field name="type" type="text" v-slot="{ field }">
                    <InputTextOutline placeholder="Chọn loại file" type="select" width="100" height="44"
                        :value="newData.type" @input="(value) => newData.type = value" :items="ABOUT_MSD_FILE"
                        item-text="title" item-value="key" />
                </Field>
                <ErrorMessage name="type" class="text-red-500  mt-1" />
            </div>
            <div v-if="newData.type === LINK" class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Link video youtube</label>
                <InputTextOutline placeholder="Nhập đường dẫn" type="text" width="100" height="44"
                    :value="newData.url_youtube" @input="(value) => newData.url_youtube = value" />

                <div v-if="newData.url_youtube && newData.type === LINK" class="mt-2">
                    <iframe :src="convertToEmbedUrl(newData.url_youtube)" width="250" height="150" frameborder="0"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            <div v-if="newData.type !== LINK && newData.type" class="mb-5">
                <div class="flex gap-2 mb-2">
                    <label class="block font-semibold mb-1">Tải file </label>
                    <span>(Kích thước ảnh 506px x 300px)</span>
                </div>
                <!-- <input type="file" @change="uploadImage('responsive_image', $event)" class="file-input w-full" /> -->
                <div class="flex gap-10 mt-3">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="uploadImage('responsive_image', $event)" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG, MP4,...</div>
                        </label>
                    </div>
                    <img v-if="newData.url_media && newData.type === IMAGE" :src="newData.url_media"
                        class=" max-h-40" />
                    <div v-else-if="newData.url_media && newData.type === VIDEO" class="">
                        <video controls class="w-[250px] h-auto rounded-lg shadow-lg">
                            <source :src="newData.url_media" type="video/mp4" />
                        </video>
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
import BtnBase from "@/components/elements/BtnBase.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { messageSuccess, messageError } from "@/common/message.service";
import { useSettingStore } from '@/stores/setting';
import { ABOUT_MSD_FILE, LINK, IMAGE, LANGUAGE, VIDEO } from "@/config/constant"
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { log } from "console";
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();
const breadcrumb = [
    { name: "Danh sách About MSD", link: '/setting/about-msd/list' },
]

const router = useRouter();
const route = useRoute();
const store = useSettingStore();
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật", link: `/setting/about-msd/edit/${route.params.id}` });
} else {
    breadcrumb.push({ name: "Tạo mới", link: '/setting/about-msd/create' });
}

const aboutMsd = reactive({
    id: '',
    key: 'about-msd',
    value: [],
});
const newData = reactive({
    id: '',
    content: '',
    type: '',
    url_youtube: '',
    url_media: '',
    lang: ''
});
onMounted(async () => {
    if (route.params.id) {
        const payload = {
            key: 'about-msd'
        }
        await store.fetchSettingByKey(payload);
        Object.assign(aboutMsd, store.settingDetail);
        for (let i = 0; i < aboutMsd.value.length; i++) {
            const item = aboutMsd.value[i];
            if (String(item.id) === String(route.params.id)) {
                Object.assign(newData, item);
                break;
            }
        }
    }
});
watch(newData, (newValue) => {
    const index = aboutMsd.value.findIndex(item => item.id === newValue.id);
    if (index !== -1) {
        aboutMsd.value[index] = { ...newValue };
    } else {
        aboutMsd.value.push({ ...newValue });
    }
}, { deep: true });

const onSubmit = async () => {
    if (!newData.content) {
        messageError('Bạn chưa nhập nội dung');
        return;
    }
    if (!newData.type) {
        messageError('Bạn chưa nhập Dạng File');
        return;
    }
    if (!newData.lang) {
        messageError('Bạn chưa chọn ngôn ngữ');
        return;
    }

    const success = await store.saveSettingHome(aboutMsd);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/setting/about-msd');
    }
};

const uploadImage = async (type: 'image' | 'responsive_image', event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    loading.setLoading(true)
    const url = await store.addFile(formData);
    if (url) {
        newData.url_media = url[0].url;
        messageSuccess('Tải file thành công');
    }
    loading.setLoading(false);
};
const convertToEmbedUrl = (url: any) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([\w\-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
}
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
