import { createI18n } from "vue-i18n";
import {getLanguage} from "@/common/jws.service";
import vi from "@/locales/vi";

const language = getLanguage()
const locale = language? language : 'vi'

export default createI18n({
    locale:locale,
    globalInjection: true,
    legacy: false,
    messages: {
       vi
    }
})