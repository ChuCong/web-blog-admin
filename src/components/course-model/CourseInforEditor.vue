<template>
    <Form @submit="onSubmit" class="w-full h-full">
        <!-- <div class="flex gap-6 items-center mb-4">
            <InputTextOutline value_translate="Khóa học miễn phí" type="checkbox" :checked="course.is_free" :width="24"
                :height="24" @change="(value) => course.is_free = value" />
            <InputTextOutline value_translate="Không bán" type="checkbox" :checked="course.not_buy" :height="24"
                @change="(value) => course.not_buy = value" :width="24" class="w-full" />
        </div> -->
        <div class="mb-4">
            <label class="block font-semibold mb-1">Kích hoạt</label>
            <Switch v-model="course.active" />
        </div>

        <div class="mb-4">
            <label class="block font-semibold mb-1">Tên khóa học</label>
            <!-- <Field name="title" v-slot="{ field, errorMessage }" rules="required"> -->
            <InputTextOutline placeholder="Nhập tên khóa học" type="text" height="44" :value="course.title"
                @input="(value) => course.title = value" class="w-full" width="100" />
            <!-- <span class="text-red-500 ">{{ errorMessage }}</span> -->
            <!-- </Field> -->
        </div>

        <!-- <div class="mb-4">
            <label class="block font-semibold mb-1">Đường dẫn lading page</label>
            <InputTextOutline placeholder="Nhập đường dẫn" type="text" height="44" :value="course.url_lading_page"
                @input="(value) => course.url_lading_page = value" class="w-full" width="100" />
        </div> -->

        <div class="mb-4">
            <label class="block font-semibold mb-1">Danh mục cha</label>
            <InputTextOutline placeholder="Chọn Danh mục cha" type="select" height="44" :value="course.category_id"
                @input="(value) => course.category_id = value" :items="categories" item-text="title" item-value="id"
                class="w-full" width="100" />
        </div>

        <div class="mb-4">
            <label class="block font-semibold mb-1">Từ khóa</label>
            <!-- <Field name="meta" v-slot="{ field, errorMessage }" rules="required"> -->
            <InputTextOutline placeholder="Nhập từ khóa" type="text" height="44" :value="course.meta"
                @input="(value) => course.meta = value" class="w-full" width="100" />
            <!-- <span class="text-red-500 ">{{ errorMessage }}</span> -->
            <!-- </Field> -->
        </div>

        <div class="mb-4">
            <label class="block font-semibold mb-1">Mô tả ngắn gọn</label>
            <!-- <Field name="description" v-slot="{ field, errorMessage }" rules="required|max:255"> -->
            <InputTextOutline placeholder="Nhập mô tả ngắn gọn" type="textarea" height="44" width="100"
                :value="course.description" @input="(value) => course.description = value" class="w-full" />
            <!-- <span class="text-red-500 ">{{ errorMessage }}</span> -->
            <!-- </Field> -->
        </div>

        <div class="mb-4">
            <h5 class="font-semibold mb-2">Mô tả khóa học</h5>
            <!-- <CkContent :content="course.introduction" @getData="val => course.introduction = val" /> -->
            <InputQuillEditor :placeholder="'Nhập Mô tả khoá học'" v-model="course.introduction" />
        </div>
        <div class="mb-4">
            <label class="block font-semibold mb-1">Bạn sẽ học được gì?</label>
            <div class="space-y-2">
                <div v-for="(item, index) in course.what_you_will_learn" :key="index"
                    class="flex gap-2 items-start group">
                    <input type="text"
                        class="border border-[#d9d9d9] rounded-[8px] px-3 py-2 w-full focus:outline-none  focus:border-[#4096ff]"
                        v-model="course.what_you_will_learn[index]" @input="onLearnInput(index)"
                        placeholder="Nhập nội dung học được" />
                    <button type="button" @click="removeLearn(index)" class="text-red-500"
                        v-if="course.what_you_will_learn.length > 1">✕</button>
                </div>
            </div>
        </div>
        <div class="mb-4" v-if="!adminStore.roleAdminAuth?.teacher">
            <label class="block font-semibold mb-1">Giảng viên</label>
            <InputTextOutline placeholder="Chọn Giảng viên" type="select" height="44" :value="course.teacher_id"
                @input="(value) => course.teacher_id = value" :items="teachers" item-text="full_name" item-value="id"
                class="w-full" width="100" />
        </div>

        <div class="mb-4">
            <label class="block font-semibold mb-1">Tag</label>
            <InputTextOutline placeholder="Chọn Tag" type="select" height="44" :value="course.tag_ids"
                @input="(value) => course.tag_ids = value" :items="tags" item-text="name" item-value="id" class="w-full"
                width="100" :multiple="true" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- <div>
                <label class="block font-semibold mb-1">Tải ảnh máy tính</label>
                <input type="file" @change="uploadImage('image', $event)" class="file-input w-full" />
                <img v-if="course.image" :src="course.image" class="mt-2 max-h-40" />
                <span class="text-red-500 ">{{ imageError }}</span>
            </div>
            <div>
                <label class="block font-semibold mb-1">Tải ảnh điện thoại</label>
                <input type="file" @change="uploadImage('responsive_image', $event)" class="file-input w-full" />
                <img v-if="course.responsive_image" :src="course.responsive_image" class="mt-2 max-h-40" />
                <span class="text-red-500 ">{{ responsiveImageError }}</span>
            </div> -->

            <div>
                <label class="block font-semibold mb-1">Tải ảnh máy tính</label>
                <div class="upload-container flex gap-3">
                    
                    <label class="upload-box">
                        <input type="file" @change="uploadImage('image', $event)" accept="image/png, image/jpeg, image/bmp, image/webp" class="hidden" />
                        <div class="w-fit mx-auto pb-[15px]">
                            <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                        </div>
                        <span>Click để upload file</span>
                        <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG</div>
                    </label>
                </div>
                <div v-if="course.image" class="mt-2">
                    <img :src="course.image" alt="preview" width="300" />
                </div>
                <span class="text-red-500 ">{{ imageError }}</span>
            </div>
            <div>
                <label class="block font-semibold mb-1">Tải ảnh điện thoại</label>
                <div class="upload-container flex gap-3">
                    <label class="upload-box">
                        <input type="file" @change="uploadImage('responsive_image', $event)" accept="image/png, image/jpeg, image/bmp, image/webp"
                            class="hidden" />
                        <div class="w-fit mx-auto pb-[15px]">
                            <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                        </div>
                        <span>Click để upload file</span>
                        <div class=" italic text-[#F15922] pt-2">Định dạng file: PNG</div>
                    </label>
                </div>
                <div v-if="course.responsive_image" class="mt-2">
                    <img :src="course.responsive_image" class="mt-2 max-h-40" />
                    <span class="text-red-500 ">{{ responsiveImageError }}</span>
                </div>
            </div>
        </div>

        <div class="mb-4 pt-4">
            <span class="block font-semibold mb-1">Thông tin SEO</span>
        </div>

        <div class="mb-4 ml-4">
            <label class="block font-semibold mb-1">Từ khóa</label>
            <!-- <Field name="meta" v-slot="{ field, errorMessage }" rules="required"> -->
            <InputTextOutline placeholder="Nhập từ khóa" type="text" height="44" :value="course.meta"
                @input="(value) => course.meta = value" class="w-full" width="100" />
            <!-- <span class="text-red-500 ">{{ errorMessage }}</span> -->
            <!-- </Field> -->
        </div>

        <div class="mb-4 ml-4">
            <label class="block font-semibold mb-1">Mô tả ngắn gọn</label>
            <!-- <Field name="description" v-slot="{ field, errorMessage }" rules="required|max:255"> -->
            <InputTextOutline placeholder="Nhập mô tả ngắn gọn" type="textarea" height="44" width="100"
                :value="course.description" @input="(value) => course.description = value" class="w-full" />
            <!-- <span class="text-red-500 ">{{ errorMessage }}</span> -->
            <!-- </Field> -->
        </div>

        <div class="text-center mt-6">
            <button type="submit" class="mb-4 text-white bg-primary rounded-md p-2 w-[200px]">Lưu</button>
        </div>
    </Form>
