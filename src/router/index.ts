import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router';
import JwtService from "@/common/jwt.service";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: "/home",
        name: 'home',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/home",
                component: () => import("@/views/home.vue"),
                meta: { key: 'home' }
            },
            {
                path: "/change-password",
                name: 'change_password',
                meta: { key: 'home' },
                component: () => import("@/views/pages/reset_password/reset.vue")
            }
        ]
    },
    {
        path: '/category',
        name: 'category',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/category/list",
                name: 'category_list',
                meta: { key: 'category' },
                component: () => import("@/views/pages/category/list.vue")
            },
            {
                path: "/category/create",
                name: 'category_create',
                meta: { key: 'category' },
                component: () => import("@/views/pages/category/create.vue")
            },
            {
                path: "/category/edit/:id",
                name: 'category_edit',
                meta: { key: 'category' },
                component: () => import("@/views/pages/category/create.vue")
            },
            {
                path: "/comment/list",
                name: 'comment',
                meta: { key: 'comment' },
                component: () => import("@/views/pages/comment/list.vue")
            },
            {
                path: "/faq/list",
                name: 'faq',
                meta: { key: 'faq' },
                component: () => import("@/views/pages/faq/list.vue")
            },
            {
                path: "/faq/create",
                name: 'faq_create',
                meta: { key: 'faq' },
                component: () => import("@/views/pages/faq/create.vue")
            },
            {
                path: "/faq/edit/:id",
                name: 'faq_edit',
                meta: { key: 'faq' },
                component: () => import("@/views/pages/faq/create.vue")
            },
            {
                path: "/resource/list",
                name: 'resource',
                meta: { key: 'resource' },
                component: () => import("@/views/pages/resource/list.vue")
            },
            {
                path: "/resource/create",
                name: 'resource_create',
                meta: { key: 'resource' },
                component: () => import("@/views/pages/resource/create.vue")
            },
            {
                path: "/resource/edit/:id",
                name: 'resource_edit',
                meta: { key: 'resource' },
                component: () => import("@/views/pages/resource/create.vue")
            },
            {
                path: "/new/list",
                name: 'new',
                meta: { key: 'new' },
                component: () => import("@/views/pages/new/list.vue")
            },
            {
                path: "/new/create",
                name: 'new_create',
                meta: { key: 'new' },
                component: () => import("@/views/pages/new/create.vue")
            },
            {
                path: "/new/edit/:id",
                name: 'new_edit',
                meta: { key: 'new' },
                component: () => import("@/views/pages/new/create.vue")
            },
        ]
    },
    {
        path: '/course',
        name: 'course',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/course/list",
                name: 'course_list',
                meta: { key: 'course' },
                component: () => import("@/views/pages/course/list.vue")
            },
            {
                path: "/course/create",
                name: 'course_create',
                meta: { key: 'course' },
                component: () => import("@/views/pages/course/create.vue")
            },
            {
                path: "/course/edit/:course_id/resource/create",
                name: "course-create-resource",
                meta: { key: 'course' },
                component: () => import("@/views/pages/course/resource_create.vue")
            },
            {
                path: "/course/edit/:course_id/resource/edit/:resource_id",
                name: "course-edit-resource",
                meta: { key: 'course' },
                component: () => import("@/views/pages/course/resource_create.vue")
            },
            {
                path: "/course/edit/:id",
                name: "course-detail",
                meta: { key: 'course' },
                component: () => import("@/views/pages/course/detail.vue")
            },
            {
                path: "/lesson/select",
                name: "lesson-choose-type",
                meta: { key: 'course' },
                component: () => import("@/views/pages/lesson/SelectType.vue")
            },
            {
                path: "/lesson/video",
                name: "lesson-video",
                meta: { key: 'course' },
                component: () => import("@/views/pages/lesson/Video.vue")
            },
            {
                path: "/lesson/text",
                name: "lesson-text",
                meta: { key: 'course' },
                component: () => import("@/views/pages/lesson/TextImage.vue")
            },
            {
                path: "/lesson/exercise",
                name: "lesson-exercise",
                meta: { key: 'course' },
                component: () => import("@/views/pages/lesson/Excercise.vue")
            },
            {
                path: "/lesson/question",
                name: "lesson-question",
                meta: { key: 'course' },
                component: () => import("@/views/pages/lesson/GroupQuestion.vue")
            }
        ]
    },
    {
        path: '/student',
        name: 'student',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/student/list",
                name: 'student_list',
                meta: { key: 'student' },
                component: () => import("@/views/pages/user/list.vue")
            }
        ]
    },
    {
        path: '/contact',
        name: 'contact',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/contact/list",
                name: 'contact_list',
                meta: { key: 'contact' },
                component: () => import("@/views/pages/contact/list.vue")
            }
        ]
    },
    {
        path: '/teacher',
        name: 'teacher',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/teacher/list",
                name: 'teacher_list',
                meta: { key: 'teacher' },
                component: () => import("@/views/pages/teacher/list.vue")
            },
            {
                path: "/teacher/create",
                name: 'teacher_create',
                meta: { key: 'teacher' },
                component: () => import("@/views/pages/teacher/create.vue")
            },
            {
                path: "/teacher/edit/:id",
                name: 'teacher_edit',
                meta: { key: 'teacher' },
                component: () => import("@/views/pages/teacher/create.vue")
            }
        ]
    },
    {
        path: '/tag',
        name: 'tag',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/tag/list",
                name: 'tag_list',
                meta: { key: 'tag' },
                component: () => import("@/views/pages/tag/list.vue")
            }
        ]
    },
    {
        path: '/userlog',
        name: 'userlog',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/userlog/list",
                name: 'userlog_list',
                meta: { key: 'userlog' },
                component: () => import("@/views/pages/userlog/list.vue")
            }
        ]
    },
    {
        path: '/setting',
        name: 'setting',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/setting/storage",
                name: 'setting_storage',
                meta: { key: 'setting_storage' },
                component: () => import("@/views/pages/setting/storage/create.vue")
            },
            {
                path: "/setting/watermark",
                name: 'setting_watermark',
                meta: { key: 'setting_watermark' },
                component: () => import("@/views/pages/setting/watermark/create.vue")
            },
            {
                path: "/setting/learning-statistics",
                name: 'learning_statistics',
                meta: { key: 'learning-statistics' },
                component: () => import("@/views/pages/setting/learning-statistics/create.vue")
            },
            {
                path: "/setting/video",
                name: 'setting_video',
                meta: { key: 'setting_video' },
                component: () => import("@/views/pages/setting/video/create.vue")
            },
            {
                path: "/setting/banner",
                name: 'list_banner',
                meta: { key: 'banner' },
                component: () => import("@/views/pages/setting/banner/index.vue")
            },
            {
                path: "/setting/banner/create",
                name: 'banner_create',
                meta: { key: 'banner' },
                component: () => import("@/views/pages/setting/banner/create.vue")
            },
            {
                path: "/setting/banner/edit/:id",
                name: "banner-detail",
                meta: { key: 'banner' },
                component: () => import("@/views/pages/setting/banner/create.vue")
            },
            {
                path: "/setting/about-msd",
                name: 'list_about-msd',
                meta: { key: 'about_msd' },
                component: () => import("@/views/pages/setting/about-msd/index.vue")
            },
            {
                path: "/setting/about-msd/create",
                name: 'about-msd_create',
                meta: { key: 'about_msd' },
                component: () => import("@/views/pages/setting/about-msd/create.vue")
            },
            {
                path: "/setting/about-msd/edit/:id",
                name: "about-msd-detail",
                meta: { key: 'about_msd' },
                component: () => import("@/views/pages/setting/about-msd/create.vue")
            },
            {
                path: "/setting/testimonial",
                name: 'list_testimonial',
                meta: { key: 'testimonial' },
                component: () => import("@/views/pages/setting/testimonial/list.vue")
            },
            {
                path: "/setting/testimonial/create",
                name: 'testimonial_create',
                meta: { key: 'testimonial' },
                component: () => import("@/views/pages/setting/testimonial/create.vue")
            },
            {
                path: "/setting/testimonial/edit/:id",
                name: "testimonial-detail",
                meta: { key: 'testimonial' },
                component: () => import("@/views/pages/setting/testimonial/create.vue")
            },
            {
                path: "/setting/other",
                name: 'setting_other',
                meta: { key: 'setting_other' },
                component: () => import("@/views/pages/setting/other/create.vue")
            },
            {
                path: "/setting/banner-course",
                name: 'setting_course',
                meta: { key: 'setting_course' },
                component: () => import("@/views/pages/setting/category/create.vue")
            },
        ]
    },
    {
        path: '/certificate_template',
        name: 'certificate_template',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/certificate_template/list",
                name: 'certificate_template_list',
                meta: { key: 'certificate_template' },
                component: () => import("@/views/pages/certificate_template/list.vue")
            },
            {
                path: "/certificate_template/create",
                name: 'certificate_template_create',
                meta: { key: 'certificate_template' },
                component: () => import("@/views/pages/certificate_template/create.vue")
            },
            {
                path: "/certificate_template/edit/:id",
                name: 'certificate_template_edit',
                meta: { key: 'certificate_template' },
                component: () => import("@/views/pages/certificate_template/create.vue")
            }
        ]
    },
    {
        path: '/course_certificate',
        name: 'course_certificate',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/course_certificate/list",
                name: 'course_certificate_list',
                meta: { key: 'course_certificate' },
                component: () => import("@/views/pages/course_certificate/list.vue")
            },
            {
                path: "/course_certificate/create",
                name: 'course_certificate_create',
                meta: { key: 'course_certificate' },
                component: () => import("@/views/pages/course_certificate/create.vue")
            },
            {
                path: "/course_certificate/edit/:id",
                name: 'course_certificate_edit',
                meta: { key: 'course_certificate' },
                component: () => import("@/views/pages/course_certificate/create.vue")
            }
        ]
    },
    {
        path: '/notification',
        name: 'notification',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/notification/list",
                name: 'notification_list',
                meta: { key: 'notification' },
                component: () => import("@/views/pages/notification/list.vue")
            },
            {
                path: "/notification/create",
                name: 'notification_create',
                meta: { key: 'notification' },
                component: () => import("@/views/pages/notification/create.vue")
            },
            {
                path: "/notification/edit/:id",
                name: 'notification_edit',
                meta: { key: 'notification' },
                component: () => import("@/views/pages/notification/create.vue")
            }
        ]
    },
    {
        path: '/usernotification',
        name: 'usernotification',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/usernotification/list",
                name: 'usernotification_list',
                meta: { key: 'usernotification' },
                component: () => import("@/views/pages/user-notification/list.vue")
            }
        ]
    },
    {
        path: '/',
        name: 'auth',
        component: () => import("@/views/pages/auth/Auth.vue"),
        children: [
            {
                path: '/login',
                name: 'login',
                component: () => import("@/views/pages/auth/login.vue")
            },
            // {
            //     path: '/forgot-password',
            //     name: 'forgot-password',
            //     component: () => import('@/views/auth/forgot_password.vue')
            // },
            // {
            //     path: '/update-password',
            //     name: 'update-password',
            //     component: () => import('@/views/auth/update_password.vue')
            // },
        ]
    },
    {
        path: '/admin',
        name: 'admin',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/admin/list",
                name: 'admin_list',
                meta: { key: 'admin' },
                component: () => import("@/views/pages/admin/list.vue")
            },
            {
                path: "/admin/create",
                name: 'admin_create',
                meta: { key: 'admin' },
                component: () => import("@/views/pages/admin/create.vue")
            },
            {
                path: "/admin/edit/:id",
                name: 'admin_edit',
                meta: { key: 'admin' },
                component: () => import("@/views/pages/admin/create.vue")
            }
        ]
    },
    {
        path: '/roles',
        name: 'roles',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/roles/list",
                name: 'roles_list',
                meta: { key: 'roles' },
                component: () => import("@/views/pages/roles/list_role.vue")
            },
            {
                path: "/roles/create",
                name: 'roles_create',
                meta: { key: 'roles' },
                component: () => import("@/views/pages/roles/create.vue")
            },
            {
                path: "/roles/edit/:id",
                name: 'roles_edit',
                meta: { key: 'roles' },
                component: () => import("@/views/pages/roles/create.vue")
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(),
    routes
})
router.beforeEach(async (to, from, next) => {
    const array: Array<string> = ['login', 'forgot-password', 'update-password']
    if (JwtService.getToken()) {
        if (to.name == 'login') {
            next('/')
        }
        else {
            next()
        }
    }
    else {
        if ((typeof to.name == 'string' && !array.includes(to.name)) || to.name == undefined) {
            next('/login')
        } else {
            next()
        }
    }
})
// @ts-ignore
export default router


