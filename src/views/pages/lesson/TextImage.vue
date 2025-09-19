<template>
    <SubHeader v-if="course && course.title" :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <Form @submit="handleUpload">
            <!-- Lesson content -->
            <div class="mb-4">
                <h5 class="font-semibold mb-2">Nhập nội dung bài học</h5>
                <!-- <CkContent :content="lesson.content" @getData="getContent" /> -->
                <InputQuillEditor :placeholder="'Nhập nội dung bài học'" v-model="lesson.content" />
            </div>

            <!-- Buttons -->
            <div class="flex justify-center gap-4 mt-6">
                <button type="button" class="px-4 py-2 rounded bg-gray-103 text-white hover:bg-gray-500"
                    @click="comeBack">
                    Hủy
                </button>
                <button type="submit" class="px-4 py-2 rounded bg-primary text-white hover:bg-blue-700 w-[200px]"
                    :disabled="overlay">
                    Lưu
                </button>
            </div>
        </Form>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useForm, Field, Form } from 'vee-validate';
// import * as yup from 'yup';
import { useLessonStore } from '@/stores/lesson';
import { useCourseStore } from '@/stores/course';

const router = useRouter();
const route = useRoute();
const lessonStore = useLessonStore();
const courseStore = useCourseStore();

const overlay = ref(false);
const allowVideoRewind = ref<number>(1);
const courseId = route.query.course_id as string;
const lessonId = route.query.lesson_id as string;

const course = computed(() => courseStore.detailCourse);
const lesson = computed(() => lessonStore.lesson);
const breadcrumb = reactive([
    { name: `Khóa học ${course.value.title}`, link: `/course/edit/${courseId}?viewType=2` },
    { name: "Tạo Bài học", link: `/lesson/video?lesson_id=${lessonId}&course_id=${courseId}` },
])

onMounted(async () => {
    await lessonStore.fetchLessonDetail(lessonId);
    await courseStore.fetchCourseDetail(courseId);

    if (lesson.value?.medias && lesson.value?.medias?.length > 0 && lesson.value.medias[0].src) {
        allowVideoRewind.value = lesson.value?.allow_video_rewind
    }
});

const comeBack = () => {
    router.push({ path: '/course', query: { courseId, viewType: 2 } });
};

const handleUpload = async () => {
    lesson.value.allow_video_rewind = allowVideoRewind.value
    await lessonStore.updateLesson(lesson.value);
};
</script>

<style scoped>
.validate-error {
    color: red;
}

.v-row {
    margin-bottom: 15px;
    padding-left: 10px;
}
</style>
