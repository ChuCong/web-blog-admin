<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4">
            <BtnBase @click="addCategory" text="Thêm mới FAQ" :width="200"></BtnBase>
        </SubHeader>
        <Content>
            <DataTable :itemHeader="Header" :itemValue="faq" :paginate="paginate" @getPage="getPage">
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:answer="item: any">
                    <div v-html="item.answer"></div>
                </template>
                <template v-slot:type="item: any">
                    <div class="flex">
                        <Switch v-model="item.type" @update:modelValue="updateType($event, item)" />
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
import { useFaqStore } from '@/stores/faq';
import penIcon from '@/assets/images/icon/pen-icon.svg'
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import Switch from "@/components/elements/Switch.vue"
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const pagination = ref({
    page: 1,
    limit: 10
})
const router = useRouter();
const store = useFaqStore();

const faq = computed(() => store.faq);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Câu hỏi", value: "title", align: "left" },
    { text: "Câu trả lời", value: "answer", align: "left" },
    { text: "Kích hoạt", value: "type", align: "center"},
    { text: "Thao tác", value: "action", align: "center" },
]

const breadcrumb = [
    { name: "Danh sách FAQ", link: '/faq/list' }
]

const addCategory = () => {
    router.push('/faq/create');
};
const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchFaq(pagination.value);
}
const editItem = (id: number) => {
    router.push(`/faq/edit/${id}`);
};
const updateType = async (type, item) => {
    item.type = type ? '1' : '0';
    const data = await store.saveFaq(item);
    if (data.status === 1) {
        await fetchFaq();
    }
}
const fetchFaq = async () => {
    const payload = {
        limit: 10,
        page: 1
    }
    await store.fetchFaq(payload);
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await store.deleteFaq(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await fetchFaq();
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
    await fetchFaq();
});

</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
