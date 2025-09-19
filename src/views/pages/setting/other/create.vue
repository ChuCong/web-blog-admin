<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
    <Content>
        <h2 class="text-xl font-bold mb-4">Cài đặt Khác</h2>
        <form @submit.prevent="onSubmit">
            <div class="mb-6 items-center grid grid-cols-3">
                <label class="font-medium mr-2 col-span-1">Số ngày nhắc học kể từ lần học gần nhất (ngày)</label>
                <InputTextOutline placeholder="Nhập Số ngày nhắc học kể từ lần học gần nhất" type="text" height="44"
                    class="col-span-1" :value="other.number_days_reminder_inactive"
                    @input="(value) => other.number_days_reminder_inactive = value" width="100" />
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
import { SETTING_KEY } from '@/config/constant'
import InputTextOutline from '@/components/elements/InputTextOutline.vue'

const breadcrumb = [
    { name: "Cấu hình" },
    { name: "Khác", link: '/setting/other' }
]

const settingStore = useSettingStore()
const settingDetail = computed(() => settingStore.settingDetail)

const other = reactive({
    number_days_reminder_inactive: 3
})

watch(() => settingDetail.value, (newVal: any) => {
    console.log('newVal', newVal)
    if (newVal && newVal.value && newVal.key == SETTING_KEY.OTHER) {

        Object.assign(other, newVal.value)
    }
}, { deep: true, immediate: true })

const onSubmit = async () => {
    await settingStore.saveSetting({
        id: settingDetail.value?.id,
        key: SETTING_KEY.OTHER,
        value: other
    })
    messageSuccess('Đã lưu cấu hình!')
}

onMounted(async () => {
    console.log(SETTING_KEY.OTHER);
    await settingStore.fetchSettingByKey({ key: SETTING_KEY.OTHER });
})
</script>