import request from '@/utils/request'
export function getAll(pv) {
    return request({
        url: '/resident/getAll',
        method: 'get',
        params:  pv 
    })  
}
export function frozenResident(pv) {
    return request({
        url: '/resident/frozenResident',
        method: 'get',
        params:  pv 
    })  
}