</template>

<script setup lang="ts">
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { Form, useForm, Field, defineRule } from 'vee-validate';
import { required, numeric, max } from '@vee-validate/rules'
import { useRouter } from 'vue-router';
import Switch from '@/components/elements/Switch.vue';
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { useAdminStore } from '@/stores/admin';

defineRule('required', required)
defineRule('numeric', numeric)
defineRule('max', max)
// import CkContent from "@/components/ck-content.vue"
import { useLoadingStore } from '@/stores/loading';
const loading = useLoadingStore();
const adminStore = useAdminStore();

import { useCourseStore } from '@/stores/course';
import { useCategoryStore } from '@/stores/category';
import { useTeacherStore } from '@/stores/teacher';
import { useTagStore } from '@/stores/tag';
import { messageSuccess, messageError } from '@/common/message.service';

const { handleSubmit } = useForm();
const router = useRouter();
const courseStore = useCourseStore();
const categoryStore = useCategoryStore();
const teacherStore = useTeacherStore();
const tagStore = useTagStore();

const props = defineProps<{ courseId?: string }>()
const course = reactive({
    id: '',
    title: '',
    price: 0,
    description: '',
    introduction: '',
    number_month_expired: 0,
    active: 0,
    what_you_will_learn: [],
    slug: '',
    meta: '',
    status: 0,
    is_recommend: 0,
    lesson_number: 0,
    image: '',
    responsive_image: '',
    category_id: '',
    teacher_id: '',
    is_free: true,
    url_lading_page: '',
    not_buy: false,
    tag_ids: []
});
const categories = computed(() => categoryStore.categories);
const teachers = computed(() => teacherStore.teachers);
const tags = computed(() => tagStore.tags);
const imageError = ref('');
const responsiveImageError = ref('');

