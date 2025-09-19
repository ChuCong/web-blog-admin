<template>
  <div class="table-wrapper ">
    <table class="w-full  text-left conten-table   ">
      <thead class=" content text-xs text-[#A1A1A1] ">
        <tr>
          <th scope="col" :class="[header.align ? 'text-' + header.align : '',
          header.width ? 'w-[' + header.width + 'px]' : 'px-6 py-4', header.order ? 'cursor-pointer' : '']"
            v-for="(header, index) in itemHeader" :key="index" @click="header.order && handleSort(header.value)">
            <span class="flex gap-1 items-center" :class="header.align ? `justify-${header.align}` : ''">
              {{ header.text }}
              <span v-if="header.order && sortField == header.value">
                <svg v-if="sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 inline text-[#F15922]" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m0 0l-4-4m4 4l4-4" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline text-[#F15922]" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V8m0 0l-4 4m4-4l4 4" />
                </svg>
              </span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody v-if="itemValue.length > 0">
        <tr v-for="(item, i) in itemValue" :key="i"
          :class="['bg-white rounded-[6px] text-[#4D4E50] ', i % 2 == 0 ? '' : 'bg-border-col']">
          <td class="py-4 px-6 " v-for="(header, i) in itemHeader" :key="i">
            <slot :name="header.value" v-bind="typeof item === 'object' && item !== null ? item : {}">{{
              item[header.value] }}</slot>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr class="bg-white border-b border-[#CED4DA] dark:bg-gray-800 dark:border-gray-700">
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-[#4D4E50] whitespace-nowrap text-center"
            :colspan="itemHeader.length">
            Không tìm thấy dữ liệu
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="p-2" v-if="paginate">
    <div class="flex mt-2 justify-end">
      <button :class="['pagination-button', { 'cursor-not-allowed': paginate.offset === 0 }]"
        @click="changePage(paginate.current_page - 1)">
        <img class="w-[22px] h-[20px]" src="@/assets/images/icon/arrow-down-1.png" />
      </button>
      <span class="pagination-number ml-3 text-[#585858]" v-for="pageNumber in visiblePages" :key="pageNumber"
        :class="{ active: pageNumber === paginate.current_page }"
        @click="typeof pageNumber === 'number' && changePage(pageNumber)">
        {{ pageNumber }}
      </span>
      <button :class="['pagination-button', { 'cursor-not-allowed': paginate.current_page === paginate.total_page }]"
        @click="changePage(paginate.current_page + 1)">
        <img class="ml-3 w-[22px] h-[20px]" width="20" src="@/assets/images/icon/arrow-down-2.png" />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, computed, ref, defineEmits } from "vue";
interface Page {
  limit: number;
  page: number;
}
let checkPaginate = ref(false);
let itemPerpage = ref([
  { value: 5, text: 5 },
  { value: 10, text: 10 },
  { value: 15, text: 15 },
  { value: null, text: "All" }
]);

const props = defineProps({
  itemHeader: {
    type: Array<{ align: string, width: number, text: string, value: string, order?: boolean, default?: boolean }>,
    default: () => []
  },
  itemValue: {
    type: Array,
    default: () => []
  },
  paginate: {
    type: Object,
    default: () => null
  }
});
const emit = defineEmits(["getPage", "sort"]);
const lastOffset = computed(() => {
  let offset = props.paginate.offset + props.paginate.limit;
  return offset > props.paginate.total || props.paginate.offset == null ? props.paginate.total : offset;
});
const changePage = (page: number, limit = false) => {
  if (page > 0) {
    if (page <= props.paginate.total_page || page === 1) {
      const params: Page = {
        page: page,
        limit: limit !== false ? limit : props.paginate.limit
      };
      emit("getPage", params);
    }
  }
};
const changeLimit = ($event: any) => {
  checkPaginate.value = true;
  let limit = $event.target.value.length === 0 ? null : $event.target.value;
  changePage(1, limit);
};
const visiblePages = computed<(number | string)[]>(() => {
  const currentPage = props.paginate.current_page;
  const totalPages = props.paginate.total_page;

  const adjacentPages = 2;
  const maxVisiblePages = 4;

  let startPage = Math.max(1, currentPage - adjacentPages);
  let endPage = Math.min(currentPage + adjacentPages, totalPages);

  const hasLeftEllipsis = startPage > 1;
  const hasRightEllipsis = endPage < totalPages;

  if (hasLeftEllipsis && !hasRightEllipsis) {
    startPage = Math.max(1, totalPages - maxVisiblePages + 1);
  } else if (!hasLeftEllipsis && hasRightEllipsis) {
    endPage = Math.min(maxVisiblePages, totalPages);
  } else if (hasLeftEllipsis && hasRightEllipsis) {
    const numVisiblePagesWithoutEllipsis = maxVisiblePages - 2;
    const numPagesBeforeCurrent = currentPage - startPage;
    const numPagesAfterCurrent = endPage - currentPage;

    if (numPagesBeforeCurrent < Math.ceil(numVisiblePagesWithoutEllipsis / 2)) {
      endPage = Math.min(currentPage + Math.floor(numVisiblePagesWithoutEllipsis / 2), totalPages);
    } else if (numPagesAfterCurrent < Math.ceil(numVisiblePagesWithoutEllipsis / 2)) {
      startPage = Math.max(currentPage - Math.floor(numVisiblePagesWithoutEllipsis / 2), 1);
    } else {
      startPage = currentPage - Math.floor(numVisiblePagesWithoutEllipsis / 2);
      endPage = currentPage + Math.ceil(numVisiblePagesWithoutEllipsis / 2);
    }
  }
  const pages: (number | string)[] = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  if (hasLeftEllipsis) {
    pages.unshift('...');
    if (startPage > 1) {
      pages.unshift(1);
    }
  }
  if (hasRightEllipsis) {
    pages.push('...');
  }
  if (hasRightEllipsis && totalPages !== endPage) {
    pages.push(totalPages);
  }
  return pages;
});

//------------------------------------------- Order
const sortField = ref(props.itemHeader.find(h => h.default)?.value || props.itemHeader[0].value)
const sortOrder = ref('desc')

function handleSort(field: string) {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'asc'
  }
  emit('sort', { sortField: sortField.value, sortOrder: sortOrder.value })
}

</script>
<style scoped lang="scss">
.conten-table {
  border-collapse: collapse;
  width: 100%;
}

.conten-table th,
.conten-table td {
  border-bottom: 1px dashed #E2E8F0;
  /* Add dashed border for rows */
  padding: 12px;
}

.conten-table td {
  height: 56px;
  font-size: 15px;
  // font-weight: 500;
  line-height: 18.15px;
}

.conten-table th {
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  // font-weight: 500;
  font-size: 14px;
  line-height: 16.94px;
}

.conten-table td {
  height: 56px;
}

.conten-table tbody tr:nth-child(even) {
  background-color: white;
}


.pagination-number {
  padding: 3px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.pagination-number.active {
  background-color: #F27619;
  color: #fff;
}

.table-wrapper {
  max-width: 100%;
  overflow-x: auto;
}

// .overflow-x-auto {
//   overflow-x: auto;
// }
</style>
