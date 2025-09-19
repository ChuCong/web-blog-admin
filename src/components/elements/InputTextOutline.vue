<template>
  <div>
    <input v-if="type === 'text' || type === 'email' || type === 'number'" :type="type"
      :class="[className, 'custom_outlineText']" :placeholder="placeholder"
      :style="[`width:${width}%;height:${height}px`]" :value="value" @input="changeValue($event.target.value)"
      :readonly="readonly" />

    <input v-if="type === 'date'" :type="type" :class="[className, 'custom_outlineText']" :placeholder="placeholder"
      :style="[`width:${width}%;height:${height}px`]" :value="value" @input="changeValue($event.target.value)"
      :readonly="readonly" />

    <div v-if="type === 'login'">
      <i class="icon-box_login " @click="show">
        <img v-if="icon" class="m-auto " width="20" :src="icon" />
      </i>
      <input :class="[className, 'custom_outlineLogin']" :placeholder="placeholder"
        :style="[`width:${width}%;height:${height}px`]" :value="value" @input="changeValue($event.target.value)"
        :readonly="readonly" />
    </div>

    <textarea v-if="type === 'textarea'" :type="type" :class="[className, 'custom_outlineText']"
      :placeholder="placeholder" :style="[`width:${width}%;`]" :rows="rows" :value="value"
      @input="changeValue($event.target.value)" :readonly="readonly" />
    <div v-if="type === 'checkbox'" class="flex items-center gap-2">
      <input :type="type" :class="[className, 'custom_outlineText']" :placeholder="placeholder" :checked="checked"
        :style="[`width:${width}px;height:${height}px`]" :value="value" @input="changeValue($event.target.checked)"
        :readonly="readonly" />
      {{ value_translate }}
    </div>
    <div v-if="type === 'password'">
      <i class="icon-box_login " @click="show">
        <img class="m-auto " width="20" :src="icon" />
      </i>
      <input :class="[className, 'custom_outlineLogin']" :placeholder="placeholder"
        :style="[`width:${width}%;height:${height}px`]" :value="value" @input="changeValue($event.target.value)"
        :readonly="readonly" :type="typeText ? 'text' : 'password'" />
      <i class="icon-outline " @click="show">
        <img v-if="typeText" class="m-auto " width="20" src="@/assets/images/icon/view.png" />
        <img v-else class="m-auto" width="20" src="@/assets/images/icon/eye-hidden.png" />
      </i>
    </div>
    <div v-if="type === 'create_password'">
      <input :class="[className, 'custom_outlineText']" :placeholder="placeholder"
        :style="[`width:${width}%;height:${height}px`]" :value="value" @input="changeValue($event.target.value)"
        :readonly="readonly" :type="typeText ? 'text' : 'password'" autocomplete="new-password" autocapitalize="off"
        spellcheck="false" />
      <i class="icon-outline" @click="show">
        <img v-if="typeText" class="m-auto " width="20" src="@/assets/images/icon/view.png" />
        <img v-else class="m-auto" width="20" src="@/assets/images/icon/eye-hidden.png" />
      </i>
    </div>

    <div v-if="type === 'select'" :class="['relative', className]" ref="selectRef">
      <div v-if="multiple == true">
        <div class="flex">
          <input id="btn-select-multi" class="custom-input_no_bg cursor-pointer truncate" readonly
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
      </div>
      <div v-else>
        <div class="flex">
          <input class="custom-input_no_bg cursor-pointer truncate" readonly :placeholder="label ? label : placeholder"
            :style="[`width:${width}%;height:${height}px`]" @click="BtnSelect" :value="itemValueSelect" />
          <div class="icon-down-select">
            <img src="@/assets/images/icon/down-icon_gray.svg" />
          </div>
        </div>
        <ul class="list-select-nobg overflow-y-auto" v-if="listSelect" :style="[`width:${width}%;`]">
          <li v-for="(item, index) in items" :key="index" @click="selected(item[itemValue])"
            :class="item[itemValue] == value ? 'item_select' : ''"><label>{{ item[itemText]
              }}</label></li>
        </ul>
      </div>
    </div>
    <input v-if="type === 'price'" type="text" :class="[className, 'custom_outlineText']" :placeholder="placeholder"
      :style="[`width:${width}%;height:${height}px`]" :value="formatNumberWithCommas(value)"
      @input="onPriceInput($event.target.value)" :readonly="readonly" />
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, defineProps, onMounted, ref, watchEffect, onBeforeUnmount } from "vue";

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  width: {
    type: [Number, String],
  },
  height: {
    type: [Number, String],
    default: 42
  },
  className: {
    type: String,
    default: ''
  },
  checked: {
    type: Boolean,
    default: false
  },
  value: {
    type: [String, Number, Array, Boolean], default: null
  },
  value_translate: {
    type: String, default: ''
  },
  readonly: {
    type: Boolean, default: false
  },
  label: {
    type: String,
    default: '',
  },
  itemText: {
    type: String,
    default: 'text',
  },
  itemValue: {
    type: String,
    default: 'value',
  },
  items: {
    type: Array,
    // eslint-disable-next-line vue/require-valid-default-prop
    default: [],
  },
  rows: {
    type: Number,
    default: 4
  },
  icon: {
    type: String,
    default: 'text',
  },
})

const typeText = ref(false)
const listSelect = ref(false)
const checkboxSelectMulti = ref();
const emit = defineEmits(['input'])

