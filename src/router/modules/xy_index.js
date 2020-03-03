import Layout from '@/layout'
const xy_index = {
    path: '/xy_index',
    component: Layout,
    redirect: '/xy_index/xy_index',
    name: 'xy_index',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '首页信息管理', //这个地方就是写 模块名字
        icon: 'message',
    },
    children: [{
        path: 'xy_indexStatus',
        component: () =>
            import ('@/views/xy_index/xy_indexStatus'),
        name: 'xy_indexStatus',
        meta: {
            title: '首页信息统计',
            roles: ["000", "001","002","003","004","005"]
        }
    }, {
        path: 'xy_indexViewpagerManage',
        component: () =>
            import ('@/views/xy_index/xy_indexViewpagerManage'),
        name: 'xy_indexViewpagerManage',
        meta: {
            title: '轮播图信息管理',
            roles: ["000", "003"]
        }
    }]
}
export default xy_index