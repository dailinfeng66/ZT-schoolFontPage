import Cookies from 'js-cookie'
const adminAuditDetailKey = "adminAuditDetailID" //工资管理  ->   工资管理详情

/**
 * 工资管理  ->   工资管理详情
 */
export function getAdminDetailParam() {
    return JSON.parse(Cookies.get(adminAuditDetailKey))
}
export function setAdminDetailParam(param) {
    return Cookies.set(adminAuditDetailKey, param)
}