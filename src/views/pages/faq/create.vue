<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <p class="mb-2 font-semibold">Kích hoạt</p>
                <Switch v-model="faq.type" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Nội dung câu hỏi</label>
                <Field name="title" type="text" v-slot="{ field }">
                    <QuillEditor theme="snow" placeholder="Nhập câu hỏi" v-model:content="faq.title" contentType="html"
                        v-bind="field" />
                </Field>
                <ErrorMessage name="title" class="text-red-500  mt-1" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Nội dung câu trả lời</label>
                <QuillEditor theme="snow" placeholder="Nhập câu trả lời" v-model:content="faq.answer"
                    contentType="html" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Chọn ngôn ngữ</label>
                <InputTextOutline placeholder="Chọn ngôn ngữ" type="select" width="100" height="44"
                    :value="faq.language" @input="(value) => faq.language = value" :items="LANGUAGE" item-text="title"
                    item-value="key" />
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
import BtnBase from "@/components/elements/BtnBase.vue"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import Switch from "@/components/elements/Switch.vue"
import { messageSuccess, messageError } from "@/common/message.service";
// import * as yup from 'yup';
import { useFaqStore } from '@/stores/faq';
import { LANGUAGE } from "@/config/constant"
const breadcrumb = [
    { name: "Danh sách FAQ", link: '/faq/list' },

]

const router = useRouter();
const route = useRoute();
const store = useFaqStore();

const faq = ref<any>({});
faq.value.type = 0;

// Removed isActive computed property as Switch now binds directly to faq.type
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật FAQ", link: '/faq/create' });
} else {
    breadcrumb.push({ name: "Tạo FAQ", link: '/faq/create' });
}
onMounted(async () => {
    if (route.params.id) {
        await store.getFaqDetail(Number(route.params.id));
        faq.value = { ...store.faqDetail };
    }
});

const onSubmit = async () => {
    if (!faq.value.title) {
        messageError('Bạn chưa nhập nội dung câu hỏi');
        return;
    }
    if (!faq.value.answer) {
        messageError('Bạn chưa nhập câu trả lời');
        return;
    }
    const success = await store.saveFaq(faq.value);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/faq/list');
    }
};
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
