import Layout from '@/layout'
const shopsManage = {
    path: '/shopsManage',
    component: Layout,
    redirect: '/shopsManage/shopsManage',
    name: 'shopsManage',
    meta: {
        title: '商铺管理 ',  //这个地方就是写 模块名字
        icon: 'peoples'
    },
    children: [
        {
            path: 'shopsApplyManage',
            component: () => import('@/views/shopsManage/shopsApplyManage'),
            name: 'shopsApplyManage',
            meta: { title: '商铺申请管理' }
        },
        {
            path: 'shopsManage',
            component: () => import('@/views/shopsManage/shopsManage'),
            name: 'shopsManage',
            meta: { title: '商铺管理 '}
        },
        {
            path: 'shopsRulesManage',
            component: () => import('@/views/shopsManage/shopsRulesManage'),
            name: 'shopsRulesManage',
            meta: { title: '商铺积分规则管理 '}
        },
        {
            path: 'shopsTypeManage',
            component: () => import('@/views/shopsManage/shopsTypeManage'),
            name: 'shopsTypeManage',
            meta: { title: '商铺类型管理 '}
        },
        {
            path: 'deposit',
            component: () => import('@/views/depositManage/deposit'),
            name: 'deposit',
            meta: { title: '商铺划账管理' }
        },
    
        
    ]
}
export default shopsManage