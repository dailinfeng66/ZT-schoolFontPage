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

// 获取商品状态信息
export function getGoodStatus() {
    return [{
            code: "0",
            name: '未审核'
        },
        {
            code: "1",
            name: '已通过'
        },
        {
            code: "2",
            name: '未通过'
        },
        {
            code: "3",
            name: '已支付'
        },
        {
            code: "4",
            name: '已删除'
        },
        {
            code: "5",
            name: '已下单'
        }
    ]
}