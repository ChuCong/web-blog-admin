<template>
    <SubHeader v-if="lesson && lesson.title" :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="w-full grid grid-cols-10 gap-2">
            <div id="exam_container" class="col-span-6 exam_content">
                <div class="w-full flex items-center gap-4 pb-2">
                    <span class="italic font-medium text-[#1894D7]">(Lưu ý: Click Tên câu
                        hỏi.... để chỉnh sửa. Giữ vào câu hỏi để di chuyển)</span>
                    <button class="bg-primary text-white rounded-md p-2" @click="addQuestion">Thêm Câu
                        hỏi</button>
                </div>
                <template v-if="lesson.questions && lesson.questions.length > 0">
                    <div class="w-full min-h-[500px] border border-dashed border-gray-102 p-2">
                        <!-- Danh sách câu hỏi trong group -->
                        <div class="mt-4 space-y-4">
                            <div v-for="(question, qIdx) in lesson.questions" :key="qIdx"
                                class="p-3 rounded border bg-white hover:bg-blue-50 cursor-pointer"
                                :class="[selectedQuestion?.random_id === question.random_id ? 'border-blue-101' : 'border-gray-102']"
                                @click="selectQuestion(question)">
                                <div class="flex items-center">
                                    <span class="font-semibold text-gray-800">Câu {{ qIdx + 1 }}:</span>
                                    <span class="ml-2" v-html="question.content"></span>
                                    <span class="ml-4 px-2 py-0.5 rounded text-xs" :class="{
                                        'bg-green-100 text-green-700': question.question_type === TYPE_ANSWER.ONE_CHOICE,
                                        'bg-yellow-100 text-yellow-700': question.question_type === TYPE_ANSWER.MULTIPLE_CHOICE,
                                        'bg-purple-100 text-purple-700': question.question_type === TYPE_ANSWER.ESSAY,
                                        'bg-pink-100 text-pink-700': question.question_type === TYPE_ANSWER.QUESTION_PAIRS,
                                        'bg-orange-300 text-orange-700': question.question_type === TYPE_ANSWER.RIGHT_OR_WRONG,
                                        'bg-blue-300 text-blue-700': question.question_type === TYPE_ANSWER.ARRANGE
                                    }">
                                        {{ questionTypeLabel(question.question_type) }}
                                    </span>
                                </div>
                                <!-- Đáp án -->
                                <div v-if="question.answers && question.answers.length" class="mt-2 ml-4">
                                    <div v-for="(answer, aIdx) in question.answers" :key="answer.id"
                                        class="flex items-center">
                                        <span class="mr-2 font-bold"
                                            :class="answer.is_correct ? 'text-green-600' : 'text-gray-400'">
                                            {{ answerLabel(question.question_type, aIdx) }}
                                        </span>
                                        <span v-html="answer.content"></span>
                                        <span v-if="answer.is_correct"
                                            class="ml-2 text-green-600 font-semibold text-xs">(Đúng)</span>
                                        <span v-if="question.question_type === TYPE_ANSWER.ARRANGE"
                                            class="ml-2 text-green-600 font-semibold text-xs">({{
                                                answer.index_correct }})</span>
                                    </div>
                                </div>
                                <!-- Tự luận -->
                                <div v-if="question.question_type === TYPE_ANSWER.ESSAY" class="ml-4 mt-2">
                                    <span class="font-bold">Đáp số: </span>
                                    <span>{{ question.essay_answer || '...' }}</span>
                                </div>
                                <!-- Giải thích -->
                                <div v-if="question.explanation" class="ml-4 mt-2 text-gray-500 italic">
                                    <span class="font-bold">Giải thích:</span>
                                    <span v-html="question.explanation"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="w-full h-[500px] flex items-center justify-center border border-dashed border-gray-102">
                        <span class="italic">Chưa có Câu hỏi</span>
                    </div>
                </template>
            </div>
            <div class="col-span-4">
                <template v-if="typeRowEdit == TYPE_ROW.QUESTION">
                    <div class="px-8">
                        <div class="w-full mt-3">
                            <InputQuillEditor id="content" :placeholder="'Nhập nội dung câu hỏi'"
                                v-model="editObj.content" />
                        </div>

                        <div class="block-upload">
                            <div class="flex items-center justify-end mt-4">
                                <select v-model="editObj.question_type" class="h-[36px] rounded-[6px] bg-white"
                                    :style="`border:1px solid #A33E9B; color: #A33E9B`">
                                    <option :value="TYPE_ANSWER.ONE_CHOICE">Câu 1 lựa chọn</option>
                                    <option :value="TYPE_ANSWER.MULTIPLE_CHOICE">Câu nhiều lựa chọn</option>
                                    <option :value="TYPE_ANSWER.ESSAY">Điền từ</option>
                                    <option :value="TYPE_ANSWER.RIGHT_OR_WRONG">Câu hỏi Đúng/Sai</option>
                                    <option :value="TYPE_ANSWER.ARRANGE">Câu hỏi Sắp xếp</option>
                                    <!-- <option :value="TYPE_ANSWER.HAS_CHILD">Câu có câu hỏi con</option> -->
                                </select>
                            </div>
                            <input type="file" :id="`file${editObj.random_id}`" hidden
                                @change="getFileTemporary($event, editObj)" accept=".mp3,audio/*">
                            <div class="flex upload-audio" v-if="editObj.media">
                                <audio
                                    :src="editObj.media && editObj.media.url ? editObj.media.url + `?time=1597104915` : ''"
                                    controls style="height: 25px">
                                </audio>
                                <div title="Xóa file Audio" class="cursor-pointer ml-2" @click="editObj.media = null">
                                    <img src="@/assets/images/icon/trash-icon.svg" :width="20" />
                                </div>
                            </div>
                            <div class="upload-file cursor-pointer" @click="chooseFileTemporary(editObj.random_id)">
                                <img src="@/assets/images/icon/upload_file.svg" class="mr-2">
                                <span class="drop-file" v-if="!editObj.media">Tải file nghe</span>
                            </div>
                        </div>
                        <template v-if="editObj.media">
                            <!-- <QuillEditor theme="snow" placeholder="Nhập transcript"
                                v-model:content="editObj.media.transcript" contentType="html" /> -->
                            <InputQuillEditor id="transcript" :placeholder="'Nhập transcript'"
                                v-model="editObj.media.transcript" />
                        </template>
                        <div class="flex underline font-bold py-2 items-center" v-if="editObj.question_type == TYPE_ANSWER.ONE_CHOICE
                            || editObj.question_type == TYPE_ANSWER.MULTIPLE_CHOICE
                            || editObj.question_type == TYPE_ANSWER.RIGHT_OR_WRONG
                            || editObj.question_type == TYPE_ANSWER.ARRANGE">
                            Đáp án <img :src="iconAdd" class="mx-2 p-2 cursor-pointer rounded" alt="Thêm đáp án"
                                title="Thêm đáp án" @click="openBlockAnswer(editObj)" :style="`background: #7E7E7E`">
                        </div>
                        <!--    table-->
                        <table class="table w-full table-fixed mt-2" v-if="editObj.question_type == TYPE_ANSWER.ONE_CHOICE
                            || editObj.question_type == TYPE_ANSWER.MULTIPLE_CHOICE
                            || editObj.question_type == TYPE_ANSWER.RIGHT_OR_WRONG
                            || editObj.question_type == TYPE_ANSWER.ARRANGE">
                            <tbody class="flex flex-col ">
                                <tr v-for="(answer, index) in editObj.answers" :key="index"
                                    :class="['inherit border border-gray-102 flex items-center', index % 2 == 1 ? 'bg-[#f8fafc]' : '']"
                                    :style="`order: ${index + 1}`">
                                    <td class="flex h-[40px] px-2 w-[10%] items-center"
                                        v-if="editObj.question_type == TYPE_ANSWER.ONE_CHOICE || editObj.question_type == TYPE_ANSWER.MULTIPLE_CHOICE">
                                        <input title="Chọn đáp án đúng"
                                            v-if="editObj.question_type == TYPE_ANSWER.ONE_CHOICE"
                                            :checked="answer.is_correct" type="radio"
                                            @change="radio($event, answer, editObj.answers)"
                                            :name="`radio-${editObj.random_id ?? editObj.id}`">
                                        <input title="Chọn đáp án đúng"
                                            v-if="editObj.question_type == TYPE_ANSWER.MULTIPLE_CHOICE"
                                            v-model="answer.is_correct" type="checkbox"
                                            :name="answer.random_id ?? editObj.id">
                                    </td>
                                    <td class="table-cell w-[70%] items-center">
                                        <InputTextOutline placeholder="Nhập nội dung câu trả lời" type="text"
                                            width="100" :value="answer.content"
                                            @input="(value) => answer.content = value" />
                                    </td>
                                    <td v-if="editObj.question_type == TYPE_ANSWER.RIGHT_OR_WRONG"
                                        class="table-cell px-2 w-[20%] items-center">
                                        <div class="flex">
                                            <input title="Đáp án đúng" :checked="answer.is_correct" type="radio"
                                                :name="`radio-edit-answer-${index}`" @change="answer.is_correct = true">
                                            <span class="px-2">Đúng</span>
                                        </div>
                                        <div class="flex">
                                            <input title="Đáp án sai" :checked="!answer.is_correct" type="radio"
                                                :name="`radio-edit-answer-${index}`"
                                                @change="answer.is_correct = false">
                                            <span class="px-2">Sai</span>
                                        </div>
                                    </td>
                                    <td v-if="editObj.question_type == TYPE_ANSWER.ARRANGE"
                                        class="table-cell w-[20%] items-center">
                                        <InputTextOutline placeholder="Vị trí đúng" type="number" width="100"
                                            :value="answer.index_correct"
                                            @input="(value) => answer.index_correct = value" />
                                    </td>
                                    <td class="table-cell px-2 w-[10%] items-center">
                                        <div class="flex justify-end">
                                            <div title="Xóa đáp án" class="cursor-pointer mr-1"
                                                @click="clearAnswer(editObj.answers, answer)">
                                                <img src="@/assets/images/icon/trash-icon.svg" :width="20" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="w-full mt-3 px-8" v-if="editObj.question_type == TYPE_ANSWER.ESSAY">
                            <span class="underline  font-bold">Đáp số</span>
                            <InputTextOutline placeholder="Nhập đáp số (có thể nhập các đáp án cách nhau bởi dấu phẩy)"
                                type="textarea" width="100" :value="editObj.essay_answer"
                                @input="(value) => editObj.essay_answer = value" />
                        </div>
                        <div class="w-full my-4" v-if="editObj.question_type !== TYPE_ANSWER.HAS_CHILD">
                            <span class="underline  font-bold">Giải thích</span>
                            <InputQuillEditor id="explanation" :placeholder="'Nhập nội dung giải thích'"
                                v-model="editObj.explanation" />
                        </div>
                        <!-- score_or_not -->
                        <InputTextOutline value_translate="Tính điểm câu" type="checkbox"
                            :checked="editObj.score_or_not" :height="24"
                            @input="(value) => editObj.score_or_not = value" :width="24" class="w-full" />

                        <div class="w-full flex items-center justify-between mb-8 mt-4">
                            <BtnBase text="Xóa Câu hỏi" color="#FFF" bg_color="#f00" :width="150"
                                @click="deleteQuestion()" />
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="flex justify-center gap-4 mt-6">
            <button type="button" class="px-4 py-2 rounded bg-gray-103 text-white hover:bg-gray-500 w-[200px]"
                @click="comeBack">
                Hủy
            </button>
            <button v-if="lesson.questions && lesson.questions.length > 0" type="submit"
                class="px-4 py-2 rounded bg-primary text-white hover:bg-blue-700 w-[200px]" @click="saveQuestion">
                Lưu
            </button>
        </div>
    </Content>
