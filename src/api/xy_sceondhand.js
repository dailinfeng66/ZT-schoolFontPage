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
