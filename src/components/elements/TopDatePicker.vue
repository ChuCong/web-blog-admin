<template>
  <Datepicker v-model="picked" />
</template>

<script setup>
import Datepicker from 'vue3-datepicker'
import { ref, defineEmits, defineProps, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: new Date()
  }
})
const emit = defineEmits(['update:modelValue'])

const picked = ref(props.modelValue)

watch(picked, (newVal) => {
  emit('update:modelValue', newVal)
}, { deep: true })
</script>
