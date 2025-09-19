<template>
    <SubHeader :breadcrumb="breadcrumb" />
    <Content>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Tên chứng chỉ</label>
            <InputTextOutline placeholder="Nhập tên chứng chỉ" type="text" width="100" height="44"
                :value="template.name" @input="(value) => template.name = value" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Upload ảnh template</label>
            <div class="upload-container flex gap-3">
                <label class="upload-box">
                    <input type="file" @change="onChangeFileUpload" accept="image/png" class="hidden" />
                    <div class="w-fit mx-auto pb-[15px]">
                        <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                    </div>
                    <span>Click để upload file</span>
                    <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG</div>
                </label>
            </div>
            <div v-if="template.image_url" class="mt-2">
                <img :src="template.image_url" alt="preview" width="300" />
            </div>
            <p class="text-red-500 mt-1">{{ imageError }}</p>
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Vị trí các trường trên template</label>
            <div v-for="field in fieldList" :key="field.key" class="flex gap-4 items-center mb-2">
                <span class="w-32">{{ field.label }}</span>
                <InputTextOutline type="number" width="80" placeholder="Top" :value="template.fields[field.key]?.top"
                    @input="(value) => setField(field.key, 'top', value)" />
                <InputTextOutline type="number" width="80" placeholder="Left" :value="template.fields[field.key]?.left"
                    @input="(value) => setField(field.key, 'left', value)" />
            </div>
        </div>
        <div class="mb-4 flex items-center">
            <InputTextOutline value_translate="Đặt làm template mặc định" type="checkbox" :checked="template.is_default"
                :height="24" @input="(value) => template.is_default = value" :width="24" class="w-full" />
        </div>
        <div class="flex text-center justify-center gap-4">
            <button class="mb-4 text-white bg-blue-500 rounded-md p-2 w-[200px]" @click="onPreview">Preview</button>
            <button class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]" @click="onSubmit">Lưu</button>
        </div>
        <div v-if="showPopup">
            <PopupPreview :link="linkPopup" @close="closePopup" />
        </div>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import PopupPreview from '@/components/elements/PopupPreview.vue'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Form } from 'vee-validate'
import { messageError, messageSuccess } from "@/common/message.service"
import { useCertificateTemplateStore } from '@/stores/certificateTemplate'
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const breadcrumb = [
    { name: "Danh sách chứng chỉ", link: '/certificate/list' },
    { name: "Tạo chứng chỉ", link: '/certificate/create' },
]

const router = useRouter()
const route = useRoute()
const store = useCertificateTemplateStore()

const template = ref<any>({
    name: '',
    image: '',
    image_url: '',
    fields: {},
    is_default: false
})
const imageError = ref('')

const fieldList = [
    { key: 'full_name', label: 'Họ tên' },
    { key: 'title', label: 'Tên khóa học' },
    { key: 'total_time', label: 'Tổng thời lượng' },
    { key: 'current_date', label: 'Ngày cấp' }
]

const showPopup = ref(false)
const linkPopup = ref('')

onMounted(async () => {
    if (route.params.id) {
        loading.setLoading(true);
        await store.getTemplateDetail(Number(route.params.id))
        template.value = store.templateDetail || {}
        loading.setLoading(false);
    }
})

const setField = (key: string, type: 'top' | 'left', value: number) => {
    if (!template.value.fields[key]) template.value.fields[key] = { top: 0, left: 0 }
    template.value.fields[key][type] = Number(value)
}

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('upload', file)
    const url = await store.uploadImage(formData)
    if (url) {
        template.value.image = url
        template.value.image_url = url
        imageError.value = ''
    } else {
        imageError.value = 'File chưa đúng định dạng'
    }
}

const onSubmit = async () => {
    if (!template.value.name) {
        messageError('Bạn chưa nhập tên chứng chỉ')
        return
    }
    if (!template.value.image) {
        messageError('Bạn chưa chọn ảnh template')
        return
    }
    loading.setLoading(true);
    const response = await store.saveTemplate(template.value)
    if (response.status) {
        messageSuccess('Lưu thành công')
        router.push('/certificate_template/list')
    } else {
        messageError('Lưu thất bại')
    }
    loading.setLoading(false);
}

const onPreview = async () => {
    if (!template.value.image) {
        messageError('Bạn chưa chọn ảnh template')
        return
    }

    loading.setLoading(true);
    const response = await store.previewTemplate(template.value)
    if (response.status) {
        openPopup(response.data.certificate_url)
    } else {
        messageError('Tạo thất bại')
    }
    loading.setLoading(false);
}

const openPopup = (link: string) => {
    linkPopup.value = link;
    showPopup.value = true;
}
const closePopup = () => {
    showPopup.value = false;
}
</script>