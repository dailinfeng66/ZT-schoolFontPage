import Layout from '@/layout'
const goodsManage = {
    path: '/goodsManage',
    component: Layout,
    redirect: '/goodsManage/goodsManage',
    name: 'goodsManage',
    meta: {
        title: '商品管理 ',  //这个地方就是写 模块名字
        icon: 'peoples'
    },
    children: [
        {
            path: 'goodsManage',
            component: () => import('@/views/goodsManage/goodsManage'),
            name: 'goodsManage',
            meta: { title: '商品管理' }
        },
        {
            path: 'goodsDetailManage',
            component: () => import('@/views/goodsManage/goodsDetailManage'),
            name: 'goodsDetailManage',
            meta: { title: '商品详情管理' }
        },

    ]
}
export default goodsManage