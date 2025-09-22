<template>
    <div class="relative min-h-[1200px]">
        <SubHeader :breadcrumb="breadcrumb"></SubHeader>
        <Content>
            <div class="text-introduce mt-10">
                Welcome to the Admin Blog
            </div>
        </Content>
    </div>
</template>

<script lang="ts" setup>
import SubHeader from "@/views/theme/SubHeader.vue"
import Content from "@/views/theme/Content.vue"
import { useLoadingStore } from '@/stores/loading';

const breadcrumb = [
    { name: "Home", link: '/home' },
]

const loading = useLoadingStore();

</script>

<style scoped lang="scss">
.text-introduce {
    color: #616161;
    text-align: center;
    font-family: Roboto;
    font-size: 20px;
    font-weight: 700;
    line-height: normal;
}
</style>