import Layout from '@/layout'
const xy_lostAndFound = {
  path: '/xy_lostAndFound',
  component: Layout,
  redirect: '/xy_lostAndFound/xy_lostAndFound',
  name: 'xy_lostAndFound',
  alwaysShow: true,
  meta: {
    title: '失物招领管理', //这个地方就是写 模块名字
    icon: 'user'
  },
  children: [{
      path: 'xy_lostAndFoundStatis',
      component: () => import('@/views/xy_lostAndFound/xy_lostAndFoundStatis'),
      name: 'xy_lostAndFoundStatis',
      meta: {
        title: '失物招领统计'
      }
    },
    {
      path: 'xy_lostAndFound',
      component: () => import('@/views/xy_lostAndFound/xy_lostAndFound'),
      name: 'xy_lostAndFound',
      meta: {
        title: '失物招领信息管理'
      }
    },
    {
      path: 'editLostAndFound',
      component: () => import('@/components/editLostAndFound'),
      name: 'editLostAndFound',
      meta: {
        title: '失物招领编辑',
        noCache: true,
        activeMenu: '@/views/xy_lostAndFound/xy_lostAndFound'
      },
      hidden: true
    },
    // {
    //     path: 'menuManage',
    //     component: () => import('@/views/systemManage/menuManage'),
    //     name: 'menuManage',
    //     meta: { title: '菜单管理' }
    // },
    // {
    //     path: 'configManage',
    //     component: () => import('@/views/systemManage/configManage'),
    //     name: 'configManage',
    //     meta: { title: '系统配置管理 ' }
    // }
  ]
}
export default xy_lostAndFound
