<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addItem" text="Gán chứng chỉ cho khóa học" :width="250" />
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="courseCertificates" :paginate="paginate" @getPage="getPage">
                <template v-slot:course="item: any">
                    <span>{{ item.course?.title }}</span>
                </template>
                <template v-slot:certificate_template="item: any">
                    <span>{{ item.certificate_template?.name }}</span>
                </template>
                <template v-slot:action="item: any">
                    <div class="flex">
                        <BtnInTable :icon="penIcon" class="mr-1" :height="20" :width="20" @click="editItem(item.id)" />
                        <BtnInTable @click="openDeletePopup(item.id)" :icon="trashIcon" :height="20" :width="20"
                            title="Delete" />
                    </div>
                </template>
            </DataTable>
        </Content>
        <PopupDelete :isOpen="isOpen" @confirm="onConfirm" @cancel="onCancel" />
    </div>
</template>

<script setup lang="ts">
import BtnBase from "@/components/elements/BtnBase.vue"
import DataTable from "@/components/elements/DataTable.vue"
import BtnInTable from "@/components/elements/BtnInTable.vue"
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { useRouter } from 'vue-router'
import { onMounted, computed, ref } from 'vue'
import { useCourseCertificateStore } from '@/stores/courseCertificate'
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter()
const store = useCourseCertificateStore()

const courseCertificates = computed(() => store.courseCertificates)
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Khóa học", value: "course", align: "left", width: 500 },
    { text: "Template chứng chỉ", value: "certificate_template", align: "left", width: 500 },
    { text: "Thao tác", value: "action", align: "left", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách gán chứng chỉ", link: '/course_certificate/list' }
]

const pagination = ref({
    page: 1,
    limit: 10
})

const addItem = () => {
    router.push('/course_certificate/create')
}

const editItem = (id: number) => {
    router.push(`/course_certificate/edit/${id}`)
}

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteCourseCertificate(selectedId.value)
        if (success) {
            messageSuccess('Xóa thành công')
            await fetchCourseCertificates()
        }
    }
    isOpen.value = false
    selectedId.value = null
}

const onCancel = () => {
    isOpen.value = false
    selectedId.value = null
}
const openDeletePopup = (id: number) => {
    selectedId.value = id
    isOpen.value = true
}

const fetchCourseCertificates = async () => {
    await store.fetchCourseCertificates({
        page: pagination.value.page,
        limit: pagination.value.limit
    })
}

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await fetchCourseCertificates()
}

onMounted(async () => {
    loading.setLoading(true)
    await fetchCourseCertificates()
    loading.setLoading(false)
})
</script>