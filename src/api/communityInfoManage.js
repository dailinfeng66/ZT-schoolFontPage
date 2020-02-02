import request from '@/utils/request'
// 从这儿开始
export function getCommunityInfo(pv) {
    return request({
        url: '/community/getCommmunityInfo',
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
export function createCommunity(community) {
    return request({
        url: '/community/insertCommunity',
        method: 'post',
        data:community
    })
}

//商品详情用  --by zx
export function getCommunity(communityId) {
    return request({
        url: '/community/getCommunity',
        method: 'get',
        params: { communityId }
    })
}
