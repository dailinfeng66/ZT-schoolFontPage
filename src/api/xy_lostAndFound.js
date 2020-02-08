import request from '@/utils/request'
// 从这儿开始
export function findAll(data1) {
  return request({
    url: '/lost/mgr/lost/list/'+data1.page+"/"+data1.size+"/"+data1.title,
    method: 'post',
    data: data1.mgrQueryLostRequest
  })
}
export function getInfo(id) {
  return request({
    url: 'lost/mgr/lost/'+id,
    method: 'get',
    // params: {
    //   roleId
    // }
  })
}
export function getComment(topic_id) {
  return request({
    url: 'comment/mgr/comment_base/1/100',
    method: 'post',
    params: {topic_id}
     
  })
}
export function getReply(comment_id) {
  return request({
    url: 'comment/mgr/comment_reply/1/100',
    method: 'post',
    params: {comment_id}
     
  })
}



export function getRole(roleId) {
  return request({
    url: '/role/getRole',
    method: 'get',
    params: {
      roleId
    }
  })
}

export function createRole(roleInfo) {
  return request({
    url: '/role/createRole',
    method: 'post',
    data: roleInfo
  })
}
export function updateRole(roleInfo) {
  return request({
    url: '/role/updateRole',
    method: 'post',
    data: roleInfo
  })
}
export function deleteRole(ids) {
  return request({
    url: '/role/deleteRole',
    method: 'get',
    params: {
      ids
    }
  })
}
export function findMenuTree(pv) {
  return request({
    url: '/menu/findMenuTree',
    method: 'get',
    params: {
      pv
    }
  })
}
export function getMenu(menuId) {
  return request({
    url: '/menu/getMenu',
    method: 'get',
    params: {
      menuId
    }
  })
}
export function updateJurisdiction(ids, roleId) {
  return request({
    url: '/role/updateJurisdiction',
    method: 'get',
    params: {
      ids,
      roleId
    }
  })
}
