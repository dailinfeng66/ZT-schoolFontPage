import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */

import xy_lostAndFound from "./modules/xy_lostAndFound";
import xy_secondHand from "./modules/xy_secondHand"
import xy_admin from "./modules/xy_admin"
import xy_financeManage from "./modules/xy_financeManage"
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path*",
            component: () =>
                import ("@/views/redirect/index")
        }]
    },
    {
        path: "/login",
        component: () =>
            import ("@/views/login/index"),
        hidden: true
    },
    {
        path: "/",
        component: Layout,
        redirect: "/dashboard",
        children: [{
            path: "dashboard",
            component: () =>
                import ("@/views/dashboard/index"),
            name: "Dashboard",
            meta: {
                title: "dashboard",
                icon: "dashboard",
                affix: true
            }
        }]
    },
    /**
     * 后面写路由
     */
    xy_lostAndFound,
    xy_secondHand,
    xy_admin,
    xy_financeManage

];

const createRouter = () =>
    new Router({
        // mode: 'history', // require service support
        scrollBehavior: () => ({
            y: 0
        }),
        routes: constantRoutes
    });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

export default router;