watchEffect(() => {
  checkboxSelectMulti.value = props.value;
})

const selectRef = ref<HTMLElement | null>(null);
onBeforeUnmount(() => {
  window.removeEventListener("mousedown", handleClickOutside);
})

onMounted(() => {
  // if (props.type == 'select' && props.multiple == true) {
  //   document.addEventListener('click', (event) => {
  //     let el = document.getElementById('box-multi-select');
  //     let btnSelect = document.getElementById('btn-select-multi');
  //     let target = event.target as Node;
  //     if (el && btnSelect && target !== el && target !== btnSelect && !el.contains(target) && !btnSelect.contains(target)) {
  //       listSelect.value = false
  //     }
  //   }
  //   )
  // }
  window.addEventListener("mousedown", handleClickOutside);
})

const handleClickOutside = (event: MouseEvent) => {
  if (listSelect.value && selectRef.value && !selectRef.value.contains(event.target as Node)) {
    listSelect.value = false;
  }
};

let itemValueSelect = computed(() => {
  // eslint-disable-next-line
  const select: any = props.items.find(((item: any) => {
    return item[props.itemValue] === props.value
  }))
  if (select) return select[props.itemText]
  return ''
});

let itemValueSelectMulti = computed(() => {
  if (Array.isArray(props.value)) {
    const select = Object.values(props.value)
    const dataSelect: any = []
    props.items?.filter(((item: any) => {
      if (select?.includes(item[props.itemValue])) {
        return dataSelect.push(item[props.itemText])
      }
    }))
    return dataSelect
  }

  return []
});

const show = () => {
  typeText.value = !typeText.value
}

const BtnSelect = () => {
  if (!props.readonly) {
    listSelect.value = !listSelect.value
  }
}

const changeValue = (val) => {
  emit('input', val)
}

const selected = (value: string) => {
  listSelect.value = false
  emit('input', value)
}

const selectedMulti = () => {
  emit('input', checkboxSelectMulti.value)
}

function formatNumberWithCommas(val: string | number) {
  const num = String(val).replace(/[^0-9]/g, '');
  if (!num) return '';
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function onPriceInput(val: string) {
  const raw = val.replace(/,/g, '');
  emit('input', raw);
}
</script>
<style scoped lang="scss">
.custom_outlineText {
  font-weight: 300;
  // font-style: italic;
  @apply border-[#d9d9d9] rounded-[8px] border p-2 text-[15px] focus:outline-none placeholder:text-[#ABADAF] focus:border-[#4096ff] focus:border-[1px] z-10
}

.custom_outlineLogin {
  font-weight: 300;
  // font-style: italic;
  @apply border-[#d9d9d9] rounded-[8px] border py-2 pr-2 pl-[55px] text-[15px] focus:outline-none placeholder:text-[#ABADAF] focus:border-[#4096ff] focus:border-[1px] z-10
}

.icon-outline {
  @apply absolute -ml-[35px] cursor-pointer mt-[14px];
}

.icon-box_login {
  @apply absolute -mr-[35px] cursor-pointer mt-[14px] border-r-[1px] pl-[12px] pr-[10px] border-[#C9CACD];
}

.custom-input {
  font-weight: 300;
  border-radius: 6px;
  @apply rounded-3xl bg-[#4097A3] text-white border-[5px] border-solid border-[#DCE9F5] px-4 pr-10;
}

.custom-input_no_bg {
  font-weight: 300;
  // font-style: italic;
  @apply text-gray-101 placeholder-gray-101 border border-[#CED4DA] px-4 pr-10 focus:outline-none focus:border-[#4096ff] focus:border-[1px] rounded-[6px];
}

.custom-input1 {
  font-weight: 300;
  @apply rounded-3xl bg-[#4097A3] text-white border-[5px] border-solid border-[#DCE9F5] px-4;
}

.custom-input:focus,
.custom-input1 {
  outline: none;
}

.list-select {
  @apply bg-[#4097A3] text-white rounded-xl w-[250px] absolute z-10 mt-1 border-[3px] border-solid border-[#DCE9F5];

  li {
    @apply px-3 py-2 border-b-[1px] truncate;
  }

  li:hover {
    @apply bg-[#DCE9F5] text-[#4097A3];
  }

  li:last-child {
    @apply border-b-[0] border-b-[#DCE9F5];
  }
}

.list-select-nobg {
  @apply text-gray-101 bg-[#f1f2f5] w-[100%] absolute z-[11] mt-1 border rounded border-[#4096ff];

  li {
    @apply border-b-[1px] border-[#CED4DA] truncate w-[100%];
  }

  label {
    @apply px-5 py-2 block w-[100%];

    input {
      @apply mr-2;
    }
  }

  li:hover {
    @apply text-[#4097A3];
  }

  li:last-child {
    @apply border-b-[0] border-b-[#CED4DA];
  }
}

.icon-down-select {
  @apply absolute z-0 mt-[10px] right-2;
}

.icon-down-select1 {
  @apply absolute mt-[18px];
}

.input__text::placeholder {
  font-size: 15px;
  /* Kích thước chữ */
  font-style: italic;
  /* Chữ nghiêng */
}

.item_select {
  color: #397494;
  background: #E3F4F7;
}

.list-select-nobg {
  max-height: 300px;
}
</style>
