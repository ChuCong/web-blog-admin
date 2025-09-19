<template>
    <SubHeader v-if="course && course.title" :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="md:flex gap-8">
            <div class="flex-1">
                <Form @submit.prevent="handleUpload">
                    <!-- Video upload -->
                    <div class="flex items-center mb-4">
                        <div class="w-full md:w-1/2 px-2 mb-2 md:mb-0">
                            <div class="mb-[54px]">
                                <p class="input__text mb-2">Video bài học</p>
                                <div class="upload-container flex gap-3">
                                    <label class="upload-box">
                                        <input type="file" @change="onChangeFileUpload" accept=".mp4" class="file-input"
                                            :disabled="overlay" />
                                        <div class="w-fit mx-auto pb-[15px]">
                                            <img src="@/assets/images/icon/icon_upload_image.svg" alt="">
                                        </div>
                                        <span>Click để upload file</span>
                                        <div class=" italic text-[#F15922] pt-2">Định dạng file: MP4</div>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div v-if="uploading" class="w-full md:w-1/2 px-2">
                            <div class="w-full bg-gray-102 rounded-full h-6">
                                <div class="bg-primary h-6 rounded-full flex items-center justify-center text-white text-xs"
                                    :style="{ width: percentUpload + '%' }">
                                    <span>{{ Math.ceil(percentUpload) }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Video preview -->
                    <div v-if="lesson && lesson.medias && lesson?.medias[0]?.src_url" class="flex justify-start mb-4">
                        <video width="400" controls class="rounded shadow">
                            <source :src="lesson?.medias[0].src_url" type="video/mp4" />
                            Your browser does not support HTML video.
                        </video>
                        <div class="w-fit cursor-pointer" @click="deleteVideo">
                            <img class="w-[18px]" src="@/assets/images/icon/icon_close.svg" alt="">
                        </div>
                    </div>

                    <div class="flex items-center mb-6" v-if="lesson && lesson.medias && lesson?.medias[0]?.src_url">
                        <label class="flex items-center mr-6">
                            <input type="radio" class="form-radio" :value="1" v-model="allowVideoRewind"
                                :disabled="overlay" />
                            <span class="ml-2">Cho phép tua Video</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" class="form-radio" :value="0" v-model="allowVideoRewind"
                                :disabled="overlay" />
                            <span class="ml-2">Không cho phép tua Video</span>
                        </label>
                    </div>

                    <!-- <file-pond name="file" ref="pond" label-idle="Drop files here..." v-bind:allow-multiple="true"
                    accepted-file-types="image/jpeg, image/png"
                    server="http://127.0.0.1:8000/admin/lessons/video/upload" v-bind:files="myFiles"
                    v-on:init="handleFilePondInit" /> -->

                    <!-- Lesson content -->
                    <div class="mb-8">
                        <h5 class="font-semibold mb-2">Nhập nội dung bài học</h5>
                        <InputQuillEditor :placeholder="'Nhập nội dung bài học'" v-model="lesson.content" />
                    </div>

                    <div v-if="lesson && lesson.medias && lesson.medias[0] && lesson.medias[0].src" class="mb-4">
                        <h5 class="font-semibold mb-2 uppercase">Dữ liệu tạo từ Video</h5>
                        <div v-if="lesson.medias[0].audio_url" class="flex items-center gap-2">
                            <span class="font-medium">Audio:</span>
                            <a :href="lesson.medias[0].audio_url" target="_blank" class="text-primary underline">Tải
                                về</a>
                        </div>
                        <div v-if="lesson.medias[0].watermark_url" class="flex items-center gap-2 mt-1">
                            <span class="font-medium">Video watermark:</span>
                            <a :href="lesson.medias[0].watermark_url" target="_blank" class="text-primary underline">Tải
                                về</a>
                        </div>
                        <div v-if="lesson.medias[0].vi_sub_url" class="flex items-center gap-2">
                            <span class="font-medium">Subtitle Tiếng Việt:</span>
                            <a :href="lesson.medias[0].vi_sub_url" target="_blank" class="text-primary underline">Tải
                                về</a>
                        </div>
                        <div v-if="lesson.medias[0].en_sub_url" class="flex items-center gap-2 mt-1">
                            <span class="font-medium">Subtitle English:</span>
                            <a :href="lesson.medias[0].en_sub_url" target="_blank"
                                class="text-primary underline">Download</a>
                        </div>
                    </div>

                    <!-- Buttons -->
                    <div class="flex justify-center gap-4 mt-6">
                        <button type="button" class="px-4 py-2 rounded bg-gray-103 text-white hover:bg-gray-500"
                            @click="comeBack">
                            Hủy
                        </button>
                        <button type="submit"
                            class="px-4 py-2 rounded bg-primary text-white hover:bg-blue-700 w-[200px]"
                            :disabled="overlay">
                            Lưu
                        </button>
                    </div>
                </Form>
            </div>
            <div class="w-full md:w-80 mt-8 md:mt-0">
                <h4 class="font-bold mb-4 text-[20px]">Quy trình xử lý video</h4>
                <ol class="relative border-l border-blue-500">
                    <li v-for="(step, idx) in processSteps" :key="step" class="mb-6 ml-4">
                        <div :class="[
                            'flex flex-col items-start',
                            processMap.has(step)
                                ? 'font-bold text-green-600'
                                : 'text-gray-400 opacity-60'
                        ]">
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full mr-3"
                                    :class="processMap.has(step) ? 'bg-green-500' : 'bg-gray-300'"></span>
                                {{ALL_VIDEO_STATUS.find(s => s.key === step)?.label}}
                            </div>
                            <div v-if="processMap.has(step)" class="ml-6 text-xs text-gray-500">
                                <div v-if="processMap.get(step)?.start">Bắt đầu: {{ processMap.get(step).start
                                }}</div>
                                <div v-if="processMap.get(step)?.end">Kết thúc: {{
                                    processMap.get(step).end }}</div>
                            </div>
                        </div>
                    </li>
                    <!-- Nếu có lỗi, hiển thị cuối cùng -->
                    <li v-if="errorProcess" class="mb-6 ml-4">
                        <div class="flex flex-col items-start text-red-600 font-bold">
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full mr-3 bg-red-500"></span>
                                {{ALL_VIDEO_STATUS.find(s => s.key === ENCRYPT_MEDIA_PROCESS.STATUS_ERROR)?.label}}
                            </div>
                            <div class="ml-6 text-xs">
                                <div class="mt-2" v-if="errorProcess.start">Thời gian lỗi: {{ errorProcess.start
                                }}</div>
                                <div class="mt-2">Message Lỗi: {{ errorProcess.message }}</div>
                            </div>
                        </div>
                    </li>
                </ol>
            </div>
        </div>
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import * as yup from 'yup';
import { useLessonStore } from '@/stores/lesson';
import { useCourseStore } from '@/stores/course';
import { useSettingStore } from '@/stores/setting'
import { ENCRYPT_MEDIA_PROCESS } from '@/config/constant';
import { messageError, messageSuccess } from "@/common/message.service"
import { useLoadingStore } from '@/stores/loading';