</template>
<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { ref, computed, onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLessonStore } from '@/stores/lesson';
import { useCourseStore } from '@/stores/course';
import { TYPE_ROW, TYPE_ANSWER } from "@/config/constant"
import iconAdd from '@/assets/images/icon/add_service.svg'
import InputTextOutline from "@/components/elements/InputTextOutline.vue"
import BtnBase from "@/components/elements/BtnBase.vue"
import { messageError, messageSuccess } from "@/common/message.service"
import { useLoadingStore } from '@/stores/loading';
import InputQuillEditor from "@/components/elements/InputQuillEditor.vue";

const loading = useLoadingStore();
const router = useRouter();
const route = useRoute();
const lessonStore = useLessonStore();
const courseStore = useCourseStore();

const courseId = route.query.course_id as string;
const lessonId = route.query.lesson_id as string;

const course = computed(() => courseStore.detailCourse);
const lesson = computed(() => lessonStore.lesson);

const breadcrumb = reactive([
    { name: `Khóa học ${course.value.title}`, link: `/course/edit/${courseId}?viewType=2` },
    { name: `Thêm câu hỏi Luyện Tập cho Bài học  ${lesson.value.title}`, link: `/lesson/question?lesson_id=${lessonId}&course_id=${courseId}` },
])

onMounted(async () => {
    loading.setLoading(true)
    await lessonStore.fetchLessonDetail(lessonId);
    await courseStore.fetchCourseDetail(courseId);
    loading.setLoading(false)
});

