import Layout from '@/layout'
const packageManage = {
    path: '/packageManage',
    component: Layout,
    redirect: '/packageManage/packageManage',
    name: 'packageManage',
    meta: {
        title: '套餐管理 ',  //这个地方就是写 模块名字
        icon: 'tab'
    },
    children: [
        {
            path: 'packageManage',
            component: () => import('@/views/packageManage/packageManage'),
            name: 'packageManage',
            meta: { title: '套餐管理 ' }
        }
    ]
}
export default packageManage