const loading = useLoadingStore();

const router = useRouter();
const route = useRoute();
const lessonStore = useLessonStore();
const courseStore = useCourseStore();
const settingStore = useSettingStore()

const ALL_VIDEO_STATUS = [
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_START, label: 'Chuẩn bị' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_ADD_TRANSCRIPT, label: 'Tạo transcript' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_ADD_WATER_MARK, label: 'Thêm watermark' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_ENCRYPTING, label: 'Đang mã hóa video' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_PUSH_TO_STORAGE, label: 'Upload lên S3' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_COMPLETE, label: 'Hoàn thành' },
    { key: ENCRYPT_MEDIA_PROCESS.STATUS_ERROR, label: 'Lỗi' }
]

const overlay = ref(false);
const uploading = ref(false);
const allowVideoRewind = ref<number>(1);
const videoConfig = reactive({});
const courseId = route.query.course_id as string;
const lessonId = route.query.lesson_id as string;

const course = computed(() => courseStore.detailCourse);
const lesson = computed(() => lessonStore.lesson);
const settingDetail = computed(() => settingStore.settingDetail)

const percentUpload = computed(() => lessonStore.percentUpload);
const breadcrumb = reactive([
    { name: `Khóa học ${course.value.title}`, link: `/course/edit/${courseId}?viewType=2` },
    { name: "Tạo Bài học", link: `/lesson/video?lesson_id=${lessonId}&course_id=${courseId}` },
])

