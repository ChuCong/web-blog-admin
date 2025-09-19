<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới Chương trình học" :width="250"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="categories" :paginate="paginate" @getPage="getPage">
                <template v-slot:full_url="item: any">
                    <div class="flex">
                        <img :src="item.full_url" alt="ảnh" class="w-[200px] my-2" />
                    </div>
                </template>
                <template v-slot:active="item: any">
                    <Switch v-model="item.active" @update:modelValue="updatePublished($event, item.id)" />
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
import { useCategoryStore } from '@/stores/category';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import Switch from "@/components/elements/Switch.vue"
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();
const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter();
const store = useCategoryStore();

const categories = computed(() => store.categories);
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Tên Chương trình học", value: "title", align: "left", width: 400 },
    { text: "Slug", value: "slug", align: "left", width: 150 },
    { text: "Ảnh", value: "full_url", align: "left", width: 220 },
    { text: "Kích hoạt", value: "active", align: "left", width: 220 },
    { text: "Thao tác", value: "action", align: "left", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách Chương trình học", link: '/category/list' }
]

const pagination = ref({
    page: 1,
    limit: 10
})

const addCategory = () => {
    router.push('/category/create');
};

const editItem = (id: number) => {
    router.push(`/category/edit/${id}`);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteCategory(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await store.fetchCategories();
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
    await store.fetchCategories({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
});

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await store.fetchCategories({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
}

const category = ref<any>({});
const updatePublished = async (status: any, id: any) => {
    loading.setLoading(true)
    // await projectComp.detailProject(id)
    await store.getCategoryDetail(id);
    category.value = store.categoryDetail;
    category.value.active = status;
    await store.saveCategory(category.value)
    loading.setLoading(false);
}
</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
