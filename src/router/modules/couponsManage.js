import Layout from '@/layout'
const couponsManage = {
    path: '/couponsManage',
    component: Layout,
    redirect: '/couponsManage/couponsManage',
    name: 'couponsManage',
    meta: {
        title: '券码类别管理 ',  //这个地方就是写 模块名字
        icon: 'nested'
    },
    children: [
        {
            path: 'couponsManage',
            component: () => import('@/views/couponsManage/couponsManage'),
            name: 'couponsManage',
            meta: { title: '券码类别管理 ' }
        }
    ]
}
export default couponsManage