watch(() => courseStore.detailCourse, (newVal) => {
    if (newVal) {
        Object.assign(course, newVal);
        course.image = newVal.image?.src_url ?? '';
        course.responsive_image = newVal.responsive_image?.src_url ?? '';
        console.log('course', course);
        try {
            const parsed = JSON.parse(newVal.what_you_will_learn);
            course.what_you_will_learn = Array.isArray(parsed) ? parsed : [''];
        } catch (e) {
            course.what_you_will_learn = [''];
        }
        if (course.what_you_will_learn.length === 0) {
            course.what_you_will_learn.push('');
        }
    }
}, { deep: true, immediate: true })

const uploadImage = async (type: 'image' | 'responsive_image', event: Event) => {
    loading.setLoading(true)
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('upload', file);
    const url = await courseStore.uploadCourseImage(formData);
    course[type] = url;
    loading.setLoading(false)
};
const onLearnInput = (index: number) => {
    const list = course.what_you_will_learn;
    const isLast = index === list.length - 1;
    const hasContent = list[index].trim() !== '';

    if (isLast && hasContent) {
        list.push('');
    }
};

const removeLearn = (index: number) => {
    course.what_you_will_learn.splice(index, 1);
};
const normalizeLearnList = () => {
    course.what_you_will_learn = course.what_you_will_learn
        .map((item) => item.trim())
        .filter((item) => item !== '');
};
const onSubmit = async () => {
    normalizeLearnList();
    // const payload = {
    //     ...course,
    //     what_you_will_learn: JSON.stringify(course.what_you_will_learn),
    // };
    const payload = {
        ...course,
        what_you_will_learn: JSON.stringify(course.what_you_will_learn),
        ...(adminStore.roleAdminAuth?.teacher ? { teacher_id: adminStore.roleAdminAuth.teacher.id } : {})
    };
    if(!course.title){
        messageError('Bạn chưa nhập tên khóa học!');
        return;
    }
    if (!course.category_id) {
        messageError('Bạn chưa chọn danh mục cha!');
        return;
    }
    if (!course.introduction) {
        messageError('Bạn chưa nhập mô tả khóa học!');
        return;
    }
    if (!course.image) {
        messageError('Bạn chưa tải ảnh cho máy tính!');
        return;
    }
    if (!course.responsive_image) {
        messageError('Bạn chưa tải ảnh cho điện thoại!');
        return;
    }
    
    loading.setLoading(true)
    if (props.courseId) {
        const response = await courseStore.updateCourse(payload);
        loading.setLoading(false)
        if (response.status) {
            messageSuccess('Tạo thông tin khóa học thành công')
            router.back();
        } else {
            messageError('Tạo thông tin khóa học thất bại')
        }
    } else {
        const response = await courseStore.saveCourse(payload);
        loading.setLoading(false)
        if (response.status) {
            messageSuccess('Cập nhật thông tin khóa học thành công')
            router.back();
        } else {
            messageError('Cập nhật thông tin khóa học thất bại')
        }
    }
};

onMounted(async () => {
    loading.setLoading(true)
    await categoryStore.fetchCategories();
    if (!adminStore.roleAdminAuth?.teacher) {
        await teacherStore.fetchTeachers();
    }
    await tagStore.fetchTags();
    if (props.courseId) await courseStore.fetchCourseDetail(props.courseId);
    loading.setLoading(false)
});
</script>

<style scoped>
.input,
.select,
.textarea,
.file-input {
    @apply border border-gray-103 rounded px-3 py-2 w-full;
}
</style>
