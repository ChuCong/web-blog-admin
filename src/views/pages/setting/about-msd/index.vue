<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="aboutMsd">
                <template v-slot:content="item: any">
                    <div v-html="item.content">
                    </div>
                </template>
                <template v-slot:img="item: any">
                    <div v-if="item.url_youtube && item.type === LINK">
                       <iframe 
                            :src="convertToEmbedUrl(item.url_youtube)" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen 
                            width="250" 
                            height="130"
                            class="rounded-lg">
                        </iframe>
                    </div>
                    <div v-else-if="item.url_media && item.type === IMAGE">
                        <img v-if="item.url_media" :src="item.url_media" alt="" class="w-[250px] h-auto">
                    </div>
                    <div v-else-if="item.url_media && item.type === VIDEO" class="mt-2">
                    <video controls class="w-[250px] h-auto rounded-lg ">
                        <source :src="item.url_media" type="video/mp4" />
                    </video>
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
import { LINK, IMAGE, VIDEO } from "@/config/constant"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const router = useRouter();
const store = useSettingStore();
const convertToEmbedUrl = (url: any) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([\w\-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : undefined;
}
const aboutMsd = computed(() => store.aboutMsd);
const Header = [
    { text: "Nội dung", value: "content" },
    { text: "Ảnh", value: "img"},
    { text: "Thao tác", value: "action", align: "center" },
]

const breadcrumb = [
    { name: "Danh sách About Msd", link: '/setting/about-msd/list' }
]

const addCategory = () => {
    router.push('/setting/about-msd/create');
};

const editItem = (id: number) => {
    router.push(`/setting/about-msd/edit/${id}`);
};

const fetchAboutMsd = async () => {
    const payload = {
        key: 'about-msd'
    }
    await store.fetchSettingByKey(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null && store.settingDetail?.key === 'about-msd') {
        const currentAboutMsd = store.aboutMsd;
        const updatedAboutMsd = currentAboutMsd.filter(item => item.id !== selectedId.value);
        store.aboutMsd = updatedAboutMsd;
        store.settingDetail.value = updatedAboutMsd;
        const success = await store.saveSettingHome(store.settingDetail);
        if (success) {
            messageSuccess('Lưu thành công');
            router.push('/setting/about-msd');
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
    await fetchAboutMsd();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
