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