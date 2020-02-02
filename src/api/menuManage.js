import request from '@/utils/request'
export function findAll(data) {
    return request({
        url: '/menu/findAll',
        method: 'get',
        params:  data 
    })
}
export function createMenu(menu) {
    return request({
        url: '/menu/createMenu',
        method: 'get',
        params:  menu 
    })
}
export function getMenu(menuId) {
    return request({
        url: '/menu/getMenu',
        method: 'get',
        params:  {menuId} 
    })
}
export function deleteMenu(ids) {
    return request({
        url: '/menu/deleteMenu',
        method: 'get',
        params:  {ids} 
    })
}
export function updateMenu(menuInfo) {
    return request({
        url: '/menu/updateMenu',
        method: 'post',
        data:  menuInfo 
    })
}

