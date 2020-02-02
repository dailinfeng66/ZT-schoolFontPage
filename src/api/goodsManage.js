import request from '@/utils/request'
export function findPage(query) {
    return request({
        url: '/goods/findPage',
        method: 'post',
        data:query
    })
}
export function insertGoods(goods) {
    return request({
        url: '/goods/insertGoods',
        method: 'post',
        data:goods
    })
}
export function findById(id) {
    return request({
        url: '/goods/findById',
        method: 'get',
        params:{id}
    })
}
