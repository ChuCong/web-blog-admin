<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addTemplate" text="Thêm mới Chứng chỉ" :width="200" />
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="templates" :paginate="paginate" @getPage="getPage">
                <template v-slot:image_url="item: any">
                    <img :src="item.image_url" alt="template" class="w-[200px] my-2" />
                </template>
                <template v-slot:is_default="item: any">
                    <span v-if="item.is_default" class="text-green-600 font-bold">Mặc định</span>
                    <span v-else></span>
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
import { useCertificateTemplateStore } from '@/stores/certificateTemplate'
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter()
const store = useCertificateTemplateStore()

const templates = computed(() => store.templates)
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Tên template", value: "name", align: "left", width: 300 },
    { text: "Ảnh template", value: "image_url", align: "left", width: 220 },
    { text: "Tọa độ dữ liệu", value: "fields", align: "left", width: 220 },
    { text: "Mặc định", value: "is_default", align: "left", width: 100 },
    { text: "Thao tác", value: "action", align: "left", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách template chứng chỉ", link: '/certificate_template/list' }
]

const pagination = ref({
    page: 1,
    limit: 10
})

const addTemplate = () => {
    router.push('/certificate_template/create')
}

const editItem = (id: number) => {
    router.push(`/certificate_template/edit/${id}`)
}

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteTemplate(selectedId.value)
        if (success) {
            messageSuccess('Xóa thành công')
            await fetchTemplates()
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

const fetchTemplates = async () => {
    await store.fetchTemplates({
        page: pagination.value.page,
        limit: pagination.value.limit
    })
}

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await fetchTemplates()
}

onMounted(async () => {
    loading.setLoading(true)
    await fetchTemplates()
    loading.setLoading(false)
})
</script>