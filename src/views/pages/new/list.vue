<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới Tin tức" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="news" :paginate="paginate" @getPage="getPage">
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:img="item: any">
                    <div v-if="item.media?.src_url">
                        <img :src="item.media?.src_url" alt="" class="w-[150px]">
                    </div>
                </template>
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
import { useNewsStore } from '@/stores/new';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const pagination = ref({
    page: 1,
    limit: 10
})
const router = useRouter();
const store = useNewsStore();

const news = computed(() => store.news);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Tên", value: "title" },
    { text: "mô tả", value: "description" },
    { text: "Link", value: "link"},
    { text: "Ảnh", value: "img"},
    { text: "Thao tác", value: "action", align: "center" },
]

const breadcrumb = [
    { name: "Danh sách tin tức", link: '/new/list' }
]

const addCategory = () => {
    router.push('/new/create');
};
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchNews(pagination.value);
}
const editItem = (id: number) => {
    router.push(`/new/edit/${id}`);
};

const fetchNews = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    await store.fetchNews(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteNew(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchNews();
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
    await fetchNews();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
