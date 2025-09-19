<template>
  <div>
    <div v-for="(menu, index) in menus" :key="index" class="my-5 text-base font-medium text-[#4D4E50] w-full">
      <div v-if="checkAdmin(menu)" class="flex items-center justify-between pl-2 cursor-pointer item-menu"
        :class="getClassActive(menu)" @click="goToPage(menu)">
        <div class="flex items-center">
          <!-- <Icon :type="menu.icon" :active="menu.active" /> -->
          <img v-if="!menu.active" :src="getIcon(menu.icon)">
          <img v-else :src="getIconActive(menu.icon)">
          <span class="pl-2 menu__title" v-if="isShowAll">{{ t(menu.title) }}</span>
        </div>
        <div v-if="menu.child && menu.child.length > 0 && isShowAll">
          <Icon :type="ARROW_DOWN" :active="menu.active" />
        </div>
      </div>
      <div v-show="menu.active && isShowAll">
        <template v-for="(child, childIndex) in menu.child" :key="childIndex">
          <div v-if="child.has_permisson || child.has_permisson == null" class="pl-6 my-5 item-menu"
            :class="[child.active ? 'active-child' : '']">
            <div class="flex items-center cursor-pointer" @click="goToPage(child)">
              <!-- <Icon :type="child.icon" :active="child.active" /> -->
              <img :src="getIcon(child.icon)">
              <img v-if="child.active" :src="getIconActive(child.icon)">
              <span class="pl-2" v-if="isShowAll">{{ t(child.title) }}</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { MENU } from "@/config/menu.ts";
import { ARROW_DOWN, ACTIVE, INACTIVE } from "@/config/constant";
import { useI18n } from "vue-i18n";
import Icon from "@/components/elements/Icon.vue";
import { useRoute, useRouter } from "vue-router"
import { useAdminStore } from "@/stores/admin";
import { watchEffect, ref, defineExpose, computed, onMounted } from 'vue';
import {
  DASHBOARD,
  CATEGORY,
  COURSE,
  TAG,
  RESOURCE,
  COMMENT,
  FAQ,
  NEWS,
  CERTIFICATE,
  NOTIFICATION,
  STUDENT,
  TEACHER,
  LOG,
  SETTING,
  ADMIN,
  ROLES,
  CONTACT
} from "@/config/constant";
// import { useStore } from "vuex";

// const store = useStore()
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const menus = ref(MENU)
const isShowAll = ref(true)
const adminStore = useAdminStore()

watchEffect(() => {
  console.log(route.meta.key)
  menus.value.forEach(item => {
    item.active = INACTIVE
    if (item.key === route.meta.key) {
      item.active = ACTIVE
    }
    item.child?.forEach(child => {
      child.active = INACTIVE
      if (child.key === route.meta.key) {
        child.active = ACTIVE
        item.active = ACTIVE
      }
    })
  });
})

const goToPage = (item) => {
  if (item.child) {
    item.active = !item.active
  } else {
    router.push(item.path)
  }
  // store.dispatch('updateCurrentPageName', item.title);
}

const getClassActive = (item) => {
  if (item.active && item.child && item.child.length > 0) {
    return 'active'
  }
  if (item.active) {
    return 'active-child'
  }
  return ''
}

const adminDetail = computed(() => adminStore.roleAdminAuth);
onMounted(async () => {
  // loading.setLoading(true)
  await adminStore.getRoleAuth();
  // loading.setLoading(false)
});

const checkAdmin = (item) => {
  // Admin chính: full quyền
  if (adminDetail.value?.is_super_admin === 1) {
    return true;
  }
  // Admin thường: check theo listPermission
  if (adminDetail.value?.listPermission) {
    if (item.child && item.child.length > 0) {
      const hasPermissChilds = item.child.filter(itemChild => {
        const childHasPermisson = adminDetail.value.listPermission?.includes(itemChild.role);
        itemChild.has_permisson = childHasPermisson;
        return childHasPermisson;
      });
      return (hasPermissChilds.length > 0);
    }
    // check menu chính
    return adminDetail.value.listPermission.includes(item.role);
  }

  return false;
};


const openMenu = () => {
  isShowAll.value = !isShowAll.value
}
defineExpose({ openMenu });

