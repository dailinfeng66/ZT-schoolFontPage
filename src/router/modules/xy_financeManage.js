import Layout from '@/layout'
const xy_financeManage = {
    path: '/xy_financeManage',
    component: Layout,
    redirect: '/xy_financeManage/xy_financeManage',
    name: 'xy_financeManage',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '财务管理', //这个地方就是写 模块名字
        icon: 'skill',
    },
    children: [{
        path: 'xy_financeMsgStatistice',
        component: () =>
            import ('@/views/xy_financeManage/financeMsgStatistice'),
        name: 'xy_financeMsgStatistice',
        meta: {
            title: '财务信息统计',
            roles: ["000", "001", "004", "003"]
        }
    }, {
        path: 'xy_adminSalaryManage',
        component: () =>
            import ('@/views/xy_financeManage/adminSalaryManage'),
        name: 'xy_adminSalaryManage',
        meta: {
            title: '审核员工资管理',
            roles: ["000", "001", "004", "003"]
        }
    }]
}
export default xy_financeManage