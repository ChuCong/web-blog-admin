<template>
  <div class="box-input">
    <div v-if="type === 'text'">
      <input :type="type" class="custom-input" :placeholder="placeholder"
        :style="[`width:${width}%;height:${height}px`]" v-model="itemValueText" @change="inputText(itemValueText)"
        :readonly="readonly" />
    </div>
    <div v-if="type === 'select'" :class="['relative']">
      <!-- <div v-if="multiple == true">
        <div class="flex ">
          <input id="btn-select-multi" class="custom-input cursor-pointer truncate" readonly
            :placeholder="label ? label : placeholder" :style="[`width:${width}%;height:${height}px`]"
            @click="BtnSelect" :value="itemValueSelectMulti.join(', ')" />
          <div class="icon-down-select" :style="width ? `margin-left:${width - 10}%` : ''">
            <img src="@/assets/images/icon/down-icon_gray.svg" />
          </div>
        </div>
        <ul id="box-multi-select" class="list-select-nobg" v-if="listSelect" :style="[`width:${width}%;`]">
          <li v-for="(item, index) in items" :key="index">
            <label>
              <input type="checkbox" :value="item[itemValue]" v-model="checkboxSelectMulti"
                @change="selectedMulti()" />{{
                  item[itemText] }}
            </label>
          </li>
        </ul>
      </div> -->
      <div>
        <div class="flex">
          <input class="custom-input cursor-pointer truncate" readonly :placeholder="label ? label : placeholder"
            :style="[`width:${width}%;height:${height}px`]" @click="BtnSelect" :value="itemValueSelect" />
          <div class="icon-down-select" :style="width ? `margin-left:${Number(width) - 15}%` : ''">
            <img src="@/assets/images/icon/down-icon_gray.svg" />
          </div>
        </div>
        <ul class="list-select" v-if="listSelect" :style="[`width:${width}%`]">
          <li v-for="(item, index) in items" :key="index" @click="selected(item[itemValue])"><label>{{ item[itemText]
              }}</label></li>
        </ul>
      </div>
    </div>

    <div v-if="type === 'date'">
      <input class="custom-input1 cursor-pointer z-10" :style="[`width:${width}%;height:${height}px`]" type="date"
        id="date" @change="inputDate(itemValueDate)" v-model="itemValueDate" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, defineProps, ref } from "vue";

const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: 'text',
  },
  items: {
    type: Array,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [],
  },
  itemText: {
    type: String,
    default: 'text',
  },
  itemValue: {
    type: String,
    default: 'value',
  },
  placeholder: {
    type: String,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: '',
  },
  label: {
    type: String,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: '',
  },
  width: {
    type: [Number, String],
    // eslint-disable-next-line vue/require-valid-default-prop
    default: 200
  },
  height: {
    type: [Number, String],
    // eslint-disable-next-line vue/require-valid-default-prop
    default: 40
  },
  value: {
    type: [Number, String], default: 1
  },
  readonly: {
    type: Boolean, default: false
  }
})

const emit = defineEmits(['input'])
let listSelect = ref(false);
let itemValueDate = ref('');
let itemValueText = ref('');

let itemValueSelect = computed(() => {
  // eslint-disable-next-line
  const select: any = props.items.find(((item: any) => {
    return item[props.itemValue] === props.value
  }))
  if (select) return select[props.itemText]
  return ''
});

const BtnSelect = () => {
  if (listSelect.value == false) {
    listSelect.value = true
  } else {
    listSelect.value = false
  }
}

const selected = (value: string) => {
  listSelect.value = false
  emit('input', value)
}
const inputDate = (value: string) => {
  emit('input', value)
}
const inputText = (value: string) => {
  emit('input', value)
}


</script>

<style scoped lang="scss">
.custom_outlineText {
  @apply border-gray-102 rounded border p-2 mt-3 focus:outline-none placeholder:text-gray-101 focus:border-blue-101 focus:border-2 z-10
}

.icon-outline {
  @apply absolute -ml-[35px] cursor-pointer mt-[15px];
}

.custom-input {
  font-weight: 300;
  @apply rounded-[6px] text-[14px] bg-[#F4F3F3] text-[#4D4E50] placeholder-[#A1A1A1] border border-solid border-[#F4F3F3] px-2;
}

.custom-input1 {
  font-weight: 300;
  @apply rounded-[6px] bg-[#F4F3F3] text-[#4D4E50] placeholder-[#060708] border border-solid border-[#F4F3F3] px-2;
}

.custom-input:focus,
.custom-input1 {
  outline: none;
}

.list-select {
  box-shadow: 0px 0px 7px #e1e1e1;
  @apply bg-[#FFFFFF] text-[#5d5d5f] pt-1 pb-1 w-[300px] absolute z-10 mt-[13px] rounded-lg border border-[#f0f0f0];

  li {
    @apply px-3 py-2 border-[#A1A1A1] truncate;
  }

  li:hover {
    @apply bg-[#ebf1f7] text-[#4FA4C8];
  }

  li:last-child {
    @apply border-b-[0] border-b-[#DCE9F5];
  }
}

.list-select-nobg {
  @apply text-gray-101 bg-white w-[250px] absolute z-10 mt-1 border rounded border-[#CED4DA];

  li {
    @apply px-5 py-2 border-b border-[#CED4DA] truncate;
  }

  li:hover {
    @apply text-[#4FA4C8];
  }

  li:last-child {
    @apply border-b-[0] border-b-[#CED4DA];
  }
}

.icon-down-select {
  @apply absolute z-0 mt-[15px];
}

.icon-down-select1 {
  @apply absolute mt-[18px];
}

input[type="date"]::-webkit-calendar-picker-indicator {
  margin-top: 5px;
  color: #ffffff;
  opacity: 1;
  display: block;
  background: url('@/assets/images/icon/date-icon.svg') no-repeat;
  width: 20px;
  height: 20px;
  border-width: thin;
}

.custom-input11 {
  font-weight: 300;
  font-style: italic;
  @apply text-gray-101 placeholder-gray-101 border border-[#CED4DA] px-4 pr-10 focus:outline-none focus:border-[#4097A3] focus:border-2 rounded;
}
</style>