import request from '@/utils/request'


export function findAllCatalog(data1) {
  return request({
    url: '/mgr/handle_catalog/catalogMsg',
    method: 'get',
    params: data1
  })
}

export function insertCatalog(data1) {
  return request({
    url: '/mgr/handle_catalog/catalog',
    method: 'post',
    data: data1
  })
}


export function updateCatalog(data1) {
  return request({
    url: '/mgr/handle_catalog/catalog',
    method: 'put',
    data: data1
  })
}

export function deleteCatalog(data1) {
  return request({
    url: '/mgr/handle_catalog/catalog',
    method: 'delete',
    data: data1
  })
}

export function findGoods(data1) {
  return request({
    url: '/mgr/judge_second_goods/goodsInfo',
    method: 'post',
    data: data1
  })
}

export function judgeGoodsPass(data1) {
  return request({
    url: '/mgr/judge_second_goods/accept',
    method: 'put',
    params: {
      goodsId: data1
    }
  })
}

export function addOrder(info) {
  return request({
    url: '/mgr/order',
    method: 'post',
    data: info
  })
}
export function findOrder(info) {
  return request({
    url: '/mgr/order/order_info',
    method: 'post',
    data: info
  })
}
export function findOrderById(order_id) {
  return request({
    url: '/mgr/order/order_info/'+order_id,
    method: 'get',
  })
}
export function editOrderById(order_id,info) {
  return request({
    url: '/mgr/order/order_info/'+order_id,
    method: 'put',
    data: info
  })
}