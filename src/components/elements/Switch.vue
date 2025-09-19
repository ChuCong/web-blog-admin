<template>
    <label class="inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer" :checked="data" @change="changeStatus" :disabled="disabled">
        <div class="relative w-11 h-6 bg-[#4D4E50] rounded-full peer peer-focus:ring-4
              dark:bg-[#4D4E50]
             peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
             peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 
             after:start-[2px] after:bg-white after:border-[#4D4E50] after:border after:rounded-full 
             after:h-5 after:w-5 after:transition-all dark:border-[#4D4E50] peer-checked:bg-[#4097A3]">
        </div>
    </label>
</template>
<script setup>
import { computed, defineProps, defineEmits } from "vue";


const props = defineProps({
    modelValue: {
        type: Number,
        default: 0
    },

    isSchedule: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        default: false
    }
})
const emit = defineEmits(['update:modelValue'])

const data = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
})

const changeStatus = () => {
    emit('update:modelValue', !props.modelValue)

}

</script>