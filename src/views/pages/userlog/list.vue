<template>
    <div>
        <SubHeader :breadcrumb="breadcrumb" class="mb-4" />
        <Content>
            <form class="flex gap-4 mb-4" @submit.prevent="onSearch">
                <InputTextOutline placeholder="Tên người dùng" width="100" className="mb-2" :value="search.full_name"
                    @input="(value) => search.full_name = value" />
                <InputTextOutline placeholder="Tên bài học" width="100" className="mb-2" :value="search.lesson_title"
                    @input="(value) => search.lesson_title = value" />
                <InputTextOutline placeholder="Tên khóa học" width="100" className="mb-2" :value="search.course_title"
                    @input="(value) => search.course_title = value" />
                <button type="submit" class="px-2 py-1 bg-primary text-white rounded">Tìm kiếm</button>
            </form>
            <DataTable :itemHeader="Header" :itemValue="userlogs" :paginate="paginate" @getPage="getPage">
                <template v-slot:user="item: any">
                    <div>{{ item.user?.full_name }}</div>
                </template>
                <template v-slot:lesson="item: any">
                    <div>{{ item.lesson?.title }}</div>
                </template>
                <template v-slot:course="item: any">
                    <div>{{ item.course?.title }}</div>
                </template>
                <template v-slot:created_at="item: any">
                    <div class="flex justify-center">{{ formatToVNTime(item.created_at) }}</div>
                </template>
            </DataTable>
        </Content>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import SubHeader from "@/views/theme/SubHeader.vue";
import Content from "@/views/theme/Content.vue";
import DataTable from "@/components/elements/DataTable.vue";
import { useUserLogStore } from '@/stores/userlog';
import { formatToVNTime } from '@/common/date';
import InputTextOutline from '@/components/elements/InputTextOutline.vue'

const store = useUserLogStore();

const userlogs = computed(() => store.userlogs);
const paginate = computed(() => store.paginate ?? {});

const Header = [
    { text: "Tên người dùng", value: "user", align: "left", width: 300 },
    { text: "Tên bài học", value: "lesson", align: "left", width: 300 },
    { text: "Tên khóa học", value: "course", align: "left", width: 300 },
    { text: "Thời gian", value: "created_at", align: "center", width: 150 },
];

const breadcrumb = [
    { name: "User Log", link: '/userlog/list' }
];

const search = ref({
    full_name: '',
    lesson_title: '',
    course_title: ''
});

const pagination = ref({
    page: 1,
    limit: 10
});

const getPage = async (params) => {
    pagination.value = {
        page: params.page ?? 1,
        limit: JSON.parse(params.limit) ?? null
    };
    await store.fetchUserLogs({
        ...pagination.value,
        ...search.value
    });
};

const onSearch = async () => {
    pagination.value.page = 1;
    await store.fetchUserLogs({
        ...pagination.value,
        ...search.value
    });
};

onMounted(async () => {
    await store.fetchUserLogs({
        ...pagination.value,
        ...search.value
    });
});
</script>