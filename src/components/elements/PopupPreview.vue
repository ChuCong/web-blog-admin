<template>
    <div class="popup-overlay" @click.self="close">
        <div class="popup-content">
            <button class="text-[#FFF] float-right mb-3" @click="close"><img src="@/assets/images/icon/icon_close.svg"
                    alt=""></button>
            <iframe :src="link" width="100%" height="100%"></iframe>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        link: String
    },
    // computed: {
    //     viewerLink() {
    //         if (!this.link) return '';
    //         if (this.link.includes('/d/')) {
    //             const fileId = this.link.split('/d/')[1].split('/')[0];
    //             return `https://drive.google.com/file/d/${fileId}/preview`;
    //         }
    //         return this.link;
    //     }
    // },
    methods: {
        close() {
            this.$emit('close');
        }
    },
};
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.822);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 90;
}

.ndfHFb-c4YZDc-s2gQvd {
    background-color: #be1717 !important;
}

.ndfHFb-c4YZDc-HiaYvf-s2gQvd {
    background-color: #be1717 !important;
}

.ndfHFb-c4YZDc-TvD9Pc-qnnXGd {
    background-color: #be1717 !important;
}



@media screen and (min-width:1000px) {
    .popup-content {
        width: 80%;
        height: 90%;
        margin: 0 auto;
    }

}

@media screen and (max-width:999px) {
    .popup-content {
        width: 100%;
        height: 100%;
        margin: 0 auto;
    }

    iframe {
        width: 100%;
        height: 95%;


    }
}


/* .ndfHFb-c4YZDc-K9a4Re-nKQ6qf ,
.ndfHFb-c4YZDc-TvD9Pc-qnnXGd,
.ndfHFb-c4YZDc-K9a4Re,
.ndfHFb-c4YZDc-s2gQvd ,
.ndfHFb-c4YZDc-HiaYvf-s2gQvd
.ndfHFb-c4YZDc-TvD9Pc-qnnXGd */
</style>