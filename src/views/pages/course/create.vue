<template>
    <SubHeader :breadcrumb="breadcrumb">
    </SubHeader>
    <Content>
        <CourseInforEditor />
    </Content>
</template>

<script setup lang="ts">
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import CourseInforEditor from '@/components/course-model/CourseInforEditor.vue';

const breadcrumb = [
    { name: "Danh sách Khóa học", link: '/course/list' },
    { name: "Tạo Khóa học", link: '/course/create' },
]
</script>
