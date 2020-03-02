import request from '@/utils/request'
const baseUrl = "admin"
    // 得到所有审核信息
export function findAllFinanceJudgeMsg(data1) {
    return request({
        url: baseUrl + '/finance/judgeMsg',
        method: 'post',
        data: data1
    })
}