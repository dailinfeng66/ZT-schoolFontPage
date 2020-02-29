import Layout from '@/layout'
const xy_admin = {
    path: '/xy_admin',
    component: Layout,
    redirect: '/xy_admin/xy_admin',
    name: 'xy_admin',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '管理员信息管理', //这个地方就是写 模块名字
        icon: 'peoples',
    },
    children: [{
        path: 'xy_adminStatus',
        component: () =>
            import ('@/views/xy_admin/adminStatus'),
        name: 'xy_adminStatus',
        meta: {
            title: '管理员信息统计',
            roles: ["000", "003"]
        }
    }, {
        path: 'xy_adminManage',
        component: () =>
            import ('@/views/xy_admin/adminManage'),
        name: 'xy_adminManage',
        meta: {
            title: '管理员信息管理',
            roles: ["000", "003"]
        }
    }]
}
export default xy_admin