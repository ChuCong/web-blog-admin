<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới tài nguyên" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="testimonial" :paginate="paginate" @getPage="getPage">
                <template v-slot:lesson="item: any">
                    <div>{{ item.lesson.title }}
                    </div>
                </template>
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:image="item: any">
                    <div class="w-[250px]" v-if="item.media?.src_url">
                        <img :src="item.media?.src_url" alt="">
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
import { useTestimonialStore } from '@/stores/testimonial';
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
const store = useTestimonialStore();

const testimonial = computed(() => store.testimonial);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Họ tên", value: "name" },
    { text: "Ảnh", value: "image" },
    { text: "Lời dẫn", value: "introduction" , width: 300},
    { text: "Url Khóa học", value: "url_course" },
    { text: "Thao tác", value: "action" },
]

const breadcrumb = [
    { name: "Danh sách Tài nguyên", link: '/testimonial/list' }
]

const addCategory = () => {
    router.push('/setting/testimonial/create');
};
const editItem = (id: number) => {
    router.push(`/setting/testimonial/edit/${id}`);
};
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchTestimonial(pagination.value);
}


const downloadFileGoogleDrive = (url: string) => {
    const fileId = url.split('/d/')[1].split('/')[0];
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    window.location.href = downloadUrl;
};

const downloadFile = (url: string) => {
    window.open(url, '_blank');
};

const fetchtestimonial = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    await store.fetchTestimonial(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteTestimonial(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchtestimonial();
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
    await fetchtestimonial();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
