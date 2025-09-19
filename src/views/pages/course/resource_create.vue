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
                            <input type="file" @change="uploadImage('responsive_image', $event)"
                                :accept="getAcceptAndFormat(resource.type).accept" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: {{
                                getAcceptAndFormat(resource.type).format }}</div>
                        </label>
                    </div>

                    <span class="underline cursor-pointer text-blue-500 font-bold"
                        @click="openPopup(urlFile ?? resource?.media?.src_url)">Xem
                        file</span>
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
                    <div v-if="resource.image_thumbnail" class="mt-2">
                        <img :src="resource.image_thumbnail" alt="preview" width="300" />
                    </div>
                </div>
            </div>
            <div class="text-center mt-10">
                <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
            </div>
            <div v-if="showPopup">
                <PopupPreview :link="linkPopup" @close="closePopup" />
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
import { messageSuccess, messageError } from "@/common/message.service";
import { useCourseResourceStore } from '@/stores/course_resource';
import PopupPreview from '@/components/elements/PopupPreview.vue'
import { RESOURCE_TYPE, LINK, IMAGE, WORD, PDF, EXCEL, POWERPOINT, VIDEO } from "@/config/constant"
import { useLoadingStore } from '@/stores/loading';

const router = useRouter();
const route = useRoute();
const store = useCourseResourceStore();
const loading = useLoadingStore();
const breadcrumb = [
    { name: "Danh sách Khóa học", link: '/course/list' },
    { name: "Tài Nguyên Khóa học", link: `/course/edit/${route.params.course_id}?viewType=3` },
]

if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật tài nguyên Khóa học", link: `/course/edit/${route.params.course_id}/resource/edit/${route.params.resource_id}` });
} else {
    breadcrumb.push({ name: "Tạo mới tài nguyên Khóa học", link: `/course/edit/${route.params.course_id}/resource/create` });
}
const resource = reactive({
    id: '',
    title: '',
    type: '',
    url: '',
    url_media: '',
    image_thumbnail: '',
    tag_ids: [],
    course_id: route.params.course_id,
    media_id: ''
});
const urlFile = ref(null)
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
onMounted(async () => {
    if (route.params.resource_id) {
        await store.getResourceDetail(Number(route.params.resource_id));
        Object.assign(resource, store.resourceDetail);
    }
});

const onSubmit = async () => {
    if (!resource.title) {
        messageError('Bạn chưa nhập tiêu đề tài nguyên');
        return;
    }
    if (!resource.type ) {
        messageError('Bạn chưa nhập Dạng File');
        return;
    }
    if (!resource.url_media && resource.type != LINK ) {
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
    const success = await store.saveResource(resource);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push(`/course/edit/${route.params.course_id}?viewType=3`);
    } else {
        messageError('Lưu tài nguyên thất bại')
    }
};

const uploadImage = async (type: 'image' | 'xlxs' | 'docx' | 'responsive_image', event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadResourceImage(formData);
    if (url) {
        urlFile.value = url[0].url
        resource.url_media = url[0].path;
        messageSuccess('Tải file thành công');
    }
};
const imageError = ref('')
const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('upload', file)
    loading.setLoading(true)
    const url = await store.uploadResourceImage(formData)
    loading.setLoading(false)
    if (url) {
        resource.image_thumbnail = url[0].url
        imageError.value = ''
    } else {
        imageError.value = 'File chưa đúng định dạng'
    }
}

const showPopup = ref(false)
const linkPopup = ref('')
const openPopup = (link: string) => {
    linkPopup.value = link;
    showPopup.value = true;
}
const closePopup = () => {
    showPopup.value = false;
}

</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
