// type icon
export const DASHBOARD = "dashboard"
export const CATEGORY = "category"
export const COURSE = "course"
export const TAG = "tag"
export const RESOURCE = "resource"
export const COMMENT = "comment"
export const FAQ = "faq"
export const NEWS = "news"
export const CERTIFICATE = "certificate"
export const NOTIFICATION = "notification"
export const STUDENT = "student"
export const TEACHER = "teacher"
export const LOG = "log"
export const SETTING = "setting"
export const ROLES = "roles"
export const CONTACT = "contact"
export const ARROW_DOWN = "arrow_down"
export const HUMBURER = "humburer"
export const PENCIL = "pencil"
export const DELETE = "delete"
export const ADMIN = "admin"
export const USER = "user"
export const API_KEY = "api_key"
export const ROSES = "roses"
export const STATISTICS = "statistics"

// constants
export const ACTIVE = true
export const INACTIVE = false

export const EXAM_TYPE_LIST = 1
export const EXAM_TYPE_PART = 2

export const REPEAT_TYPE_DAILY = 1
export const REPEAT_TYPE_DAYS_OF_WEEK = 2
export const REPEAT_TYPE_SPECIFIC_DATE = 3

export const SUNDAY = 0
export const MONDAY = 1
export const TUESDAY = 2
export const WEDNESDAY = 3
export const THURSDAY = 4
export const FRIDAY = 5
export const SATURDAY = 6

export const TYPE_ROW = {
    NAME_EXAM: 'name_exam',
    ADD_ANSWERS: 'add_answers',
    ADD_SCORE: 'add_score',
    NAME_CATEGORY: 'name_category',
    PART: 'part',
    QUESTION: 'question',
    UPDATE_IMG_EXAM: 'update_img_exam',
    GROUP_QUESTION: 'group_question'
}

export const TYPE_ANSWER = {
    ONE_CHOICE: 1,
    MULTIPLE_CHOICE: 2,
    ESSAY: 3,
    QUESTION_PAIRS: 4,
    HAS_CHILD: 5,
    RIGHT_OR_WRONG: 6,
    ARRANGE: 7
}

export const UPLOAD_FILE_FOR_USER = 1
export const UPLOAD_FILE_FOR_ADMIN = 2

export const ANSWER_LETTERS = ['A', 'B', 'C', 'D']


export const TYPE_QUESTION_SCORE_SENTENCE = 1
export const TYPE_QUESTION_SCORE_EACH_IDEA = 2

export const TYPE_IDEA_SCORE_BY_EACH_IDEA = 1
export const TYPE_IDEA_SCORE_BY_NUMBER_IDEA = 2

export const CONTEST_INACTIVE_STATUS = 0
export const CONTEST_REQUEST_PUBLISH_STATUS = 1
export const CONTEST_PUBLISH_STATUS = 2
export const CONTEST_CLOSE_STATUS = 3


export const ORDER_CREATED_STATUS = 0
export const ORDER_CANCELED_STATUS = 1
export const ORDER_PAID_STATUS = 2
export const ORDER_PAID_ERROR_STATUS = 3
export const ORDER_UNCREATED = 4

export const CONTEST_ORDER_TYPE = "App\\Models\\Group"
export const EXAM_ORDER_TYPE = "App\\Models\\Exam"

export const LESSON_TYPE_NOT_SELECTED = 0;
export const LESSON_TYPE_VIDEO = 1;
export const LESSON_TYPE_TEXT_IMAGE = 2;
export const LESSON_TYPE_EXCERCISE = 3;
export const LESSON_TYPE_FLASHCARD = 4;

export const LESSON_MEDIA_TYPE = {
    VIDEO: 1,
    TEXT_AND_IMAGE: 2
}

export const ENCRYPT_MEDIA_PROCESS = {
    STATUS_ERROR : 99,
    STATUS_START : 1,
    STATUS_ADD_TRANSCRIPT : 3,
    STATUS_ADD_WATER_MARK : 4,
    STATUS_ENCRYPTING : 5,
    STATUS_PUSH_TO_STORAGE : 6,
    STATUS_COMPLETE : 7
}

export const VIET_NAM = 'vi'
export const ENGLISH = 'en'

export const WORD = 'word'
export const PDF = 'pdf'
export const EXCEL = 'excel'
export const POWERPOINT = 'powerpoint'
export const LINK = 'link'
export const VIDEO = 'video'
export const IMAGE = 'image'

export const LANGUAGE = [
    {title: "Tiếng Việt", key: VIET_NAM },
    {title: "English", key: ENGLISH },
]

export const LESSON_ACTION = {
    EDIT : 1,
    COPY : 2,
    ADD_QUESTION : 3,
    DELETE : 4
}

export const RESOURCE_TYPE = [
    {title: "File Ảnh", key: IMAGE },
    {title: "File Word", key: WORD },
    {title: "File PDF", key: PDF },
    {title: "File Excel", key: EXCEL },
    // {title: "File Powerpoint", key: POWERPOINT },
    {title: "Google Drive", key: LINK },
    {title: "Video", key: VIDEO },
]

export const NOTIFICATION_TYPE = {
    INFO : "info",
    SUCCESS : "success",
    WARNING : "warning",
    ERROR : "error"
}

export const AUDIENCE_TYPE = {
    ALL : "all",
    COURSE : "course",
    CUSTOM : "custom"
}

export const SEND_TYPE = {
    NOW : "now",
    SET_A_TIMER : "set_a_timer"
}

export const SCHEDULE_TYPE = {
    SPECIFIC_DATE : "specific_date",
    DAILY : "daily",
    WEEKLY : "weekly",
    MONTHLY : "monthly"
}

export const ABOUT_MSD_FILE = [
    {title: "Video Youtube", key: LINK },
    {title: "File Ảnh", key: IMAGE },
    {title: "Video", key: VIDEO },
]

export const SETTING_KEY = {
    OTHER: 'other'
}

