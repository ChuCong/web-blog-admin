<template>
    <div class="p-4">
        <!-- Nút Thêm bài học -->
        <div class="flex justify-end mb-4">
            <button @click="createLesson" class="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded">
                Thêm bài học
            </button>
        </div>

        <!-- Hộp thoại thêm/sửa bài học -->
        <PDialog v-model="dialog" maxWidth="500px">
            <template #header>
                <h2 class="text-lg font-semibold">Thêm bài học</h2>
            </template>

            <form @submit.prevent="isEditLesson ? editTitle() : saveLesson()">
                <div class="space-y-4">
                    <!-- <div>
                        <label class="block text-sm font-medium mb-2">Kích hoạt</label>
                        <Switch v-model="lesson.active" />
                    </div> -->
                    <div>
                        <label class="block text-sm font-medium">Tên bài học</label>
                        <InputTextOutline placeholder="Nhập Tên bài học" type="text" height="44" :value="lesson.title"
                            @input="(value) => lesson.title = value" class="w-full" width="100" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium">Bài học cha</label>
                        <InputTextOutline placeholder="Chọn Bài học Cha" type="select" height="44"
                            :value="lesson.reference_id" @input="(value) => lesson.reference_id = value"
                            :items="lessonsOption" item-text="text" item-value="value" class="w-full" width="100" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium">Thời gian học</label>
                        <InputTextOutline placeholder="Nhập Thời gian học" type="number" height="44"
                            :value="lesson.time" @input="(value) => lesson.time = value" class="w-full" width="100" />
                    </div>

                    <div class="mb-4 pt-4">
                        <span class="block font-semibold mb-1">Thông tin SEO</span>
                    </div>

                    <div class="ml-4">
                        <label class="block text-sm font-medium">Từ khóa</label>
                        <InputTextOutline placeholder="Nhập Từ khóa" type="text" height="44" :value="lesson.seo_title"
                            @input="(value) => lesson.seo_title = value" class="w-full" width="100" />
                    </div>

                    <div class="ml-4">
                        <label class="block text-sm font-medium">Mô tả</label>
                        <InputTextOutline placeholder="Nhập Mô tả" type="textarea" height="44"
                            :value="lesson.seo_description" @input="(value) => lesson.seo_description = value"
                            class="w-full" width="100" />
                    </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button type="button" @click="dialog = false"
                        class="px-4 py-2 bg-gray-102 rounded hover:bg-gray-400">
                        Hủy
                    </button>
                    <button type="submit" class="px-4 py-2 text-white bg-primary hover:bg-blue-700 rounded w-[200px]">
                        Lưu
                    </button>
                </div>
            </form>
        </PDialog>

        <!-- Danh sách bài học có kéo thả -->
        <template v-if="lessons">
            <VueDraggableNext v-model="lessons" handle=".handle" @change="submitOrder">
                <CurriculumItem v-for="(lesson, index) in lessons" :key="index" class="mb-4" :lesson="lesson"
                    :courseId="courseId" @editLesson="editLesson" @handleAction="handleAction">
                    <VueDraggableNext v-if="lesson.open" v-model="lesson.children" handle=".handle"
                        @change="submitOrder">
                        <CurriculumItem v-for="(child, childIndex) in lesson.children" :key="childIndex" :lesson="child"
                            :courseId="courseId" :parent="lesson" @editLesson="editLesson"
                            @handleChildAction="handleChildAction" />
                    </VueDraggableNext>
                </CurriculumItem>
            </VueDraggableNext>
        </template>
    </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import InputTextOutline from '@/components/elements/InputTextOutline.vue'
