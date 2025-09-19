
const API = {
    //users
    ADD_USERS: '/users',
    DETAIL_USER: '/users',
    UPDATE_USER: '/users',
    DELETE_USER: '/users',

    //admins
    ADD_ADMINS: '/admins',
    DETAIL_ADMIN: '/admins',
    UPDATE_ADMIN: '/admins',
    DELETE_ADMIN: '/admins',

    //role
    API_ROLE: '/roles',

    //permission
    API_PERMISSION: '/permissions',

    //personal_access_key
    API_PERSONAL_ACCESS_KEY: '/personalAccessKeys',

    //company
    API_COMPANY: '/companies',

    GET_LIST_EXAM: 'exams',
    GET_LIST_EXAM_SEARCH: 'exams/search',
    GET_LIST_EXAM_USER_SEARCH: 'exams-of-user/search',
    GET_LIST_EXAM_SEARCH_ELASTIC: 'exams/search-in-elasticsearch',
    GET_LIST_EXAM_COMMERCE_SEARCH: 'exam-commerce/search',
    APPROVAL_EXAM_COMMERCE: 'approval/exam-commerce',
    GET_EXAM_DETAIL: 'exams',
    ADD_EXAM: 'exams',
    UPDATE_EXAM: 'exams',
    DELETE_EXAM: 'exams',
    //temporary exam
    GET_LIST_TEMPORARY_EXAM_SEARCH: 'temporaryExams/search',
    GET_LIST_TEMPORARY_EXAM: 'temporaryExams',
    GET_DETAIL_TEMPORARY_EXAM: 'temporaryExams',
    UPDATE_TEMPORARY_EXAM: 'temporaryExams',
    //import excel
    GET_DATA_FROM_EXCEL: '/getDataFromExcel',

    //category
    API_CATEGORY: 'categories',
    BLOCK_OR_UN_BLOCK_USER: "block-or-unblock-user",
    LIST_EXAM_BY_CATEGORY: "category/list-exam",
    UPDATE_INDEX_EXAM: "exams/update-index",
    LIST_URL_EXAM_WORD: "/export-category",

    //category newses
    CATEGORY_NEWSES: 'category-newses',
    CREATE_CATEGORY_NEWSES: 'category-newses/create',
    UPDATE_CATEGORY_NEWSES: 'category-newses/update',
    DELETE_CATEGORY_NEWSES: 'category-newses/delete',
    LIST_CATEGORY_NEWSES: 'list-category-newses',

    //newses
    NEWSES: 'newses',
    CREATE_NEWSES: 'newses/create',
    UPDATE_NEWSES: 'newses/update',
    DELETE_NEWSES: 'newses/delete',

    //exam
    BLOCK_OR_UN_BLOCK_EXAM: "block-or-unblock-exam",
    UPDATE_REVIEWED_EXAM: "update-reviewed-exam",

    DELETE_COMMENT: "comment",

    //take exam
    GET_LIST_TAKE_EXAM: 'takeExam',
    GET_LIST_TAKE_EXAM_SEARCH: 'takeExams/search',
    GET_LIST_TAKE_EXAM_USER: 'takeExamsForUser',
    DELETE_TAKE_EXAM: 'takeExam',

    //statistics
    GET_LIST_USER_TAKE_EXAM_STATISTICS: 'userTakeExamStatistics',
    GET_LIST_EXAM_TAKE_EXAM_STATISTICS: 'examTakeExamStatistics',
    GET_LIST_QUESTION_TAKE_EXAM_STATISTICS: 'questionTakeExamStatistics',

    //roads
    ROADS: '/roads',
    GET_LIST_ROAD_SENT_SEARCH: 'roadSent/search',

    //search query
    SEARCH_QUERY: 'search-query',

    //keyword
    KEYWORD: 'keyword',

    //keyword
    LABEL: 'label',

    //menu_footer
    CREATE_MENU_FOOTER: 'menu-footer/create',
    UPDATE_MENU_FOOTER: 'menu-footer/update',
    DELETE_MENU_FOOTER: 'menu-footer/delete',
    MENU_FOOTER: 'menu-footer',

    //media_press
    CREATE_MEDIA_PRESS: 'media-press/create',
    UPDATE_MEDIA_PRESS: 'media-press/update',
    DELETE_MEDIA_PRESS: 'media-press/delete',
    MEDIA_PRESS: 'media-press',

    //media_press
    CREATE_ADVISER: 'adviser/create',
    UPDATE_ADVISER: 'adviser/update',
    DELETE_ADVISER: 'adviser/delete',
    ADVISER: 'adviser',

    //ads
    CREATE_DISPLAY_ADS: 'display-ads/create',
    UPDATE_DISPLAY_ADS: 'display-ads/update',
    DELETE_DISPLAY_ADS: 'display-ads/delete',
    DISPLAY_ADS: 'display-ads',

    CREATE_TAB_ADS: 'tab-ads/create',
    UPDATE_TAB_ADS: 'tab-ads/update',
    DELETE_TAB_ADS: 'tab-ads/delete',
    TAB_ADS: 'tab-ads',

    CREATE_CONTENT_ADS: 'content-ads/create',
    UPDATE_CONTENT_ADS: 'content-ads/update',
    DELETE_CONTENT_ADS: 'content-ads/delete',
    CONTENT_ADS: 'content-ads',

    CREATE_ADS: 'create-ads',
    UPDATE_ADS: 'update-ads',
    DELETE_ADS: 'delete-ads',
    DETAIL_ADS: 'ads',
    ADS: 'list-ads',

    //roads
    SCORE_SHEETS: '/score-sheets',

    //group
    GROUPS: '/groups',
    GROUP_ACCEPT_PUBLISH: '/groups/accept-publish',

    //orders
    ORDERS: '/orders',
    UPDATE_ORDER_STATUS: (id) => `/orders/${id}/status`,

    //group
    LEARNING_PATHS: '/learning-path',
    ROADMAP_CONTENT:'roadmap-content',

    COMMENT :'/comment'
}
export default API