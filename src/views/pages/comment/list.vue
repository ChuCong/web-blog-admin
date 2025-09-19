<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="comment" :paginate="paginate" @getPage="getPage">
                <template v-slot:title="item">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:full_name="item">
                    <div>{{ item.user.full_name }}</div>
                </template>
                <template v-slot:avatar="item">
                    <div v-if="item.user.avatar">
                        <img :src="item.user.avatar" alt="" class="w-[60px] rounded-[50%]">
                    </div>
                </template>
                <template v-slot:email="item">
                    <div>{{ item.user.email }}</div>
                </template>
                <template v-slot:view="item">
                    <a :href="urlFront + `khoa-hoc/` + item.lesson.slug + item.course.slug" target="_blank"
                        class="w-5">
                        Xem
                    </a>
                </template>
                <template v-slot:action="item">
                    <div class="flex">
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
import { useCommentStore } from '@/stores/comment';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const urlFront = import.meta.env.VITE_URL_FRONT;
const pagination = ref({
    page: 1,
    limit: 10
})
const store = useCommentStore();
const comment = computed(() => store.comment);
const paginate = computed(() => store.paginate ?? {});
const Header = [
    { text: "Tên Người dùng", value: "full_name" },
    { text: "Avatar", value: "avatar" },
    { text: "Email", value: "email" },
    { text: "Nội dung", value: "content" },
    { text: "Xem bình luận", value: "view" },
    { text: "Thao tác", value: "action", content_align: "center" },
]

const breadcrumb = [
    { name: "Danh sách Comment", link: '/comment/list' }
]

const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchComment(pagination.value);
}

const fetchComment = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    await store.fetchComment(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteComment(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchComment();
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
    await fetchComment();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
