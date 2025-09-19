<!-- filepath: src/views/pages/notification/create.vue -->
<template>
    <SubHeader :breadcrumb="breadcrumb" />
    <Content>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Tiêu đề</label>
            <InputTextOutline placeholder="Nhập tiêu đề" type="text" width="100" height="44" :value="form.title"
                @input="(v) => form.title = v" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Nội dung</label>
            <InputQuillEditor :placeholder="'Nhập nội dung'" v-model="form.message" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Đường dẫn điều hướng</label>
            <InputTextOutline placeholder="Nhập Đường dẫn điều hướng" type="text" width="100" height="44"
                :value="form.link" @input="(v) => form.link = v" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Upload ảnh</label>
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
            <div v-if="form.image_url" class="mt-2">
                <img :src="form.image_url" alt="preview" width="300" />
            </div>
            <p class="text-red-500 mt-1">{{ imageError }}</p>
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Loại thông báo</label>
            <InputTextOutline type="select" :items="typeOptions" item-text="label" item-value="value" :value="form.type"
                @input="(v) => form.type = v" width="100" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Đối tượng nhận</label>
            <InputTextOutline type="select" :items="audienceOptions" item-text="label" item-value="value"
                :value="form.audience" @input="onAudienceChange" width="100" />
        </div>
        <div v-if="form.audience === AUDIENCE_TYPE.COURSE" class="mb-4">
            <label class="block font-semibold mb-2">Chọn khóa học</label>
            <InputTextOutline type="select" :items="courses" item-text="title" item-value="id"
                :value="form.target_ids?.[0] || ''" @input="(v) => form.target_ids = v ? [v] : []" width="100" />
        </div>
        <div v-if="form.audience === AUDIENCE_TYPE.CUSTOM" class="mb-4 relative">
            <label class="block font-semibold mb-2">Chọn người nhận</label>
            <InputTextOutline placeholder="Nhập tên người dùng hoặc email" type="text" width="100"
                :value="search.keyword" @input="(value) => searchUsersByInput(value)" class="-mt-2" />
            <transition name="slide-fade">
                <div v-if="showSearchUsers" class="list-search slide-in ">
                    <template v-if="users && users.length > 0">
                        <div class="overflow-auto scroll_list_users px-[15px]" ref="scrollableDiv">
                            <ul v-for="(item, index) in users" :key="index"
                                class="list-box rounded-[4px] border border-[#CED4DA] p-[10px] my-[10px] cursor-pointer"
                                @click="selectedUser(item)">
                                <li>
                                    <p class="text-[16px] font-medium mb-2">{{ item.full_name }} - {{ item.email }}</p>
                                </li>
                            </ul>
                        </div>
                    </template>
                    <div class="my-3">
                        <div class="bg-[#397494] py-[6px] px-[10px] rounded-[4px] w-[100px] text-center m-auto">
                            <button @click="closeListSearchUsers" type="button">
                                <p class="text-[#fff] text-[14px]">Đóng</p>
                            </button>
                        </div>
                    </div>
                </div>
            </transition>
            <div class="flex flex-wrap gap-2 my-8">
                <div v-for="(user, idx) in selectedUsers" :key="user.id"
                    class="relative flex items-center bg-[#f3f4f6] rounded px-3 py-2 mr-2 mb-2 shadow">
                    <div>
                        <span class="font-medium">{{ user.full_name }}</span>
                        <span class="text-gray-500 ml-2 text-sm">- {{ user.email }}</span>
                    </div>
                    <button
                        class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        @click="removeSelectedUser(idx)">
                        ×
                    </button>
                </div>
            </div>
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-2">Thời gian gửi</label>
            <InputTextOutline type="select" :items="sendTypeOptions" item-text="label" item-value="value"
                :value="form.send_type" @input="onSendTypeChange" width="100" />
            <div v-if="form.send_type === SEND_TYPE.SET_A_TIMER" class="ml-10">
                <div class="mb-4">
                    <label class="block font-semibold my-4">Kiểu gửi</label>
                    <InputTextOutline type="select" :items="scheduleTypeOptions" item-text="label" item-value="value"
                        :value="form.send_time_type" @input="(v) => form.send_time_type = v" width="100" />
                </div>
                <div class="flex gap-4 mb-4" v-if="form.send_time_type != SCHEDULE_TYPE.SPECIFIC_DATE">
                    <div>
                        <label class="block font-semibold mb-2">Ngày bắt đầu</label>
                        <VueDatePicker v-model="form.start_date" placeholder="Ngày bắt đầu"
                            :enable-time-picker="false" />
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Ngày Kết thúc</label>
                        <VueDatePicker v-model="form.end_date" placeholder="Ngày kết thúc"
                            :enable-time-picker="false" />
                    </div>
                </div>

                <!-- Nếu gửi 1 lần -->
                <div v-if="form.send_time_type === SCHEDULE_TYPE.SPECIFIC_DATE" class="mb-4">
                    <div>
                        <label class="block font-semibold my-4">Ngày Gửi</label>
                        <VueDatePicker v-model="form.specific_date" placeholder="Chọn ngày"
                            :enable-time-picker="false" />
                    </div>
                    <div>
                        <label class="block font-semibold my-4">Giờ Gửi</label>
                        <VueTimepicker v-model="newTime" placeholder="Chọn giờ gửi" />
                        <button type="button" @click="addTime"
                            class="bg-blue-500 text-white px-2 py-1 rounded mx-2">Thêm</button>
                    </div>
                </div>

                <div v-if="[SCHEDULE_TYPE.DAILY, SCHEDULE_TYPE.WEEKLY, SCHEDULE_TYPE.MONTHLY].includes(form.send_time_type)"
                    class="mb-4">
                    <div v-if="form.send_time_type === SCHEDULE_TYPE.WEEKLY" class="my-4">
                        <label class="block font-semibold my-4">Chọn ngày trong tuần</label>
                        <div class="flex gap-2">
                            <button v-for="d in weekDays" :key="d.value"
                                :class="{ 'bg-blue-500 text-white': form.send_day?.includes(d.value) }"
                                @click="toggleDayOfWeek(d.value)">
                                {{ d.label }}
                            </button>
                        </div>
                    </div>

                    <div v-if="form.send_time_type === SCHEDULE_TYPE.MONTHLY" class="mb-2">
                        <label class="block font-semibold my-4">Chọn ngày trong tháng (cách nhau bởi dấu phẩy)</label>
                        <InputTextOutline :value="form.send_day" @input="(v) => form.send_day = v"
                            placeholder="Nhập các ngày trong tháng, cách nhau bởi dấu phẩy" />
                    </div>
                    <!-- Chọn nhiều mốc giờ gửi -->
                    <label class="block font-semibold mb-2">Các mốc giờ gửi</label>
                    <div class="flex gap-2 items-center mb-2">
                        <VueTimepicker v-model="newTime" placeholder="Chọn giờ gửi" />
                        <button type="button" @click="addTime"
                            class="bg-blue-500 text-white px-2 py-1 rounded">Thêm</button>
                    </div>
                </div>
                <div class="flex flex-wrap gap-2 mb-2">
                    <span v-for="(t, idx) in form.notification_times" :key="idx"
                        class="bg-gray-200 px-2 py-1 rounded flex items-center">
                        {{ formatTime(t.time) }}
                        <button type="button" @click="removeTime(idx)" class="ml-1 text-red-500">×</button>
                    </span>
                </div>
            </div>
        </div>
        <div class="flex gap-4 mt-4">
            <span>Trạng thái</span>
            <Switch v-model="form.status" @update:modelValue="updateStatus($event, form)" />
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
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { messageError, messageSuccess } from "@/common/message.service"
import { useNotificationStore } from '@/stores/notification'
import { useCourseStore } from '@/stores/course'
import { useUserStore } from '@/stores/user'
import { NOTIFICATION_TYPE, AUDIENCE_TYPE, SEND_TYPE, SCHEDULE_TYPE } from '@/config/constant'
import type { User } from "@/model"
import { useLoadingStore } from '@/stores/loading'
import { formatTime, formatDate } from '@/common/date'
import Switch from "@/components/elements/Switch.vue"
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue"

