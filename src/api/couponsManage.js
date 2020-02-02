import request from '@/utils/request'
export function findAll(data) {
    return request({
        url: '/couponType/getParentCouponType',
        method: 'get',
        params: data
    })
}


export function addcoupons(data1) {
    return request({
        url: '/couponType/addCouponType',
        method: 'post',
        data: data1
    })
}
