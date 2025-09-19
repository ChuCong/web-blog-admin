<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="flex flex-wrap gap-4">
            <div class="flex items-center justify-center w-[240px] h-[295px] 
                    border border-primary rounded-2xl bg-white cursor-pointer hover:bg-primary hover:text-white">
                <a href="/course/create" class="w-full h-full text-center content-center">
                    <div class="text-blue-600 text-lg font-bold">+</div>
                    <div class=" mt-2">Thêm khóa học</div>
                </a>
            </div>

            <div class="w-60" v-for="(course, index) in courses" :key="index">
                <CourseBox :course="course" @deleteItem="openDeletePopup"
                    :path="`/course/edit/${course.id}?viewType=1`" />
            </div>
        </div>
    </Content>
    <PopupDelete :isOpen="isOpen" @confirm="onConfirm" @cancel="onCancel" />
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useCourseStore } from '@/stores/course';
import CourseBox from '@/components/course-model/CourseBox.vue';
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { messageSuccess } from '@/common/message.service';
import PopupDelete from "@/components/elements/PopupDelete.vue"

const isOpen = ref(false)
const selectedId = ref<number | null>(null)
const breadcrumb = [
    { name: "Danh sách Khóa học", link: '/course/list' }
]

const courseStore = useCourseStore();
const items = ref([
    { title: 'Click Me' },
    { title: 'Click Me' },
    { title: 'Click Me' },
    { title: 'Click Me 2' }
]);

const courses = computed(() => courseStore.courses);

const action = () => {
    messageSuccess('hello');
};

const onConfirm = async () => {
    if (selectedId.value !== null) {
        const success = courseStore.deleteCourse(selectedId.value);
        if (success) {
            messageSuccess('Xóa thành công');
            await courseStore.fetchCourses();
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
    await courseStore.fetchCourses();
});
</script>

<style scoped></style>
