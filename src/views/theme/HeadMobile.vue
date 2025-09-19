<template>
    <div class="flex justify-between items-center p-5">
        <div class="flex items-center">
            <div class="icon-hamburger cursor-pointer icon_menu_mobile" @click="Mmenu">
                <Icon :type="HUMBURER" />
            </div>
            <!-- <div class="main_menu_mobile w-[275px]" v-show="isMobileSidebarVisible">
                <MenuMobile></MenuMobile>
            </div> -->
            <div class="logo pl-9">
                <img :src="Logo">
            </div>
        </div>
        <div>
            <div v-click-outside="closeDropdown" class="test">
                <img :src="AvaterDefault" class="max-w-11 cursor-pointer" @click="showDropdown">
                <div class="dropdown_profile" v-if="isShow">
                    <DropdownProfile />
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import Icon from '@/components/elements/Icon.vue';
import DropdownProfile from '@/views/theme/DropdownProfile.vue';
import { HUMBURER } from '@/config/constant';
import Logo from "@/assets/logo.png";
import AvaterDefault from "@/assets/images/avatar.png";
import { ref, defineEmits } from "vue";
// import MenuMobile from "@/views/theme/MenuLeft.vue";

const isShow = ref(false)
const isMobileSidebarVisible = ref(false)
const showDropdown = () => {
    isShow.value = true
}
const closeDropdown = () => {
    isShow.value = false
}
const Mmenu = () => {
    isMobileSidebarVisible.value = !isMobileSidebarVisible.value;
}
</script>
<style lang="scss">
.dropdown_profile {
    z-index: 107;
    margin: 0;
    position: fixed;
    inset: 0 0 auto auto;
    transform: translate(-29px, 68px);
    box-shadow: 0px 0px 50px 0px rgba(82, 63, 105, 0.15);
    border-radius: 0.75rem;
    width: 275px;
}

.desktop {
    display: none;
}

.icon_menu_mobile {
    position: relative;
}

.main_menu_mobile {
    // transform: translate(-110px, 68px);
    // inset: 0 0 auto auto;
    z-index: 107;
    position: fixed;
    top: 80px;
    background-color: #F1F1F4;
    // margin-top: 80px;
    left: 0px;
    border-radius: 8px;
}
</style>