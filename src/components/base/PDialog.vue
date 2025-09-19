<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white rounded-lg shadow-lg relative p-6 w-[500px]">
            <div class="mb-4">
                <slot name="header">
                    <h2 class="text-lg font-semibold">Dialog</h2>
                </slot>
            </div>

            <div>
                <slot />
            </div>

            <button class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                @click="$emit('update:modelValue', false)">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M10 8.586l4.95-4.95a1 1 0 111.414 1.414L11.414 10l4.95 4.95a1 1 0 01-1.414 1.414L10 11.414l-4.95 4.95a1 1 0 01-1.414-1.414L8.586 10l-4.95-4.95a1 1 0 011.414-1.414L10 8.586z"
                        clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    maxWidth: {
        type: String,
        default: '500px'
    }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
:root {
    --max-width: 500px;
}
</style>