import { useCourseStore } from '@/stores/course';
import { useLessonStore } from '@/stores/lesson';
import { messageError, messageSuccess } from "@/common/message.service"
import { useRoute, useRouter } from 'vue-router'
import { VueDraggableNext } from 'vue-draggable-next'
import CurriculumItem from '@/components/lesson/CurriculumItem.vue'
import PDialog from '@/components/base/PDialog.vue'
import Switch from '@/components/elements/Switch.vue';
import {
    LESSON_TYPE_NOT_SELECTED,
    LESSON_TYPE_VIDEO,
    LESSON_TYPE_TEXT_IMAGE,
    LESSON_TYPE_EXCERCISE,
    LESSON_TYPE_FLASHCARD,
    LESSON_ACTION
} from '@/config/constant';
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

// import {
//     SET_BREADCRUMB,
//     GET_LIST_LESSON,
//     SAVE_LESSON,
//     UPDATE_LESSON_TITLE,
//     DELETE_LESSON,
//     UPDATE_LESSON_ORDER
// } from '@/store/lessons.module'

// import { GET_COURSE_DETAIL } from '@/store/courses.module'
// import { GET_EXERCISE_DETAIL } from '@/store/exercises.module'
// import { SUCCESS } from '@/store/alerts.module'

const courseStore = useCourseStore();
const lessonStore = useLessonStore();

// const store = useStore()
const route = useRoute()
const router = useRouter()

const dialog = ref(false)
const isEditLesson = ref(false)
const openId = ref(null)

const props = defineProps<{ courseId?: string }>()
const courseId = props.courseId
const course = computed(() => courseStore.detailCourse)
const lessons = computed(() => lessonStore.lessons)

const lesson = ref({
    id: '',
    title: '',
    reference_id: null,
    course_id: null,
    seo_title: '',
    seo_description: '',
    time: 0,
    status: 1,
    is_free: 1,
    open: false,
    active: 0
})

const lessonsOption = computed(() => {
    const options = [{ text: 'Không', value: null }]
    lessonStore.lessons.forEach(l => {
        options.push({ text: l.title, value: l.id })
    })
    return options
})

onMounted(async () => {
    loading.setLoading(true)
    await courseStore.fetchCourseDetail(courseId);
    await lessonStore.fetchLessons(courseId);
    loading.setLoading(false)
})

watch(lessons, () => {
    lessons.value.forEach(l => {
        if (l.id === openId.value) l.open = true
    })
})
function createLesson() {
    lesson.value = {
        id: null,
        title: '',
        reference_id: null,
        course_id: null,
        seo_title: '',
        seo_description: '',
        time: 0,
        status: 1,
        is_free: 1,
        open: false,
        active: 0
    }
    isEditLesson.value = false
    dialog.value = true
}

function editLesson(item) {
    lesson.value = { ...item }
    isEditLesson.value = true
    dialog.value = true
    // resetDialog()
    // dialog.value = false
}

function resetDialog() {
    lesson.value = {
        id: null,
        title: '',
        reference_id: null,
        course_id: null,
        seo_title: '',
        seo_description: '',
        time: 0,
        status: 1,
        is_free: 1,
        open: false,
        active: 0
    }
}

async function saveLesson() {
    if (lesson.value.reference_id && !lesson.value.time) {
        messageError('Bạn chưa nhập thời gian học!')
        return
    }
    loading.setLoading(true)
    await lessonStore.saveLesson({
        ...lesson.value,
        course_id: courseId
    }).then(async data => {
        if (data.status) {
            await courseStore.fetchCourseDetail(courseId);
            await lessonStore.fetchLessons(courseId);
            openId.value = data.data.reference_id
            dialog.value = false
            resetDialog()
            messageSuccess("Lưu bài học thành công")
            loading.setLoading(false)
        } else {
            messageError("Lưu bài học thất bại")
            loading.setLoading(false)
        }
    })
}

