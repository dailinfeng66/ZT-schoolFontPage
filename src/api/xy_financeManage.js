import request from '@/utils/request'
const baseUrl = "admin/finance"
    // 得到所有审核信息
export function findAllFinanceJudgeMsg(data1) {
    return request({
        url: baseUrl + '/judgeMsg',
        method: 'post',
        data: data1
    })
}

export function findAdminAuditDetail(data1) {
    return request({
        url: baseUrl + '/admin_audit_details',
        method: 'post',
        data: data1
    })
}