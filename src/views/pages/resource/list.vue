<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới tài nguyên" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="resource" :paginate="paginate" @getPage="getPage">
                <template v-slot:lesson="item: any">
                    <div>{{ item.lesson.title }}
                    </div>
                </template>
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:image_thumbnail_url="item: any">
                    <img :src="item.image_thumbnail_url" alt="">
                </template>
                <template v-slot:tags="item: any">
                    <span v-if="item.tags">{{item.tags.map(tag => tag.name).join(', ')}}</span>
                </template>
                <template v-slot:download="item: any">
                    <div v-if="item.type === LINK" @click="downloadFileGoogleDrive(item.url)"
                        class=" cursor-pointer  flex justify-center">
                        <img src="@/assets/images/download.png" alt="" class="w-[35px]">
                    </div>
                    <div v-else @click="downloadFile(item.media.src_url)" class=" cursor-pointer  flex justify-center">
                        <img src="@/assets/images/download.png" alt="" class="w-[35px]">
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
import { useResourceStore } from '@/stores/resource';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageError, messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import penIcon from '@/assets/images/icon/pen-icon.svg'
import { LINK } from "@/config/constant"
const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const pagination = ref({
    page: 1,
    limit: 10
})
const router = useRouter();
const store = useResourceStore();

const resource = computed(() => store.resource);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Tên tài Nguyên", value: "title" },
    { text: "Loại file", value: "type" },
    { text: "Ảnh Thumbnail", value: "image_thumbnail_url" },
    { text: "Tags", value: "tags" },
    { text: "download", value: "download" },
    { text: "Thao tác", value: "action" },
]

const breadcrumb = [
    { name: "Danh sách Tài nguyên", link: '/resource/list' }
]

const addCategory = () => {
    router.push('/resource/create');
};
const editItem = (id: number) => {
    router.push(`/resource/edit/${id}`);
};
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchResource(pagination.value);
}


const downloadFileGoogleDrive = (url: string) => {
    const fileId = url.split('/d/')[1].split('/')[0];
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    window.location.href = downloadUrl;
};

const downloadFile = (url: string) => {
    window.open(url, '_blank');
};

const fetchResource = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    await store.fetchResource(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteResource(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchResource();
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
    await fetchResource();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
