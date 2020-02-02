import Layout from '@/layout'
const residentManage = {
    path: '/residentManage',
    component: Layout,
    redirect: '/residentManage/residentManage',
    name: 'residentManage',
    meta: {
        title: '客户管理 ',  //这个地方就是写 模块名字
        icon: 'peoples'
    },
    children: [
        {
            path: 'residentManage',
            component: () => import('@/views/residentManage/residentManage'),
            name: 'residentManage',
            meta: { title: '客户信息管理' }
        },
    ]
}
export default residentManage