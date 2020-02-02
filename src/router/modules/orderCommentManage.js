import Layout from '@/layout'
const orderCommentManage = {
    path: '/orderCommentManage',
    component: Layout,
    redirect: '/orderCommentManage/orderCommentManage',
    name: 'orderCommentManage',
    meta: {
        title: '订单管理 ',  //这个地方就是写 模块名字
        icon: 'tab'
    },
    children: [
        {
            path: 'orderCommentManage',
            component: () => import('@/views/orderCommentManage/orderCommentManage'),
            name: 'orderCommentManage',
            meta: { title: '订单评论管理 ' }
        },
        {
            path: 'getSaleInfo',
            component: () => import('@/views/orderCommentManage/getSaleInfo'),
            name: 'getSaleInfo',
            meta: { title: '订单售后管理' }
        },
    ]
}
export default orderCommentManage