import request from '@/utils/request'
export function findApplyPage(query) {
    return request({
        url: '/shopsApply/findPage',
        method: 'post',
        data:query
    })
}
export function findShopPage(query) {
    return request({
        url: '/shops/findPage',
        method: 'post',
        data:query
    })
}

export function findOrderInfo(query) {
    return request({
        url: '/afterSale/findPage',
        method: 'post',
        data:query
    })
}

export function findTypePage(query) {
    return request({
        url: '/shopsType/findPage',
        method: 'post',
        data:query
    })
}

export function findTypeById(Id) {
    return request({
        url: '/shopsType/findById',
        method: 'get',
        params:{Id}
    })
}
export function findShopById(id) {
    return request({
        url: '/shops/findById',
        method: 'get',
        params:{id}
    })
}


