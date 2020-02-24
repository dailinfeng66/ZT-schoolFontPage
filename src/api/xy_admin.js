import request from '@/utils/request'
const baseUrl = "admin/admin"
    // 得到用户信息
export function findAdmins(data1) {
    return request({
        url: baseUrl + '/admin',
        method: 'post',
        data: data1
    })
}
// 启用用户
export function ableAdminByID(data1) {
    return request({
        url: baseUrl + '/ableAdmin',
        method: 'get',
        params: data1
    })
}
//禁用用户
export function disableAdminByID(data1) {
    return request({
        url: baseUrl + '/disableAdmin',
        method: 'get',
        params: data1
    })
}
// 得到角色信息
export function getGrades() {
    return request({
        url: baseUrl + '/grade',
        method: 'get'
    })
}

// 更新角色信息
export function updateAdmin(data1) {
    return request({
        url: baseUrl + '/admin',
        method: 'put',
        data: data1
    })
}













/**
 * 根据ID获取学校名字
 * @param  id 
 */
export function getSchoolNameById(id) {
    let name = "null";
    switch (id) {
        case "00000":
            name = "全部学校";
            break;
        case "00001":
            name = "成都信息工程大学";
            break;
        case "00002":
            name = "西南民族大学";
            break;
    }
    return name;
}
/**
 * 根据学校姓名获取学校ID
 * @param {} id 
 */
export function getSchoolIdByName(id) {
    let name = "null";
    switch (id) {
        case "全部学校":
            name = "00000";
            break;
        case "成都信息工程大学":
            name = "00001";
            break;
        case "西南民族大学":
            name = "00002";
            break;
    }
    return name;
}