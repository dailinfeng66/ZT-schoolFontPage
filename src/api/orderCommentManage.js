import request from '@/utils/request'
export function findPage(query) {
    return request({
        url: '/orderComment/findPage',
        method: 'post',
        data:query
    })
}
