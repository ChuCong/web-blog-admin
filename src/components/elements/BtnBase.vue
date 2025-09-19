  <template>
    <div class="item-add"
      :style="[width ? `width:${width}px` : '', height ? `height:${height}px` : '', `border:2px solid ${bg_color}`, `background:${bg_color}`,]">
      <div class="add__text" :style="color ? `color:${color}` : 'color:#7E7E7E'">
        {{ text }}
      </div>
      <!-- <div class="btn-add"
         :style="[color?`background: linear-gradient(110deg, transparent 20px, ${color} 0)`:'background: linear-gradient(110deg, transparent 20px, #7E7E7E 0)',
         height?`height:${height}px`:''
         ]">
      <svg class="ml-2" :width="widthIcon" :height="heightIcon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path :fill="bg_color" d="M18.1792 8.11733H11.8826V1.82095C11.8826 -0.606984 8.11715 -0.606984 8.11715 1.82095V8.11733H1.82055C-0.606849 8.11733 -0.606849 11.8827 1.82055 11.8827H8.11715V18.179C8.11715 20.607 11.8826 20.607 11.8826 18.179V11.8827H18.1792C20.6069 11.8827 20.6069 8.11733 18.1792 8.11733Z" />
      </svg>

    </div> -->
    </div>
  </template>
<script lang="ts" setup>
import { defineProps } from "vue";

// eslint-disable-next-line
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  color: {
    type: String,
    default: '#FFF',
  },
  bg_color: {
    type: String,
    default: '#F27619',
  },
  text: {
    type: String,
    default: '',
  },
  // heightIcon: {
  //   type: Number,
  //   default: 20,
  // },
  // widthIcon: {
  //   type: Number,
  //   default: 20
  // },
  width: {
    type: Number,
    default: 140
  },
  height: {
    type: Number,
    default: 40
  }
})
</script>
<style lang="scss" scoped>
.item-add {
  @apply border rounded-[6px] flex justify-end items-center cursor-pointer cursor-pointer;

  .add__text {
    @apply text-[16px] mx-auto
  }

  .btn-add {
    @apply rounded-r-[1.3rem] flex justify-center items-center w-[70px];

    img {
      margin-left: 10px;
    }
  }

}
</style>
