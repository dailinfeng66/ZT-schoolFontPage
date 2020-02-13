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
