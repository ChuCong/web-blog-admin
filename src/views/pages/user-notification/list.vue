<!-- filepath: f:\Projects\LMS_MSD\Source\msd-admin\src\views\pages\usernotification\list.vue -->
<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
        <Content>
            <form class="flex gap-4 mb-4" @submit.prevent="onSearch">
                <InputTextOutline placeholder="Tên người dùng hoặc email" width="100" className="mb-2"
                    :value="search.name" @input="(value) => search.name = value" />
                <InputTextOutline placeholder="Tiêu đề thông báo" width="100" className="mb-2" :value="search.title"
                    @input="(value) => search.title = value" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
            <DataTable :itemHeader="Header" :itemValue="usernotifications" :paginate="paginate" @getPage="getPage">
                <template v-slot:user="item: any">
                    <div>{{ item.user?.full_name }}</div>
                </template>
                <template v-slot:title="item: any">
                    <div>{{ item.title }}</div>
                </template>
                <template v-slot:message="item: any">
                    <div v-html="item.message"></div>
                </template>
                <template v-slot:image_url="item: any">
                    <img class="flex justify-center" :src="item.image_url">
                </template>
                <template v-slot:link="item: any">
                    <a v-if="item.link" class="flex justify-center underline" :href="item.link" target="_blank">Mở</a>
                </template>
                <template v-slot:is_read="item: any">
                    <div>
                        <span v-if="item.is_read" class="text-green-600">Đã đọc</span>
                        <span v-else class="text-red-600">Chưa đọc</span>
                    </div>
                </template>
                <template v-slot:read_at="item: any">
                    <div v-if="item.read_at">{{ formatToVNTime(item.read_at) }}</div>
                </template>
                <template v-slot:created_at="item: any">
                    <div class="flex justify-center">{{ formatToVNTime(item.created_at) }}</div>
                </template>
                <template v-slot:action="item: any">
                    <div class="flex">
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
import { ref, computed, onMounted } from 'vue'
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import DataTable from "@/components/elements/DataTable.vue"
import { useUserNotificationStore } from '@/stores/userNotification'
import { formatToVNTime } from '@/common/date'
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess, messageError } from "@/common/message.service"

const store = useUserNotificationStore()

const isOpen = ref(false)
const selectedId = ref<number | null>(null)

const usernotifications = computed(() => store.usernotifications)
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Tên người dùng", value: "user", align: "left", width: 300 },
    { text: "Tiêu đề thông báo", value: "title", align: "left", width: 300 },
    { text: "Message", value: "message", align: "left", width: 300 },
    { text: "Ảnh", value: "image_url", align: "left" },
    { text: "Điều hướng", value: "link", align: "left" },
    { text: "Đã đọc", value: "is_read", align: "center", width: 100 },
    { text: "Thời gian đọc", value: "read_at", align: "center", width: 150 },
    { text: "Thời gian gửi", value: "created_at", align: "center", width: 150 },
]

const breadcrumb = [
    { name: "User Notification", link: '/usernotification/list' }
]

const search = ref({
    name: '',
    title: ''
})

const pagination = ref({
    page: 1,
    limit: 10
})

const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    }
    await store.fetchUserNotifications({
        ...pagination.value,
        ...search.value
    })
}

const onSearch = async () => {
    pagination.value.page = 1
    await store.fetchUserNotifications({
        ...pagination.value,
        ...search.value
    })
}

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteUserNotification(selectedId.value)
        if (success) {
            messageSuccess('Xóa thành công')
            await store.fetchUserNotifications({
                ...pagination.value,
                ...search.value
            })
        } else {
            messageError("Xóa lỗi")
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

onMounted(async () => {
    await store.fetchUserNotifications({
        ...pagination.value,
        ...search.value
    })
})
</script>