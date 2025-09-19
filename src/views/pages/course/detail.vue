<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <div class="w-full border-b border-gray-300">
            <nav class="flex space-x-4 text-center">
                <button class="py-2 px-4 font-medium" :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-1',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-1'
                }" @click="changeTab('tab-1')">
                    Thông tin chung
                </button>

                <button class="py-2 px-4 font-medium" :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-2',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-2'
                }" @click="changeTab('tab-2')">
                    Giáo trình
                </button>
                <button class="py-2 px-4 font-medium" :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-3',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-3'
                }" @click="changeTab('tab-3')">
                    Tài liệu
                </button>

                <button class="py-2 px-4 font-medium" :class="{
                    'text-blue-600 border-b-2 border-blue-600': activeTab === 'tab-4',
                    'text-gray-600 hover:text-blue-600': activeTab !== 'tab-4'
                }" @click="changeTab('tab-4')">
                    Học viên
                </button>
            </nav>
        </div>

        <div class="mt-4">
            <div v-if="activeTab === 'tab-1'">
                <CourseInforEditor :courseId="courseId" />
            </div>
            <div v-else-if="activeTab === 'tab-2'">
                <keep-alive>
                    <CourseCurriculumEditor :courseId="courseId" />
                </keep-alive>
            </div>
            <div v-else-if="activeTab === 'tab-3'">
                <keep-alive>
                    <ListResource :courseId="courseId" />
                </keep-alive>
            </div>
            <div v-else-if="activeTab === 'tab-4'">
                <keep-alive>
                    <ListStudent :courseId="courseId" />
                </keep-alive>
            </div>
        </div>
    </Content>
</template>

<script setup>
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CourseInforEditor from '@/components/course-model/CourseInforEditor.vue';
import CourseCurriculumEditor from '@/components/course-model/CourseCurriculumEditor.vue';
import ListStudent from '@/components/course-model/ListStudent.vue';
import ListResource from '@/components/course-model/ListResource.vue';

const route = useRoute();
const router = useRouter();

const breadcrumb = [
    { name: "Danh sách Khóa học", link: '/course/list' },
    { name: "Chỉnh sửa Khóa học", link: `/course/edit/${route.params.id}?viewType=1` },
]
const courseId = ref('');
const activeTab = ref('tab-1');

onMounted(() => {
    courseId.value = route.params.id || '';
    activeTab.value = 'tab-' + (route.query.viewType || '1');
    handleTabChange(activeTab.value);
});

function changeTab(tabId) {
    activeTab.value = tabId;
    handleTabChange(tabId);
}

function handleTabChange(tabId) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    router.replace({
        query: {
            ...route.query,
            viewType: tabId.replace('tab-', '')
        }
    });
}
</script>
