<template>
    <div
        class="border rounded-md border-primary hover:border-l-4 hover:border-purple-600 flex flex-wrap items-center space-x-4 p-2">
        <div class="handle cursor-move">
            <!-- <BaseIcon class="w-5 h-5" :src="iconHead.src" /> -->
            <i :class="'text-2xl mdi ' + iconHead.src"></i>
        </div>

        <div :style="'color:' + lesson.color" class="flex-1 flex items-center space-x-2">
            <span>{{ lesson.title }}</span>
            <button @click="editLesson(lesson)">
                <i class="text-xl mdi mdi-lead-pencil"></i>
            </button>
        </div>

        <div v-if="lesson.encrypt_process" class="text-sm font-medium">
            <span :class="getClassTextStatus(lesson.encrypt_process)">
                {{ getTextStatus(lesson.encrypt_process) }}
            </span>
        </div>

        <div class="flex items-center space-x-2">
            <template v-if="!lesson.reference_id">
                <button v-for="(icon, index) in iconsParent" :key="'parent-' + index" @click="handleAction(icon.action)"
                    :title="icon.tooltip">
                    <i :class="'text-2xl mdi ' + icon.src"></i>
                </button>
            </template>

            <template v-else>
                <button v-for="(icon, index) in iconsChild" :key="'child-' + index"
                    @click="handleChildAction(icon.action)" :title="icon.tooltip">
                    <i :class="'text-2xl mdi ' + icon.src"></i>
                </button>
            </template>

            <button @click="toggleItem">
                <i :class="'text-2xl mdi ' + iconStatus"></i>
            </button>
        </div>
    </div>

    <div class="ml-4">
        <slot></slot>
    </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import { ENCRYPT_MEDIA_PROCESS, LESSON_ACTION } from '@/config/constant';
import { useCourseStore } from '@/stores/course';

const props = defineProps({
    lesson: Object,
    courseId: String,
    parent: Object | null
});

const emit = defineEmits(['editLesson', 'handleAction', 'handleChildAction']);
const courseStore = useCourseStore();

const iconHead = { src: 'mdi-menu' };
const iconsParent = [
    { src: 'mdi-content-copy', action: LESSON_ACTION.COPY, tooltip: 'Copy' },
    { src: 'mdi-delete', action: LESSON_ACTION.DELETE, tooltip: 'Delete' },
];
const iconsChild = computed(() => {
    const base = [
        { src: 'mdi-square-edit-outline', action: LESSON_ACTION.EDIT, tooltip: 'Edit' },
        { src: 'mdi-content-copy', action: LESSON_ACTION.COPY, tooltip: 'Copy' },
        { src: 'mdi-delete', action: LESSON_ACTION.DELETE, tooltip: 'Delete' }
    ];
    if (props.lesson.type === 1) {
        base.splice(1, 0, { src: 'mdi-comment-question-outline', action: LESSON_ACTION.ADD_QUESTION, tooltip: 'Add Question' });
    }
    return base;
});

const disable = ref(false);

const course = computed(() => courseStore.detailCourse);

watch(course, (newVal) => {
    if (newVal && newVal.is_free === 1) {
        disable.value = true;
    }
}, { immediate: true });

const iconStatus = computed(() => {
    if (props.lesson.open === true) return 'mdi-chevron-right-circle';
    else if (props.lesson.open === false) return 'mdi-chevron-down-circle';
    else return '';
});

onMounted(async () => { });

function editLesson(lesson) {
    emit('editLesson', lesson);
}

function toggleItem() {
    props.lesson.open = !props.lesson.open;
}

function handleAction(action) {
    emit('handleAction', { action, item: props.lesson });
}

function handleChildAction(action) {
    emit('handleChildAction', { action, item: props.lesson, parent: props.parent });
}

function getTextStatus(encryptProcess) {
    const status = encryptProcess[encryptProcess.length - 1]?.status;
    switch (status) {
        case ENCRYPT_MEDIA_PROCESS.STATUS_START: return 'Chuẩn bị';
        case ENCRYPT_MEDIA_PROCESS.STATUS_ADD_TRANSCRIPT: return 'Tạo transcript';
        case ENCRYPT_MEDIA_PROCESS.STATUS_ADD_WATER_MARK: return 'Thêm watermark';
        case ENCRYPT_MEDIA_PROCESS.STATUS_ENCRYPTING: return 'Đang mã hóa video';
        case ENCRYPT_MEDIA_PROCESS.STATUS_PUSH_TO_STORAGE: return 'Đẩy lên S3';
        case ENCRYPT_MEDIA_PROCESS.STATUS_COMPLETE: return 'Hoàn thành';
        case ENCRYPT_MEDIA_PROCESS.STATUS_ERROR: return 'Có lỗi xảy ra';
        default: return '';
    }
}

function getClassTextStatus(encryptProcess) {
    const status = encryptProcess[encryptProcess.length - 1]?.status;
    switch (status) {
        case ENCRYPT_MEDIA_PROCESS.STATUS_ERROR: return 'text-red-600';
        case ENCRYPT_MEDIA_PROCESS.STATUS_COMPLETE: return 'text-green-600';
        default: return 'text-blue-600';
    }
}
</script>
