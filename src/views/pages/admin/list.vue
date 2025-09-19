<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addAdmins" text="Thêm mới tài khoản" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <form class="flex gap-4 mb-4" @submit.prevent="onSearch">
                <InputTextOutline placeholder="Nhập tên" type="text" width="100" height="44" :value="searchData.name"
                    @input="(value) => searchData.name = value" />
                <InputTextOutline placeholder="Nhập tên đăng nhập" type="text" width="100" height="44"
                    :value="searchData.user_name" @input="(value) => searchData.user_name = value" />
                <InputTextOutline placeholder="Nhập Email" type="text" width="100" height="44" :value="searchData.email"
                    @input="(value) => searchData.email = value" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
            <DataTable :itemHeader="Header" :itemValue="admins" :paginate="paginate" @getPage="getPage">
                <template v-slot:action="item: any">
                    <div class="flex justify-center">
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
import { useRouter } from 'vue-router';
import { onMounted, computed, ref } from 'vue';
import { useAdminStore } from '@/stores/admin';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import { useLoadingStore } from '@/stores/loading';
import InputTextOutline from "@/components/elements/InputTextOutline.vue"

const loading = useLoadingStore();
const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const pagination = ref({
    page: 1,
    limit: 10
})
const router = useRouter();
const store = useAdminStore();

const admins = computed(() => store.admins ?? []);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Tên", value: "name", align: "left", width: 200 },
    { text: "Tên đăng nhập", value: "user_name", align: "left", width: 200 },
    { text: "Email", value: "email", align: "center", width: 200 },
    { text: "Thao tác", value: "action", align: "center", width: 200 },
]

const breadcrumb = [
    { name: "Danh sách tài khoản", link: '/admin/list' }
]
const searchData = ref({
    name: '',
    user_name: '',
    email: ''
})
const addAdmins = () => {
    router.push('/admin/create');
};
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchAdmin(pagination.value);
}
const editItem = (id: number) => {
    router.push(`/admin/edit/${id}`);
};
const onSearch = async () => {
    const payload = {
        ...pagination.value,
        name: searchData.value.name,
        user_name: searchData.value.user_name,
        email: searchData.value.email
    }
    await store.fetchAdmin(payload);
};
const fetchAdmins = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    loading.setLoading(true)
    await store.fetchAdmin(payload);
    loading.setLoading(false)
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteAdmin(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchAdmins();
        }
    }
    isOpen.value = false;
    selectedId.value = null;
};

const onCancel = () => {
    isOpen.value = false;
    selectedId.value = null;
};
const openDeletePopup = (id: number) => {
    selectedId.value = id;
    isOpen.value = true;
};

onMounted(async () => {
    await fetchAdmins();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
