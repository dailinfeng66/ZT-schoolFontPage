import Layout from '@/layout'
const merchantManage = {
  path: '/merchantManage',
  component: Layout,
  redirect: '/merchantManage/merchantManage',
  name: 'merchantManage',
  meta: {
    title: '商户管理 ', //这个地方就是写 模块名字
    icon: 'table'
  },
  children: [{
      path: 'merchantManage',
      component: () => import('@/views/merchantManage/merchantManage'),
      name: 'merchantManage',
      meta: {
        title: '商户管理'
      }
    },
    {
      path: 'merchantApply',
      component: () => import('@/views/merchantManage/merchantApply'),
      name: 'merchantApply',
      meta: {
        title: '商户申请管理 '
      }
    }

  ]
}
export default merchantManage
