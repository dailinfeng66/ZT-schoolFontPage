import request from '@/utils/request'

// 得到两级分类信息
export function findAllCatalog(data1) {
    return request({
        url: '/mgr/handle_catalog/catalogMsg',
        method: 'get',
        params: data1
    })
}
// 更改商品信息
export function updateGoodsMsg(data1) {
    return request({
        url: '/mgr/judge_second_goods/goodsInfo',
        method: 'put',
        params: data1
    })
}
// 根据商品ID查询商品的两级分类的信息
export function findGoodsCatalog(data1) {
    return request({
        url: '/mgr/judge_second_goods/catalogInfo',
        method: 'get',
        params: data1
    })
}
// 添加两级分类
export function insertCatalog(data1) {
    return request({
        url: '/mgr/handle_catalog/catalog',
        method: 'post',
        data: data1
    })
}
// 更改两级分类
export function updateCatalog(data1) {
    return request({
        url: '/mgr/handle_catalog/catalog',
        method: 'put',
        data: data1
    })
}
// 删除两级分类
export function deleteCatalog(data1) {
    return request({
        url: '/mgr/handle_catalog/catalog',
        method: 'delete',
        data: data1
    })
}
// 查询商品
export function findGoods(data1) {
    return request({
        url: '/mgr/judge_second_goods/goodsInfo',
        method: 'post',
        data: data1
    })
}
// 通过审核
export function judgeGoodsPass(data1) {
    return request({
        url: '/mgr/judge_second_goods/accept',
        method: 'put',
        params: {
            goodsId: data1
        }
    })
}
//通过用户的状态码得到用户的状态值
export function getGoodStateByCode(value) {
    let result = "";
    if (value == "0") {
        result = "未审核";
    }
    if (value == "1") {
        result = "已通过";
    }
    if (value == "2") {
        result = "未通过";
    }
    if (value == "3") {
        result = "已支付";
    }
    if (value == "4") {
        result = "已删除";
    }
    if (value == "5") {
        result = "已下单";
    }
    return result;
}
export function addOrder(info) {
    return request({
        url: '/mgr/order',
        method: 'post',
        data: info
    })
}
export function findOrder(info) {
    return request({
        url: '/mgr/order/order_info',
        method: 'post',
        data: info
    })
}
export function findOrderById(order_id) {
    return request({
        url: '/mgr/order/order_info/' + order_id,
        method: 'get',
    })
}
export function editOrderById(order_id, info) {
    return request({
        url: '/mgr/order/order_info/' + order_id,
        method: 'put',
        data: info
    })
}
export function findOrderByIdIncludeDES(order_id) {
    return request({
        url: '/mgr/order/order_info_des/' + order_id,
        method: 'get',
    })
}