const loading = useLoadingStore();

const router = useRouter()
const route = useRoute()
const store = useNotificationStore()
const courseStore = useCourseStore()
const userStore = useUserStore()

const breadcrumb = [
    { name: "Danh sách thông báo", link: '/notification/list' },
    { name: "Tạo thông báo", link: '/notification/create' },
]

import type { Notification } from "@/model"

const form = ref<Notification>({
    title: '',
    message: '',
    image: '',
    image_url: '',
    link: '',
    type: NOTIFICATION_TYPE.INFO,
    audience: AUDIENCE_TYPE.ALL,
    target_ids: [],
    send_time_type: null,
    specific_date: null,
    send_day: [],
    start_date: '',
    end_date: '',
    notification_times: [],
    send_type: SEND_TYPE.NOW,
    status: 0
})

const typeOptions = [
    { label: 'Thông tin', value: NOTIFICATION_TYPE.INFO },
    { label: 'Thành công', value: NOTIFICATION_TYPE.SUCCESS },
    { label: 'Cảnh báo', value: NOTIFICATION_TYPE.WARNING },
    { label: 'Lỗi', value: NOTIFICATION_TYPE.ERROR }
]
const audienceOptions = [
    { label: 'Tất cả', value: AUDIENCE_TYPE.ALL },
    { label: 'Theo khóa học', value: AUDIENCE_TYPE.COURSE },
    { label: 'Tùy chọn người nhận', value: AUDIENCE_TYPE.CUSTOM }
]
const sendTypeOptions = [
    { label: 'Gửi ngay', value: SEND_TYPE.NOW },
    { label: 'Hẹn giờ', value: SEND_TYPE.SET_A_TIMER }
]

