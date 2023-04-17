import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
const routes = [{
        name: '登录',
        path: '/login',
        component: () =>
            import ('../views/Login.vue'),
    },
    {
        name: '框架页',
        path: '/',
        component: () =>
            import ('../views/Framework.vue'),
        redirect: "/blog/list",
        children: [{
                name: "博客管理",
                path: "/blog/test",
                component: () =>
                    import ('../views/blog/BlogManage.vue')
            }, {
                name: "测试",
                path: "/blog/list",
                component: () =>
                    import ('../views/blog/Text.vue')
            },
            {
                name: "分类管理",
                path: "/blog/category",
                component: () =>
                    import ('../views/blog/SortManage.vue')
            },
        ]
    },
]
const router = createRouter({
    routes,
    history: createWebHistory(),
})


// 有cookie信息才允许跳转到首页
router.beforeEach((to, from, next) => {
    const userInfo = VueCookies.get("userInfo")
    if (!userInfo && to.path != "/login") {
        router.push("/login")
    }
    next()
})

export default router