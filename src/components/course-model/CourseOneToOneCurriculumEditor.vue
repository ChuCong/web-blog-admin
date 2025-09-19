<template>
    <div class="p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 class="text-xl font-bold mb-4">Chỉnh sửa chương trình 1-1</h2>
        <div class="mb-4">
            <label class="block  font-medium text-gray-700">Tên chương trình</label>
            <input v-model="curriculum.name" type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:" />
        </div>

        <div class="mb-4">
            <label class="block  font-medium text-gray-700">Mô tả</label>
            <textarea v-model="curriculum.description" rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:"></textarea>
        </div>

        <div class="flex justify-end space-x-2">
            <button @click="cancelEdit" class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Hủy</button>
            <button @click="saveCurriculum"
                class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Lưu</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const curriculum = ref({
    name: '',
    description: '',
});

const cancelEdit = () => {
    router.back();
};

const saveCurriculum = () => {
    console.log('Saving:', curriculum.value);
    // Thêm logic lưu thực tế tại đây
    router.push('/course');
};
</script>

<style scoped></style>