const courses = ref<any[]>([])

onMounted(async () => {
    loading.setLoading(true)
    courses.value = await courseStore.fetchAllCourses()
    if (route.params.id) {
        await store.getNotificationDetail(Number(route.params.id))
        Object.assign(form.value, store.notificationDetail)
        if (store.notificationDetail && store.notificationDetail.notification_times) {

        }
    }
    loading.setLoading(false)
})

const onAudienceChange = (v: any) => {
    form.value.audience = v
    form.value.target_ids = []
}
const onSendTypeChange = (v: any) => {
    form.value.send_type = v
    if (v === SEND_TYPE.NOW) {
        form.value.send_time_type = null
        form.value.specific_date = null
        form.value.send_day = []
        form.value.start_date = null
        form.value.end_date = null
        form.value.notification_times = []
    }
}

const onSubmit = async () => {
    if (!form.value.title) {
        messageError('Vui lòng nhập tiêu đề')
        return
    }
    if (form.value.specific_date)
        form.value.specific_date = formatDate(form.value.specific_date);
    if (form.value.start_date)
        form.value.start_date = formatDate(form.value.start_date);
    if (form.value.end_date)
        form.value.end_date = formatDate(form.value.end_date);

    loading.setLoading(true)
    const res = await store.saveNotification(form.value)
    loading.setLoading(false)
    if (res.status) {
        messageSuccess('Lưu thành công')
        router.push('/notification/list')
    } else {
        messageError('Lưu thất bại')
    }
}

//---------------------------------------------------------------Search User---------------------------------------------------------------
import debounce from "lodash/debounce"
const showSearchUsers = ref(false)
const scrollableDiv = ref()
const search = ref({
    page: 1,
    limit: 10,
    keyword: ''
})

const selectedUsers = reactive<User[]>([])
const users = computed(() => {
    return userStore.users
})

const searchUsers = async () => {
    showSearchUsers.value = true
    loading.setLoading(true)
    await userStore.fetchUsers(search.value)
    loading.setLoading(false)
}

const searchUsersByInput = debounce(async (input: any) => {
    search.value.keyword = input
    search.value.page = 1
    await searchUsers()
}, 500)

const selectedUser = (user: User) => {
    form.value.target_ids.push(user.id)
    selectedUsers.push(user)
}

const removeSelectedUser = (index: number) => {
    const user = selectedUsers[index]
    form.value.target_ids = form.value.target_ids.filter((id: number) => id !== user.id)
    selectedUsers.splice(index, 1)
}

const closeListSearchUsers = () => {
    showSearchUsers.value = false
}

// ---------------------------------------------------------------
import VueTimepicker from 'vue3-timepicker'
import VueDatePicker from '@vuepic/vue-datepicker';

const scheduleTypeOptions = [
    { label: 'Một lần', value: SCHEDULE_TYPE.SPECIFIC_DATE },
    { label: 'Hằng ngày', value: SCHEDULE_TYPE.DAILY },
    { label: 'Hằng tuần', value: SCHEDULE_TYPE.WEEKLY },
    { label: 'Hằng tháng', value: SCHEDULE_TYPE.MONTHLY }
];

const weekDays = [
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
    { label: 'Sun', value: 0 }
];

const toggleDayOfWeek = (day: number) => {
    if (!form.value.send_day) form.value.send_day = [];
    const idx = form.value.send_day.indexOf(day);
    if (idx === -1) form.value.send_day.push(day);
    else form.value.send_day.splice(idx, 1);
};

const newTime = ref('');
const addTime = () => {
    if (!form.value.notification_times) {
        form.value.notification_times = []
    }
    if (newTime.value && !form.value.notification_times.some(t => t.time === newTime.value)) {
        form.value.notification_times.push({ time: newTime.value });
        newTime.value = '';
    }
};

const removeTime = (idx: number) => {
    form.value.notification_times.splice(idx, 1);
};

const updateStatus = async (status, item) => {
    if (item.id) {
        await store.updateNotificationStatus(item.id, status);
    }
}

const imageError = ref('')
const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('upload', file)
    const url = await store.uploadImage(formData)
    if (url) {
        form.value.image = url
        form.value.image_url = url
        imageError.value = ''
    } else {
        imageError.value = 'File chưa đúng định dạng'
    }
}
</script>
<style lang="scss" scoped>
.list-search {
    @apply shadow-lg bg-white border border-black w-full mt-1 rounded-[10px];

    .list-box {
        @apply px-4 py-2;
    }

    .animate-spin {
        animation: spin 1s linear infinite;

        @keyframes spin {
            from {
                transform: rotate(0deg);
            }

            to {
                transform: rotate(360deg);
            }
        }
    }
}
</style>