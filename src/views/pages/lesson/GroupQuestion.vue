<template>
    <SubHeader v-if="lesson && lesson.title" :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="w-full grid grid-cols-10 gap-2">
            <div id="exam_container" class="col-span-6 exam_content">
                <div class="w-full flex items-center gap-4 pb-2">
                    <span class="italic font-medium text-[#1894D7]">(Lưu ý: Click vào Tên nhóm câu hỏi hoặc Tên câu
                        hỏi.... để chỉnh sửa. Giữ vào câu hỏi để di chuyển)</span>
                    <button class="bg-primary text-white rounded-md p-2" @click="addGroupQuestion">Thêm Nhóm Câu
                        hỏi</button>
                </div>
                <template v-if="lesson.group_questions && lesson.group_questions.length > 0">
                    <div class="w-full min-h-[500px] border border-dashed border-gray-102">
                        <div v-for="(group, groupIdx) in lesson.group_questions" :key="groupIdx"
                            class="mb-6 border rounded shadow p-4 bg-gray-50"
                            :class="[selectedGroup?.index === group.index ? 'border-primary' : 'border-orange-200']">
                            <!-- Header group question -->
                            <div class="flex items-center justify-between cursor-pointer" @click="selectGroup(group)">
                                <div>
                                    <span class="font-bold text-lg text-blue-700">Nhóm {{ groupIdx + 1 }}: {{
                                        group.title
                                    }}</span>
                                    <span class="ml-4 text-gray-600 italic">Thời gian hiển thị Câu hỏi: <b>{{ group.time
                                    }}</b>
                                        giây</span>
                                </div>
                                <div class="flex">
                                    <button class="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs"
                                        @click.stop="editGroupTime(group)">
                                        Sửa thời gian
                                    </button>
                                    <button class="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs"
                                        @click.stop="addQuestion(group)">
                                        Thêm câu hỏi
                                    </button>
                                </div>
                            </div>

                            <!-- Danh sách câu hỏi trong group -->
                            <div class="mt-4 space-y-4">
                                <div v-for="(question, qIdx) in group.questions" :key="qIdx"
                                    class="p-3 rounded border bg-white hover:bg-blue-50 cursor-pointer"
                                    :class="[selectedQuestion?.random_id === question.random_id ? 'border-blue-101' : 'border-gray-102']"
                                    @click="selectQuestion(question, group)">
                                    <div class="flex items-center">
                                        <span class="font-semibold text-gray-800">Câu {{ qIdx + 1 }}:</span>
                                        <span class="ml-2" v-html="question.content"></span>
                                        <span class="ml-4 px-2 py-0.5 rounded text-xs" :class="{
                                            'bg-green-100 text-green-700': question.question_type === 1,
                                            'bg-yellow-100 text-yellow-700': question.question_type === 2,
                                            'bg-purple-100 text-purple-700': question.question_type === 3,
                                            'bg-pink-100 text-pink-700': question.question_type === 4,
                                            'bg-orange-300 text-orange-700': question.question_type === 6,
                                            'bg-blue-300 text-blue-700': question.question_type === 7
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
                                            <span v-if="question.question_type === 7"
                                                class="ml-2 text-green-600 font-semibold text-xs">({{
                                                    answer.index_correct }})</span>
                                        </div>
                                    </div>
                                    <!-- Đúng/Sai -->
                                    <!-- <div v-if="question.question_type === TYPE_ANSWER.RIGHT_OR_WRONG && question.answers && question.answers.length"
                                    class="ml-4 mt-2">
                                    <span class="font-bold">Đáp án: </span>
                                    <span v-for="(answer, aIdx) in question.answers" :key="answer.id"
                                        :class="answer.is_correct ? 'text-green-600 font-semibold' : 'text-red-600'">
                                        {{ answer.is_correct ? 'Đúng' : 'Sai' }}
                                    </span>
                                </div> -->
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
                    </div>
                </template>
                <template v-else>
                    <div class="w-full h-[500px] flex items-center justify-center border border-dashed border-gray-102">
                        <span class="italic">Chưa có Câu hỏi</span>
                    </div>
                </template>
            </div>
            <div class="col-span-4">
                <template v-if="typeRowEdit == TYPE_ROW.GROUP_QUESTION">
                    <div class="w-full mt-3 px-8">
                        <span class="underline  font-bold">Thời gian hiển thị câu hỏi</span>
                        <InputTextOutline placeholder="Nhập Thời gian hiển thị câu hỏi" type="number" width="100"
                            :value="editObj.time" @input="(value) => editObj.time = value" />
                    </div>
                </template>
                <template v-if="typeRowEdit == TYPE_ROW.QUESTION">
                    <div class="px-8">
                        <!-- <ck-content class="ck-news mt-4" :value="editObj.content" @input="(val) => editObj.content = val"
                        :placeholder="'Nhập nội dung câu hỏi'" /> -->
                        <div class="w-full mt-3">
                            <InputQuillEditor theme="snow" placeholder="Nhập nội dung câu hỏi"
                                v-model:content="editObj.content" contentType="html" />
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
                            <!-- <ck-content class="ck-news" :value="editObj.media.transcript"
                            @input="(val) => editObj.media.transcript = val" :placeholder="'Nhập transcript'" /> -->
                            <InputQuillEditor theme="snow" placeholder="Nhập transcript"
                                v-model:content="editObj.media.transcript" contentType="html" />
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
                            <InputTextOutline placeholder="Nhập đáp số" type="textarea" width="100"
                                :value="editObj.essay_answer" @input="(value) => editObj.essay_answer = value" />
                        </div>
                        <div class="w-full my-4" v-if="editObj.question_type !== TYPE_ANSWER.HAS_CHILD">
                            <span class="underline  font-bold">Giải thích</span>
                            <!-- <ck-content class="ck-news mt-2" :value="editObj.explanation"
                            @input="(val) => editObj.explanation = val" :placeholder="'Nhập nội dung giải thích'" /> -->
                            <InputQuillEditor theme="snow" placeholder="Nhập nội dung giải thích"
                                v-model:content="editObj.explanation" contentType="html" />
                        </div>
                        <div class="w-full flex items-center justify-between mb-8 mt-4">
                            <!-- <div>
                                <label class="flex items-center space-x-1 gap-2 ">
                                    <input type="checkbox" v-model="editObj.show" :true-value="1" :false-value="0"
                                        class="form-checkbox cursor-pointer" />
                                    <span>Show câu hỏi</span>
                                </label>
                            </div> -->
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
            <button v-if="lesson.group_questions && lesson.group_questions.length > 0" type="submit"
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
    { name: `Thêm câu hỏi cho Bài học  ${lesson.value.title}`, link: `/lesson/question?lesson_id=${lessonId}&course_id=${courseId}` },
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
const parentObj: any = ref({})
const editObj: any = ref({})
const correctAnswers: any = ref()
const typeRowEdit = ref()
const questionIndex = ref(0)
const maxQuestionIndex = ref(0)
const updateFollowByName = ref(false)
const showTranscript = ref(false)
const readonly = ref(true)
const errors = reactive([])
const scoreSheet: any = ref({})

