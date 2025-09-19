<!-- filepath: f:\Projects\LMS_MSD\Source\msd-admin\src\views\pages\setting\course\create.vue -->
<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
    <Content>
        <h2 class="text-xl font-bold mb-4">Cài đặt ảnh khóa học</h2>
        <form @submit.prevent="onSubmit">
            <!-- Ảnh course -->
            <div class="mb-8  pb-4">
                <label class="block font-medium mb-2">Upload ảnh banner khóa học</label>
                <div class="flex gap-10 mt-3 mb-5">
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
                    <div v-if="course.image_url" class="">
                        <img :src="course.image_url" alt="course preview" class="max-h-32 rounded shadow" />
                    </div>
                </div>
            </div>
            <div class="text-center mt-6">
                <button type="submit" class="px-6 py-2 bg-primary text-white rounded">Lưu cấu hình</button>
            </div>
        </form>
    </Content>
</template>

<script setup lang="ts">
import { reactive, computed, watch, onMounted } from 'vue'
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { useSettingStore } from '@/stores/setting'
import { messageSuccess } from '@/common/message.service'

const breadcrumb = [
    { name: "Cấu hình" },
    { name: "Watermark", link: '/setting/watermark' }
]

const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const course = reactive({
    image_url: '',
})

watch(() => settingDetail.value, (newVal: any) => {
    if (newVal && newVal.value && newVal.key == 'image-banner-course') {
        Object.assign(course, newVal.value)
    }
}, { deep: true, immediate: true })

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await settingStore.uploadImage(formData);
    if (url) {
        course.image_url = url;
    }
};

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: 'image-banner-course',
        value: course
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    await settingStore.fetchSettingByKey({ key: 'image-banner-course' })
})
</script>