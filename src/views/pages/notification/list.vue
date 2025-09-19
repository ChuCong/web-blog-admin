<!-- filepath: src/views/pages/notification/list.vue -->
<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addNotification" text="Tạo thông báo" :width="200" />
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="notifications" :paginate="paginate" @getPage="getPage">
                <template v-slot:message="item: any">
                    <div class="flex justify-center" v-html="item.message"></div>
                </template>
                <template v-slot:image_url="item: any">
                    <img class="flex justify-center" :src="item.image_url">
                </template>
                <template v-slot:link="item: any">
                    <a v-if="item.link" class="flex justify-center underline" :href="item.link" target="_blank">Mở</a>
                </template>
                <template v-slot:type="item: any">
                    <span :class="{
                        'text-blue-500': item.type === 'info',
                        'text-green-500': item.type === 'success',
                        'text-yellow-500': item.type === 'warning',
                        'text-red-500': item.type === 'error'
                    }">{{ item.type }}</span>
                </template>
                <template v-slot:audience="item: any">
                    <span v-if="item.audience === AUDIENCE_TYPE.ALL">Tất cả</span>
                    <span v-else-if="item.audience === AUDIENCE_TYPE.COURSE">Khóa học</span>
                    <span v-else>Tùy chọn</span>
                </template>
                <template v-slot:send_type="item: any">
                    <span v-if="item.send_type === SEND_TYPE.NOW">Ngay bây giờ</span>
                    <span v-else>Hẹn giờ</span>
                </template>
                <template v-slot:send_time_type="item: any">
                    <span v-if="item.send_time_type === SCHEDULE_TYPE.SPECIFIC_DATE">Ngay cụ thể</span>
                    <span v-else-if="item.send_time_type === SCHEDULE_TYPE.DAILY">Hằng ngày</span>
                    <span v-else-if="item.send_time_type === SCHEDULE_TYPE.WEEKLY">Hằng tuần</span>
                    <span v-else-if="item.send_time_type === SCHEDULE_TYPE.MONTHLY">Hàng tháng</span>
                </template>
                <template v-slot:start_date="item: any">
                    <div class="flex justify-center" v-if="item.start_date">{{ formatDate(item.start_date) }}</div>
                </template>
                <template v-slot:end_date="item: any">
                    <div class="flex justify-center" v-if="item.end_date">{{ formatDate(item.end_date) }}</div>
                </template>
                <template v-slot:specific_date="item: any">
                    <span v-if="item.send_time_type === SCHEDULE_TYPE.SPECIFIC_DATE">{{ item.specific_date }}</span>
                    <span v-else-if="item.send_time_type === SCHEDULE_TYPE.WEEKLY && item.send_day">{{
                        item.send_day
                            ?.map(day => {
                                const found = weekDays.find(w => w.value === day);
                                return found ? found.label : day;
                            })
                            .join(', ')}}</span>
                    <span v-else-if="item.send_time_type === SCHEDULE_TYPE.MONTHLY && item.send_day">
                        {{ item.send_day }}
                    </span>
                </template>
                <template v-slot:times="item: any">
                    <div v-if="item.notification_times && item.notification_times.length">
                        <span>
                            {{item.notification_times.map(t => formatTime(t.time)).join(', ')}}
                        </span>
                    </div>
                </template>
                <template v-slot:created_at="item: any">
                    <div class="flex justify-center">{{ formatToVNTime(item.created_at) }}</div>
                </template>
                <template v-slot:status="item: any">
                    <div class="flex">
                        <Switch v-model="item.status" @update:modelValue="updateStatus($event, item)" />
                    </div>
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
import { useNotificationStore } from '@/stores/notification'
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import { formatDate, formatTime, formatToVNTime } from '@/common/date';
import Switch from "@/components/elements/Switch.vue"
import { NOTIFICATION_TYPE, AUDIENCE_TYPE, SEND_TYPE, SCHEDULE_TYPE } from '@/config/constant'

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter()
const store = useNotificationStore()

const notifications = computed(() => store.notifications)
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Tiêu đề", value: "title", align: "left" },
    { text: "Nội dung", value: "message", align: "left" },
    { text: "Ảnh", value: "image_url", align: "left" },
    { text: "Điều hướng", value: "link", align: "left" },
    { text: "Loại", value: "type", align: "left", width: 100 },
    { text: "Đối tượng", value: "audience", align: "left", width: 120 },
    { text: "Hình thức gửi", value: "send_type", align: "left", width: 180 },
    { text: "Loại thời gian gửi", value: "send_time_type", align: "left", width: 180 },
    { text: "Ngày bắt đầu", value: "start_date", align: "left", width: 180 },
    { text: "Ngày kết thúc", value: "end_date", align: "left", width: 180 },
    { text: "Ngày gửi", value: "specific_date", align: "left", width: 180 },
    { text: "Thời gian gửi", value: "times", align: "left", width: 180 },
    { text: "Thời gian tạo", value: "created_at", align: "left", width: 180 },
    { text: "Trạng thái", value: "status", align: "left", width: 180 },
    { text: "Thao tác", value: "action", align: "left", width: 120 }
]

const weekDays = [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 }
];

const breadcrumb = [
    { name: "Danh sách thông báo", link: '/notification/list' }
]

const pagination = ref({
    page: 1,
    limit: 10
})

const addNotification = () => {
    router.push('/notification/create')
}

const editItem = (id: number) => {
    router.push(`/notification/edit/${id}`)
}

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteNotification(selectedId.value)
        if (success) {
            messageSuccess('Xóa thành công')
            await fetchNotifications()
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

const fetchNotifications = async () => {
    await store.fetchNotifications({
        page: pagination.value.page,
        limit: pagination.value.limit
    })
}

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await fetchNotifications()
}

const updateStatus = async (status, item) => {
    await store.updateNotificationStatus(item.id, status);
}

onMounted(async () => {
    await fetchNotifications()
})
</script>