const edit = (object: any, typeRow: string, index: number, parent: any) => {
    if (editObj.value) {
        if (editObj.value.exam_checked) editObj.value.exam_checked = false
        if (editObj.value.category_checked) editObj.value.category_checked = false
        if (editObj.value.checked) editObj.value.checked = false
    }

    if (object.is_part) {
        currentPartIndex.value = index
        currentPart.value = object
    }
    parentObj.value = parent
    editObj.value = object
    typeRowEdit.value = typeRow
    questionIndex.value = index

    if (typeRow == TYPE_ROW.QUESTION) {
        editObj.value.checked = true
        editObj.value.updated = true
    }
}

const addGroupQuestion = () => {
    if (!lesson.value.group_questions) {
        lesson.value.group_questions = []
    }
    let index = lesson.value.group_questions.length
    lesson.value.group_questions.push({
        lesson_id: lessonId,
        title: '',
        questions: [],
        time: 0,
        index: index
    })
}


function chooseFileTemporary(question_id) {
    // clearFormEdit()
    window.document.getElementById('file' + question_id).click()
}

function getFileTemporary(e, question) {
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append('files[]', file)
    formData.append('type', 'exams')
    // store.dispatch(`${UPLOAD_AUDIO}`, formData).then(({ data }) => {
    //     if (data.status) {
    //         addAudio(data.data[0], question)
    //     }
    //     e.target.value = null
    // })
}

function addAudio(data, question) {
    question.media_id = data.media_id
    question.media = {
        id: data.media_id,
        path: data.path,
        url: data.url,
        transcript: question.media ? question.media.transcript : ''
    }
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

const clearChildQuestion = (currentQuestion, removeItem, removeIndex) => {
    currentPart.value.questions.push(removeItem)
    currentQuestion.questions.splice(removeIndex, 1)
}


function addQuestion(group) {
    let random_id = Math.random();
    let index = group.questions.length;
    let object = {
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
        labels: []
    }

    group.questions.push(object)
    selectQuestion(object, group)
}

const contentScroll = () => {
    let objDiv: any = document.getElementById("exam_container");
    if (objDiv) {
        setTimeout(() => {
            objDiv.scrollIntoView({ behavior: 'smooth', block: "end" })
        }, 200)
    }
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
    if (parentObj.value && parentObj.value.questions) {
        parentObj.value.questions.splice(questionIndex.value, 1)
    }
    clearFormEdit()
}

const selectedGroup = ref<any>(null)
const selectedQuestion = ref<any>(null)

function selectGroup(group) {
    selectedGroup.value = group
    selectedQuestion.value = null
    // Hiển thị form edit time ở panel phải
    typeRowEdit.value = TYPE_ROW.GROUP_QUESTION
    editObj.value = group
}
function selectQuestion(question, group) {
    selectedQuestion.value = question
    selectedGroup.value = group
    typeRowEdit.value = TYPE_ROW.QUESTION
    editObj.value = question
    parentObj.value = group
}

// Hiển thị label loại câu hỏi
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
// Hiển thị label đáp án (A, B, C, ...)
function answerLabel(type: number, idx: number) {
    // if (type === 1 || type === 4) {
    return String.fromCharCode(65 + idx) + '.'
    // }
    // return ''
}

// Sửa thời gian group
function editGroupTime(group) {
    selectGroup(group)
    // Panel phải sẽ show form edit time
}

const comeBack = () => {
    router.push({ path: '/course', query: { courseId, viewType: 2 } });
}

const saveQuestion = async () => {
    loading.setLoading(true)
    const response = await lessonStore.updateQuestionsOfLesson(lesson.value);
    loading.setLoading(false)
    console.log(response)
    if (response.status) {
        messageSuccess("Lưu câu hỏi thành công")
        // router.push({ path: `/course/edit/${courseId}` });
    } else {
        messageError("Lưu câu hỏi thất bại")
    }
}

</script>