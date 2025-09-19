<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
    <Content>
        <h2 class="text-xl font-bold mb-4">Cài đặt Video</h2>
        <form @submit.prevent="onSubmit">
            <div class="mb-6 flex items-center">
                <label class="w-60 font-medium mr-2">Tự động tạo transcript</label>
                <input type="checkbox" v-model="videoConfig.auto_transcript" class="w-5 h-5" />
            </div>
            <div class="mb-6 flex items-center">
                <label class="w-60 font-medium mr-2">Dùng watermark</label>
                <input type="checkbox" v-model="videoConfig.use_watermark" class="w-5 h-5" />
                <div v-if="videoConfig.use_watermark" class="ml-6 flex items-center gap-4">
                    <label class="font-medium">Kiểu watermark:</label>
                    <select v-model="videoConfig.watermark_type" class="border rounded p-2">
                        <option value="image">Ảnh</option>
                        <option value="text">Chữ</option>
                    </select>
                </div>
            </div>
            <div class="mb-6 flex items-center">
                <label class="w-60 font-medium mr-2">Lưu trữ lên S3</label>
                <input type="checkbox" v-model="videoConfig.store_on_s3" class="w-5 h-5" />
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
    { name: "Video", link: '/setting/video' }
]

const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const videoConfig = reactive({
    auto_transcript: true,
    use_watermark: true,
    watermark_type: 'image', // hoặc 'text'
    store_on_s3: false
})

watch(() => settingDetail.value, (newVal: any) => {
    if (newVal && newVal.value && newVal.key == 'video_config') {
        Object.assign(videoConfig, newVal.value)
    }
}, { deep: true, immediate: true })

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: 'video_config',
        value: videoConfig
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    await settingStore.fetchSettingByKey({ key: 'video_config' })
})
</script>