const currentExam: any = ref({})
const currentPart: any = ref({})
const currentPartIndex: any = ref(0)
const editObj: any = ref({})
const typeRowEdit = ref()
const questionIndex = ref(0)

function chooseFileTemporary(question_id) {
    window.document.getElementById('file' + question_id).click()
}

function getFileTemporary(e, question) {
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append('files[]', file)
    formData.append('type', 'exams')
}

function radio(e, answer, answers) {
    answers.forEach(el => {
        if ((el.random_id && el.random_id == answer.random_id) || (el.id && el.id == answer.id)) {
            el.is_correct = true
        } else {
            el.is_correct = false
        }
    })
}

const answer = ref()
const resetAnswer = (random_id: number | null = null) => {
    answer.value = {
        id: null,
        random_id: random_id,
        content: "",
        question_id: null,
        media_id: null,
        is_correct: false,
        media: {}
    }
}

function openBlockAnswer(question: any) {
    let random_id = Math.random()
    resetAnswer(random_id)
    if (!question.answers) {
        question.answers = []
    }
    question.answers.push({
        random_id: answer?.value?.random_id,
        content: answer?.value?.content,
        question_id: answer?.value?.question_id,
        media_id: answer?.value?.media_id,
        is_correct: answer?.value?.is_correct,
        media: answer?.value?.media
    })
    resetAnswer()
}
const clearAnswer = (answers: any, answer: any) => {
    const inx = answers.findIndex(v => (v.random_id && v.random_id === answer.random_id) || (v.id && v.id === answer.id))
    answers.splice(inx, 1)
}

