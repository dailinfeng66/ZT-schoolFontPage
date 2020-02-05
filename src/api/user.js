import request from '@/utils/request'

// export function login(data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }
export function login(data1) {
  return request({
    url: '/admin/admin/login',
    method: 'post',
    params: data1
  })
}


export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
