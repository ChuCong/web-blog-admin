<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4">
    </SubHeader>
    <Content>
        <h2 class="text-xl font-bold mb-4">Cài đặt lưu trữ đa nền tảng</h2>
        <form @submit.prevent="onSubmit">
            <div v-for="platform in platforms" :key="platform.value" class="mb-6">
                <h3 class="font-semibold mb-2">{{ platform.label }}</h3>
                <div v-for="field in platform.fields" :key="field.key" class="w-full mb-2 flex items-center">
                    <label class="w-40 font-medium mr-2 flex-none">{{ field.label }}</label>
                    <InputTextOutline class="grow" :type="field.type || 'text'" width="100"
                        :value="storage[platform.value][field.key]"
                        @input="(value) => storage[platform.value][field.key] = value" />
                </div>
            </div>
            <div class="text-center mt-6">
                <button type="submit" class="px-6 py-2 bg-primary text-white rounded">Lưu cấu hình</button>
            </div>
        </form>
    </Content>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue'
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { useSettingStore } from '@/stores/setting'
import { messageSuccess } from '@/common/message.service'

const breadcrumb = [
    { name: "Cấu hình" },
    { name: "Lưu trữ", link: '/setting/storage' }
]

const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const platforms = [
    {
        value: 's3',
        label: 'Amazon S3',
        fields: [
            { key: 'access_key', label: 'Access Key' },
            { key: 'secret_key', label: 'Secret Key', type: 'text' },
            { key: 'bucket', label: 'Bucket' },
            { key: 'region', label: 'Region' },
            { key: 'endpoint', label: 'Endpoint' }
        ]
    },
    {
        value: 'gdrive',
        label: 'Google Drive',
        fields: [
            { key: 'client_id', label: 'Client ID' },
            { key: 'client_secret', label: 'Client Secret', type: 'text' },
            { key: 'refresh_token', label: 'Refresh Token' },
            { key: 'folder_id', label: 'Folder ID' }
        ]
    },
    {
        value: 'dropbox',
        label: 'Dropbox',
        fields: [
            { key: 'access_token', label: 'Access Token', type: 'text' },
            { key: 'folder', label: 'Folder' }
        ]
    },
    {
        value: 'vimeo',
        label: 'Vimeo',
        fields: [
            { key: 'client_id', label: 'Client ID' },
            { key: 'client_secret', label: 'Client Secret', type: 'text' },
            { key: 'access_token', label: 'Access Token', type: 'text' }
        ]
    }
]

const storage = reactive({
    s3: { access_key: '', secret_key: '', bucket: '', region: '', endpoint: '' },
    gdrive: { client_id: '', client_secret: '', refresh_token: '', folder_id: '' },
    dropbox: { access_token: '', folder: '' },
    vimeo: { client_id: '', client_secret: '', access_token: '' }
})

watch(() => settingDetail.value, (newVal: any) => {
    if (newVal && newVal.value && newVal.key == 'storage') {
        Object.assign(storage, newVal.value)
    }
}, { deep: true, immediate: true })

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: 'storage',
        value: storage
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    await settingStore.fetchSettingByKey({ key: 'storage' })
})
</script>