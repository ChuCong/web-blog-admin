<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Tên tài nguyên</label>
                <Field name="title" type="text" v-slot="{ field }">
                    <InputTextOutline placeholder="Nhập tên tài nguyên" type="text" width="100" height="44"
                        :value="resource.title" @input="(value) => resource.title = value" />
                </Field>
                <ErrorMessage name="title" class="text-red-500  mt-1" />
            </div>
            <div class="flex justify-between flex-wrap lg:flex-wrap mb-5 gap-6">
                <div class="flex-1">
                    <label class="block font-semibold text-gray-700 mb-2">Dạng File</label>
                    <Field name="type" type="text" v-slot="{ field }">
                        <InputTextOutline placeholder="Chọn loại file" type="select" width="100" height="44"
                            :value="resource.type" @input="(value) => resource.type = value" :items="RESOURCE_TYPE"
                            item-text="title" item-value="key" />
                    </Field>
                    <ErrorMessage name="type" class="text-red-500  mt-1" />
                </div>
                <div class="flex-1">
                    <label class="block font-semibold mb-2">Tag</label>
                    <InputTextOutline placeholder="Chọn Tag" type="select" height="44" :value="resource.tag_ids"
                        @input="(value) => resource.tag_ids = value" :items="tags" item-text="name" item-value="id"
                        class="w-full" width="100" :multiple="true" />
                </div>
            </div>
            <div v-if="resource.type === LINK" class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Link google drive</label>
                <InputTextOutline placeholder="Nhập đường dẫn" type="text" width="100" height="44" :value="resource.url"
                    @input="(value) => resource.url = value" />
            </div>
            <div v-if="resource.type !== LINK && resource.type" class="mb-5 grid grid-cols-2">
                <div>
                    <label class="block font-semibold mb-1">Tải File tài nguyên</label>
                    <div class="upload-container flex gap-3">
                        <label class="upload-box">
                            <input type="file" @change="uploadFile('responsive_image', $event)"
                                :accept="getAcceptAndFormat(resource.type).accept" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: {{
                                getAcceptAndFormat(resource.type).format }}</div>
                        </label>
                    </div>

                    <div class="mt-4 font-bold text-green-600">
                        <img v-if="urlFile && resource.type === IMAGE" :src="urlFile" class="max-h-40" />
                        <a v-if="urlFile" class="underline" :href="urlFile" target="_blank">Link</a>
                        <a v-else-if="resource?.media?.src_url" class="underline" :href="resource?.media?.src_url"
                            target="_blank">Link</a>
                    </div>
                </div>
                <div v-if="resource.type !== IMAGE">
                    <label class="block font-semibold mb-1">Ảnh Thumbnail</label>
                    <div class="upload-container flex gap-3">
                        <label class="upload-box">
                            <input type="file" @change="onChangeFileUpload" accept="image/png,image/jpeg,image/jpg"
                                class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG, JPEG</div>
                        </label>
                    </div>
                    <div v-if="resource.image_thumbnail_url" class="mt-2">
                        <img :src="resource.image_thumbnail_url" alt="preview" width="300" />
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
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useTagStore } from '@/stores/tag';
import { messageSuccess, messageError } from "@/common/message.service";
import { useResourceStore } from '@/stores/resource';
import { RESOURCE_TYPE, LINK, IMAGE, WORD, PDF, EXCEL, POWERPOINT, VIDEO } from "@/config/constant"
import { useLoadingStore } from '@/stores/loading';

const breadcrumb = [
    { name: "Danh sách tài nguyên", link: '/resource/list' },
]

const loading = useLoadingStore();
const tagStore = useTagStore();
const tags = computed(() => tagStore.tags);
const router = useRouter();
const route = useRoute();
const store = useResourceStore();
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật tài nguyên", link: `/resource/edit/${route.params.id}` });
} else {
    breadcrumb.push({ name: "Tạo mới tài nguyên", link: '/resource/create' });
}
const resource = reactive({
    id: '',
    title: '',
    type: '',
    url: '',
    url_media: '',
    image_thumbnail: '',
    image_thumbnail_url: '',
    tag_ids: []
});
const urlFile = ref(null)

onMounted(async () => {
    if (route.params.id) {
        await store.getResourceDetail(Number(route.params.id));
        Object.assign(resource, store.resourceDetail);
    }
    await tagStore.fetchTags();
});
const onSubmit = async () => {
    if (!resource.title) {
        messageError('Bạn chưa nhập tiêu đề tài nguyên');
        return;
    }
    if (!resource.type) {
        messageError('Bạn chưa nhập Dạng File');
        return;
    }
    if (!resource.url_media && resource.type != LINK && !route.params.id ) {
        messageError('Bạn chưa tải file tài nguyên');
        return;
    }
    if (!resource.url && resource.type === LINK ) {
        messageError('Bạn chưa nhập Link');
        return;
    }
    // if (!resource.image_thumbnail) {
    //     messageError('Bạn chưa tải ảnh thumbnail');
    //     return;
    // }
    loading.setLoading(true)
    const data = await store.saveResource(resource);
    loading.setLoading(false)
    if (data.status) {
        messageSuccess('Lưu thành công');
        router.push('/resource/list');
    } else {
        messageError('Lưu thất bại');
    }
};

const uploadFile = async (type: 'image' | 'xlxs' | 'docx' | 'responsive_image', event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    loading.setLoading(true)
    const url = await store.uploadResource(formData);
    loading.setLoading(false)
    if (url) {
        urlFile.value = url[0].url
        resource.url_media = url[0].path;
        messageSuccess('Tải file thành công');
    }
}

function getAcceptAndFormat(type: string) {
    switch (type) {
        case IMAGE:
            return { accept: "image/png,image/jpeg,image/jpg", format: "PNG, JPG, JPEG" }
        case WORD:
            return { accept: ".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document", format: "DOC, DOCX" }
        case PDF:
            return { accept: "application/pdf", format: "PDF" }
        case EXCEL:
            return { accept: ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", format: "XLS, XLSX" }
        case POWERPOINT:
            return { accept: ".ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation", format: "PPT, PPTX" }
        case VIDEO:
            return { accept: "video/mp4,video/x-m4v,video/*", format: "MP4, M4V, ..." }
        default:
            return { accept: "*", format: "Tất cả các loại file" }
    }
}

const imageError = ref('')
const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('upload', file)
    loading.setLoading(true)
    const url = await store.uploadResource(formData)
    loading.setLoading(false)
    if (url) {
        resource.image_thumbnail = url[0].url
        resource.image_thumbnail_url = url[0].url
        imageError.value = ''
    } else {
        imageError.value = 'File chưa đúng định dạng'
    }
}
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
