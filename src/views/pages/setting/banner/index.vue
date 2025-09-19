<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới Banner" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="banner">
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:image="item: any">
                    <div v-if="item.url_image">
                        <img :src="item.url_image" alt="" class="w-[150px]">
                    </div>
                </template>
                <template v-slot:content="item: any">
                    <div v-if="item.content">
                        <div v-html="item.content"></div>
                    </div>
                </template>
                <template v-slot:list_content="item: any">
                    <div v-if="item.list_contents">
                        <ul>
                            <li v-for="(content, index) in item.list_contents" :key="index" class="p-1">
                                <span class="dot">.</span> {{ content.title }}
                            </li>
                        </ul>
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
import { useSettingStore } from '@/stores/setting';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter();
const store = useSettingStore();
const banner = computed(() => store.banner);
const Header = [
    { text: "Id", value: "id" },
    { text: "Tên", value: "title" },
    { text: "Ảnh", value: "image" },
    { text: "Nội dung (list)", value: "list_content" },
    { text: "Nội dung (Html)", value: "content" },
    { text: "Url khóa học", value: "url_course" },
    { text: "Thao tác", value: "action", align: "center" },
]

const breadcrumb = [
    { name: "Danh sách banner", link: '/setting/banner' }
]
const addCategory = () => {
    router.push('/setting/banner/create');
};

const editItem = (id: number) => {
    router.push(`/setting/banner/edit/${id}`);
};

const fetchbanner = async () => {
    const payload = {
        key: 'banner'
    }
    await store.fetchSettingByKey(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null && store.settingDetail?.key === 'banner') {
        const currentBanner = store.banner;
        const updatedBanner = currentBanner.filter(item => item.id !== selectedId.value);
        store.banner = updatedBanner;
        store.settingDetail.value = updatedBanner;
        const success = await store.saveSettingHome(store.settingDetail);
        if (success) {
            messageSuccess('Lưu thành công');
            router.push('/setting/banner');
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
    await fetchbanner();
});

</script>
<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
