import request from '@/utils/request'
// 从这儿开始
export function getusers(pv) {
    return request({
        url: '/user/getAll',
        method: 'get',
        params: { pv }
    })
}

export function findByUserId(userId) {
    return request({
        url: '/user/getUser',
        method: 'get',
        params: userId
    })
}

export function deleteUsers(userIds) {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        params: userIds
    })
}
export function createUser(data1) {
    return request({
        url: '/user/createUser',
        method: 'post',
       data:data1
    })
}
export function createProfile(pic) {
    return request({
        url: '//image/uplode',
        method: 'post',
       data:pic
    })
}
//修改用户
export function updateUser(data) {
    return request({
        url: '/user/updateUser',
        method: 'post',
        data:data
    })
}