function addQuestion() {
    let random_id = Math.random();
    if (!lesson.value.questions) {
        lesson.value.questions = []
    }
    let index = lesson.value.questions.length;
    let object = {
        id: 0, // or generate a temporary id if needed
        random_id: random_id,
        content: '',
        slug: '',
        index: index,
        media_id: null,
        page_break: false,
        questions: [],
        answers: [],
        essay_answer: '',
        question_type: 1,
        show: 0,
        seo: {
            title: '',
            keyword: '',
            description: '',
        },
        labels: [],
        score: 0, // default score
        level: 1, // default level
        group_question_id: 0, // default group id
        explanation: '',
        score_or_not: true,
        created_at: '',
        updated_at: ''
    }

    lesson.value.questions.push(object)
    selectQuestion(object)
}

const removeAnswersForEssayQuestion = (questions: any[]) => {
    if (questions && questions.length > 0) {
        questions.forEach(q => {
            if (q.question_type == TYPE_ANSWER.ESSAY) {
                q.answers = null
            }
            if (q.questions && q.questions.length > 0) {
                removeAnswersForEssayQuestion(q.questions)
            }
        })
    }
}

const clearFormEdit = () => {
    currentExam.value = null
    currentPart.value = null
    currentPartIndex.value = 0
    editObj.value = null
    typeRowEdit.value = null
    questionIndex.value = 0
}

const deleteQuestion = () => {
    lesson.value.questions?.splice(questionIndex.value, 1)
    clearFormEdit()
}

const selectedQuestion = ref<any>(null)
function selectQuestion(question) {
    selectedQuestion.value = question
    typeRowEdit.value = TYPE_ROW.QUESTION
    editObj.value = question
}

function questionTypeLabel(type: number) {
    switch (type) {
        case 1: return 'Một lựa chọn'
        case 2: return 'Nhiều lựa chọn'
        case 3: return 'Điền từ'
        case 4: return 'Chọn cặp'
        case 6: return 'Đúng sai'
        case 7: return 'Sắp xếp'
        default: return 'Khác'
    }
}
function answerLabel(type: number, idx: number) {
    return String.fromCharCode(65 + idx) + '.'
}

const comeBack = () => {
    router.push({ path: '/course', query: { courseId, viewType: 2 } });
}

const saveQuestion = async () => {
    loading.setLoading(true)
    const response = await lessonStore.updateLesson(lesson.value);
    loading.setLoading(false)
    if (response.status) {
        messageSuccess("Lưu bài học thành công")
        // router.push({ path: `/course/edit/${courseId}` });
    } else {
        messageError("Lưu bài học thất bại")
    }
}

</script>