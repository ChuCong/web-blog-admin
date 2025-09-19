<template>
    <div>
        <SubHeader class="mb-4">
            <BtnBase @click="addResource" text="Thêm mới tài nguyên" :width="200"></BtnBase>
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
                 <template v-slot:image_thumbnail="item: any">
                    <div v-if="item.image_thumbnail">
                        <img :src="item.image_thumbnail" alt="">
                    </div>
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
import { useCourseResourceStore } from '@/stores/course_resource';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageError, messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import penIcon from '@/assets/images/icon/pen-icon.svg'
import { LINK } from "@/config/constant"
import { useLoadingStore } from '@/stores/loading';

const props = defineProps<{ courseId?: string }>()

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const pagination = ref({
    page: 1,
    limit: 10
})
const router = useRouter();
const store = useCourseResourceStore();
const loading = useLoadingStore();

const resource = computed(() => store.resource);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Tên tài Nguyên", value: "title", align: "left", width: 300 },
    { text: "Loại file", value: "type", align: "left", width: 120 },
    { text: "Ảnh Thumbnail", value: "image_thumbnail", align: "center", width: 300 },
    { text: "download", value: "download", align: "center", width: 100 },
    { text: "Thao tác", value: "action", align: "center", width: 120 },
]

const addResource = () => {
    router.push(`/course/edit/${props.courseId}/resource/create`);
};
const editItem = (id: number) => {
    router.push(`/course/edit/${props.courseId}/resource/edit/${id}`);
};
const getPage = async (params) => {
    loading.setLoading(true)
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchResource({ ...pagination.value, course_id: props.courseId });
    loading.setLoading(false)
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
    loading.setLoading(true)
    const payload = {
        limit: 10,
        page: 1,
        course_id: props.courseId
    }
    await store.fetchResource(payload);
    loading.setLoading(false)
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        loading.setLoading(true);
        const success = await store.deleteResource(selectedId.value);
        loading.setLoading(false)
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchResource();
        } else {
            messageError('Xóa thất bại');
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
