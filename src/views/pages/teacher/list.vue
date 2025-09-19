<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addTeacher" text="Thêm mới Giảng viên" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <form class="flex gap-4 mb-4" @submit.prevent="onSearch">
                <InputTextOutline placeholder="Nhập tên Giảng viên" type="text" width="100" height="44"
                    :value="searchData.full_name" @input="(value) => searchData.full_name = value" />
                <InputTextOutline placeholder="Nhập Email" type="text" width="100" height="44" :value="searchData.email"
                    @input="(value) => searchData.email = value" />
                <InputTextOutline placeholder="Nhập SĐT" type="text" width="100" height="44"
                    :value="searchData.phone_number" @input="(value) => searchData.phone_number = value" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
            <DataTable :itemHeader="Header" :itemValue="teachers" :paginate="paginate" @getPage="getPage">
                <template v-slot:avatar_full_url="item: any">
                    <div class="w-[200px]">
                        <img v-if="item.avatar_full_url" :src="item.avatar_full_url" alt="ảnh" class="w-[200px] my-2" />
                    </div>
                </template>
                <template v-slot:biography="item: any">
                    <div class="group">
                        <div v-html="item.biography"
                            class="biography  group-hover:line-clamp-none ">
                        </div>
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
import { useRouter } from 'vue-router';
import { onMounted, computed, ref } from 'vue';
import { useTeacherStore } from '@/stores/teacher';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import InputTextOutline from "@/components/elements/InputTextOutline.vue"
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();
const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter();
const store = useTeacherStore();

const teachers = computed(() => store.teachers);
const searchData = ref({
    full_name: '',
    phone_number: '',
    email: ''
})

const Header = [
    { text: "Ảnh", value: "avatar_full_url", align: "center", width: 120 },
    { text: "Tên Giảng viên", value: "full_name", align: "left", width: 180 },
    { text: "Email", value: "email", align: "left", width: 150 },
    { text: "Số điện thoại", value: "phone_number", align: "left", width: 140 },
    { text: "Tuổi", value: "age", align: "center", width: 80 },
    { text: "Vị trí", value: "position", align: "left", width: 120 },
    { text: "Tổ chức", value: "organization", align: "left", width: 140 },
    { text: "Tiểu sử", value: "biography", align: "left", width: 250 },
    { text: "Lĩnh vực chuyên môn", value: "area_of_expertise", align: "left", width: 160 },
    { text: "Kỹ năng", value: "skills", align: "left", width: 160 },
    { text: "LinkedIn ", value: "linkedin_link", align: "left", width: 140 },
    { text: "Facebook", value: "fb_link", align: "left", width: 140 },
    { text: "Trạng thái", value: "status", align: "center", width: 100 },
    { text: "Thao tác", value: "action", align: "center", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách Giảng viên", link: '/teacher/list' }
]

const addTeacher = () => {
    router.push('/teacher/create');
};

const editItem = (id: number) => {
    router.push(`/teacher/edit/${id}`);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteTeacher(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            const payload = {
                'full_name': searchData.value.full_name ? searchData.value.full_name : null,
                'phone_number': searchData.value.phone_number ? searchData.value.phone_number : null,
                'email': searchData.value.email ? searchData.value.email : null
            };
            await store.fetchTeachers(payload);
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
        'full_name': searchData.value.full_name ? searchData.value.full_name : null,
        'phone_number': searchData.value.phone_number ? searchData.value.phone_number : null,
        'email': searchData.value.email ? searchData.value.email : null
    };
    loading.setLoading(true)
    await store.fetchTeachers(payload);
    loading.setLoading(false)
};
onMounted(async () => {
    const payload = {
        'full_name': searchData.value.full_name ? searchData.value.full_name : null,
        'phone_number': searchData.value.phone_number ? searchData.value.phone_number : null,
        'email': searchData.value.email ? searchData.value.email : null
    };
    await store.fetchTeachers(payload);
});

const paginate = computed(() => {
    return {};
})

const getPage = (params) => {
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
