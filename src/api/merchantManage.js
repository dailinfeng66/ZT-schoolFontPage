import request from '@/utils/request'
export function findPage(query) {
    return request({
        url: '/merchant/findPage',
        method: 'post',
        data:query
    })
}
