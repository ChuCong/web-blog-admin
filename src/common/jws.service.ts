
const LANGUAGE = 'language'

export const getLanguage = () => {
    return localStorage.getItem(LANGUAGE);
};
export const setLanguage = lang => {
    localStorage.removeItem(LANGUAGE);
    localStorage.setItem(LANGUAGE, lang);
};

export default {
    setLanguage,
    getLanguage

};
