<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
        </SubHeader>
        <Content>
            <form class="flex gap-4 mb-4" @submit.prevent="onSearch">
                <InputTextOutline placeholder="Nhập tên người dùng" type="text" width="100" height="44"
                    :value="searchData.name" @input="(value) => searchData.name = value" />
                <InputTextOutline placeholder="Nhập Email" type="text" width="100" height="44" :value="searchData.email"
                    @input="(value) => searchData.email = value" />
                <InputTextOutline placeholder="Nhập SĐT" type="text" width="100" height="44" :value="searchData.phone"
                    @input="(value) => searchData.phone = value" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
            <DataTable :itemHeader="Header" :itemValue="contact" :paginate="paginate" @getPage="getPage">
                <template v-slot:action="item: any">
                    <div class="flex justify-center">
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
import DataTable from "@/components/elements/DataTable.vue"
import BtnInTable from "@/components/elements/BtnInTable.vue"
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { useRouter } from 'vue-router';
import { onMounted, computed, ref } from 'vue';
import { useContactStore } from '@/stores/contact';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import InputTextOutline from "@/components/elements/InputTextOutline.vue"
import { useLoadingStore } from '@/stores/loading';

const paginate = computed(() => store.paginate ?? {});
const loading = useLoadingStore();
const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const store = useContactStore();

const contact = computed(() => store.contact);
const searchData = ref({
    name: '',
    phone: '',
    email: ''
})

const Header = [
    { text: "ID", value: "id", align: "center", width: 120 },
    { text: "Tên", value: "name", align: "center", width: 120 },
    { text: "SĐT", value: "phone", align: "left", width: 180 },
    { text: "Email", value: "email", align: "left", width: 150 },
    { text: "Nội dung", value: "content", },
    { text: "Thao tác", value: "action", align: "center", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách liên hệ", link: '/contact/list' }
]
const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteContacts(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            const payload = {
                'name': searchData.value.name ? searchData.value.name : null,
                'phone': searchData.value.phone ? searchData.value.phone : null,
                'email': searchData.value.email ? searchData.value.email : null
            };
            await store.fetchContact(payload);
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


const onSearch = async () => {
    const payload = {
        'name': searchData.value.name ? searchData.value.name : null,
        'phone': searchData.value.phone ? searchData.value.phone : null,
        'email': searchData.value.email ? searchData.value.email : null
    };
    loading.setLoading(true)
    await store.fetchContact(payload);
    loading.setLoading(false)
};
onMounted(async () => {
    const payload = {
        'name': searchData.value.name ? searchData.value.name : null,
        'phone': searchData.value.phone ? searchData.value.phone : null,
        'email': searchData.value.email ? searchData.value.email : null
    };
    await store.fetchContact(payload);
});
const pagination = ref({
    page: 1,
    limit: 10
})
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchContact(pagination.value);
}
</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}

.biography {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
