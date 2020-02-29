import Layout from '@/layout'
const xy_audit = {
    path: '/xy_audit',
    component: Layout,
    redirect: '/xy_audit/xy_audit',
    name: 'xy_audit',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '审核信息管理', //这个地方就是写 模块名字
        icon: 'tree-table',
    },
    children: [{
        path: 'xy_auditStatus',
        component: () =>
            import ('@/views/xy_audit/xy_auditStatus'),
        name: 'xy_auditStatus',
        meta: {
            title: '审核信息统计',
            roles: ["000", "003"]
        }
    }, {
        path: 'xy_auditManage',
        component: () =>
            import ('@/views/xy_audit/xy_auditManage'),
        name: 'xy_auditManage',
        meta: {
            title: '审核信息管理',
            roles: ["000", "003"]
        }
    },
    {
        path: 'xy_auditManage',
        component: () =>
            import ('@/views/xy_audit/xy_auditManage'),
        name: 'xy_auditManage',
        meta: {
            title: '审核信息查看',
            roles: ["000", "003"]
        }
    }

]
}
export default xy_audit