import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import i18n from '@/common/i18n'
import './assets/main.scss'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@mdi/font/css/materialdesignicons.min.css';
import Toaster from '@meforma/vue-toaster'
import VueTimepicker from 'vue3-timepicker'
import 'vue3-timepicker/dist/VueTimepicker.css'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { Chart, registerables } from 'chart.js'

import App from '@/App.vue'
import router from '@/router'

Chart.register(...registerables)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueAxios, axios)
app.component('QuillEditor', QuillEditor)
app.use(Toaster)
app.use(VueTimepicker)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
