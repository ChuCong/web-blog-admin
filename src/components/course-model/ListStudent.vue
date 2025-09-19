<template>
    <Content>
        <div class="flex justify-between mb-4">
            <form class="flex gap-4" @submit.prevent="onSearch">
                <InputTextOutline :value="search.keyword" @input="(value) => search.keyword = value"
                    placeholder="Tên người dùng hoặc email" width="100" class="mb-2" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
        </div>
        <DataTable :itemHeader="Header" :itemValue="users" :paginate="paginate" @getPage="getPage" @sort="onSortChange">
            <template v-slot:full_name="item: any">
                <div>{{ item.full_name }}</div>
            </template>
            <template v-slot:email="item: any">
                <div>{{ item.email }}</div>
            </template>
            <template v-slot:phone_number="item: any">
                <div>{{ item.phone_number }}</div>
            </template>
            <template v-slot:avatar="item: any">
                <div v-if="item.avatar" class="flex justify-center">
                    <img :src="item.avatar" alt="" class="w-[48px] rounded-full" />
                </div>
            </template>
            <template v-slot:created_at="item: any">
                <div>{{ formatToVNTime(item.created_at) }}</div>
            </template>
            <template v-slot:active="item: any">
                <Switch v-model="item.active" @update:modelValue="updateStatus($event, item)" />
            </template>
        </DataTable>
    </Content>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SubHeader from "@/views/theme/SubHeader.vue";
import Content from "@/views/theme/Content.vue";
import DataTable from "@/components/elements/DataTable.vue";
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { useUserStore } from '@/stores/user';
import Switch from "@/components/elements/Switch.vue"
import { formatToVNTime } from '@/common/date';
import { useLoadingStore } from '@/stores/loading';
import { messageError, messageSuccess } from "@/common/message.service"

const loading = useLoadingStore();
const store = useUserStore();
const users = computed(() => store.users);
const paginate = computed(() => store.paginate ?? {});

const props = defineProps<{ courseId?: string }>()

const Header = [
    { text: "Tên người dùng", value: "full_name", align: "left", width: 400, order: true },
    { text: "Avatar", value: "avatar", align: "center", width: 80 },
    { text: "Email", value: "email", align: "left", width: 400, order: true },
    { text: "Số điện thoại", value: "phone_number", align: "left", width: 150, order: true },
    { text: "Địa chỉ", value: "address", align: "left", width: 150, order: true },
    { text: "Dân tộc", value: "ethnicity", align: "left", width: 150, order: true },
    { text: "Tình trạng khuyết tật", value: "disability", align: "left", width: 150, order: true },
    { text: "Học vấn", value: "education", align: "left", width: 150, order: true },
    { text: "Đơn vị công tác", value: "organization", align: "left", width: 150, order: true },
    { text: "Ngày tạo tài khoản", value: "created_at", align: "left", width: 150, order: true, default: true },
    { text: "Trạng thái", value: "active", align: "left", width: 150 },
];

const search = ref({
    keyword: '',
    course_id: props.courseId
});

const sort = ref({
    sortField: 'created_at',
    sortOrder: 'desc'
})

const pagination = ref({
    page: 1,
    limit: 10
});

const getPage = async (params: any) => {
    loading.setLoading(true)
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchUsers({
        ...pagination.value,
        ...search.value,
        ...sort.value
    });
    loading.setLoading(false)
};

const onSearch = async () => {
    loading.setLoading(true)
    pagination.value.page = 1;
    await store.fetchUsers({
        ...pagination.value,
        ...search.value,
        ...sort.value
    });
    loading.setLoading(false)
};

onMounted(async () => {
    loading.setLoading(true)
    await store.fetchUsers({
        ...pagination.value,
        ...search.value,
        ...sort.value
    });
    loading.setLoading(false)
});

const updateStatus = async (status, item) => {
    if (item.id) {
        loading.setLoading(true)
        const response = await store.updateStatus(item.id, status);
        loading.setLoading(false)
        if (response) {
            messageSuccess("Cập nhật trạng thái Người dùng thành công!")
        } else {
            messageError("Cập nhật trạng thái Người dùng thất bại!")
        }
    }
}

const onSortChange = (newSort: any) => {
    sort.value = newSort
    onSearch()
}
</script>