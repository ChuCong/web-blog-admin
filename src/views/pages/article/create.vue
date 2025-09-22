<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-4">
                <label class="block font-semibold mb-1">Kích hoạt</label>
                <Switch v-model="article.active" />
            </div>
            <div class="mb-4 flex-1">
                <label class="block font-semibold text-gray-700 mb-2">Tên bài viết</label>
                <InputTextOutline placeholder="Nhập tên bài viết" type="text" width="100" height="44"
                    :value="article.title" @input="(value) => article.title = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Mô tả ngắn</label>
                <InputTextOutline placeholder="Nhập mô tả" type="textarea" width="100" height="44"
                    :value="article.description" @input="(value) => article.description = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Nội dung bài viết</label>
                <InputQuillEditor v-model="article.content" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Chọn chuyên mục</label>
                <InputTextOutline placeholder="Chọn Danh mục cha" type="select" height="44" :value="article.category_id"
                    @input="(value) => article.category_id = value" :items="categories" item-text="title" item-value="id"
                    class="w-full" width="100" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-2">Upload ảnh bìa</label>
                <div class="flex gap-10">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="onChangeFileUpload"
                                accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG</div>
                        </label>
                    </div>
                    <div v-if="article.url">
                        <img :src="article.url" alt="preview" width="300" />
                    </div>
                </div>
                <p class="text-red-500 mt-1">{{ imageError }}</p>
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Seo title</label>
                <InputTextOutline placeholder="Nhập Seo title" type="text" width="100" height="44"
                    :value="article.seo_title" @input="(value) => article.seo_title = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Seo key</label>
                <InputTextOutline placeholder="Nhập Seo key" type="text" width="100" height="44"
                    :value="article.seo_key" @input="(value) => article.seo_key = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Seo description</label>
                <InputTextOutline placeholder="Nhập Seo description" type="text" width="100" height="44"
                    :value="article.seo_description" @input="(value) => article.seo_description = value" />
            </div>
            <div class="text-center">
                <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
            </div>
        </Form>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { messageError, messageSuccess } from "@/common/message.service";
import Switch from "@/components/elements/Switch.vue";
// import * as yup from 'yup';
import { useArticleStore } from '@/stores/article';
import { useCategoryStore } from '@/stores/category';

const storeCategory = useCategoryStore();
const categories = computed(() => storeCategory.categories);
const breadcrumb = [
    { name: "Danh sách Bài viết", link: '/article/list' },
    { name: "Tạo Bài viết", link: '/article/create' },
]

const router = useRouter();
const route = useRoute();
const store = useArticleStore();

const article = ref<any>({});
const imageError = ref('');
const save = 'Lưu';
// const schema = yup.object({ title: yup.string().required('Bạn chưa nhập tiêu đề') });

onMounted(async () => {
    if (route.params.id) {
        await store.getArticleDetail(Number(route.params.id));
        article.value = store.articleDetail;
        console.log(article.value)
    }
    await storeCategory.fetchCategories({
        page: 1,
        limit: 1000
    });
});

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    console.log(file)
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadImage(formData);
    console.log('url', url);
    if (url) {
        article.value.url = url;
        imageError.value = '';
    } else {
        imageError.value = 'File chưa đúng định dạng';
    }
};

const onSubmit = async () => {
    if (!article.value.title) {
        messageError('Bạn chưa nhập tiêu đề');
        return;
    }
    if (!article.value.description) {
        messageError('Bạn chưa nhập mô tả');
        return;
    }
    const success = await store.saveArticle(article.value);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/article/list');
    }
};
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
