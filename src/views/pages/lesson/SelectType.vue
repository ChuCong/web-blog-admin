<template>
    <SubHeader>
    </SubHeader>
    <Content>
        <h2 class="text-xl font-semibold text-center mb-6">Chọn kiểu bài giảng!</h2>
        <div class="flex justify-center gap-8 mb-6">
            <div class="flex flex-col items-center w-1/3">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" class="form-radio text-blue-600" name="lessonType" :value="LESSON_TYPE_VIDEO"
                        v-model="selected" />
                    <span class="text-lg font-medium">Bài giảng Video</span>
                </label>
                <img class="mt-3 object-contain w-full" :src="videoImage" alt="Bài giảng" />
            </div>

            <div class="flex flex-col items-center w-1/3">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" class="form-radio text-blue-600" name="lessonType"
                        :value="LESSON_TYPE_TEXT_IMAGE" v-model="selected" />
                    <span class="text-lg font-medium">Bài giảng Text - Image</span>
                </label>
                <img class="mt-3 object-contain w-full" :src="textImage" alt="Bài giảng" />
            </div>

            <div class="flex flex-col items-center w-1/3">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" class="form-radio text-blue-600" name="lessonType"
                        :value="LESSON_TYPE_EXCERCISE" v-model="selected" />
                    <span class="text-lg font-medium">Bài thực hành</span>
                </label>
                <img class="mt-3 object-contain w-full" :src="excerciseImage" alt="Thực hành" />
            </div>

            <!-- <div class="flex flex-col items-center w-1/3">
                <label class="flex items-center space-x-2 cursor-pointer">
                    <input type="radio" class="form-radio text-blue-600" name="lessonType"
                        :value="LESSON_TYPE_FLASHCARD" v-model="selected" />
                    <span class="text-lg font-medium">Bài giảng FlashCard</span>
                </label>
                <img class="mt-3 rounded shadow-md border border-primary object-contain h-[360px] w-[300px]"
                    :src="lectureImage" alt="Bài giảng" />
            </div> -->
        </div>

        <div class="text-center text-red-600 mb-4" v-if="validateMessage">
            {{ validateMessage }}
        </div>

        <div class="text-center">
            <button @click="saveType" class="bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">
                Tiếp tục
            </button>
        </div>
    </Content>
</template>

<script setup>
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course';
import { useLessonStore } from '@/stores/lesson';
import { LESSON_TYPE_VIDEO, LESSON_TYPE_TEXT_IMAGE, LESSON_TYPE_EXCERCISE, LESSON_TYPE_FLASHCARD } from '@/config/constant';

// State & router
const selected = ref(null)
const validateMessage = ref('')
const courseStore = useCourseStore()
const lessonStore = useLessonStore()
const route = useRoute()
const router = useRouter()

const courseId = route.query.course_id
const lessonId = route.query.lesson_id

// Images
const videoImage = new URL('@/assets/images/video_guide.png', import.meta.url).href
const textImage = new URL('@/assets/images/text_guide.png', import.meta.url).href
const excerciseImage = new URL('@/assets/images/excercise_guide.png', import.meta.url).href

// Course & Lesson ID from store
const course = computed(() => courseStore.detailCourse)
const lesson = computed(() => lessonStore.lesson)

onMounted(() => {
    courseStore.fetchCourseDetail(courseId)
    lessonStore.fetchLessonDetail(lessonId)
})

function redirectPage(type, lessonId) {
    const query = {
        lesson_id: lessonId,
        course_id: courseId
    }

    if (type === LESSON_TYPE_VIDEO) {
        router.push({ path: '/lesson/video', query })
    } else if (type === LESSON_TYPE_TEXT_IMAGE) {
        query.lesson_id = lesson.value.id
        router.push({ path: '/lesson/text', query })
    } else if (type === LESSON_TYPE_EXCERCISE) {
        query.lesson_id = lesson.value.id
        router.push({ path: '/lesson/exercise', query })
    }
    // else if (type === LESSON_TYPE_FLASHCARD) {
    //     query.lesson_id = lesson.value.id
    //     router.push({ path: '/lesson/flashcard', query })
    // }
}

function saveType() {
    if (!selected.value) {
        validateMessage.value = 'Bạn chưa chọn loại bài học'
        return
    }

    lessonStore.updateLessonType({
        type: selected.value,
        lesson_id: lesson.value.id,
    }).then(() => {
        redirectPage(selected.value, lesson.value.id)
    })
}
</script>