async function editTitle() {

    if (lesson.value.reference_id && !lesson.value.time) {
        messageError('Bạn chưa nhập thời gian học!')
        return
    }

    loading.setLoading(true)
    await lessonStore.updateLesson({
        ...lesson.value,
        course_id: courseId
    }).then(async data => {
        if (data.status) {
            await courseStore.fetchCourseDetail(courseId);
            await lessonStore.fetchLessons(courseId);
            openId.value = data.data.reference_id
            dialog.value = false
            resetDialog()
            messageSuccess("Lưu bài học thành công")
            loading.setLoading(false)
        } else {
            messageError("Lưu bài học thất bại")
            loading.setLoading(false)
        }
    })

    // await store.dispatch(UPDATE_LESSON_TITLE, { lesson: lesson.value }).then(data => {
    //     if (data.status) {
    //         store.dispatch(GET_LIST_LESSON, { courseId })
    //         openId.value = lesson.value.reference_id
    //         resetDialog()
    //     }
    // })
}

const handleAction = async (payload) => {
    const lesson = payload.item
    switch (payload.action) {
        case LESSON_ACTION.DELETE:
            const response = await lessonStore.deleteLesson(lesson.id);
            if (response.status) {
                await lessonStore.fetchLessons(courseId);
            }
            break;
        case LESSON_ACTION.COPY:
            const clonedLesson = removeIdRecursive(JSON.parse(JSON.stringify(lesson)));
            lessonStore.lessons.push(clonedLesson)
            break;
    }
}

const removeIdRecursive = (lesson) => {
    if ('id' in lesson) delete lesson.id;
    if (Array.isArray(lesson.children)) {
        lesson.children.forEach(child => removeIdRecursive(child));
    }
    return lesson;
}

const handleChildAction = async (payload) => {
    const lesson = payload.item
    const parent = payload.parent
    switch (payload.action) {
        case LESSON_ACTION.EDIT:
            redirectPage(lesson.type, lesson.id);
            break;
        case LESSON_ACTION.ADD_QUESTION:
            openQuestionPage(lesson.id);
            break;
        case payload.action === LESSON_ACTION.DELETE:
            if (confirm('Bạn chắc chắn muốn xóa?')) {
                const response = await lessonStore.deleteLesson(lesson.id);
                if (response.status) {
                    await lessonStore.fetchLessons(courseId);
                }
            }
            break;
        case LESSON_ACTION.COPY:
            if (parent) {
                const clonedLesson = removeIdRecursive(JSON.parse(JSON.stringify(lesson)));
                parent.children.push(clonedLesson)
            }
            break;
    }
}

function submitOrder() {
    // lessons.value.forEach((l, i) => {
    //     l.order = i
    //     l.children?.forEach((c, j) => {
    //         c.order = j
    //     })
    // })
    // store.dispatch(UPDATE_LESSON_ORDER, { lessons: lessons.value }).then(data => {
    //     if (data.status) {
    //         store.dispatch(SUCCESS, {
    //             type: 'success_vote',
    //             message: 'Cập nhật vị trí thành công'
    //         })
    //     }
    // })
}

const redirectPage = (lesson_type, lesson_id) => {
    if (lesson_type === LESSON_TYPE_NOT_SELECTED) {
        router.push({
            path: "/lesson/select",
            query: { lesson_id: lesson_id, course_id: course.value.id }
        });
    } else if (lesson_type === LESSON_TYPE_VIDEO) {
        router.push({
            path: "/lesson/video",
            query: { lesson_id: lesson_id, course_id: course.value.id }
        });
    } else if (lesson_type === LESSON_TYPE_TEXT_IMAGE) {
        router.push({
            path: "/lesson/text",
            query: { lesson_id: lesson_id, course_id: course.value.id }
        });
    } else if (lesson_type === LESSON_TYPE_EXCERCISE) {
        router.push({
            path: "/lesson/exercise",
            query: { lesson_id: lesson_id, course_id: course.value.id }
        });
    } else if (lesson_type === LESSON_TYPE_FLASHCARD) {
        router.push({
            path: "/lesson/flashcard",
            query: { lesson_id: lesson_id, course_id: course.value.id }
        });
    }
}

const openQuestionPage = (lesson_id) => {
    router.push({
        path: "/lesson/question",
        query: { lesson_id: lesson_id, course_id: course.value.id }
    });
}
</script>
