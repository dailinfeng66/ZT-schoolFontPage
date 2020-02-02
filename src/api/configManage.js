import request from '@/utils/request'
export function findAllConfig(data) {
    return request({
        url: '/systemConfig/findAll',
        method: 'get',
        params: data
    })
}

export function addConfig(data1) {
    return request({
        url: '/systemConfig/createSystemConfig',
        method: 'post',
        data: data1
    })
}

export function findconfig(id) {
    return request({
        url: '/systemConfig/getSystemConfig',
        method: 'get',
        params: { id }
    })
}
