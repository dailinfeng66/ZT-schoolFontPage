import Layout from '@/layout'
const communityInfoManage = {
    path: '/communityInfoManage',
    component: Layout,
    redirect: '/communityInfoManage/communityInfoGetAll',
    name: 'communityInfoManage',
    meta: {
        title: '社区信息管理 ',  //这个地方就是写 模块名字
        icon: 'user'
    },
    children: [
        {
            path: 'communityInfoGetAll',
            component: () => import('@/views/communityInfoManage/communityInfoGetAll'),
            name: 'communityInfoGetAll',
            meta: { title: '社区信息管理' }
        },
        // {
        //     path: 'userGetAll',
        //     component: () => import('@/views/systemManage/userGetAll'),
        //     name: 'userGetAll',
        //     meta: { title: '系统用户管理2' }
        // },
    ]
}
export default communityInfoManage