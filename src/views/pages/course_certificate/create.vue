<!-- filepath: src/views/pages/course_certificate/create.vue -->
<template>
    <SubHeader :breadcrumb="breadcrumb" />
    <Content>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Chọn khóa học</label>
            <InputTextOutline placeholder="Chọn khóa học" type="select" width="100" height="44" :value="form.course_id"
                @input="(value) => form.course_id = value" :items="courses" item-text="title" item-value="id"
                class="w-full" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Chọn template chứng chỉ</label>
            <InputTextOutline placeholder="Chọn template" type="select" width="100" height="44"
                :value="form.certificate_template_id" @input="(value) => form.certificate_template_id = value"
                :items="templates" item-text="name" item-value="id" class="w-full" />
        </div>
        <div class="text-center">
            <button class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]" @click="onSubmit">Lưu</button>
        </div>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { messageError, messageSuccess } from "@/common/message.service"
import { useCourseCertificateStore } from '@/stores/courseCertificate'
import { useCourseStore } from '@/stores/course'
import { useCertificateTemplateStore } from '@/stores/certificateTemplate'
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const router = useRouter()
const route = useRoute()
const store = useCourseCertificateStore()
const courseStore = useCourseStore()
const templateStore = useCertificateTemplateStore()

const breadcrumb = [
    { name: "Danh sách gán chứng chỉ", link: '/course_certificate/list' },
    { name: "Gán chứng chỉ cho khóa học", link: '/course_certificate/create' },
]

const form = ref({
    course_id: '',
    certificate_template_id: ''
})

const courses = ref<any[]>([])
const templates = ref<any[]>([])

onMounted(async () => {
    loading.setLoading(true)
    courses.value = await courseStore.fetchAllCourses()
    templates.value = await templateStore.fetchAllTemplates()
    if (route.params.id) {
        await store.getCourseCertificateDetail(Number(route.params.id))
        Object.assign(form.value, store.courseCertificateDetail)
    }
    loading.setLoading(false)
})

const onSubmit = async () => {
    if (!form.value.course_id || !form.value.certificate_template_id) {
        messageError('Vui lòng chọn đầy đủ thông tin')
        return
    }
    loading.setLoading(true)
    const res = await store.saveCourseCertificate(form.value)
    loading.setLoading(false)
    if (res.status) {
        messageSuccess('Lưu thành công')
        router.push('/course_certificate/list')
    } else {
        messageError('Lưu thất bại. Chú ý, một Khóa học chỉ có một Certificate')
    }
}
</script>