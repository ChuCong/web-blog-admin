<template>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4">
        <div class="flex items-center gap-4">
            <BtnBase @click="showTagDialog = true" text="Thêm mới Tag" :width="200"></BtnBase>
            <BtnBase @click="showTagTypeDialog = true" text="Thêm mới Loại Tag" :width="200"></BtnBase>
        </div>
    </SubHeader>
    <Content>
        <DataTable :itemHeader="Header" :itemValue="tags" :paginate="paginate" @getPage="getPage">
            <template v-slot:name="item: any">
                <div class="flex gap-2">
                    <span>{{ item.name }}</span>
                    <BtnInTable @click="openEditTag(item)" :icon="penIcon" :height="20" :width="20" title="Delete" />
                </div>
            </template>
            <template v-slot:tagType="item: any">
                <div class="flex gap-2">
                    <span>{{ item.tag_type.name }}</span>
                    <BtnInTable @click="openEditTagType(item.tag_type)" :icon="penIcon" :height="20" :width="20"
                        title="Delete" />
                </div>
            </template>
            <template v-slot:show_in_course="item: any">
                <div class="flex gap-2">
                    <span class="text-primary font-bold" v-if="item.tag_type.show_in_course">Có</span>
                    <span v-else>Không</span>
                </div>
            </template>
            <template v-slot:action="item: any">
                <div class="flex justify-center">
                    <BtnInTable @click="openDeletePopup(item.id)" :icon="trashIcon" :height="20" :width="20"
                        title="Delete" />
                </div>
            </template>
        </DataTable>
        <PDialog v-model="showTagDialog" maxWidth="500px">
            <template #header>
                <h2 class="text-lg font-semibold">Thêm Tag</h2>
            </template>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Tên Tag</label>
                    <InputTextOutline placeholder="Nhập Tên Tag" type="text" width="100" height="44" :value="tag.name"
                        @input="(value) => tag.name = value" />
                </div>

                <div>
                    <label class="block text-sm font-medium mb-2">Loại Tag</label>
                    <InputTextOutline placeholder="Chọn Loại Tag" type="select" height="44" :value="tag.tag_type_id"
                        @input="(value) => tag.tag_type_id = value" :items="tagTypes" item-text="name" item-value="id"
                        class="w-full" width="100" />
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button type="button" @click="showTagDialog = false"
                    class="px-4 py-2 bg-gray-102 rounded hover:bg-gray-400">
                    Hủy
                </button>
                <button type="submit" class="px-4 py-2 text-white bg-primary hover:bg-blue-700 rounded w-[200px]"
                    @click="addTag">
                    Lưu
                </button>
            </div>
        </PDialog>
        <PDialog v-model="showTagTypeDialog" maxWidth="500px">
            <template #header>
                <h2 class="text-lg font-semibold">Thêm Loại Tag</h2>
            </template>

            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Tên Loại Tag</label>
                    <InputTextOutline placeholder="Nhập Tên Tag" type="text" width="100" height="44"
                        :value="tagType.name" @input="(value) => tagType.name = value" />
                </div>
            </div>
            <div class="space-4 mt-4">
                <div>
                    <InputTextOutline value_translate="Hiển thị trên Khóa học" type="checkbox"
                        :checked="tagType.show_in_course" :height="24"
                        @input="(value) => { console.log(value); tagType.show_in_course = value }" :width="24"
                        class="w-full" />
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button type="button" @click="showTagTypeDialog = false"
                    class="px-4 py-2 bg-gray-102 rounded hover:bg-gray-400">
                    Hủy
                </button>
                <button type="submit" class="px-4 py-2 text-white bg-primary hover:bg-blue-700 rounded w-[200px]"
                    @click="addTypeTag">
                    Lưu
                </button>
            </div>
        </PDialog>
    </Content>
    <PopupDelete :isOpen="isOpen" @confirm="onConfirm" @cancel="onCancel" />
</template>

<script setup lang="ts">
import BtnBase from "@/components/elements/BtnBase.vue"
import DataTable from "@/components/elements/DataTable.vue"
import BtnInTable from "@/components/elements/BtnInTable.vue"
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { ref, onMounted, computed } from 'vue';
import { useTagStore } from '@/stores/tag';
import { useTagTypeStore } from '@/stores/tagType';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import penIcon from '@/assets/images/icon/pen-icon.svg'
import PDialog from '@/components/base/PDialog.vue'
import type { Tag, TagType } from '@/model'
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { messageSuccess } from "@/common/message.service"
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const tagStore = useTagStore();
const tagTypeStore = useTagTypeStore();

const tags = computed(() => tagStore.tags);
const tagTypes = computed(() => tagTypeStore.tagTypes);

const Header = [
    { text: "Tên Tag", value: "name", align: "left", width: 400 },
    { text: "Type", value: "tagType", align: "left", width: 300 },
    { text: "Hiển thị trên Khóa học", value: "show_in_course", align: "left", width: 300 },
    { text: "Thao tác", value: "action", align: "center", width: 120 },
]

const breadcrumb = [
    { name: "Danh sách Tag", link: '/tag/list' }
]

const showTagDialog = ref(false)
const showTagTypeDialog = ref(false)

const tag = ref<Tag>({
    name: '',
    tag_type_id: ''
})

const tagType = ref<TagType>({
    name: '',
    show_in_course: false
})


const addTag = async () => {
    await tagStore.saveTag(tag.value);
    showTagDialog.value = false
    await loadData();
};

const addTypeTag = async () => {
    await tagTypeStore.saveTagType(tagType.value);
    showTagTypeDialog.value = false
    await loadData();
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = await tagStore.deleteTag(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await tagStore.fetchTags();
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

const loadData = async () => {
    await tagStore.fetchTags({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
    await tagTypeStore.fetchTagTypes();
}

onMounted(async () => {
    await loadData();
});

const pagination = ref({
    page: 1,
    limit: 10
})

const paginate = computed(() => tagStore.paginate ?? {})

const getPage = async (params: any) => {
    pagination.value.page = params.page ?? 1
    pagination.value.limit = params.limit ? JSON.parse(params.limit) : 10
    await tagStore.fetchTags({
        page: pagination.value.page,
        limit: pagination.value.limit
    });
}

const openEditTagType = (item: TagType) => {
    tagType.value = item
    showTagTypeDialog.value = true
}

const openEditTag = (item: Tag) => {
    tag.value = item
    showTagDialog.value = true
}
</script>

<style scoped>
table th,
table td {
    border: 1px solid #e5e7eb;
}
</style>