import dashboardIcon from '@/assets/images/menu/dashboard.svg'
import categoryIcon from '@/assets/images/menu/category.svg'
import courseIcon from '@/assets/images/menu/course.svg'
import tagIcon from '@/assets/images/menu/tag.svg'
import resourceIcon from '@/assets/images/menu/resource.svg'
import commentIcon from '@/assets/images/menu/comment.svg'
import faqIcon from '@/assets/images/menu/faq.svg'
import newsIcon from '@/assets/images/menu/news.svg'
import certificateIcon from '@/assets/images/menu/certificate.svg'
import notificationIcon from '@/assets/images/menu/notification.svg'
import studentIcon from '@/assets/images/menu/student.svg'
import teacherIcon from '@/assets/images/menu/teacher.svg'
import logIcon from '@/assets/images/menu/log.svg'
import settingIcon from '@/assets/images/menu/setting.svg'
import adminIcon from '@/assets/images/menu/admin.svg'
import rolesIcon from '@/assets/images/menu/roles.svg'
import contactIcon from '@/assets/images/menu/contact.svg'


import adminIconActive from '@/assets/images/menu/admin_active.svg'
import rolesIconActive from '@/assets/images/menu/roles_active.svg'
import contactIconActive from '@/assets/images/menu/contact_active.svg'
import dashboardActiveIcon from '@/assets/images/menu/dashboard_active.svg'
import categoryActiveIcon from '@/assets/images/menu/category_active.svg'
import courseActiveIcon from '@/assets/images/menu/course_active.svg'
import tagActiveIcon from '@/assets/images/menu/tag_active.svg'
import resourceActiveIcon from '@/assets/images/menu/resource_active.svg'
import commentActiveIcon from '@/assets/images/menu/comment_active.svg'
import faqActiveIcon from '@/assets/images/menu/faq_active.svg'
import newsActiveIcon from '@/assets/images/menu/news_active.svg'
import certificateActiveIcon from '@/assets/images/menu/certificate_active.svg'
import notificationActiveIcon from '@/assets/images/menu/notification_active.svg'
import studentActiveIcon from '@/assets/images/menu/student_active.svg'
import teacherActiveIcon from '@/assets/images/menu/teacher_active.svg'
import logActiveIcon from '@/assets/images/menu/log_active.svg'
import settingActiveIcon from '@/assets/images/menu/setting_active.svg'

const getIcon = (icon) => {
  switch (icon) {
    case DASHBOARD: return dashboardIcon;
    case CATEGORY: return categoryIcon;
    case COURSE: return courseIcon;
    case TAG: return tagIcon;
    case RESOURCE: return resourceIcon;
    case COMMENT: return commentIcon;
    case FAQ: return faqIcon;
    case NEWS: return newsIcon;
    case CERTIFICATE: return certificateIcon;
    case NOTIFICATION: return notificationIcon;
    case STUDENT: return studentIcon;
    case TEACHER: return teacherIcon;
    case LOG: return logIcon;
    case SETTING: return settingIcon;
    case ADMIN: return adminIcon;
    case ROLES: return rolesIcon;
    case CONTACT: return contactIcon;

    default: return '';
  }
}

const getIconActive = (icon) => {
  switch (icon) {
    case DASHBOARD: return dashboardActiveIcon;
    case CATEGORY: return categoryActiveIcon;
    case COURSE: return courseActiveIcon;
    case TAG: return tagActiveIcon;
    case RESOURCE: return resourceActiveIcon;
    case COMMENT: return commentActiveIcon;
    case FAQ: return faqActiveIcon;
    case NEWS: return newsActiveIcon;
    case CERTIFICATE: return certificateActiveIcon;
    case NOTIFICATION: return notificationActiveIcon;
    case STUDENT: return studentActiveIcon;
    case TEACHER: return teacherActiveIcon;
    case LOG: return logActiveIcon;
    case SETTING: return settingActiveIcon;
    case ADMIN: return adminIconActive;
    case ROLES: return rolesIconActive;
    case CONTACT: return contactIconActive;
    default: return '';
  }
}

</script>

<style scoped lang="scss">
.menu__title {
  font-weight: 600;
  @apply text-[16px];
}

.active {
  @apply text-primary;
}

.active-child {
  @apply rounded-xl bg-white text-primary py-2;
}

.item-menu {
  transition: height 500ms;

  :hover {
    @apply text-[#F27619];
  }
}

@media screen and (max-width: 1278px) {
  .item-menu {
    @apply ml-5 mr-[10px];
  }
}
</style>