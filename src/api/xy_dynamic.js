import request from '@/utils/request'
const baseUrl = "dynamic/mgr"
// 增加动态信息
export function addDynamic(dynamic) {
  return request({
    url: baseUrl + '/dynamic',
    method: 'post',
    data: dynamic
  })
}
// 修改动态信息
export function updateDynamic(dynamic) {
  return request({
    url: baseUrl + '/dynamic',
    method: 'put',
    data: dynamic
  })
}
// 删除动态信息
export function deleteDynamic(ids) {
    return request({
      url: baseUrl + '/dynamic',
      method: 'delete',
      data: ids
    })
  }
  //分页查询动态信息
  export function queryDynamic(data1) {
    return request({
      url: baseUrl + '/dynamic/info',
      method: 'post',
      data: data1
    })
  }
//审核不通过
export function auditNotPass(data1) {
    return request({
      url: baseUrl + '/dynamic/not_pass',
      method: 'put',
      data: data1
    })
  }
//审核不通过
export function auditPass(data1) {
    return request({
      url: baseUrl + '/dynamic/pass',
      method: 'put',
      data: data1
    })
  }