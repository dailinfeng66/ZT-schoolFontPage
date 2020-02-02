import request from '@/utils/request'
export function loginCheckData(data1) {
    return request({
        url: '/login/tologin',
        method: 'post',
        params:  data1 
    })
}
