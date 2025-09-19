<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
    <Content>
        <h2 class="text-xl font-bold mb-10">Cài đặt thống kê học tập</h2>
        <form @submit.prevent="onSubmit">
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Chọn cách nhập dữ liệu</label>
                <InputTextOutline placeholder="Chọn cách nhập dữ liệu" type="select" width="100" height="44"
                    :value="learningStatistics.type" @input="(value) => learningStatistics.type = value"
                    :items="listType" item-text="name" item-value="type" />
            </div>

            <div v-if="learningStatistics.type === 2">
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-2">Số chương trình học</label>
                    <InputTextOutline placeholder="Nhập số chương trình học" type="number" width="100" height="44"
                        :value="learningStatistics.category" @input="(value) => learningStatistics.category = value" />
                </div>
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-2">Số khóa học</label>
                    <InputTextOutline placeholder="Nhập số khóa học" type="number" width="100" height="44"
                        :value="learningStatistics.course" @input="(value) => learningStatistics.course = value" />
                </div>
                <div class="mb-5">
                    <label class="block font-semibold text-gray-700 mb-2">Số học viên</label>
                    <InputTextOutline placeholder="Nhập số học viên" type="number" width="100" height="44"
                        :value="learningStatistics.user" @input="(value) => learningStatistics.user = value" />
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
import InputTextOutline from '@/components/elements/InputTextOutline.vue'

const breadcrumb = [
    { name: "Cấu hình" },
    { name: "Thống kê học tập", link: '/setting/learning-statistics' }
]
const listType = [
    { name: 'Tự động lấy dữ liệu', type: 1 },
    { name: 'Nhập dữ liệu', type: 2 }
]
const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const learningStatistics = reactive({
    type: 0,
    user: '',
    category: '',
    course: ''
})
function parseIfJson(val: any) {
    if (typeof val === 'string') {
        try {
            return JSON.parse(val);
        } catch (e) {
            console.error('Invalid JSON:', val);
            return {};
        }
    }
    return val;
}
watch(() => settingDetail.value, (newVal: any) => {
    if (newVal?.key === 'learning-statistics' && newVal.value) {
        Object.assign(learningStatistics, parseIfJson(newVal.value));
    }
}, { immediate: true });

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: 'learning-statistics',
        value: learningStatistics
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    const payload = {
        key: 'learning-statistics'
    }
    await settingStore.fetchSettingByKey(payload)
})
</script>