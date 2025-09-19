<template>
  <div>
    <SubHeader :breadcrumb="breadcrumb" class="mb-4">
      <BtnBase @click="openCreate" text="Thêm vai trò" :width="200" />
    </SubHeader>

    <Content>
      <DataTable :itemHeader="Header" :itemValue="role" :paginate="paginate" @getPage="getPage">
        <template v-slot:action="{ id }">
          <div class="flex justify-center">
            <BtnInTable :icon="penIcon" class="mr-1" :height="20" :width="20" @click="editItem(id)" />
            <BtnInTable :icon="trashIcon" :height="20" :width="20" title="Delete" @click="openDeletePopup(id)" />
          </div>
        </template>
      </DataTable>
    </Content>

    <!-- Dialog thêm / sửa role -->
    <BaseDialog v-model:active="show" >
      <div class="base_dialog ">
        <div class="text-[#F27619] text-[18px] font-medium text-center mb-5">
          {{ !roleData.id ? 'Thêm mới vai trò' : 'Cập nhật vai trò' }}
        </div>
        <div class="flex">
          <div class="w-full">
            <p class="input__text">Tên vai trò</p>
            <InputTextOutline placeholder="Nhập tên vai trò" type="text" width="100" height="44" :value="roleData.name"
              @input="(value) => roleData.name = value" />
          </div>
        </div>
        <div class="overflow-y-auto 2xl:max-h-[650px] xl:max-h-[440px] mt-3">
          <div v-for="(listPermission, group_name) in permissions" :key="group_name">
            <p class="input__text mt-4"><strong>{{ group_name }}</strong></p>
            <div class="box-group-input-checkbox border-dashed border-b pb-3 border-gray-200">
              <div v-for="permission in listPermission" :key="permission.name" class="w-[25%] inline-block">
                <InputTextOutline placeholder="Nhập tên vai trò" type="checkbox" width="13" height="13"
                  :value_translate="permission.title" :value="permission.name"
                  :checked="roleData.permissions.includes(permission.name)"
                  @change="(event) => updatePermission(permission.name, event.target.checked)" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex py-3 justify-center">
          <BtnBase :icon="backIcon" text="Hủy" color="#4D4E50" :width="150" class="mr-8" @click="show = false"
            bg_color="#F9F9F9" />
          <BtnBase v-if="!roleData.id" :icon="continueIcon" text="Thêm mới" color="#FFF" :width="170" @click="addItem"
            bg_color="#F27619" />
          <BtnBase v-else :icon="continueIcon" text="Cập nhật" color="#FFF" :width="170" @click="updateItem"
            bg_color="#F27619" />
        </div>
      </div>
    </BaseDialog>
    <PopupDelete :isOpen="isOpen" @confirm="onConfirm" @cancel="onCancel" />
  </div>
</template>

<script setup lang="ts">
import BtnBase from "@/components/elements/BtnBase.vue"
import DataTable from "@/components/elements/DataTable.vue"
import BtnInTable from "@/components/elements/BtnInTable.vue"
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import BaseDialog from "@/components/elements/BaseDialog.vue"
import PopupDelete from "@/components/elements/PopupDelete.vue"
import { useRouter } from "vue-router"
import { onMounted, computed, ref } from "vue"
import { useRoleStore } from "@/stores/role"
import { usePermissionStore } from "@/stores/permission"
import { messageSuccess, messageError } from "@/common/message.service"
import InputTextOutline from '@/components/elements/InputTextOutline.vue'

// icons -> import thay vì require
import penIcon from "@/assets/images/icon/pen-icon.svg"
import trashIcon from "@/assets/images/icon/trash-icon.svg"
import backIcon from "@/assets/images/icon/back-icon.svg"
import continueIcon from "@/assets/images/icon/continue.svg"

const router = useRouter()
const store = useRoleStore()
const permissionStore = usePermissionStore()

const show = ref(false)
const isOpen = ref(false)
const selectedId = ref<number | null>(null)

const pagination = ref({ page: 1, limit: 10 })
const role = computed(() => store.roles ?? [])
const paginate = computed(() => store.paginate ?? {})
const permissions = computed(() => permissionStore.permissions)

const Header = [
  { text: "ID", value: "id", align: "left", width: 200 },
  { text: "Tên vai trò", value: "name", align: "left", width: 200 },
  { text: "Thao tác", value: "action", align: "center", width: 200 },
]

const breadcrumb = [{ name: "Danh sách vai trò", link: "/roles/list" }]

const roleData = ref({
  id: null,
  name: "",
  permissions: [] as string[],
})

// reset khi mở dialog tạo mới
const openCreate = () => {
  roleData.value = { id: null, name: "", permissions: [] }
  show.value = true
}

const updatePermission = (permissionName: string, isChecked: boolean) => {
  const perms = roleData.value.permissions;
  if (isChecked) {
    if (!perms.includes(permissionName)) {
      perms.push(permissionName); // Add permission
    }
  } else {
    roleData.value.permissions = perms.filter(p => p !== permissionName); // Remove permission
  }
}

const addItem = async () => {
  try {
    const data = await store.saveRole(roleData.value)
    if (data) {
      show.value = false
      await store.fetchRole(pagination.value)
      messageSuccess(data.data.message)
    }
  } catch (err: any) {
    messageError(err.errors)
  }
}
const editItem = async (id: number) => {
  await store.getRoleDetail(id)
  const detail = store.roleDetail
  if (detail) {
    roleData.value = {
      id: detail.id,
      name: detail.name,
      // permissions: detail.permissions ?? [],
      permissions: detail.permissions.map(permission => permission.name),
    }
    show.value = true
  }
}

const updateItem = async () => {
  try {
    const data = await store.updateRole(roleData.value)
    if (data) {
      show.value = false
      await store.fetchRole(pagination.value)
      messageSuccess(data.message)
    }
  } catch (err: any) {
    messageError(err.errors)
  }
}

const openDeletePopup = (id: number) => {
  selectedId.value = id
  isOpen.value = true
}

const onConfirm = async () => {
  if (selectedId.value !== null) {
    const success = await store.deleteRole(selectedId.value)
    if (success) {
      messageSuccess("Xóa thành công")
      await store.fetchRole(pagination.value)
    }
  }
  isOpen.value = false
  selectedId.value = null
}

const onCancel = () => {
  isOpen.value = false
  selectedId.value = null
}

const getPage = async (params: any) => {
  pagination.value = {
    page: params.page ?? 1,
    limit: JSON.parse(params.limit) ?? 10,
  }
  await store.fetchRole(pagination.value)
}

onMounted(async () => {
  await store.fetchRole(pagination.value)
  await permissionStore.fetchPermission()
})

</script>

<style scoped>
table th,
table td {
  border: 1px solid #e5e7eb;
}

.dialog-container1 {
  max-width: 800px;
  height: 96%;
  overflow-y: scroll;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);
  margin-left: auto;
  margin-right: auto;
  padding: 15px 0px 15px 15px;
  background-color: #fff;
}


</style>
