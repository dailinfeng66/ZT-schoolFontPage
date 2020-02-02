import request from '@/utils/request'
export function findAll(query) {
    return request({
        url: '/setMeal/findPage',
        method: 'post',
        data: query
    })
}


export function addcoupons(data1) {
    return request({
        url: '/couponType/addCouponType',
        method: 'post',
        data: data1
    })
}


export function findShopName(id) {
    return request({
        url: '/shops/findById',
        method: 'get',
        params: { id }
    })
}


export function findGoodsName(id) {
    return request({
        url: '/goods/findById',
        method: 'get',
        params: { id }
    })
}