watch(() => settingDetail.value, (newVal: any) => {
    if (newVal && newVal.value) {
        Object.assign(videoConfig, newVal.value)
    }
}, { deep: true, immediate: true })

const processSteps = computed(() => getVideoProcessSteps(videoConfig));
const processMap = computed(() => {
    const map = new Map();
    (lesson.value.encrypt_process || []).forEach(item => {
        map.set(item.status, item);
    });
    return map;
});
const errorProcess = computed(() =>
    (lesson.value.encrypt_process || []).find(p => p.status === ENCRYPT_MEDIA_PROCESS.STATUS_ERROR)
);

const processStatusList = computed(() => lesson.value.encrypt_process?.map(p => p.status) || []);
const errorStatus = computed(() => lesson.value.encrypt_process?.find(p => p.status === ENCRYPT_MEDIA_PROCESS.STATUS_ERROR));

onMounted(async () => {
    loading.setLoading(true)
    await lessonStore.fetchLessonDetail(lessonId);
    await courseStore.fetchCourseDetail(courseId);
    await settingStore.fetchSettingByKey({ key: 'video_config' });
    loading.setLoading(false)

    if (lesson.value?.medias && lesson.value?.medias?.length > 0 && lesson.value.medias[0].src) {
        allowVideoRewind.value = lesson.value?.allow_video_rewind
    }
});

const comeBack = () => {
    router.push({ path: '/course', query: { courseId, viewType: 2 } });
};

const onChangeFileUpload = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    overlay.value = true;
    uploading.value = true;

    const formData = new FormData();
    formData.append('file', file);

    const res = await lessonStore.uploadLessonVideo(formData) as { data?: { status?: number, data?: string } };
    if (res?.data?.status === 1) {
        overlay.value = false;
        uploading.value = false;
        lesson.value.medias[0].src = res.data.data;
        lesson.value.medias[0].src_url = res.data.data;
    }
};

const handleUpload = async () => {
    loading.setLoading(true)
    lesson.value.allow_video_rewind = allowVideoRewind.value
    const response = await lessonStore.updateLesson(lesson.value);
    loading.setLoading(false)
    if (response.status) {
        messageSuccess("Lưu bài học thành công")
        // router.push({ path: `/course/edit/${courseId}` });
    } else {
        messageError("Lưu bài học thất bại")
    }
};


const getVideoProcessSteps = (videoConfig) => {
    const steps = [
        ENCRYPT_MEDIA_PROCESS.STATUS_START
    ];
    if (videoConfig.auto_transcript) steps.push(ENCRYPT_MEDIA_PROCESS.STATUS_ADD_TRANSCRIPT);
    if (videoConfig.use_watermark) steps.push(ENCRYPT_MEDIA_PROCESS.STATUS_ADD_WATER_MARK);
    steps.push(ENCRYPT_MEDIA_PROCESS.STATUS_ENCRYPTING);
    if (videoConfig.store_on_s3) steps.push(ENCRYPT_MEDIA_PROCESS.STATUS_PUSH_TO_STORAGE);
    steps.push(ENCRYPT_MEDIA_PROCESS.STATUS_COMPLETE);
    return steps;
};

const deleteVideo = () => {
    lesson.value.medias[0].src = null
    lesson.value.medias[0].src_url = null
}

</script>

<style scoped>
.validate-error {
    color: red;
}

.v-row {
    margin-bottom: 15px;
    padding-left: 10px;
}

.upload-container {
    @apply flex gap-3 items-center;
}

.upload-box {
    border-radius: 4px;
    border: 1px dashed #ABADAF;
    padding: 16px 48px;
    text-align: center;
    cursor: pointer;
    position: relative;
}

.file-input {
    display: none;
}

.upload-box span {
    color: #F15922;
    font-size: 15px;
    font-weight: 600;
}
</style>
