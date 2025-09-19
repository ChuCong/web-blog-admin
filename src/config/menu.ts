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
  CONTACT,
} from "./constant";
export const MENU = [
  {
    title: "menu.home",
    path: "/home",
    key: "home",
    icon: DASHBOARD,
    active: false,
    role: "dashboard",
  },
  {
    title: "menu.category",
    path: "/category/list",
    key: "category",
    icon: CATEGORY,
    active: false,
    role: "category",
  },
  {
    title: "menu.course",
    path: "/course/list",
    key: "course",
    icon: COURSE,
    active: false,
    role: "course",
  },
  {
    title: "menu.tag",
    path: "/tag/list",
    key: "tag",
    icon: TAG,
    active: false,
    role: "tag",
  },
  {
    title: "menu.resource",
    path: "/resource/list",
    key: "resource",
    icon: RESOURCE,
    active: false,
    role: "resources",
  },
  {
    title: "menu.comment",
    path: "/comment/list",
    key: "comment",
    icon: COMMENT,
    active: false,
    role: "commnet",
  },
  {
    title: "menu.faq",
    path: "/faq/list",
    key: "faq",
    icon: FAQ,
    active: false,
    role: "faq",
  },
  {
    title: "menu.new",
    path: "/new/list",
    key: "new",
    icon: NEWS,
    active: false,
    role: "new",
  },
  {
    title: "menu.certificate.title",
    path: "/certificate/list",
    key: "certificate",
    icon: CERTIFICATE,
    active: false,
    role: "certificate",
    child: [
      {
        title: "menu.certificate.child.certificate_template",
        path: "/certificate_template/list",
        key: "certificate_template",
        active: false,
        role: "certificate_template"
      },
      {
        title: "menu.certificate.child.course_certificate",
        path: "/course_certificate/list",
        key: "course_certificate",
        active: false,
        role: "course_certificate"
      }
    ]
  },
  {
    title: "menu.notification.title",
    path: "/notification/list",
    key: "notification",
    icon: NOTIFICATION,
    active: false,
    role: "notification",
    child: [
      {
        title: "menu.notification.child.notification",
        path: "/notification/list",
        key: "notification",
        active: false,
        role: "notification"
      },
      {
        title: "menu.notification.child.user_notification",
        path: "/usernotification/list",
        key: "usernotification",
        active: false,
        role: "usernotification"
      }
    ]
  },
  {
    title: "menu.student",
    path: "/student/list",
    key: "student",
    icon: STUDENT,
    active: false,
    role: "student"
  },
  {
    title: "menu.teacher",
    path: "/teacher/list",
    key: "teacher",
    icon: TEACHER,
    active: false,
    role: "teacher"
  },
  {
    title: "menu.log",
    path: "/userlog/list",
    key: "userlog",
    icon: LOG,
    active: false,
    role: "userlog"
  },
  {
    title: "menu.contact",
    path: "/contact/list",
    key: "contact",
    icon: CONTACT,
    active: false,
    role: "contact"
  },
  {
    title: "admin.title",
    path: "/admin/list",
    key: "admin",
    icon: ADMIN,
    active: false,
    role: "user"
  },
  {
    title: "menu.roles",
    path: "/roles/list",
    key: "roles",
    icon: ROLES,
    active: false,
    role: "role"
  },
  {
    title: "menu.setting.title",
    path: "/",
    key: "setting",
    icon: SETTING,
    active: false,
    role: "setting",
    child: [
      {
        title: "menu.setting.child.banner",
        path: "/setting/banner",
        key: "banner",
        active: false,
        role: "banner"
      },
      {
        title: "menu.setting.child.about_msd",
        path: "/setting/about-msd",
        key: "about_msd",
        active: false,
        role: "about_msd",
      },
      {
        title: "menu.setting.child.testimonial",
        path: "/setting/testimonial",
        key: "testimonial",
        active: false,
        role: "testimonial1",
      },
      {
        title: "menu.setting.child.category",
        path: "/setting/banner-course",
        key: "setting_course",
        active: false,
        role: "course_banner"
      },
      {
        title: "menu.setting.child.learning_statistics",
        path: "/setting/learning-statistics",
        key: "learning-statistics",
        active: false,
        role: "learning_statistics",
      },
      {
        title: "menu.setting.child.storage",
        path: "/setting/storage",
        key: "setting_storage",
        active: false,
        role: "storage"
      },
      {
        title: "menu.setting.child.watermark",
        path: "/setting/watermark",
        key: "setting_watermark",
        active: false,
        role: "watermark"
      },
      {
        title: "menu.setting.child.video",
        path: "/setting/video",
        key: "setting_video",
        active: false,
        role: "video"
      },
      {
        title: "menu.setting.child.other",
        path: "/setting/other",
        key: "setting_other",
        active: false,
        role: "other"
      }
    ]
  },
];
