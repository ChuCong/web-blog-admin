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
            }
        ]
    },
    {
        path: '/article',
        name: 'article',
        component: () => import("@/components/layouts/Dashboard.vue"),
        children: [
            {
                path: "/article/list",
                name: 'article_list',
                meta: { key: 'article' },
                component: () => import("@/views/pages/article/list.vue")
            },
            {
                path: "/article/create",
                name: 'article_create',
                meta: { key: 'article' },
                component: () => import("@/views/pages/article/create.vue")
            },
            {
                path: "/article/edit/:id",
                name: "article_detail",
                meta: { key: 'article' },
                component: () => import("@/views/pages/article/create.vue")
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


