import Layout from '@/layout'
const xy_secondHand = {
    path: '/xy_secondHand',
    component: Layout,
    redirect: '/xy_secondHand/xy_secondHand',
    name: 'xy_secondHand',
    alwaysShow: true,
    // constantRoutes: true,
    meta: {
        title: '二手平台管理', //这个地方就是写 模块名字
        icon: 'tree-table',

    },
    children: [{
            path: 'platformStatistics',
            component: () =>
                import ('@/views/xy_secondHand/platformStatistics'),
            name: 'platformStatistics',
            meta: {
                title: '平台统计',
                roles: ['000']
            }
        },
        {
            path: 'goodsManage',
            component: () =>
                import ('@/views/xy_secondHand/goodsManage'),
            name: 'goodsManage',
            meta: {
                title: '商品管理',
                roles: ['000']
            }
        },
        {
            path: 'goodsDetails',
            component: () =>
                import ('@/views/xy_secondHand/goodsManage/goodsDetail'),
            name: 'goodsDetails',
            meta: {
                title: '商品详情',
                noCache: true,
                roles: ['000']
                    // activeMenu: '@/views/xy_secondHand/goodsManage'
            },
            hidden: true
        },
        {
            path: 'catalogManage',
            component: () =>
                import ('@/views/xy_secondHand/catalogManage'),
            name: 'catalogManage',
            meta: {
                title: '分类管理',
                roles: ['000']
            }
        },
        {
            path: 'orderManage',
            component: () =>
                import ('@/views/xy_secondHand/orderManage'),
            name: 'orderManage',
            meta: {
                title: '订单管理',
                roles: ['000']
            }
        },

    ]
}
export default xy_secondHand