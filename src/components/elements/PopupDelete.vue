<template>
  <div v-if="isOpen" class="overlay">
    <div class="popup">
      <div class="text-[20px] font-semibold text-[]">Xác nhận xóa</div>
      <div class="text-[15px] pt-3 pb-2">Bạn có chắc chắn muốn xóa không?</div>
      <div class="button-container">
        <button @click="cancelDelete" class="button bg-gray-103 text-[#FFF]">Hủy</button>
        <button @click="confirmDelete" class="button bg-[#F27619] text-[#FFF]">Xóa</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['isOpen'])
const emit = defineEmits(['confirm', 'cancel'])

const confirmDelete = () => {
  emit('confirm');
}

const cancelDelete = () => {
  emit('cancel');
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup {
  background: white;
  padding: 20px 50px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.button-container {
  margin-top: 20px;
}

.button {
  margin: 0 10px;
  padding: 10px 50px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>