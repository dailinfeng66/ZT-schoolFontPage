import router from './router'
import store from './store'
import {
    Message
} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {
    getToken
} from '@/utils/auth' // get token from cook
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
        showSpinner: false
    }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
router.beforeEach(async(to, from, next) => {
    // start progress bar
    NProgress.start() //加载进度条

    // set page title
    document.title = getPageTitle(to.meta.title)

    // determine whether the user has logged in
    const hasToken = getToken()


    if (hasToken) {
        if (to.path === '/login') {
            // if is logged in, redirect to the home page
            NProgress.done()
        } else {
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) { //有权限
                console.log("有权限 有角色--->" + store.getters.roles)
                const roles = store.getters.roles;
                sessionStorage.setItem("roles", roles); //页面一刷新VUEX里面存的东西就被刷新了 所以我把角色存到sessionStorage里面
                const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                router.addRoutes(accessRoutes) //添加路由
                next()
            } else { //没有权限
                console.log("没有权限 没有角色")
                try {
                    const roles = sessionStorage.getItem("roles"); //如果没有权限就在sessionStorage里面去取 
                    console.log("从SessionStorage里面获取了角色" + roles)
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                    router.addRoutes(accessRoutes)
                    next()
                } catch (error) {
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                        // next()
                    NProgress.done()
                }
            }
        }
    } else {
        /* has no token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
                // next('/')
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})