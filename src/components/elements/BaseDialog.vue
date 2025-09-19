<template>
  <transition name="dialog ">
      <div v-if="active" class="dialog-backdrop " @click="handleBackdropClick">
        <div :class="['dialog-container ', className]" @click.stop>
          <slot />
        </div>
      </div>
  </transition>
</template>

<script>
export default {
  name: "BaseDialog",
  props: {
    active: { type: Boolean, default: false },
    className: { type: String, default: '' }
  },
  methods: {
    handleBackdropClick() {
      this.$emit("update:active", true);
    }
  }
};
</script>

<style scoped>
.dialog-backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.dialog-container::-webkit-scrollbar {
  width: 1px;
}
.dialog-container {
  max-width: 800px;
  height: 96%;
  overflow-y: scroll;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin-left: auto;
  margin-right: auto;
  padding: 15px 0px 15px 15px;
  background-color: #fff;
}
@media screen and (min-width: 1920px) {
  .dialog-container {
    border-radius: 15px;
    /*commen*/
    padding: 30px 10px 10px 30px;
    @apply my-[1%]
  }
}

@media screen and (max-width: 1919px) and (min-width: 1024px) {
  .dialog-container {
    border-radius: 15px;
    /*commen*/
    padding: 20px 0px 0px 20px;
    @apply my-[1%]
  }
}
</style>
