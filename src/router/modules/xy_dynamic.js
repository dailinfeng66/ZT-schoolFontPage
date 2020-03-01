import Layout from '@/layout'
const xy_dynamic = {
    path: '/xy_dynamic',
    component: Layout,
    redirect: '/xy_dynamic/xy_dynamic',
    name: 'xy_dynamic',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '动态信息管理', //这个地方就是写 模块名字
        icon: 'message',
    },
    children: [{
        path: 'xy_dynamicStatus',
        component: () =>
            import ('@/views/xy_dynamic/xy_dynamicStatus'),
        name: 'xy_dynamicStatus',
        meta: {
            title: '动态信息统计',
            roles: ["000", "003"]
        }
    }, {
        path: 'xy_dynamicManage',
        component: () =>
            import ('@/views/xy_dynamic/xy_dynamicManage'),
        name: 'xy_dynamicManage',
        meta: {
            title: '动态信息管理',
            roles: ["000", "003"]
        }
    }]
}
export default xy_dynamic