<template>
    <div class="w-60 border border-primary rounded-2xl bg-gray-100 text-xs">
        <router-link :title="course.title" :to="{ path: path }" class="p-0">
            <img v-if="course.image && course.image.src_url" :src="course.image.src_url"
                class="w-full h-[160px] object-cover rounded-t-2xl" />
            <div class="text-center font-bold h-fit m-2 line-clamp-2 text-black" :title="course.title">
                {{ course.title }}
            </div>
            <div class="px-3 pb-2">
                <div class="">
                    Doanh thu:
                    <span class="font-bold">{{ course.revenue ? formatPrice(course.revenue) : 0 }}</span>
                </div>
                <div class="">
                    Số học viên Đăng ký:
                    <span class="font-bold">{{ course.users_count ?? 0 }}</span>
                </div>
            </div>
        </router-link>
        <div class="flex justify-between w-full p-2">
            <span :class="[course.active ? 'text-green-500' : 'text-red-500', 'font-bold']">
                {{ course.active ? 'Hoạt động' : 'Không hoạt động' }}
            </span>
            <BtnInTable @click="deleteItem(course.id)" :icon="trashIcon" :height="28" :width="28" title="Delete" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { Course } from '@/model';
import trashIcon from '@/assets/images/icon/trash-icon.svg'
import BtnInTable from "@/components/elements/BtnInTable.vue"


const props = defineProps<{
    course: Course;
    path?: string;
}>();

const emit = defineEmits<{
    (e: 'deleteItem', id: number): void;
}>();

const formatPrice = (price: number) => {
    const value = parseFloat(String(price));
    if (value < 0) return '0';
    return new Intl.NumberFormat('de-DE').format(value);
};

const deleteItem = (id: number) => {
    emit('deleteItem', id);
};
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    line-height: 1.4;
    /* hoặc giá trị bạn muốn */
    min-height: 2.9em;
    /* 2 x line-height (1.4em x 2) */
    max-height: 2.9em;
}
</style>
