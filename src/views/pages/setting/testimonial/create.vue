<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="onSubmit" v-slot="{ errors }">
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Họ và tên</label>
                <Field name="name" type="text" v-slot="{ field }">
                    <InputTextOutline placeholder="Nhập họ và tên" type="text" width="100" height="44"
                        :value="testimonial.name" @input="(value) => testimonial.name = value" />
                </Field>
                <ErrorMessage name="name" class="text-red-500  mt-1" />
            </div>
            <div class="mb-4 ">
                <label class="block font-semibold mb-1">Tải File tài nguyên</label>
                <div class="flex gap-10 mt-3">
                    <div class="upload-container flex gap-3 h-fit">
                        <label class="upload-box">
                            <input type="file" @change="uploadImage('image', $event)"
                                accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                            <div class="w-fit mx-auto pb-[15px]">
                                <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                            </div>
                            <span>Click để upload file</span>
                            <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG, JPG,..</div>
                        </label>
                    </div>
                        <img v-if="urlFile" :src="urlFile" class="max-h-40" />
                        <img v-else :src="testimonial.media?.src_url" alt="" class="max-h-40" >
                </div>
            </div>
            <div class="mb-4">
                <label class="block font-semibold mb-1">Lời dẫn</label>
                <InputTextOutline placeholder="Nhập nội dung" type="textarea" height="44" width="100"
                    :value="testimonial.introduction" @input="(value) => testimonial.introduction = value"
                    class="w-full" />
            </div>
            <div class="mb-5">
                <label class="block font-semibold text-gray-700 mb-2">Url Khóa Học</label>
                <InputTextOutline placeholder="Nhập url khóa học" type="text" width="100" height="44"
                    :value="testimonial.url_course" @input="(value) => testimonial.url_course = value" />
            </div>
            <div class="mb-4">
                <label class="block font-semibold text-gray-700 mb-2">Chọn ngôn ngữ</label>
                <InputTextOutline placeholder="Chọn ngôn ngữ" type="select" width="100" height="44"
                    :value="testimonial.lang" @input="(value) => testimonial.lang = value" :items="LANGUAGE"
                    item-text="title" item-value="key" />
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
import { ref, onMounted, computed, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { messageSuccess, messageError } from "@/common/message.service";
import { useTestimonialStore } from '@/stores/testimonial';
import { LANGUAGE } from "@/config/constant"
const breadcrumb = [
    { name: "Danh sách tài nguyên", link: '/testimonial/list' },
]

const router = useRouter();
const route = useRoute();
const store = useTestimonialStore();
if (route.params.id) {
    breadcrumb.push({ name: "Cập nhật tài nguyên", link: `setting/testimonial/edit/${route.params.id}` });
} else {
    breadcrumb.push({ name: "Tạo mới tài nguyên", link: 'setting/testimonial/create' });
}
const testimonial = reactive({
    id: '',
    name: '',
    introduction: '',
    url_course: '',
    url_media: '',
    media_id: '',
    lang: ''
});
const urlFile = ref(null)

onMounted(async () => {
    if (route.params.id) {
        await store.getTestimonialDetail(Number(route.params.id));
        Object.assign(testimonial, store.testimonialDetail);
    }
});
const onSubmit = async () => {
    if (!testimonial.name) {
        messageError('Bạn chưa nhập họ và tên');
        return;
    }
    if (!testimonial.introduction) {
        messageError('Bạn chưa nhập lời dẫn');
        return;
    }
    if (!testimonial.lang) {
        messageError('Bạn chưa chọn ngôn ngữ');
        return;
    }
    const success = await store.saveTestimonial(testimonial);
    if (success) {
        messageSuccess('Lưu thành công');
        router.push('/setting/testimonial');
    }
};

const uploadImage = async (type: 'image' | 'responsive_image', event: Event) => {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await store.uploadTestimonialImage(formData);
    if (url) {
        urlFile.value = url[0].url
        testimonial.url_media = url[0].path;
        messageSuccess('Tải file thành công');
    }
};
</script>

<style scoped>
img {
    border-radius: 4px;
}
</style>
