import request from '@/utils/request'
export function findPage(query) {
    return request({
        url: '/goodsDetail/findPage',
        method: 'post',
        data:query
    })
}
export function insertGoodsDetail(goods) {
    return request({
        url: '/goodsDetail/insertGoodsDetail',
        method: 'post',
        data:goods
    })
}
