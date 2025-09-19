<!-- filepath: f:\Projects\LMS_MSD\Source\msd-admin\src\views\pages\setting\watermark\create.vue -->
<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
    <Content>
        <h2 class="text-xl font-bold mb-4">Cài đặt Watermark</h2>
        <form @submit.prevent="onSubmit">
            <!-- Ảnh watermark -->
            <div class="mb-8 border-b pb-4">
                <h3 class="font-semibold mb-2">Ảnh watermark</h3>
                <label class="block font-medium mb-2">Upload ảnh watermark</label>
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
                    <div v-if="watermark.image.image_url" class="">
                        <img :src="watermark.image.image_url" alt="Watermark preview" class="max-h-32 rounded shadow" />
                    </div>
                </div>
                <div class="flex gap-4 mt-4">
                    <div>
                        <label class="block font-medium mb-1">Vị trí</label>
                        <select v-model="watermark.image.position" class="border rounded p-2 w-full max-w-xs">
                            <option value="top-left">Trên trái</option>
                            <option value="top-right">Trên phải</option>
                            <option value="bottom-left">Dưới trái</option>
                            <option value="bottom-right">Dưới phải</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-medium mb-1">X (px)</label>
                        <InputTextOutline :value="watermark.image.x" @input="(value) => watermark.image.x = value"
                            type="number" placeholder="0" width="100" />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">Y (px)</label>
                        <InputTextOutline :value="watermark.image.y" @input="(value) => watermark.image.y = value"
                            type="number" placeholder="0" width="100" />
                    </div>
                </div>
            </div>

            <!-- Chữ watermark -->
            <div class="mb-8">
                <h3 class="font-semibold mb-2">Chữ watermark</h3>
                <label class="block font-medium mb-2">Nội dung watermark</label>
                <InputTextOutline :value="watermark.text.text" @input="(value) => watermark.text.text = value"
                    placeholder="Nhập nội dung watermark" />
                <div class="flex gap-4 mt-4">
                    <div>
                        <label class="block font-medium mb-1">Vị trí</label>
                        <select v-model="watermark.text.position" class="border rounded p-2 w-full max-w-xs">
                            <option value="top-left">Trên trái</option>
                            <option value="top-right">Trên phải</option>
                            <option value="bottom-left">Dưới trái</option>
                            <option value="bottom-right">Dưới phải</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-medium mb-1">X (px)</label>
                        <InputTextOutline :value="watermark.text.x" @input="(value) => watermark.text.x = value"
                            type="number" placeholder="0" width="100" />
                    </div>
                    <div>
                        <label class="block font-medium mb-1">Y (px)</label>
                        <InputTextOutline :value="watermark.text.y" @input="(value) => watermark.text.y = value"
                            type="number" placeholder="0" width="100" />
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
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { useSettingStore } from '@/stores/setting'
import { messageSuccess } from '@/common/message.service'

const breadcrumb = [
    { name: "Cấu hình" },
    { name: "Watermark", link: '/setting/watermark' }
]

const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const watermark = reactive({
    image: {
        image_url: '',
        position: 'top-left',
        x: 0,
        y: 0
    },
    text: {
        text: '',
        position: 'bottom-right',
        x: 0,
        y: 0
    }
})

watch(() => settingDetail.value, (newVal: any) => {
    console.log('newval', newVal)
    if (newVal && newVal.value && newVal.key == 'watermark') {
        Object.assign(watermark, newVal.value)
        console.log('watermark', watermark)
    }
}, { deep: true, immediate: true })

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await settingStore.uploadImage(formData);
    if (url) {
        watermark.image.image_url = url;
    }
};

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: 'watermark',
        value: watermark
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    await settingStore.fetchSettingByKey({ key: 'watermark' })
})
</script>