<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Tiêu đề banner</label>
                <Field name="title" type="text" v-slot="{ field }">
                    <InputTextOutline placeholder="Nhập tên tài nguyên" type="text" width="100" height="44"
                        :value="newData.title" @input="(value) => newData.title = value" />
                </Field>
                <ErrorMessage name="title" class="text-red-500  mt-1" />
            </div>
            <div class="mb-5">
                <div class="flex gap-2 mb-2">
                    <label class="block font-semibold text-gray-700 mb-2">Url khóa học</label>
                    <span>(*) Copy Url khóa học</span>
                </div>
                <InputTextOutline placeholder="Nhập đường dẫn" type="text" width="100" height="44"
                    :value="newData.url_course" @input="(value) => newData.url_course = value" />
            </div>

            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Chọn ngôn ngữ</label>
                <InputTextOutline placeholder="Chọn ngôn ngữ" type="select" width="100" height="44"
                    :value="newData.lang" @input="(value) => newData.lang = value" :items="LANGUAGE" item-text="title"
                    item-value="key" />
            </div>
            <div class="mb-4 ">
                <div class="flex gap-2 mb-2">
                    <label class="block font-semibold mb-1">Tải ảnh </label>
                    <span>(Kích thước 1905px x 600px)</span>
                </div>
                <div class="flex gap-10 mt-3">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="onChangeFileUpload"
                                accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG,..</div>
                        </label>
                    </div>
                    <div v-if="newData.url_image">
                        <img :src="newData.url_image" alt="preview" width="200" />
                    </div>
                </div>
            </div>
            <div class="mb-5">
                <label class="block font-semibold mb-1">Nội dung Html</label>
                <Field name="content" v-slot="{ field }">
                    <InputQuillEditor :placeholder="'Nhập mô tả Chương trình học'" v-model="newData.content" />
                </Field>
                <ErrorMessage name="content" class="text-red-500 mt-1" />
            </div>

            <div class="text-[18px] font-bold pb-7">Nội dung dạng list</div>
            <DataTable :itemHeader="Header" :itemValue="newData.list_contents">
                <template v-slot:title="item: any">
                    <div v-html="item.title">
                    </div>
                </template>
                <template v-slot:action="item: any">
                    <div class="flex justify-center">
                        <BtnInTable @click="openDeletePopup(item)" :icon="trashIcon" :height="20" :width="20"
                            title="Delete" />
                    </div>
                </template>
            </DataTable>
            <div class="mb-5 mt-9">
                <label class="block font-semibold mb-1">Nội dung</label>
                <div class="flex items-center w-[100%]">
                    <div class="w-[98%]">
                        <InputTextOutline placeholder="Nhập nội dung" type="text" width="100" height="44"
                            :value="newContent" @input="(value) => newContent = value" />
                    </div>
                    <button @click.prevent="addToList" class="ml-2 text-white bg-primary rounded-md p-2">Thêm</button>
                </div>
            </div>
            <div class="text-center">
                <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
            </div>
        </Form>
    </Content>
    <PopupDelete :isOpen="isOpen" @confirm="onConfirm" @cancel="onCancel" />
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import BtnBase from "@/components/elements/BtnBase.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { messageSuccess, messageError } from "@/common/message.service";
import { useSettingStore } from '@/stores/setting';
import { CONTEST_PUBLISH_STATUS, LANGUAGE } from "@/config/constant"
import DataTable from "@/components/elements/DataTable.vue"
import BtnInTable from "@/components/elements/BtnInTable.vue"
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import PopupDelete from "@/components/elements/PopupDelete.vue"
import { useListContentStore } from "@/stores/listContent";
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";

const newContent = ref('');
const listContentStore = useListContentStore();
const isOpen = ref(false)
const breadcrumb = [
    { name: "Danh sách banner", link: '/new/list' },
]
const Header = [
    { text: "Nội dung", value: "title" },
    { text: "Thao tác", value: "action", align: "center" },
]

const router = useRouter();
const route = useRoute();
const store = useSettingStore();
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật banner", link: `/setting/banner/edit/${route.params.id}` });
} else {
    breadcrumb.push({ name: "Tạo mới banner", link: '/setting/banner/create' });
}

const urlFile = ref(null)
const selectedId = ref<number | null>(null)
const dataBanner = reactive({
    id: '',
    key: 'banner',
    value: [],
});
const newData = reactive({
    id: '',
    title: '',
    url_course: '',
    url_image: '',
    lang: '',
    content: '',
    list_contents: [],
});
onMounted(async () => {
    if (route.params.id) {
        const payload = {
            key: 'banner'
        }
        await store.fetchSettingByKey(payload);
        Object.assign(dataBanner, store.settingDetail);
        for (let i = 0; i < dataBanner.value.length; i++) {
            const item = dataBanner.value[i];
            if (String(item.id) === String(route.params.id)) {
                Object.assign(newData, item);
                break;
            }
        }
    }
});
watch(newData, (newValue) => {
    const index = dataBanner.value.findIndex(item => item.id === newValue.id);
    if (index !== -1) {
        dataBanner.value[index] = { ...newValue };
    } else {
        dataBanner.value.push({ ...newValue });
    }
}, { deep: true });
const addToList = () => {
    if (newContent.value.trim() === '') {
        messageError('Bạn chưa nhập nội dung');
        return;
    }
    newData.list_contents.push({
        title: newContent.value,
    });
    newContent.value = '';
};

const onSubmit = async () => {
    if (!newData.title) {
        messageError('Bạn chưa nhập tiêu đề banner');
        return;
    }
    if (!newData.url_course) {
        messageError('Bạn chưa nhập link banner');
        return;
    }
    if (!newData.lang) {
        messageError('Bạn chưa nhập ngôn ngữ');
        return;
    }
    if (!newData.url_image && !route.params.id) {
        messageError('Bạn chưa tải ảnh banner');
        return;
    }
    if (!newData.lang) {
        messageError('Bạn chưa chọn ngôn ngữ');
        return;
    }
    const success = await store.saveSettingHome(dataBanner);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/setting/banner');
    }
};

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadImage(formData);
    if (url) {
        newData.url_image = url;
    }
};

const onConfirm = async (item: any) => {
    if (selectedId.value !== null) {

        const index = newData.list_contents.findIndex(content => content.id === selectedId.value);
        if (index !== -1) {
            newData.list_contents.splice(index, 1);
        }

    }
    isOpen.value = false;
    selectedId.value = null;
};

const onCancel = () => {
    isOpen.value = false;
    selectedId.value = null;
};
const openDeletePopup = (item: any) => {
    const index = newData.list_contents.findIndex(content => content.title === item.title);
    if (index !== -1) {
        newData.list_contents.splice(index, 1);
        messageSuccess('Đã xóa nội dung khỏi danh sách');
    } else {
        messageError('Nội dung không tìm thấy');
    }
};
</script>
<style scoped>
img {
    border-radius: 4px;
}
</style>
