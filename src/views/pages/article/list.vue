<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addArticle" text="Thêm mới Bài viết" :width="250"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="articles" :paginate="paginate" @getPage="getPage">
                <template v-slot:content="item: any">
                    <div class="max-h-[150px] overflow-auto" v-html="item.content"></div>
                </template>
                <template v-slot:url="item: any">
                    <div class="flex">
                        <img :src="item.url" alt="ảnh" class="w-[200px] my-2" />
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
import { useArticleStore } from '@/stores/article';
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
const store = useArticleStore();

const articles = computed(() => store.articles);
const paginate = computed(() => store.paginate ?? {})

const Header = [
    { text: "Tên Bài viết", value: "title", align: "center", width: 400 },
    { text: "Slug", value: "slug", align: "center", width: 200 },
    { text: "Mô tả", value: "description", align: "center", width: 300 },
    { text: "Nội dung", value: "content", align: "center", width: 300 },
    { text: "Ảnh", value: "url", align: "center", width: 220 },
    { text: "Kích hoạt", value: "active", align: "center", width: 150 },
    { text: "Thao tác", value: "action", align: "center", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách Chuyên mục", link: '/category/list' }
]

const pagination = ref({
    page: 1,
    limit: 10
})

const addArticle = () => {
    router.push('/article/create');
};

const editItem = (id: number) => {
    router.push(`/article/edit/${id}`);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteArticle(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await store.fetchArticles();
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
    await store.fetchArticles({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
});

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await store.fetchArticles({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
}

const article = ref<any>({});
const updatePublished = async (status: any, id: any) => {
    loading.setLoading(true)
    // await projectComp.detailProject(id)
    await store.getArticleDetail(id);
    article.value = store.articleDetail;
    article.value.active = status;
    await store.saveArticle(article.value)
    loading.setLoading(false);
}
</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
