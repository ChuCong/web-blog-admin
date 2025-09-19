<template>
  <div class="base-icon">
    <img :style="'width:' + size + '; height:' + size" :src=src v-on:click="onClick" />
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    size: String
  },
  data() {
    return {
    };
  },
  components: {},
  methods: {
    onClick() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss">
.base-icon:hover {
  cursor: pointer;
}

.base-icon {
  display: inline-block;
}
</style>
